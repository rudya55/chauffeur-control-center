Copy profiles (or any table) between two Supabase projects

This small helper copies rows from a table in a source Supabase project to the same table in a target Supabase project using service_role keys.

Pre-requisites
- Node.js (>= 16/18 recommended)
- Service role keys for both Supabase projects (these are sensitive; do not commit them)

Install dependencies

From the repository root run:

```bash
npm init -y
npm install @supabase/supabase-js minimist
```

Usage

```bash
node scripts/copy_profiles.js \
  --sourceUrl=https://<source>.supabase.co \
  --sourceKey=<SOURCE_SERVICE_ROLE_KEY> \
  --targetUrl=https://<target>.supabase.co \
  --targetKey=<TARGET_SERVICE_ROLE_KEY> \
  --table=profiles \
  --batch=200
```

Options
- --sourceUrl : URL of source Supabase (e.g. https://abc.supabase.co)
- --sourceKey : source project's service_role key (required)
- --targetUrl : URL of target Supabase (required)
- --targetKey : target project's service_role key (required)
- --table : table to copy (default: profiles)
- --batch : number of rows per fetch/upsert (default: 200)
- --dry : if present, do a dry run (no writes), prints sample rows and counts

Important notes
- The script does an UPSERT to the target using `id` as onConflict key. If your primary key is different, edit the script's upsert call.
- Always run with `--dry` first to preview.
- Back up the target database before running destructive operations.
- Service_role keys are powerful. Do not share them publicly.

Alternative approaches
- Use pg_dump/pg_restore if you have direct DB connection strings. That copies schema and data.
- Use the Supabase admin UI SQL editor to run INSERT/UPDATE/ALTER statements for manual control.

If you want, I can adapt the script to also copy other tables (reservations, tokens) and to translate column names between projects (mapping).