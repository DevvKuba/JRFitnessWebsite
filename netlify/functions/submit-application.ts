import type { Handler } from '@netlify/functions';
import { Client } from '@notionhq/client';
import { Resend } from 'resend';

const notion = new Client({ auth: process.env.NOTION_API_KEY });
const resend = new Resend(process.env.RESEND_API_KEY);

// Verified-domain sender for outbound email. Falls back to the Resend sandbox
// sender, which can only deliver to the Resend account's own address — fine for
// the owner notification before a domain is verified, but applicant
// confirmations will not deliver until EMAIL_FROM points at a verified domain.
const EMAIL_FROM = process.env.EMAIL_FROM ?? 'JR Fitness Website <onboarding@resend.dev>';

const COACHING_TYPE_LABELS: Record<string, string> = {
  online: 'Online Coaching',
  'in-person': 'In-Person Coaching',
  hybrid: 'Hybrid Coaching',
};

const GOAL_LABELS: Record<string, string> = {
  'fat-loss': 'Fat Loss',
  'muscle-gain': 'Muscle Gain',
  recomposition: 'Body Recomposition',
  'general-fitness': 'General Fitness',
  other: 'Other',
};

const FITNESS_LEVEL_LABELS: Record<string, string> = {
  beginner: 'Beginner',
  intermediate: 'Intermediate',
  advanced: 'Advanced',
};

const EQUIPMENT_LABELS: Record<string, string> = {
  'commercial-gym': 'Commercial Gym',
  'home-gym': 'Home Gym',
  minimal: 'Minimal Equipment',
  none: 'No Equipment',
};

const PREFERRED_DAYS_LABELS: Record<string, string> = {
  weekdays: 'Weekdays',
  weekends: 'Weekends',
  flexible: 'Flexible',
};

const REFERRAL_LABELS: Record<string, string> = {
  instagram: 'Instagram',
  facebook: 'Facebook',
  'word-of-mouth': 'Word of Mouth',
  google: 'Google',
  other: 'Other',
};

interface ApplicationPayload {
  coachingType: string;
  fullName: string;
  email: string;
  phone: string;
  goal: string;
  fitnessLevel: string;
  injuries?: string;
  referral: string;
  equipment?: string;
  preferredDays?: string;
  trainingLocation?: string;
}

const REQUIRED_FIELDS: (keyof ApplicationPayload)[] = [
  'coachingType',
  'fullName',
  'email',
  'phone',
  'goal',
  'fitnessLevel',
  'referral',
];

const BRAND_BLUE = '#2962ff';

function buildConfirmationText(firstName: string): string {
  return [
    `Hi ${firstName},`,
    '',
    `Thanks for applying to JR Fitness — your application has been received.`,
    '',
    `JR will personally review your details and get back to you directly to talk through the next steps.`,
    '',
    `This inbox isn't monitored, so please don't reply — we'll reach out to you directly.`,
    '',
    `— JR Fitness`,
  ].join('\n');
}

function buildConfirmationHtml(firstName: string): string {
  return `<!DOCTYPE html>
<html lang="en">
  <body style="margin:0;padding:0;background-color:#f4f4f6;font-family:Arial,Helvetica,sans-serif;color:#1a1a1c;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#f4f4f6;padding:24px 0;">
      <tr>
        <td align="center">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background-color:#ffffff;border-radius:12px;overflow:hidden;border:1px solid #e0e0ea;">
            <tr>
              <td style="background-color:${BRAND_BLUE};padding:28px 32px;">
                <span style="color:#ffffff;font-size:22px;font-weight:bold;letter-spacing:2px;">JR FITNESS</span>
              </td>
            </tr>
            <tr>
              <td style="padding:32px;">
                <h1 style="margin:0 0 16px;font-size:22px;color:#1a1a1c;">Application received</h1>
                <p style="margin:0 0 16px;font-size:16px;line-height:1.6;color:#1a1a1c;">Hi ${firstName},</p>
                <p style="margin:0 0 16px;font-size:16px;line-height:1.6;color:#1a1a1c;">
                  Thanks for applying to JR Fitness — your application has been received.
                </p>
                <p style="margin:0 0 16px;font-size:16px;line-height:1.6;color:#1a1a1c;">
                  JR will personally review your details and get back to you directly to talk through the next steps.
                </p>
                <p style="margin:24px 0 0;font-size:16px;line-height:1.6;color:#1a1a1c;">— JR Fitness</p>
              </td>
            </tr>
            <tr>
              <td style="padding:20px 32px;background-color:#f4f4f6;border-top:1px solid #e0e0ea;">
                <p style="margin:0;font-size:13px;line-height:1.5;color:#5a5a6e;">
                  This inbox isn't monitored, so please don't reply to this email — we'll reach out to you directly.
                </p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;
}

export const handler: Handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  let data: ApplicationPayload;
  try {
    data = JSON.parse(event.body ?? '{}');
  } catch {
    return { statusCode: 400, body: JSON.stringify({ success: false, error: 'Invalid JSON' }) };
  }

  for (const field of REQUIRED_FIELDS) {
    if (!data[field]) {
      return { statusCode: 400, body: JSON.stringify({ success: false, error: `Missing field: ${field}` }) };
    }
  }

  const coachingType = COACHING_TYPE_LABELS[data.coachingType] ?? data.coachingType;

  try {
    await notion.pages.create({
      parent: { type: 'data_source_id', data_source_id: process.env.NOTION_DATABASE_ID! },
      properties: {
        Name: { title: [{ text: { content: data.fullName } }] },
        Status: { select: { name: 'New Inquiry' } },
        'Coaching Type': { select: { name: coachingType } },
        Email: { email: data.email },
        Phone: { phone_number: data.phone },
        'Primary Goal': { select: { name: GOAL_LABELS[data.goal] ?? data.goal } },
        'Fitness Level': { select: { name: FITNESS_LEVEL_LABELS[data.fitnessLevel] ?? data.fitnessLevel } },
        ...(data.injuries
          ? { 'Injuries / Limitations': { rich_text: [{ text: { content: data.injuries } }] } }
          : {}),
        ...(data.equipment
          ? { 'Equipment Access': { select: { name: EQUIPMENT_LABELS[data.equipment] ?? data.equipment } } }
          : {}),
        ...(data.preferredDays
          ? { 'Preferred Days': { select: { name: PREFERRED_DAYS_LABELS[data.preferredDays] ?? data.preferredDays } } }
          : {}),
        ...(data.trainingLocation
          ? { 'Training Location': { rich_text: [{ text: { content: data.trainingLocation } }] } }
          : {}),
        'Referral Source': { select: { name: REFERRAL_LABELS[data.referral] ?? data.referral } },
        Submitted: { date: { start: new Date().toISOString() } },
      },
    } as any);

    const summaryLines = [
      `Coaching Type: ${coachingType}`,
      `Name: ${data.fullName}`,
      `Email: ${data.email}`,
      `Phone: ${data.phone}`,
      `Primary Goal: ${GOAL_LABELS[data.goal] ?? data.goal}`,
      `Fitness Level: ${FITNESS_LEVEL_LABELS[data.fitnessLevel] ?? data.fitnessLevel}`,
    ];

    if (data.injuries) summaryLines.push(`Injuries / Limitations: ${data.injuries}`);
    if (data.equipment) summaryLines.push(`Equipment Access: ${EQUIPMENT_LABELS[data.equipment] ?? data.equipment}`);
    if (data.preferredDays) summaryLines.push(`Preferred Days: ${PREFERRED_DAYS_LABELS[data.preferredDays] ?? data.preferredDays}`);
    if (data.trainingLocation) summaryLines.push(`Training Location: ${data.trainingLocation}`);

    summaryLines.push(`Referral Source: ${REFERRAL_LABELS[data.referral] ?? data.referral}`);

    await resend.emails.send({
      from: EMAIL_FROM,
      to: process.env.NOTIFICATION_EMAIL!,
      subject: `New Application — ${data.fullName} (${coachingType})`,
      text: summaryLines.join('\n'),
    });

    // Applicant confirmation — best-effort. A failure here (e.g. before a domain
    // is verified, or a bounced address) must not fail the submission: the Notion
    // record and owner notification above have already succeeded.
    try {
      const firstName = data.fullName.trim().split(/\s+/)[0];
      await resend.emails.send({
        from: EMAIL_FROM,
        to: data.email,
        subject: `We've received your application — JR Fitness`,
        text: buildConfirmationText(firstName),
        html: buildConfirmationHtml(firstName),
      });
    } catch (confirmErr) {
      console.error('submit-application confirmation email failed', confirmErr);
    }

    return { statusCode: 200, body: JSON.stringify({ success: true }) };
  } catch (err) {
    console.error('submit-application error', err);
    return { statusCode: 500, body: JSON.stringify({ success: false }) };
  }
};
