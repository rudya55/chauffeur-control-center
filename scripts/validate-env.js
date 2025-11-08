#!/usr/bin/env node
// Validate required environment variables before build
const required = [
  'VITE_SUPABASE_URL',
  'VITE_SUPABASE_PUBLISHABLE_KEY',
  'VITE_GOOGLE_MAPS_API_KEY'
];

const missing = required.filter(k => !process.env[k]);
if (missing.length) {
  console.error(`Missing environment variables: ${missing.join(', ')}`);
  console.error('You can create a local .env file (not commited) or set these in CI. See .env.example.');
  process.exit(1);
}

console.log('Environment variables check passed');
