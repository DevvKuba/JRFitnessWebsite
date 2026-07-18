import type { Handler } from '@netlify/functions';

const BREVO_API_KEY = process.env.BREVO_API_KEY!;
const BREVO_LIST_ID = Number(process.env.BREVO_LIST_ID);

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

    // Brevo returns 400 for "contact already exists" in some API versions even
    // with updateEnabled — treat that as success rather than a real failure.
    if (!res.ok && res.status !== 400) {
      throw new Error(`Brevo responded ${res.status}`);
    }

    return { statusCode: 200, body: JSON.stringify({ success: true }) };
  } catch (err) {
    console.error('submit-lead error', err);
    return { statusCode: 500, body: JSON.stringify({ success: false }) };
  }
};
