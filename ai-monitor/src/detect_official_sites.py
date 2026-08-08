"""
SarkariSetu AI Monitoring — Official Website Detection Engine
Har exam ke liye sahi official website detect karta hai (rules-based, verified domains only).
Run: python3 detect_official_sites.py  (Supabase URL/key env se)
"""
import os, re, json, requests, time

SUPABASE_URL = os.environ.get("SUPABASE_URL", "https://fbcvxefvvifmxaiqxiuq.supabase.co")
SUPABASE_KEY = os.environ.get("SUPABASE_KEY", "")

# Strict rules: (regex on name.upper(), official_domain)
STRICT = [
    (r"UPTET", "https://upbasiceduboard.gov.in"),
    (r"MPTET", "https://esb.mp.gov.in"),
    (r"KARTET", "https://schooleducation.kar.nic.in"),
    (r"APTET", "https://aptet.apcfss.in"),
    (r"TNTET", "https://trb.tn.nic.in"),
    (r"PSTET", "https://pstet.pseb.ac.in"),
    (r"UKTET", "https://uktet.uk.gov.in"),
    (r"HTET", "https://bseh.org.in"),
    (r"BTET", "https://biharboardonline.bihar.gov.in"),
    (r"REET|RTET", "https://rajeduboard.rajasthan.gov.in"),
    (r"CTET", "https://ctet.nic.in"),
    (r"OTET", "https://bseodisha.ac.in"),
    (r"JTET", "https://jac.jharkhand.gov.in"),
    (r"CGTET|CG TET", "https://cgbse.nic.in"),
    (r"TSTET|TGTET", "https://tgtet.aptonline.in"),
    (r"WEST BENGAL TET", "https://wbbpe.org"),
    (r"MAHA TET|MAHATET", "https://mscepune.in"),
    (r"HP TET", "https://hpbose.org"),
    (r"KERALA TET", "https://keralapareekshabhavan.in"),
    (r"GSEB", "https://gseb.org"),
    (r"ANDHRA PRADESH PSC|APPSC", "https://psc.ap.gov.in"),
    (r"TELANGANA PSC|TSPSC", "https://tspsc.gov.in"),
    (r"MAHARASHTRA PSC|MPSC", "https://mpsc.gov.in"),
    (r"WEST BENGAL PSC|WBPSC", "https://psc.wb.gov.in"),
    (r"KERALA PSC", "https://keralapsc.gov.in"),
    (r"GUJARAT PSC|\bGPSC\b", "https://gpsc.gujarat.gov.in"),
    (r"ASSAM PSC|APSC", "https://apsc.nic.in"),
    (r"PUNJAB PSC|\bPPSC\b", "https://ppsc.gov.in"),
    (r"J&K PSC|JKPSC", "https://jkpsc.nic.in"),
    (r"UPPSC", "https://uppsc.up.nic.in"),
    (r"MPPSC", "https://mppsc.mp.gov.in"),
    (r"HPPSC", "https://hppsc.hp.gov.in"),
    (r"BPSC", "https://bpsc.bih.nic.in"),
    (r"RPSC", "https://rpsc.rajasthan.gov.in"),
    (r"HPSC", "https://hpsc.gov.in"),
    (r"UKPSC", "https://psc.uk.gov.in"),
    (r"KPSC", "https://kpsc.kar.nic.in"),
    (r"TNPSC", "https://tnpsc.gov.in"),
    (r"OPSC", "https://opsc.gov.in"),
    (r"JPSC", "https://jpsc.gov.in"),
    (r"CGPSC", "https://psc.cg.gov.in"),
    (r"GOA PSC", "https://gpsc.goa.gov.in"),
    (r"UP POLICE", "https://uppolice.gov.in"),
    (r"MP POLICE", "https://mppolice.gov.in"),
    (r"BIHAR POLICE", "https://police.bihar.gov.in"),
    (r"RAJASTHAN POLICE", "https://police.rajasthan.gov.in"),
    (r"DELHI POLICE", "https://delhipolice.gov.in"),
    (r"MAHARASHTRA POLICE", "https://mahapolice.gov.in"),
    (r"TAMIL NADU POLICE|TN POLICE", "https://tnusrb.tn.gov.in"),
    (r"GUJARAT POLICE", "https://ojas.gujarat.gov.in"),
    (r"KARNATAKA POLICE", "https://ksp.karnataka.gov.in"),
    (r"PUNJAB POLICE", "https://punjabpolice.gov.in"),
    (r"HARYANA POLICE", "https://haryanapolice.gov.in"),
    (r"ODISHA POLICE", "https://odishapolice.gov.in"),
    (r"ASSAM POLICE", "https://slprbassam.in"),
    (r"JHARKHAND POLICE", "https://jhpolice.gov.in"),
    (r"WEST BENGAL POLICE|WB POLICE", "https://wbpolice.gov.in"),
    (r"KERALA POLICE", "https://keralapolice.gov.in"),
    (r"ANDHRA PRADESH POLICE|AP POLICE", "https://appolice.gov.in"),
    (r"TELANGANA POLICE|TS POLICE", "https://tspolice.gov.in"),
    (r"HIMACHAL POLICE|HP POLICE", "https://hppolice.gov.in"),
    (r"UTTARAKHAND POLICE", "https://uttarakhandpolice.uk.gov.in"),
    (r"CHHATTISGARH POLICE", "https://cgpolice.gov.in"),
    (r"J&K POLICE|JK POLICE", "https://jkpolice.gov.in"),
    (r"AIIMS", "https://aiimsexams.ac.in"),
    (r"JIPMER", "https://jipmer.edu.in"),
    (r"CLAT", "https://consortiumofnlus.ac.in"),
    (r"\bXAT\b", "https://xatonline.in"),
    (r"\bCAT\b", "https://iimcat.ac.in"),
    (r"\bMAT\b", "https://mat.aima.in"),
    (r"CMAT", "https://cmat.nta.ac.in"),
    (r"KVS", "https://kvsangathan.nic.in"),
    (r"NVS|NAVODAYA", "https://navodaya.gov.in"),
    (r"DSSSB", "https://dsssb.delhi.gov.in"),
    (r"AFCAT", "https://afcat.cdac.in"),
    (r"\bNDA\b|\bCDS\b|CAPF", "https://upsc.gov.in"),
    (r"INDIAN ARMY|ARMY RECRUIT", "https://joinindianarmy.nic.in"),
    (r"INDIAN NAVY|NAVY RECRUIT", "https://joinindiannavy.gov.in"),
    (r"AIR FORCE|IAF", "https://indianairforce.nic.in"),
    (r"BSF", "https://bsf.gov.in"),
    (r"CRPF", "https://crpf.gov.in"),
    (r"CISF", "https://cisf.gov.in"),
    (r"ITBP", "https://itbpolice.nic.in"),
    (r"SSB", "https://ssbrectt.gov.in"),
    (r"ESIC", "https://esic.nic.in"),
    (r"EPFO", "https://epfindia.gov.in"),
    (r"NABARD", "https://nabard.org"),
    (r"\bRBI\b", "https://rbi.org.in"),
    (r"\bLIC\b", "https://licindia.in"),
    (r"NIACL|NEW INDIA", "https://newindia.co.in"),
    (r"OICL", "https://www.oicl.co.in"),
    (r"UICL", "https://www.uiic.co.in"),
    (r"SEBI", "https://sebi.gov.in"),
    (r"UGC NET", "https://ugcnet.nta.nic.in"),
    (r"CSIR NET", "https://csirnet.nta.nic.in"),
    (r"CUET", "https://cuet.nta.nic.in"),
    (r"GATE", "https://gate2026.iitg.ac.in"),
    (r"ICAR", "https://icar.org.in"),
    (r"ASRB", "https://asrb.org.in"),
    (r"CBSE", "https://www.cbse.gov.in"),
    (r"UP BOARD", "https://upmsp.edu.in"),
    (r"MP BOARD", "https://mpbse.nic.in"),
    (r"SBI PO|SBI CLERK|SBI SO|SBI APP", "https://sbi.co.in"),
    (r"IBPS", "https://ibps.in"),
]

# Junk/placeholder domains that should be replaced when a real one is known
JUNK = {"exam.gov.in", "bprd.nic.in", "iimcat.ac.in", "psc.gov.in", "nagarnigam.gov.in", "police.gov.in"}


def norm(url):
    u = (url or "").strip().lower()
    for p in ("http://", "https://", "www."):
        u = u.replace(p, "")
    return u.rstrip("/").split("/")[0]


def detect(name):
    up = (name or "").upper()
    for pat, dom in STRICT:
        if re.search(pat, up):
            return dom
    return None


def main():
    if not SUPABASE_KEY:
        print("SUPABASE_KEY env missing")
        return
    h = {"apikey": SUPABASE_KEY, "Authorization": f"Bearer {SUPABASE_KEY}"}
    rows, off = [], 0
    while True:
        r = requests.get(f"{SUPABASE_URL}/rest/v1/exams?select=id,name,category,official_website&limit=1000&offset={off}", headers=h, timeout=30)
        rs = r.json()
        if not rs:
            break
        rows += rs
        off += 1000
        if off > 60000:
            break
    changes = 0
    for x in rows:
        cur = norm(x.get("official_website"))
        dom = detect(x.get("name"))
        if not dom:
            continue
        newd = norm(dom)
        if cur == newd:
            continue
        if cur and cur not in JUNK:
            continue  # already has a specific site — trust it
        requests.patch(f"{SUPABASE_URL}/rest/v1/exams?id=eq.{x['id']}",
                       json={"official_website": dom}, headers={**h, "Content-Type": "application/json"}, timeout=30)
        changes += 1
    print(f"detect_official_sites: {changes} updated")


if __name__ == "__main__":
    main()
