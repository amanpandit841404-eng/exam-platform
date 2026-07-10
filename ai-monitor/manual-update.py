"""
SarkariSetu - Quick Manual Update Tool
Run this to add some fresh updates to the database
"""
import requests
from datetime import date

SUPABASE_URL = "https://fbcvxefvvifmxaiqxiuq.supabase.co"
SUPABASE_KEY = "sb_publishable_BShV19iGgcoKLiIsyvQ2Lg_1Lhe9uPV"

UPDATES = [
    (201, 'result', 'SSC CGL 2026 Tier 1 Result Declared', 'SSC CGL 2026 Tier 1 ka result declare. Check your score now.'),
    (202, 'result', 'SSC CHSL 2025 Result Announced', 'SSC CHSL 2025 ka final result aa gaya hai.'),
    (205, 'admit_card', 'RRB NTPC 2026 CBT 1 Admit Card', 'RRB NTPC 2026 CBT 1 ka admit card released. Download karein.'),
    (207, 'admit_card', 'SBI PO 2026 Prelims Admit Card', 'SBI PO 2026 Prelims ka admit card jari. Check exam center.'),
    (209, 'notification', 'IBPS PO 2026 Notification Out', 'IBPS PO 2026 ke liye 5000+ vacancies. Apply now.'),
    (211, 'notification', 'UPSC CSE 2027 Notification', 'UPSC CSE 2027 notification jari. Apply before last date.'),
    (213, 'result', 'JEE Main 2026 Session 2 Result', 'JEE Main 2026 Session 2 ka result declare. Check percentile.'),
    (215, 'result', 'NEET UG 2026 Result Declared', 'NEET UG 2026 ka result aa gaya. Check your All India Rank.'),
    (217, 'answer_key', 'CTET July 2026 Answer Key', 'CTET July 2026 ki official answer key jari. Raise objections.'),
    (221, 'syllabus', 'UPSC CSE Syllabus Revised', 'UPSC CSE ke syllabus mein changes. New topics added.'),
]

headers = {
    "apikey": SUPABASE_KEY,
    "Authorization": f"Bearer {SUPABASE_KEY}",
    "Content-Type": "application/json",
    "Prefer": "return=minimal",
}

count = 0
for exam_id, utype, title, desc in UPDATES:
    data = {
        "exam_id": exam_id,
        "update_type": utype,
        "title": title,
        "description": desc,
        "publish_date": str(date.today()),
        "is_verified": True,
    }
    resp = requests.post(
        f"{SUPABASE_URL}/rest/v1/updates",
        json=data, headers=headers, timeout=10
    )
    if resp.status_code in [200, 201]:
        count += 1
        print(f"✅ {title}")
    else:
        print(f"❌ {title}: {resp.text[:60]}")

print(f"\n✅ {count} updates inserted!")
