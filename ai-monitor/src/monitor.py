"""
SarkariSetu AI Monitoring Engine v2.1
- Content hash change detection
- Supabase logging (monitor_events + monitor_state)
- AI Extractor integration: changed sources → Gemini extraction → ai_extractions table
Run: python3 monitor.py
"""
import os, json, time, hashlib, requests
from datetime import datetime
from bs4 import BeautifulSoup

SUPABASE_URL = os.environ.get("SUPABASE_URL", "https://fbcvxefvvifmxaiqxiuq.supabase.co")
SUPABASE_KEY = os.environ.get("SUPABASE_KEY", "")
GEMINI_API_KEY = os.environ.get("GEMINI_API_KEY", "")
SOURCES_FILE = os.environ.get("SOURCES_FILE", os.path.join(os.path.dirname(__file__), "..", "sources.json"))
STATE_FILE = os.path.join(os.path.dirname(__file__), "..", "monitor_state.json")
STATE_TABLE = "monitor_state"

HEADERS = {"User-Agent": "Mozilla/5.0 (compatible; SarkariSetuMonitor/1.0)"}


def load_sources():
    with open(SOURCES_FILE) as f:
        return json.load(f)["sources"]


def load_state():
    state = {}
    try:
        r = requests.get(f"{SUPABASE_URL}/rest/v1/{STATE_TABLE}?select=*&limit=1000",
                         headers={"apikey": SUPABASE_KEY, "Authorization": f"Bearer {SUPABASE_KEY}"}, timeout=15)
        if r.status_code == 200:
            for row in r.json():
                state[row["source_id"]] = {"hash": row.get("hash", ""), "last_checked": row.get("last_checked", "")}
    except Exception:
        pass
    if not state and os.path.exists(STATE_FILE):
        with open(STATE_FILE) as f:
            state = json.load(f)
    return state


def save_state(state):
    with open(STATE_FILE, "w") as f:
        json.dump(state, f, indent=1)


def fetch_text(url):
    try:
        r = requests.get(url, headers=HEADERS, timeout=20, allow_redirects=True)
        if r.status_code != 200:
            return None
        soup = BeautifulSoup(r.text, "html.parser")
        for tag in soup(["script", "style", "nav", "footer"]):
            tag.decompose()
        return soup.get_text(" ", strip=True)[:200000]
    except Exception:
        return None


def content_hash(text):
    return hashlib.sha256(text.encode("utf-8", "ignore")).hexdigest()[:16]


def supabase_log_event(source, changed, hash_old, hash_new):
    data = {
        "source_id": source["id"],
        "source_name": source["name"],
        "source_url": source["url"],
        "category": source.get("category", ""),
        "changed": changed,
        "hash_old": hash_old,
        "hash_new": hash_new,
        "checked_at": datetime.utcnow().isoformat(),
    }
    try:
        r = requests.post(
            f"{SUPABASE_URL}/rest/v1/monitor_events",
            json=data,
            headers={"apikey": SUPABASE_KEY, "Authorization": f"Bearer {SUPABASE_KEY}",
                     "Content-Type": "application/json", "Prefer": "return=minimal"},
            timeout=15,
        )
        return r.status_code in (200, 201)
    except Exception:
        return False


# ── AI Extractor (inline, no import needed) ──────────────────────────────────

GEMINI_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent"

SYSTEM_PROMPT = """You are an expert at extracting structured information from Indian government exam websites.
Given the text content of an official exam website, extract ALL recent notifications, results, admit cards, and updates.

For each item found, return a JSON object with these fields:
- exam_name: string (full exam name, e.g. "UPSC Civil Services 2024")
- event_type: one of ["result", "admit_card", "notification", "answer_key", "syllabus", "cutoff", "interview_schedule", "other"]
- title: string (exact title of the notification/update)
- description: string (brief description, max 200 chars)
- dates: object with optional keys: notification_date, last_date, exam_date, result_date, admit_card_date (ISO format YYYY-MM-DD or null)
- official_link: string (direct URL if found, else null)
- vacancy_count: integer or null
- confidence: float 0.0-1.0 (how confident you are this is a real, current update)

Return a JSON array of all items found. If nothing relevant found, return [].
Focus on items from the last 90 days. Ignore old archived content.
Return ONLY valid JSON, no markdown, no explanation."""


def extract_with_gemini(source_text, source_name, source_url):
    import re
    if not GEMINI_API_KEY:
        print("  - No GEMINI_API_KEY, skipping extraction")
        return []
    text_snippet = source_text[:8000]
    prompt = f"Website: {source_name} ({source_url})\n\nPage content:\n{text_snippet}\n\nExtract all recent exam notifications, results, admit cards from this content."
    payload = {
        "contents": [{"parts": [{"text": SYSTEM_PROMPT + "\n\n" + prompt}]}],
        "generationConfig": {"temperature": 0.1, "maxOutputTokens": 4096}
    }
    try:
        r = requests.post(f"{GEMINI_URL}?key={GEMINI_API_KEY}", json=payload, timeout=30)
        if r.status_code != 200:
            print(f"  - Gemini error {r.status_code}: {r.text[:200]}")
            return []
        resp = r.json()
        text = resp["candidates"][0]["content"]["parts"][0]["text"]
        text = re.sub(r"```json\s*", "", text)
        text = re.sub(r"```\s*", "", text)
        text = text.strip()
        items = json.loads(text)
        if not isinstance(items, list):
            items = [items]
        return items
    except json.JSONDecodeError as e:
        print(f"  - JSON parse error: {e}")
        return []
    except Exception as e:
        print(f"  - Gemini call failed: {e}")
        return []


def save_extractions(source, items, raw_text):
    if not items:
        return 0
    saved = 0
    for item in items:
        confidence = float(item.get("confidence", 0.5))
        if confidence >= 0.95:
            status = "auto_approved"
        elif confidence >= 0.85:
            status = "quick_review"
        elif confidence >= 0.70:
            status = "pending"
        else:
            status = "low_confidence"
        data = {
            "source_id": source["id"],
            "source_name": source["name"],
            "source_url": source["url"],
            "category": source.get("category", ""),
            "raw_content": raw_text[:5000],
            "extracted_json": json.dumps(item),
            "exam_name": item.get("exam_name", ""),
            "event_type": item.get("event_type", "other"),
            "title": item.get("title", ""),
            "description": item.get("description", ""),
            "official_link": item.get("official_link"),
            "vacancy_count": item.get("vacancy_count"),
            "confidence": confidence,
            "status": status,
            "extracted_at": datetime.utcnow().isoformat(),
        }
        try:
            r = requests.post(
                f"{SUPABASE_URL}/rest/v1/ai_extractions",
                json=data,
                headers={"apikey": SUPABASE_KEY, "Authorization": f"Bearer {SUPABASE_KEY}",
                         "Content-Type": "application/json", "Prefer": "return=minimal"},
                timeout=15
            )
            if r.status_code in (200, 201):
                saved += 1
            else:
                print(f"  - Save failed {r.status_code}: {r.text[:100]}")
        except Exception as e:
            print(f"  - Save exception: {e}")
    return saved


# ─────────────────────────────────────────────────────────────────────────────

def run_monitor():
    sources = load_sources()
    state = load_state()
    changes_found = []
    changed_with_text = []  # for AI extractor

    for src in sources:
        sid = src["id"]
        print(f"Checking {src['name']} ({src['url']})...")
        text = fetch_text(src["url"])
        if not text:
            print("  - fetch failed, skipping")
            time.sleep(2)
            continue
        h = content_hash(text)
        prev = state.get(sid, {}).get("hash")
        changed = prev is not None and prev != h
        state[sid] = {"hash": h, "last_checked": datetime.utcnow().isoformat()}
        if changed:
            changes_found.append(src["name"])
            changed_with_text.append((src, text))
            print(f"  ! CHANGED ({prev} -> {h})")
        else:
            print(f"  - same ({h})")
        supabase_log_event(src, changed, prev or "", h)
        time.sleep(3)

    save_state(state)

    # Persist state to Supabase
    try:
        for sid, st in state.items():
            requests.post(
                f"{SUPABASE_URL}/rest/v1/{STATE_TABLE}",
                json={"source_id": sid, "hash": st.get("hash", ""), "last_checked": st.get("last_checked", "")},
                headers={"apikey": SUPABASE_KEY, "Authorization": f"Bearer {SUPABASE_KEY}",
                         "Content-Type": "application/json",
                         "Prefer": "resolution=merge-duplicates"}, timeout=15)
    except Exception:
        pass

    # AI Extraction for changed sources
    if changed_with_text and GEMINI_API_KEY:
        print(f"\n--- AI Extraction for {len(changed_with_text)} changed sources ---")
        for source, text in changed_with_text:
            print(f"Extracting from {source['name']}...")
            items = extract_with_gemini(text, source["name"], source["url"])
            print(f"  Found {len(items)} items")
            saved = save_extractions(source, items, text)
            print(f"  Saved {saved} to ai_extractions")
            time.sleep(2)
    elif changed_with_text:
        print(f"\n{len(changed_with_text)} sources changed but GEMINI_API_KEY not set — skipping extraction")

    print(f"\nDone. {len(changes_found)} sources changed: {changes_found}")
    return changes_found


if __name__ == "__main__":
    run_monitor()
