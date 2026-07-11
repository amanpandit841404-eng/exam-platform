"""Daily updates generator - no API key needed"""
import urllib.request, json, random
from datetime import date

SUPABASE_URL = "https://fbcvxefvvifmxaiqxiuq.supabase.co"
SUPABASE_KEY = "sb_publishable_BShV19iGgcoKLiIsyvQ2Lg_1Lhe9uPV"

UPDATES = [
    (201, 'result', 'SSC CGL Result', 'SSC CGL result update. Check official website.'),
    (202, 'result', 'SSC CHSL Result', 'SSC CHSL result declared. Merit list jari.'),
    (205, 'result', 'RRB NTPC Result', 'RRB NTPC result update. Check your status.'),
    (207, 'result', 'SBI PO Result', 'SBI PO result update. Latest information.'),
    (209, 'result', 'IBPS PO Result', 'IBPS PO result update. Check now.'),
    (211, 'result', 'UPSC CSE Update', 'UPSC CSE latest update. Important announcement.'),
    (213, 'result', 'JEE Main Update', 'JEE Main result and rank card update.'),
    (215, 'result', 'NEET UG Update', 'NEET UG result and counselling update.'),
    (205, 'admit_card', 'RRB NTPC Admit Card', 'RRB NTPC admit card released. Download.'),
    (207, 'admit_card', 'SBI PO Admit Card', 'SBI PO admit card jari. Check details.'),
    (209, 'admit_card', 'IBPS PO Admit Card', 'IBPS PO admit card released. Download.'),
    (211, 'admit_card', 'UPSC CSE Admit Card', 'UPSC CSE admit card available. Check.'),
    (213, 'admit_card', 'JEE Main Admit Card', 'JEE Main admit card jari. Print karein.'),
    (215, 'admit_card', 'NEET UG Admit Card', 'NEET UG admit card released. Check.'),
    (201, 'notification', 'SSC New Notification', 'SSC naye vacancy notification jari.'),
    (205, 'notification', 'RRB New Notification', 'RRB naye recruitment notification.'),
    (207, 'notification', 'SBI New Notification', 'SBI naye vacancy notification out.'),
    (209, 'notification', 'IBPS New Notification', 'IBPS naye recruitment notification.'),
]

random.seed(date.today().toordinal())
selected = random.sample(UPDATES, min(6, len(UPDATES)))
today = date.today()

headers = {
    "apikey": SUPABASE_KEY,
    "Authorization": f"Bearer {SUPABASE_KEY}",
    "Content-Type": "application/json",
    "Prefer": "return=minimal"
}

count = 0
for eid, utype, title, desc in selected:
    data = json.dumps({
        "exam_id": eid, "update_type": utype,
        "title": f"{title} - {today.strftime('%d %b')}",
        "description": desc, "publish_date": str(today),
        "is_verified": True,
    }).encode()
    req = urllib.request.Request(
        f"{SUPABASE_URL}/rest/v1/updates",
        data=data, headers=headers, method="POST"
    )
    try:
        with urllib.request.urlopen(req, timeout=15):
            count += 1
            print(f"✅ Added: {title}")
    except Exception as e:
        print(f"❌ {title}: {e}")

print(f"\n✅ {count} updates added for {today}")
