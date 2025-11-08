#!/usr/bin/env node
/*
  copy_profiles.js
  Copy rows from a table in one Supabase project to another using service_role keys.

  Usage (example):
    node copy_profiles.js \
      --sourceUrl=https://source.supabase.co \
      --sourceKey=<SOURCE_SERVICE_ROLE_KEY> \
      --targetUrl=https://target.supabase.co \
      --targetKey=<TARGET_SERVICE_ROLE_KEY> \
      --table=profiles \
      --batch=200 \
      --dry

  Notes:
  - Use service_role keys for both projects.
  - By default the script does an UPSERT on the target using the `id` column as conflict key.
  - Test with --dry to only print counts and a sample before doing writes.
*/

const { createClient } = require('@supabase/supabase-js');
const argv = require('minimist')(process.argv.slice(2));

const srcUrl = argv.sourceUrl || argv.sourceUrl || argv.s || process.env.SOURCE_SUPABASE_URL;
const srcKey = argv.sourceKey || argv.sourceKey || argv.sk || process.env.SOURCE_SUPABASE_KEY;
const tgtUrl = argv.targetUrl || argv.targetUrl || argv.t || process.env.TARGET_SUPABASE_URL;
const tgtKey = argv.targetKey || argv.targetKey || argv.tk || process.env.TARGET_SUPABASE_KEY;
const table = argv.table || 'profiles';
const batchSize = parseInt(argv.batch || argv.b || 200, 10);
const dryRun = argv.dry || argv.d || false;

if (!srcUrl || !srcKey || !tgtUrl || !tgtKey) {
  console.error('\nERROR: Missing required arguments.');
  console.error('Please provide --sourceUrl, --sourceKey, --targetUrl, --targetKey');
  process.exit(1);
}

const src = createClient(srcUrl, srcKey, { auth: { persistSession: false } });
const tgt = createClient(tgtUrl, tgtKey, { auth: { persistSession: false } });

async function countRows(client) {
  // Try an efficient count call
  const { data, error } = await client.from(table).select('id', { count: 'estimated', head: false }).limit(1);
  if (error) return null;
  // Supabase returns count in error if head:true; fallback to querying
  try {
    const { count } = (await client.from(table).select('id', { count: 'exact', head: false })).count || {};
    return count;
  } catch (e) {
    return null;
  }
}

async function fetchBatch(client, from, to) {
  const { data, error } = await client.from(table).select('*').range(from, to);
  if (error) throw error;
  return data || [];
}

async function main() {
  console.log('Source:', srcUrl);
  console.log('Target:', tgtUrl);
  console.log('Table:', table);
  console.log('Batch size:', batchSize);
  console.log('Dry run:', dryRun);

  // Count rows if possible
  let total = null;
  try {
    const { error } = await src.from(table).select('id', { count: 'exact', head: true });
    // head:true doesn't return data but count is in headers; supabase-js v2 returns count in error? fallback
  } catch (e) {
    // ignore
  }

  // We'll iterate by offset until no rows
  let offset = 0;
  let copied = 0;
  while (true) {
    const from = offset;
    const to = offset + batchSize - 1;
    let rows;
    try {
      rows = await fetchBatch(src, from, to);
    } catch (e) {
      console.error('Failed to fetch batch', from, to, e.message || e);
      process.exit(1);
    }
    if (!rows || rows.length === 0) break;

    console.log(`Fetched ${rows.length} rows (offset ${from})`);

    if (dryRun) {
      // Print a sample and continue
      console.log('Sample row:', JSON.stringify(rows[0], null, 2));
      copied += rows.length;
      offset += batchSize;
      continue;
    }

    // Upsert into target. Use onConflict id. If your table has different PK, adapt.
    try {
      const { data, error } = await tgt.from(table).upsert(rows, { onConflict: 'id' });
      if (error) {
        console.error('Upsert error:', error);
        process.exit(1);
      }
      console.log(`Upserted ${Array.isArray(data) ? data.length : 0} rows to target`);
      copied += rows.length;
    } catch (e) {
      console.error('Target upsert failed', e.message || e);
      process.exit(1);
    }

    offset += batchSize;
  }

  console.log('Done. Total rows processed:', copied);
}

main().catch(err => {
  console.error('Unexpected error:', err.message || err);
  process.exit(1);
});
