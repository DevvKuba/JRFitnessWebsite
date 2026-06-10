import type { Handler } from '@netlify/functions';
import { Client } from '@notionhq/client';
import { Resend } from 'resend';

const notion = new Client({ auth: process.env.NOTION_API_KEY });
const resend = new Resend(process.env.RESEND_API_KEY);

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
      from: 'JR Fitness Website <onboarding@resend.dev>',
      to: process.env.NOTIFICATION_EMAIL!,
      subject: `New Application — ${data.fullName} (${coachingType})`,
      text: summaryLines.join('\n'),
    });

    return { statusCode: 200, body: JSON.stringify({ success: true }) };
  } catch (err) {
    console.error('submit-application error', err);
    return { statusCode: 500, body: JSON.stringify({ success: false }) };
  }
};
