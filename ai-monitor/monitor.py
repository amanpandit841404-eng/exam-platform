"""
SarkariSetu AI Monitoring Engine
Automatically checks official exam websites for updates
Uses Gemini AI to detect and extract changes
"""

import os
import json
import time
import hashlib
import requests
from datetime import datetime, date
from bs4 import BeautifulSoup

# =============================================
# CONFIGURATION
# =============================================

SUPABASE_URL = "https://fbcvxefvvifmxaiqxiuq.supabase.co"
SUPABASE_KEY = "sb_publishable_BShV19iGgcoKLiIsyvQ2Lg_1Lhe9uPV"
GEMINI_API_KEY = os.environ.get("GEMINI_API_KEY", "")

# Official websites to monitor
SITES = [
    {
        "name": "SSC",
        "url": "https://ssc.gov.in/",
        "category": "SSC Exams",
        "exam_ids": [201, 202, 203, 204, 222],
    },
    {
        "name": "UPSC",
        "url": "https://upsc.gov.in/",
        "category": "UPSC Civil Services",
        "exam_ids": [211, 212, 221],
    },
    {
        "name": "IBPS",
        "url": "https://ibps.in/",
        "category": "Banking and Finance",
        "exam_ids": [207, 208, 209, 223],
    },
    {
        "name": "RRB",
        "url": "https://rrb.gov.in/",
        "category": "Railway Recruitment",
        "exam_ids": [205, 206, 224, 225],
    },
    {
        "name": "NEET",
        "url": "https://neet.nta.nic.in/",
        "category": "Medical Entrance",
        "exam_ids": [215, 216],
    },
]

# File to store last seen content (for change detection)
STATE_FILE = "monitor_state.json"


# =============================================
# HELPERS
# =============================================

def supabase_insert(table, data):
    """Insert data into Supabase"""
    url = f"{SUPABASE_URL}/rest/v1/{table}"
    headers = {
        "apikey": SUPABASE_KEY,
        "Authorization": f"Bearer {SUPABASE_KEY}",
        "Content-Type": "application/json",
        "Prefer": "return=minimal",
    }
    try:
        resp = requests.post(url, json=data, headers=headers, timeout=15)
        if resp.status_code in [200, 201]:
            return True
        else:
            print(f"  ❌ Supabase insert error {resp.status_code}: {resp.text[:100]}")
            return False
    except Exception as e:
        print(f"  ❌ Supabase connection error: {e}")
        return False


def fetch_page_content(url):
    """Fetch and extract text from a webpage"""
    try:
        headers = {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"
        }
        resp = requests.get(url, headers=headers, timeout=20)
        resp.raise_for_status()
        soup = BeautifulSoup(resp.text, "html.parser")
        
        # Remove script and style elements
        for tag in soup(["script", "style", "nav", "footer", "header"]):
            tag.decompose()
        
        text = soup.get_text(separator="\n", strip=True)
        # Limit to first 5000 chars (to save AI cost)
        return text[:5000]
    except Exception as e:
        print(f"  ⚠️ Fetch error: {e}")
        return None


def get_content_hash(content):
    """Generate hash for change detection"""
    return hashlib.md5(content.encode()).hexdigest() if content else ""


def load_state():
    """Load previous monitoring state"""
    try:
        with open(STATE_FILE, "r") as f:
            return json.load(f)
    except:
        return {}


def save_state(state):
    """Save monitoring state"""
    with open(STATE_FILE, "w") as f:
        json.dump(state, f)


def detect_updates_with_ai(site_name, old_content, new_content):
    """Use Gemini AI to compare old and new content and detect updates"""
    if not GEMINI_API_KEY:
        return None
    
    try:
        import google.generativeai as genai
        genai.configure(api_key=GEMINI_API_KEY)
        model = genai.GenerativeModel("gemini-2.0-flash")
        
        prompt = f"""You are an exam update monitor for {site_name} website.
Compare the OLD content with the NEW content and detect if there are any NEW exam-related updates.

OLD Content:
{old_content[:2000]}

NEW Content:
{new_content[:2000]}

If there's a NEW update (result declared, admit card released, notification, etc.), respond with JSON:
{{"has_update": true, "type": "result/admit_card/notification/answer_key", "title": "short title", "description": "brief description"}}

If no new update, respond with: {{"has_update": false}}

Only respond with JSON, nothing else."""
        
        response = model.generate_content(prompt)
        result = response.text.strip()
        # Extract JSON from response
        if "{" in result:
            json_str = result[result.index("{"):result.rindex("}")+1]
            return json.loads(json_str)
        return None
    except Exception as e:
        print(f"  ⚠️ AI error: {e}")
        return None


# =============================================
# MAIN MONITOR LOOP
# =============================================

def run_monitor():
    print("=" * 50)
    print(f"🔍 SarkariSetu AI Monitor - {datetime.now().isoformat()}")
    print("=" * 50)
    
    state = load_state()
    total_updates = 0
    
    for site in SITES:
        print(f"\n📡 Checking {site['name']} ({site['url']})...")
        
        content = fetch_page_content(site["url"])
        if not content:
            print(f"  ⏭️ Skipping - no content")
            continue
        
        content_hash = get_content_hash(content)
        prev_hash = state.get(site["name"], {}).get("hash", "")
        
        if content_hash == prev_hash:
            print(f"  ✅ No changes detected")
            continue
        
        print(f"  🔄 Change detected! Previous hash: {prev_hash[:8]}... New: {content_hash[:8]}...")
        
        prev_content = state.get(site["name"], {}).get("content", "")
        
        # Try AI detection
        ai_result = detect_updates_with_ai(site["name"], prev_content, content)
        
        if ai_result and ai_result.get("has_update"):
            update_type = ai_result.get("type", "notification")
            title = ai_result.get("title", f"New update on {site['name']}")
            description = ai_result.get("description", "")
            
            print(f"  🤖 AI detected: {update_type} - {title}")
            
            # Insert update for each related exam
            for exam_id in site.get("exam_ids", []):
                update_data = {
                    "exam_id": exam_id,
                    "update_type": update_type,
                    "title": title,
                    "description": description,
                    "publish_date": str(date.today()),
                    "is_verified": False,
                }
                if supabase_insert("updates", update_data):
                    total_updates += 1
                    print(f"    ✅ Inserted for exam {exam_id}")
        else:
            print(f"  ℹ️ Content changed but no structured update detected by AI")
        
        # Save state
        if site["name"] not in state:
            state[site["name"]] = {}
        state[site["name"]]["hash"] = content_hash
        state[site["name"]]["content"] = content
        state[site["name"]]["last_checked"] = datetime.now().isoformat()
        save_state(state)
        
        # Be nice to websites - delay between requests
        time.sleep(3)
    
    print(f"\n{'=' * 50}")
    print(f"✅ Monitor complete! {total_updates} new updates added")
    print(f"{'=' * 50}")
    return total_updates


if __name__ == "__main__":
    run_monitor()
