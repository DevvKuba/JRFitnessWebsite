import type { Handler } from '@netlify/functions';

const BREVO_API_KEY = process.env.BREVO_API_KEY?.trim() ?? '';
const BREVO_LIST_ID = Number(process.env.BREVO_LIST_ID?.trim());

interface LeadPayload {
  email?: string;
}

export const handler: Handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  let data: LeadPayload;
  try {
    data = JSON.parse(event.body ?? '{}');
  } catch {
    return { statusCode: 400, body: JSON.stringify({ success: false, error: 'Invalid JSON' }) };
  }

  if (!data.email) {
    return { statusCode: 400, body: JSON.stringify({ success: false, error: 'Missing field: email' }) };
  }

  try {
    const res = await fetch('https://api.brevo.com/v3/contacts', {
      method: 'POST',
      headers: {
        'api-key': BREVO_API_KEY,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: data.email,
        listIds: [BREVO_LIST_ID],
        updateEnabled: true,
      }),
    });

    const bodyText = await res.text();

    // Brevo returns 400 with code "duplicate_parameter" when the contact already
    // exists — that's expected (updateEnabled still applies list membership), not
    // a failure. Any other non-2xx response is a real error and must not be
    // swallowed, or a bad submission silently never reaches Brevo.
    const isDuplicate = res.status === 400 && bodyText.includes('"duplicate_parameter"');

    if (!res.ok && !isDuplicate) {
      throw new Error(`Brevo responded ${res.status}: ${bodyText}`);
    }

    console.log(
      `submit-lead: ${data.email} -> list ${BREVO_LIST_ID} (${isDuplicate ? 'already existed, re-added' : 'created/updated'})`
    );

    return { statusCode: 200, body: JSON.stringify({ success: true }) };
  } catch (err) {
    console.error(`submit-lead error for ${data.email}:`, err);
    return { statusCode: 500, body: JSON.stringify({ success: false }) };
  }
};
