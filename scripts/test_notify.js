#!/usr/bin/env node
// Simple script to POST to the Supabase function that sends notifications.
// Usage:
//   NOTIFY_FUNCTION_URL="https://.../functions/v1/notify-new-reservation" \
//   NOTIFY_FUNCTION_KEY="<optional_token>" \
//   node scripts/test_notify.js <reservationId>

const [,, reservationId] = process.argv;
if (!reservationId) {
  console.error('Usage: node scripts/test_notify.js <reservationId>');
  process.exit(2);
}

const url = process.env.NOTIFY_FUNCTION_URL || process.env.FUNCTION_URL;
if (!url) {
  console.error('Please set NOTIFY_FUNCTION_URL environment variable to your function URL.');
  process.exit(2);
}

const key = process.env.NOTIFY_FUNCTION_KEY;

(async () => {
  try {
    const body = { reservationId };

    const headers = { 'Content-Type': 'application/json' };
    if (key) headers['Authorization'] = `Bearer ${key}`;

    console.log('POST', url, 'body=', body);

    const res = await fetch(url, {
      method: 'POST',
      headers,
      body: JSON.stringify(body),
    });

    const text = await res.text();
    console.log('Status:', res.status);
    console.log('Response:', text);
    process.exit(res.ok ? 0 : 1);
  } catch (err) {
    console.error('Error:', err);
    process.exit(1);
  }
})();
