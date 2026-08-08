# SarkariSetu AI Monitoring

Official exam websites ka automatic monitoring system (MVP).

## Files
- `sources.json` — monitored official sources registry (UPSC, SSC, RRB, IBPS, state PSCs...)
- `src/monitor.py` — har source ki website check karta hai; content hash se change detect karta hai; `monitor_events` table me log karta hai
- `src/detect_official_sites.py` — exams table me har exam ke liye sahi official website detect/fill karta hai (rules-based, verified domains only)

## Setup (user ke liye — ek baar)
1. Supabase SQL Editor me ye table banayein:
   ```sql
   create table if not exists monitor_events (
     id bigint generated always as identity primary key,
     source_id text,
     source_name text,
     source_url text,
     category text,
     changed boolean default false,
     hash_old text,
     hash_new text,
     checked_at timestamptz default now()
   );
   alter table monitor_events enable row level security;
   create policy "anon read" on monitor_events for select using (true);
   create policy "service write" on monitor_events for insert with check (true);

   create table if not exists monitor_state (
     source_id text primary key,
     hash text,
     last_checked timestamptz default now()
   );
   alter table monitor_state enable row level security;
   create policy "anon read state" on monitor_state for select using (true);
   create policy "service write state" on monitor_state for all using (true) with check (true);
   ```
2. Env vars: `SUPABASE_URL`, `SUPABASE_KEY` (service key)

## GitHub Actions (24/7 auto-run — recommended)
- `.github/workflows/monitor.yml` har 3 ghante me monitor + detect chalaata hai
- Repo Settings → Secrets and variables → Actions me ye 2 secrets daalein:
  - `SUPABASE_URL` = `https://fbcvxefvvifmxaiqxiuq.supabase.co`
  - `SUPABASE_SERVICE_KEY` = (service role key)
- Manual run: GitHub repo → Actions → "SarkariSetu Monitor" → Run workflow

## Run (local)
```bash
pip install -r requirements.txt
export SUPABASE_URL=... SUPABASE_KEY=...
python3 src/monitor.py
python3 src/detect_official_sites.py
```

## AI extractor (next phase)
- monitor_events me `changed=true` wale sources ke liye naya page content AI ko bheja jayega
- AI structured JSON nikalega (exam name, dates, eligibility, links)
- Admin approval ke baad exams/updates table me publish
