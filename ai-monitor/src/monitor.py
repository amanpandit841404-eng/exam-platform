"""
SarkariSetu AI Monitoring Engine v2
Har source ki website ko check karta hai, content hash se change detect karta hai,
aur naye changes ko Supabase 'monitor_events' table me log karta hai (admin review ke liye).
Run: python3 monitor.py
"""
import os, json, time, hashlib, requests
from datetime import datetime
from bs4 import BeautifulSoup

SUPABASE_URL = os.environ.get("SUPABASE_URL", "https://fbcvxefvvifmxaiqxiuq.supabase.co")
SUPABASE_KEY = os.environ.get("SUPABASE_KEY", "")
SOURCES_FILE = os.environ.get("SOURCES_FILE", os.path.join(os.path.dirname(__file__), "..", "sources.json"))
STATE_FILE = os.path.join(os.path.dirname(__file__), "..", "monitor_state.json")

HEADERS = {"User-Agent": "Mozilla/5.0 (compatible; SarkariSetuMonitor/1.0)"}


def load_sources():
    with open(SOURCES_FILE) as f:
        return json.load(f)["sources"]


def load_state():
    if os.path.exists(STATE_FILE):
        with open(STATE_FILE) as f:
            return json.load(f)
    return {}


def save_state(state):
    with open(STATE_FILE, "w") as f:
        json.dump(state, f, indent=1)


def fetch_text(url):
    try:
        r = requests.get(url, headers=HEADERS, timeout=20, allow_redirects=True)
        if r.status_code != 200:
            return None
        soup = BeautifulSoup(r.text, "html.parser")
        # main content text
        for tag in soup(["script", "style", "nav", "footer"]):
            tag.decompose()
        return soup.get_text(" ", strip=True)[:200000]
    except Exception:
        return None


def content_hash(text):
    return hashlib.sha256(text.encode("utf-8", "ignore")).hexdigest()[:16]


def supabase_log_event(source, changed, hash_old, hash_new):
    """Log a monitor run result. Table: monitor_events (created by user SQL)."""
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


def run_monitor():
    sources = load_sources()
    state = load_state()
    changes_found = []
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
            print(f"  ! CHANGED ({prev} -> {h})")
        else:
            print(f"  - same ({h})")
        supabase_log_event(src, changed, prev or "", h)
        time.sleep(3)  # be polite to govt sites
    save_state(state)
    print(f"\nDone. {len(changes_found)} sources changed: {changes_found}")
    return changes_found


if __name__ == "__main__":
    run_monitor()
