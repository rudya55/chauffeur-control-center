#!/usr/bin/env node
/*
  poll_and_notify.js

  Usage: configured to run in GitHub Actions or locally.

  What it does:
  - Connects to a source Supabase project (SERVICE ROLE) and queries for recent reservations
    that look "new" (status in new/pending) or have a `notified` boolean = false.
  - For each reservation, it calls the configured notify function endpoint to trigger FCM sends.
  - If a `notified` column exists on reservations, it sets it to true after successful send.

  Environment variables expected (set in GitHub Actions secrets or .env when running locally):
    SOURCE_SUPABASE_URL
    SOURCE_SUPABASE_KEY   (service_role key)
    NOTIFY_FUNCTION_URL   (e.g. https://<project>.functions.supabase.co/notify-new-reservation)
    NOTIFY_FUNCTION_KEY   (optional Authorization Bearer for the function)
    BATCH (optional, default 50)

  Note: use --dry to only log without writing updates.
*/

const argv = require('minimist')(process.argv.slice(2));
const { createClient } = require('@supabase/supabase-js');

const SOURCE_SUPABASE_URL = process.env.SOURCE_SUPABASE_URL || argv.sourceUrl;
const SOURCE_SUPABASE_KEY = process.env.SOURCE_SUPABASE_KEY || argv.sourceKey;
// Default to the project's dispatch-course function URL if not provided
const NOTIFY_FUNCTION_URL = process.env.NOTIFY_FUNCTION_URL || argv.functionUrl || 'https://qroqygbculbfqkbinqmp.supabase.co/functions/v1/dispatch-course';
const NOTIFY_FUNCTION_KEY = process.env.NOTIFY_FUNCTION_KEY || argv.functionKey;
const BATCH = parseInt(process.env.BATCH || argv.batch || '50', 10);
const DRY = (argv.dry || process.env.DRY || 'false') === 'true';

if (!SOURCE_SUPABASE_URL || !SOURCE_SUPABASE_KEY || !NOTIFY_FUNCTION_URL) {
  console.error('\nERROR: Missing required environment variables.');
  console.error('Set SOURCE_SUPABASE_URL, SOURCE_SUPABASE_KEY and NOTIFY_FUNCTION_URL');
  process.exit(1);
}

const src = createClient(SOURCE_SUPABASE_URL, SOURCE_SUPABASE_KEY, { auth: { persistSession: false } });

async function fetchCandidates() {
  // Prefer to look for a 'notified' boolean column (safer) if present
  let rows = [];

  // First try: fetch where notified = false
  try {
    const { data, error } = await src.from('reservations').select('*').eq('notified', false).limit(BATCH);
    if (!error && data && data.length) {
      return data;
    }
  } catch (e) {
    // ignore
  }

  // Fallback: look for status in typical values
  try {
    const { data, error } = await src.from('reservations').select('*').in('status', ['new', 'pending', 'available']).limit(BATCH);
    if (!error && data && data.length) {
      return data;
    }
  } catch (e) {
    // ignore
  }

  // Final fallback: return most recent rows (limit)
  try {
    const { data, error } = await src.from('reservations').select('*').order('created_at', { ascending: false }).limit(BATCH);
    if (!error && data && data.length) return data;
  } catch (e) {
    console.error('Failed to read reservations:', e.message || e);
  }

  return [];
}

async function markNotified(reservationId) {
  try {
    const { data, error } = await src.from('reservations').update({ notified: true }).eq('id', reservationId).select('id');
    if (error) {
      // maybe column doesn't exist or RLS; ignore but log
      console.warn('Warning: could not mark reservation notified:', error.message || error);
      return false;
    }
    return true;
  } catch (e) {
    console.warn('Warning: error updating reservation:', e.message || e);
    return false;
  }
}

async function callNotifyFunction(reservation) {
  const body = {
    reservationId: reservation.id,
    title: `Nouvelle course: ${reservation.client_name || ''}`,
    body: `${reservation.pickup_address || ''} → ${reservation.destination || ''}`
  };

  const headers = { 'Content-Type': 'application/json' };
  if (NOTIFY_FUNCTION_KEY) headers['Authorization'] = `Bearer ${NOTIFY_FUNCTION_KEY}`;

  try {
    const resp = await fetch(NOTIFY_FUNCTION_URL, { method: 'POST', headers, body: JSON.stringify(body) });
    const text = await resp.text();
    return { ok: resp.ok, status: resp.status, text };
  } catch (e) {
    return { ok: false, error: e.message || e };
  }
}

async function main() {
  console.log('Poll & notify starting. Dry run:', DRY);

  const candidates = await fetchCandidates();
  console.log('Candidates found:', candidates.length);

  for (const r of candidates) {
    console.log('Processing reservation id=', r.id);
    if (DRY) {
      console.log('DRY: would call notify function for', r.id);
      continue;
    }

    const result = await callNotifyFunction(r);
    if (result.ok) {
      console.log(`Notified reservation ${r.id} -> status ${result.status}`);
      await markNotified(r.id);
    } else {
      console.error('Failed to notify reservation', r.id, result.error || result.text || result.status);
    }
  }

  console.log('Done');
}

main().catch(err => { console.error('Fatal error', err); process.exit(1); });
