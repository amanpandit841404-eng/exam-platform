"""
SarkariSetu AI Extractor v1
Changed sources se structured data extract karta hai using Gemini API.
Extracts: exam_name, event_type, dates, links, vacancy, confidence score.
"""
import os, json, re, requests
from datetime import datetime

SUPABASE_URL = os.environ.get("SUPABASE_URL", "https://fbcvxefvvifmxaiqxiuq.supabase.co")
SUPABASE_KEY = os.environ.get("SUPABASE_KEY", "")
GEMINI_API_KEY = os.environ.get("GEMINI_API_KEY", "")

EXTRACT_TABLE = "ai_extractions"

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
    """Call Gemini API to extract structured data from page text."""
    if not GEMINI_API_KEY:
        print("  - No GEMINI_API_KEY, skipping extraction")
        return []
    
    # Truncate to ~8000 chars for Gemini flash
    text_snippet = source_text[:8000]
    
    prompt = f"""Website: {source_name} ({source_url})

Page content:
{text_snippet}

Extract all recent exam notifications, results, admit cards from this content."""

    payload = {
        "contents": [{"parts": [{"text": SYSTEM_PROMPT + "\n\n" + prompt}]}],
        "generationConfig": {"temperature": 0.1, "maxOutputTokens": 4096}
    }
    
    try:
        r = requests.post(
            f"{GEMINI_URL}?key={GEMINI_API_KEY}",
            json=payload,
            timeout=30
        )
        if r.status_code != 200:
            print(f"  - Gemini error {r.status_code}: {r.text[:200]}")
            return []
        
        resp = r.json()
        text = resp["candidates"][0]["content"]["parts"][0]["text"]
        
        # Clean markdown code blocks if present
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
    """Save extracted items to ai_extractions table."""
    if not items:
        return 0
    
    saved = 0
    for item in items:
        confidence = float(item.get("confidence", 0.5))
        
        # Auto-determine status based on confidence
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
            "raw_content": raw_text[:5000],  # store first 5000 chars
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
                f"{SUPABASE_URL}/rest/v1/{EXTRACT_TABLE}",
                json=data,
                headers={
                    "apikey": SUPABASE_KEY,
                    "Authorization": f"Bearer {SUPABASE_KEY}",
                    "Content-Type": "application/json",
                    "Prefer": "return=minimal"
                },
                timeout=15
            )
            if r.status_code in (200, 201):
                saved += 1
            else:
                print(f"  - Save failed {r.status_code}: {r.text[:100]}")
        except Exception as e:
            print(f"  - Save exception: {e}")
    
    return saved


def run_extractor(changed_sources_with_text):
    """
    Main entry point. 
    changed_sources_with_text: list of (source_dict, page_text) tuples
    """
    total_saved = 0
    for source, text in changed_sources_with_text:
        print(f"Extracting from {source['name']}...")
        items = extract_with_gemini(text, source["name"], source["url"])
        print(f"  Found {len(items)} items")
        saved = save_extractions(source, items, text)
        print(f"  Saved {saved} to ai_extractions")
        total_saved += saved
    
    print(f"\nExtractor done. Total saved: {total_saved}")
    return total_saved


if __name__ == "__main__":
    # Test mode: extract from a single source
    import sys
    if len(sys.argv) > 1:
        test_url = sys.argv[1]
        import hashlib
        from bs4 import BeautifulSoup
        r = requests.get(test_url, headers={"User-Agent": "Mozilla/5.0"}, timeout=20)
        soup = BeautifulSoup(r.text, "html.parser")
        for tag in soup(["script", "style", "nav", "footer"]):
            tag.decompose()
        text = soup.get_text(" ", strip=True)[:200000]
        run_extractor([
            ({"id": "test", "name": "Test Source", "url": test_url, "category": "test"}, text)
        ])
