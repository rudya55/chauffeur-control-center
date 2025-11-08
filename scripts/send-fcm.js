#!/usr/bin/env node
/*
Simple script to send an FCM downstream message using the legacy HTTP endpoint.
Requires FCM server key in env var FCM_SERVER_KEY.

Usage:
  FCM_SERVER_KEY=your_server_key node scripts/send-fcm.js <device_token> "Title" "Body"

Be careful: keep the server key secret. Do not commit it to the repo.
*/
import fetch from 'node-fetch';

const [,, token, title = 'Test', body = 'Test message'] = process.argv;

if (!token) {
  console.error('Usage: FCM_SERVER_KEY=key node scripts/send-fcm.js <device_token> "Title" "Body"');
  process.exit(1);
}

const key = process.env.FCM_SERVER_KEY;
if (!key) {
  console.error('Missing FCM_SERVER_KEY environment variable');
  process.exit(1);
}

const payload = {
  to: token,
  notification: {
    title,
    body,
    sound: 'default',
  },
  data: { test: '1' },
};

const send = async () => {
  try {
    const res = await fetch('https://fcm.googleapis.com/fcm/send', {
      method: 'POST',
      headers: {
        'Authorization': `key=${key}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    const json = await res.json();
    console.log('FCM response:', json);
  } catch (e) {
    console.error('Failed to send FCM message', e);
    process.exit(2);
  }
};

send();
