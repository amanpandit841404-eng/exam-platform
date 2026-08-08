"use client";
    import { useState, useEffect, useCallback } from "react";

    const ADMIN_PASSWORD = "sarkari123";

    const TABLES = [
      { key: "dashboard", icon: "📊", label: "Dashboard", color: "#1e40af" },
      { key: "exams", icon: "📝", label: "Exams", color: "#2563eb" },
      { key: "results", icon: "🏆", label: "Results", color: "#16a34a" },
      { key: "admits", icon: "🎫", label: "Admit Cards", color: "#ea580c" },
      { key: "updates", icon: "🔄", label: "Updates", color: "#dc2626" },
      { key: "upcoming", icon: "📅", label: "Upcoming", color: "#7c3aed" },
      { key: "hubs", icon: "🏠", label: "Hub Pages", color: "#0891b2" },
      { key: "categories", icon: "🗂️", label: "Categories", color: "#475569" },
    ];

    const FIELD_DEFS = {
      exams: [
        { key: "name", label: "Name", type: "text" },
        { key: "full_name", label: "Full Name", type: "text" },
        { key: "category", label: "Category", type: "text" },
        { key: "state", label: "State", type: "text" },
        { key: "official_website", label: "Official Website", type: "text" },
        { key: "logo_url", label: "Logo URL", type: "text" },
        { key: "is_active", label: "Active", type: "bool" },
        { key: "description", label: "Description", type: "textarea" },
        { key: "exam_date", label: "Exam Date", type: "text" },
      ],
      results: [
        { key: "exam_id", label: "Exam ID", type: "number" },
        { key: "exam_name", label: "Exam Name", type: "text" },
        { key: "result_title", label: "Result Title", type: "text" },
        { key: "result_date", label: "Result Date", type: "text" },
        { key: "result_url", label: "Result URL", type: "text" },
        { key: "status", label: "Status", type: "select", options: ["declared", "expected", "pending"] },
      ],
      admits: [
        { key: "exam_id", label: "Exam ID", type: "number" },
        { key: "exam_name", label: "Exam Name", type: "text" },
        { key: "title", label: "Title", type: "text" },
        { key: "download_url", label: "Download URL", type: "text" },
        { key: "active_from", label: "Active From", type: "text" },
        { key: "active_to", label: "Active To", type: "text" },
        { key: "status", label: "Status", type: "select", options: ["released", "expected", "pending"] },
      ],
      updates: [
        { key: "exam_id", label: "Exam ID", type: "number" },
        { key: "update_type", label: "Update Type", type: "select", options: ["result", "admit_card", "notification", "exam_date", "vacancy", "other"] },
        { key: "title", label: "Title", type: "text" },
        { key: "description", label: "Description", type: "textarea" },
        { key: "official_link", label: "Official Link", type: "text" },
        { key: "publish_date", label: "Publish Date", type: "text" },
        { key: "is_verified", label: "Verified", type: "bool" },
      ],
      upcoming: [
        { key: "exam_id", label: "Exam ID", type: "number" },
        { key: "exam_name", label: "Exam Name", type: "text" },
        { key: "exam_date", label: "Exam Date", type: "text" },
        { key: "status", label: "Status", type: "text" },
      ],
      categories: [
        { key: "name", label: "Category Name", type: "text" },
        { key: "slug", label: "Slug (URL)", type: "text" },
        { key: "icon", label: "Icon", type: "text" },
        { key: "description", label: "Description", type: "textarea" },
        { key: "exam_count", label: "Exam Count", type: "number" },
      ],
    };

    const HUB_DEFAULTS = {
 "railway": {
  "emoji": "🚂",
  "name": "Railway Exams Center",
  "path": "/railway-data/exams.json",
  "hero": {
   "badge": "🚂 भारतीय रेलवे भर्ती",
   "title": "Railway Exams Center",
   "subtitle": "RRB NTPC, Group D, ALP, JE, RPF — सभी रेलवे exams की पूरी जानकारी एक जगह। Posts, Eligibility, Exam Pattern, Syllabus और Salary।",
   "gradient": "linear-gradient(135deg,#7c2d12,#c2410c)"
  },
  "statsCards": [
   [
    "📋",
    12,
    "Major Exams"
   ],
   [
    "🗺️",
    21,
    "RRB Boards"
   ],
   [
    "🛤️",
    17,
    "Railway Zones"
   ]
  ],
  "quickLinks": [
   [
    "/results",
    "🏆 Railway Results"
   ],
   [
    "/admit-cards",
    "📄 Admit Card"
   ],
   [
    "/vacancy",
    "📢 Vacancy"
   ],
   [
    "/syllabus",
    "📚 Syllabus"
   ],
   [
    "/notifications",
    "🔔 Updates"
   ],
   [
    "https://rrb.gov.in",
    "🌐 Official rrb.gov.in"
   ]
  ]
 },
 "banking": {
  "emoji": "🏦",
  "name": "Banking Exams Center",
  "path": "/banking-data/exams.json",
  "hero": {
   "badge": "🏦 भारतीय बैंकिंग भर्ती",
   "title": "Banking Exams Center",
   "subtitle": "IBPS PO, SBI Clerk, RBI Grade B, LIC AAO — सभी बैंकिंग exams की पूरी जानकारी एक जगह। Posts, Eligibility, Exam Pattern, Syllabus और Salary।",
   "gradient": "linear-gradient(135deg,#14532d,#16a34a)"
  },
  "statsCards": [
   [
    "📋",
    11,
    "Major Exams"
   ],
   [
    "🏦",
    "25+",
    "PSU Banks"
   ],
   [
    "💸",
    "1L+",
    "Posts हर साल"
   ]
  ],
  "quickLinks": [
   [
    "/results",
    "🏆 Banking Results"
   ],
   [
    "/admit-cards",
    "📄 Admit Card"
   ],
   [
    "/category/banking",
    "🏦 All Banking Exams"
   ],
   [
    "/syllabus",
    "📚 Syllabus"
   ],
   [
    "/notifications",
    "🔔 Updates"
   ],
   [
    "https://www.ibps.in",
    "🌐 Official ibps.in"
   ]
  ]
 },
 "ssc": {
  "emoji": "🏛️",
  "name": "SSC Exams Center",
  "path": "/ssc-data/exams.json",
  "hero": {
   "badge": "🏛️ भारत की सरकारी भर्ती (SSC)",
   "title": "SSC Exams Center",
   "subtitle": "SSC CGL, CHSL, MTS, GD, CPO, JE — सभी SSC exams की पूरी जानकारी एक जगह। Posts, Eligibility, Exam Pattern, Syllabus और Salary।",
   "gradient": "linear-gradient(135deg,#312e81,#4f46e5)"
  },
  "statsCards": [
   [
    "📋",
    12,
    "Major Exams"
   ],
   [
    "🗺️",
    "10",
    "Regional Offices"
   ],
   [
    "💸",
    "5K+",
    "Posts हर साल"
   ]
  ],
  "quickLinks": [
   [
    "/results",
    "🏆 SSC Results"
   ],
   [
    "/admit-cards",
    "📄 Admit Card"
   ],
   [
    "/category/ssc",
    "🏛️ All SSC Exams"
   ],
   [
    "/syllabus",
    "📚 Syllabus"
   ],
   [
    "/notifications",
    "🔔 Updates"
   ],
   [
    "https://ssc.gov.in",
    "🌐 Official ssc.gov.in"
   ]
  ]
 },
 "upsc": {
  "emoji": "🎖️",
  "name": "UPSC Exams Center",
  "path": "/upsc-data/exams.json",
  "hero": {
   "badge": "🎖️ भारत की शीर्ष सिविल सेवाएँ",
   "title": "UPSC Exams Center",
   "subtitle": "UPSC CSE (IAS/IPS), NDA, CDS, CAPF AC, ESE — सभी UPSC exams की पूरी जानकारी एक जगह। Posts, Eligibility, Exam Pattern, Syllabus और Salary।",
   "gradient": "linear-gradient(135deg,#7f1d1d,#dc2626)"
  },
  "statsCards": [
   [
    "📋",
    12,
    "Major Exams"
   ],
   [
    "🎯",
    "3",
    "CSE Stages"
   ],
   [
    "👑",
    "8",
    "Top Services"
   ]
  ],
  "quickLinks": [
   [
    "/results",
    "🏆 UPSC Results"
   ],
   [
    "/admit-cards",
    "📄 Admit Card"
   ],
   [
    "/category/upsc",
    "🎖️ All UPSC Exams"
   ],
   [
    "/syllabus",
    "📚 Syllabus"
   ],
   [
    "/notifications",
    "🔔 Updates"
   ],
   [
    "https://upsc.gov.in",
    "🌐 Official upsc.gov.in"
   ]
  ]
 },
 "police": {
  "emoji": "🚔",
  "name": "Police Exams Center",
  "path": "/police-data/exams.json",
  "hero": {
   "badge": "🚔 राज्य पुलिस भर्ती",
   "title": "Police Exams Center",
   "subtitle": "UP Police, Bihar Police, MP Police, Rajasthan Police — सभी राज्य police exams की पूरी जानकारी एक जगह। Posts, Eligibility, Exam Pattern, Salary।",
   "gradient": "linear-gradient(135deg,#0f172a,#3b82f6)"
  },
  "statsCards": [
   [
    "📋",
    12,
    "State Forces"
   ],
   [
    "👮",
    "5L+",
    "Posts हर साल"
   ],
   [
    "🗺️",
    "12",
    "States"
   ]
  ],
  "quickLinks": [
   [
    "/results",
    "🏆 Police Results"
   ],
   [
    "/admit-cards",
    "📄 Admit Card"
   ],
   [
    "/category/police",
    "👮 All Police Exams"
   ],
   [
    "/syllabus",
    "📚 Syllabus"
   ],
   [
    "/notifications",
    "🔔 Updates"
   ],
   [
    "/search",
    "🔍 Search Exams"
   ]
  ]
 },
 "defence": {
  "emoji": "🪖",
  "name": "Defence Exams Center",
  "path": "/defence-data/exams.json",
  "hero": {
   "badge": "🪖 भारतीय रक्षा बल भर्ती",
   "title": "Defence Exams Center",
   "subtitle": "Agniveer (Army/Vayu/Navy), AFCAT, INET, Coast Guard — सभी defence exams की पूरी जानकारी एक जगह। Posts, Eligibility, Exam Pattern, Syllabus और Salary।",
   "gradient": "linear-gradient(135deg,#134e4a,#14b8a6)"
  },
  "statsCards": [
   [
    "📋",
    12,
    "Major Exams"
   ],
   [
    "🪖",
    "3",
    "Agniveer Entries"
   ],
   [
    "🌊",
    "1.5L+",
    "Posts हर साल"
   ]
  ],
  "quickLinks": [
   [
    "/results",
    "🏆 Defence Results"
   ],
   [
    "/admit-cards",
    "📄 Admit Card"
   ],
   [
    "/category/defence",
    "🪖 All Defence Exams"
   ],
   [
    "/syllabus",
    "📚 Syllabus"
   ],
   [
    "/notifications",
    "🔔 Updates"
   ],
   [
    "https://joinindianarmy.nic.in",
    "🌐 Official Army Portal"
   ]
  ]
 },
 "teaching": {
  "emoji": "🎓",
  "name": "Teaching Exams Center",
  "path": "/teaching-data/exams.json",
  "hero": {
   "badge": "🎓 शिक्षक भर्ती & TET Exams",
   "title": "Teaching Exams Center",
   "subtitle": "CTET, UPTET, REET, KVS, NVS, DSSSB — सभी teaching exams की पूरी जानकारी एक जगह। Posts, Eligibility, Exam Pattern, Syllabus और Salary।",
   "gradient": "linear-gradient(135deg,#831843,#db2777)"
  },
  "statsCards": [
   [
    "📋",
    12,
    "Major Exams"
   ],
   [
    "🏫",
    "7+",
    "TET Exams"
   ],
   [
    "👩‍🏫",
    "2L+",
    "Posts हर साल"
   ]
  ],
  "quickLinks": [
   [
    "/results",
    "🏆 Teaching Results"
   ],
   [
    "/admit-cards",
    "📄 Admit Card"
   ],
   [
    "/category/teaching",
    "🎓 All Teaching Exams"
   ],
   [
    "/syllabus",
    "📚 Syllabus"
   ],
   [
    "/notifications",
    "🔔 Updates"
   ],
   [
    "https://ctet.nic.in",
    "🌐 Official CTET Portal"
   ]
  ]
 },
 "health": {
  "emoji": "🏥",
  "name": "Health Exams Center",
  "path": "/health-data/exams.json",
  "hero": {
   "badge": "🏥 स्वास्थ्य विभाग भर्ती",
   "title": "Health Exams Center",
   "subtitle": "AIIMS NORCET, RRB Staff Nurse, NHM, ESIC, UP CHO — सभी health exams की पूरी जानकारी एक जगह। Posts, Eligibility, Exam Pattern, Salary।",
   "gradient": "linear-gradient(135deg,#881337,#f43f5e)"
  },
  "statsCards": [
   [
    "📋",
    12,
    "Major Exams"
   ],
   [
    "🏥",
    "50+",
    "Health Orgs"
   ],
   [
    "🩺",
    "1L+",
    "Nursing Posts"
   ]
  ],
  "quickLinks": [
   [
    "/results",
    "🏆 Health Results"
   ],
   [
    "/admit-cards",
    "📄 Admit Card"
   ],
   [
    "/category/medical",
    "🏥 All Medical Exams"
   ],
   [
    "/syllabus",
    "📚 Syllabus"
   ],
   [
    "/notifications",
    "🔔 Updates"
   ],
   [
    "/search",
    "🔍 Search Exams"
   ]
  ]
 },
 "insurance": {
  "emoji": "🛡️",
  "name": "Insurance Exams Center",
  "path": "/insurance-data/exams.json",
  "hero": {
   "badge": "🛡️ बीमा कंपनी भर्ती",
   "title": "Insurance Exams Center",
   "subtitle": "LIC ADO, NIACL AO, NICL AO, UIIC, IRDAI, GIC — सभी insurance exams की पूरी जानकारी एक जगह। Posts, Eligibility, Exam Pattern, Salary।",
   "gradient": "linear-gradient(135deg,#4c1d95,#8b5cf6)"
  },
  "statsCards": [
   [
    "📋",
    12,
    "Major Exams"
   ],
   [
    "🏢",
    "10+",
    "Insurers"
   ],
   [
    "💰",
    "AO/ADO",
    "Officer Posts"
   ]
  ],
  "quickLinks": [
   [
    "/results",
    "🏆 Insurance Results"
   ],
   [
    "/admit-cards",
    "📄 Admit Card"
   ],
   [
    "/banking",
    "🏦 Banking Center"
   ],
   [
    "/syllabus",
    "📚 Syllabus"
   ],
   [
    "/notifications",
    "🔔 Updates"
   ],
   [
    "/search",
    "🔍 Search Exams"
   ]
  ]
 },
 "forest": {
  "emoji": "🌲",
  "name": "Forest Exams Center",
  "path": "/forest-data/exams.json",
  "hero": {
   "badge": "🌲 वन विभाग भर्ती",
   "title": "Forest Exams Center",
   "subtitle": "AIIMS NORCET, RRB Staff Nurse, NHM, ESIC, UP CHO — सभी health exams की पूरी जानकारी एक जगह। Posts, Eligibility, Exam Pattern, Salary।",
   "gradient": "linear-gradient(135deg,#1a2e05,#65a30d)"
  },
  "statsCards": [
   [
    "📋",
    12,
    "Major Exams"
   ],
   [
    "🌲",
    "50+",
    "Forest Orgs"
   ],
   [
    "🪖",
    "3L+",
    "Forest Posts"
   ]
  ],
  "quickLinks": [
   [
    "/results",
    "🏆 Forest Results"
   ],
   [
    "/admit-cards",
    "📄 Admit Card"
   ],
   [
    "/category/forest-environment",
    "🌲 All Forest Exams"
   ],
   [
    "/syllabus",
    "📚 Syllabus"
   ],
   [
    "/notifications",
    "🔔 Updates"
   ],
   [
    "/search",
    "🔍 Search Exams"
   ]
  ]
 },
 "judiciary": {
  "emoji": "⚖️",
  "name": "Judiciary Exams Center",
  "path": "/judiciary-data/exams.json",
  "hero": {
   "badge": "⚖️ न्यायिक विभाग भर्ती",
   "title": "Judiciary Exams Center",
   "subtitle": "AIIMS NORCET, RRB Staff Nurse, NHM, ESIC, UP CHO — सभी health exams की पूरी जानकारी एक जगह। Posts, Eligibility, Exam Pattern, Salary।",
   "gradient": "linear-gradient(135deg,#422006,#ca8a04)"
  },
  "statsCards": [
   [
    "📋",
    12,
    "Major Exams"
   ],
   [
    "⚖️",
    "50+",
    "Judiciary Orgs"
   ],
   [
    "🪖",
    "3L+",
    "Judiciary Posts"
   ]
  ],
  "quickLinks": [
   [
    "/results",
    "🏆 Judiciary Results"
   ],
   [
    "/admit-cards",
    "📄 Admit Card"
   ],
   [
    "/category/judiciary-environment",
    "⚖️ All Judiciary Exams"
   ],
   [
    "/syllabus",
    "📚 Syllabus"
   ],
   [
    "/notifications",
    "🔔 Updates"
   ],
   [
    "/search",
    "🔍 Search Exams"
   ]
  ]
 },
 "post-office": {
  "emoji": "📮",
  "name": "Post Office Exams Center",
  "path": "/post-office-data/exams.json",
  "hero": {
   "badge": "📮 डाक विभाग भर्ती",
   "title": "Post Office Exams Center",
   "subtitle": "GDS, Postman, Mail Guard, MTS, Postal Assistant, IPPB — सभी post office exams की पूरी जानकारी एक जगह।",
   "gradient": "linear-gradient(135deg,#064e3b,#10b981)"
  },
  "statsCards": [
   [
    "📋",
    12,
    "Major Posts"
   ],
   [
    "📮",
    "1.5L+",
    "GDS Posts हर साल"
   ],
   [
    "✅",
    "10",
    "Merit-Based"
   ]
  ],
  "quickLinks": [
   [
    "/results",
    "🏆 Post Office Results"
   ],
   [
    "/admit-cards",
    "📄 Admit Card"
   ],
   [
    "/search",
    "🔍 Search Exams"
   ],
   [
    "/syllabus",
    "📚 Syllabus"
   ],
   [
    "/notifications",
    "🔔 Updates"
   ],
   [
    "https://indiapost.gov.in",
    "🌐 Official India Post"
   ]
  ]
 },
 "psu": {
  "emoji": "🏭",
  "name": "PSU Exams Center",
  "path": "/psu-data/exams.json",
  "hero": {
   "badge": "🏭 सार्वजनिक उपक्रम भर्ती",
   "title": "PSU Exams Center",
   "subtitle": "IOCL, ONGC, BHEL, NTPC, SAIL, GAIL, BEL — सभी PSU exams की पूरी जानकारी एक जगह। Posts, Eligibility, Exam Pattern, Salary।",
   "gradient": "linear-gradient(135deg,#164e63,#06b6d4)"
  },
  "statsCards": [
   [
    "📋",
    12,
    "Major PSUs"
   ],
   [
    "🏭",
    "90+",
    "PSUs (DB में)"
   ],
   [
    "⚡",
    "5",
    "GATE-based Entries"
   ]
  ],
  "quickLinks": [
   [
    "/results",
    "🏆 PSU Results"
   ],
   [
    "/admit-cards",
    "📄 Admit Card"
   ],
   [
    "/jobs",
    "💼 PSU Jobs"
   ],
   [
    "/syllabus",
    "📚 Syllabus"
   ],
   [
    "/notifications",
    "🔔 Updates"
   ],
   [
    "/search",
    "🔍 Search Exams"
   ]
  ]
 },
 "state-psc": {
  "emoji": "🗺️",
  "name": "State PSC Exams Center",
  "path": "/state-psc-data/exams.json",
  "hero": {
   "badge": "🗺️ राज्य लोक सेवा आयोग भर्ती",
   "title": "State PSC Exams Center",
   "subtitle": "UPPSC, BPSC, MPPSC, RPSC (RAS), MPSC, TNPSC — सभी राज्य PSC exams की पूरी जानकारी एक जगह। Posts, Eligibility, Exam Pattern, Syllabus और Salary।",
   "gradient": "linear-gradient(135deg,#78350f,#d97706)"
  },
  "statsCards": [
   [
    "📋",
    12,
    "Major PSCs"
   ],
   [
    "🗺️",
    "20+",
    "States Listed"
   ],
   [
    "🏛️",
    "PCS/RAS",
    "Top Posts"
   ]
  ],
  "quickLinks": [
   [
    "/results",
    "🏆 State PSC Results"
   ],
   [
    "/admit-cards",
    "📄 Admit Card"
   ],
   [
    "/category/state-psc",
    "🏛️ All State PSC Exams"
   ],
   [
    "/syllabus",
    "📚 Syllabus"
   ],
   [
    "/notifications",
    "🔔 Updates"
   ],
   [
    "/search",
    "🔍 Search Exams"
   ]
  ]
 }
};

    const EXAM_FIELDS = [
      { key: "slug", label: "Slug (URL)", type: "text" },
      { key: "name", label: "Name", type: "text" },
      { key: "emoji", label: "Emoji", type: "text" },
      { key: "fullName", label: "Full Name", type: "text" },
      { key: "tags", label: "Tags (comma separated)", type: "text" },
      { key: "officialWebsite", label: "Official Website", type: "text" },
      { key: "examFee", label: "Exam Fee", type: "text" },
      { key: "latestStatus", label: "Latest Status", type: "textarea" },
      { key: "overview", label: "Overview", type: "textarea" },
      { key: "posts", label: "Posts (ek line = ek post)", type: "textarea" },
      { key: "eligibility", label: "Eligibility", type: "textarea" },
      { key: "examPattern", label: "Exam Pattern (stage | detail, ek line me)", type: "textarea" },
      { key: "syllabus", label: "Syllabus (ek line = ek topic)", type: "textarea" },
      { key: "salary", label: "Salary", type: "text" },
      { key: "selectionProcess", label: "Selection Process", type: "textarea" },
    ];

    const REAL_TABLE = { exams: "exams", results: "results", admits: "admit_cards", updates: "updates", upcoming: "upcoming_exams", categories: "categories" };
    const KEY_FOR = { exams: "exams", results: "results", admit_cards: "admits", updates: "updates", upcoming_exams: "upcoming", categories: "categories" };

    const toEditor = (ex) => ({
      slug: ex.slug || "", name: ex.name || "", emoji: ex.emoji || "", fullName: ex.fullName || "",
      tags: (ex.tags || []).join(", "), officialWebsite: ex.officialWebsite || "", examFee: ex.examFee || "",
      latestStatus: ex.latestStatus || "", overview: ex.overview || "",
      posts: (ex.posts || []).join("\n"),
      eligibility: ex.eligibility || "",
      examPattern: (ex.examPattern || []).map((p) => (p.stage || "") + " | " + (p.detail || "")).join("\n"),
      syllabus: (ex.syllabus || []).join("\n"), salary: ex.salary || "", selectionProcess: ex.selectionProcess || "",
    });

    const fromEditor = (f) => ({
      slug: (f.slug || "").trim(), name: (f.name || "").trim(), emoji: (f.emoji || "").trim(), fullName: (f.fullName || "").trim(),
      tags: (f.tags || "").split(",").map((s) => s.trim()).filter(Boolean),
      officialWebsite: (f.officialWebsite || "").trim(), examFee: (f.examFee || "").trim(),
      latestStatus: (f.latestStatus || "").trim(), overview: (f.overview || "").trim(),
      posts: (f.posts || "").split("\n").map((s) => s.trim()).filter(Boolean),
      eligibility: (f.eligibility || "").trim(),
      examPattern: (f.examPattern || "").split("\n").map((l) => l.trim()).filter(Boolean).map((l) => {
        const i = l.indexOf("|");
        return i > -1 ? { stage: l.slice(0, i).trim(), detail: l.slice(i + 1).trim() } : { stage: l, detail: "" };
      }),
      syllabus: (f.syllabus || "").split("\n").map((s) => s.trim()).filter(Boolean),
      salary: (f.salary || "").trim(), selectionProcess: (f.selectionProcess || "").trim(),
    });

    const styles = {
      page: { minHeight: "100vh", background: "#f0f4f8", fontFamily: "'Segoe UI',Arial,sans-serif" },
      header: { background: "linear-gradient(135deg, #1e3a5f, #2563eb)", padding: "16px 20px", color: "#fff" },
      headerTitle: { fontSize: 22, fontWeight: 700, margin: 0, display: "flex", alignItems: "center", gap: 8 },
      headerSub: { fontSize: 12, opacity: 0.85, marginTop: 2 },
      container: { maxWidth: 1100, margin: "0 auto", padding: "12px 12px 90px" },
      tabBar: { display: "flex", gap: 6, flexWrap: "wrap", margin: "-8px 0 16px" },
      tabBtn: (active, color) => ({
        padding: "10px 14px", borderRadius: 10, border: "none", fontSize: 13, fontWeight: active ? 600 : 400,
        cursor: "pointer", background: active ? color : "#fff", color: active ? "#fff" : "#444",
        boxShadow: "0 1px 3px rgba(0,0,0,0.08)", display: "flex", alignItems: "center", gap: 5, transition: "all .2s",
      }),
      card: { background: "#fff", borderRadius: 12, padding: 16, boxShadow: "0 1px 4px rgba(0,0,0,0.06)", marginBottom: 12 },
      input: { width: "100%", padding: "9px 12px", fontSize: 13, border: "1px solid #d1d5db", borderRadius: 8, outline: "none", boxSizing: "border-box" },
      btn: (bg, sm) => ({ padding: sm ? "6px 12px" : "10px 18px", background: bg, color: "#fff", border: "none", borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: "pointer", whiteSpace: "nowrap" }),
      listItem: { display: "flex", alignItems: "center", gap: 10, padding: "12px 14px", background: "#fff", borderRadius: 10, marginBottom: 8, boxShadow: "0 1px 3px rgba(0,0,0,0.05)", border: "1px solid #eef2f7" },
      label: { display: "block", fontSize: 12, fontWeight: 600, color: "#555", marginBottom: 4 },
      searchRow: { display: "flex", gap: 8, marginBottom: 12, flexWrap: "wrap", alignItems: "center" },
      badge: (c) => ({ background: c, color: "#fff", fontSize: 11, fontWeight: 700, padding: "3px 8px", borderRadius: 999, whiteSpace: "nowrap" }),
      modal: { position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(15,23,42,0.55)", display: "flex", alignItems: "center", justifyContent: "center", padding: 16, zIndex: 999 },
      modalBox: { background: "#fff", borderRadius: 16, padding: 20, width: "100%", maxWidth: 640, maxHeight: "85vh", overflowY: "auto" },
      toast: (type) => ({ position: "fixed", bottom: 90, left: "50%", transform: "translateX(-50%)", padding: "10px 22px", borderRadius: 10, zIndex: 9999, background: type === "success" ? "#16a34a" : "#dc2626", color: "#fff", fontSize: 13, fontWeight: 500, boxShadow: "0 4px 12px rgba(0,0,0,0.15)" }),
      statCard: (c) => ({ background: "#fff", borderRadius: 12, padding: 16, textAlign: "center", boxShadow: "0 1px 4px rgba(0,0,0,0.06)" }),
    };
    
    export default function AdminPage() {
      const [auth, setAuth] = useState(false);
      const [pw, setPw] = useState("");
      const [err, setErr] = useState("");
      const [tab, setTab] = useState("dashboard");
      const [toast, setToast] = useState(null);
      const [loading, setLoading] = useState(false);
      const [stats, setStats] = useState({});

      const [tableData, setTableData] = useState({ exams: [], results: [], admits: [], updates: [], upcoming: [], categories: [] });
      const [totals, setTotals] = useState({});
      const [search, setSearch] = useState("");
      const [editing, setEditing] = useState(null);
      const [adding, setAdding] = useState(null);
      const [form, setForm] = useState({});

      // Hub editor state
      const [currentHub, setCurrentHub] = useState(null);
      const [hubForm, setHubForm] = useState(null);
      const [hubStatus, setHubStatus] = useState({});
      const [examModal, setExamModal] = useState(null);
      const [saving, setSaving] = useState(false);

      const showToast = (msg, type = "success") => { setToast({ msg, type }); setTimeout(() => setToast(null), 2800); };

      const api = async (payload) => {
        const res = await fetch("/api/admin", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ secret: ADMIN_PASSWORD, ...payload }),
        });
        return res.json();
      };

      const loadStats = useCallback(async () => {
        try {
          const [ex, re, ad, ud, up, cat] = await Promise.all([
            api({ action: "count", table: "exams" }),
            api({ action: "count", table: "results" }),
            api({ action: "count", table: "admit_cards" }),
            api({ action: "count", table: "updates" }),
            api({ action: "count", table: "upcoming_exams" }),
            api({ action: "count", table: "categories" }),
          ]);
          setStats({ exams: ex.count || 0, results: re.count || 0, admits: ad.count || 0, updates: ud.count || 0, upcoming: up.count || 0, categories: cat.count || 0 });
        } catch (e) { showToast("Stats error", "error"); }
      }, []);

      const fetchTable = async (t, q) => {
        setLoading(true);
        try {
          const r = await api({ action: "list", table: t, search: q || "", limit: 50 });
          if (r.success) {
            const k = KEY_FOR[t] || t;
            setTableData((p) => ({ ...p, [k]: r.data || [] }));
            setTotals((p) => ({ ...p, [k]: r.total || 0 }));
          } else showToast(r.error || "Fetch error", "error");
        } catch (e) { showToast("Fetch error", "error"); }
        setLoading(false);
      };

      const loadHubStatus = async () => {
        setLoading(true);
        const status = {};
        await Promise.all(Object.keys(HUB_DEFAULTS).map(async (h) => {
          try {
            const res = await fetch(HUB_DEFAULTS[h].path);
            const j = await res.json();
            status[h] = { custom: !!(j && j.hero), exams: (j && j.exams ? j.exams.length : 0) };
          } catch (e) { status[h] = { custom: false, exams: 0 }; }
        }));
        setHubStatus(status);
        setLoading(false);
      };

      const openHubEditor = async (h) => {
        setCurrentHub(h);
        setLoading(true);
        const d = HUB_DEFAULTS[h];
        let raw = null;
        try {
          const res = await fetch(d.path);
          const j = await res.json();
          if (j && j.exams) raw = j;
        } catch (e) {}
        setHubForm({
          raw: raw || {},
          hero: (raw && raw.hero) || d.hero,
          quickLinks: (raw && raw.quickLinks) || d.quickLinks,
          statsCards: (raw && raw.statsCards) || d.statsCards,
          exams: (raw && raw.exams) || [],
        });
        setLoading(false);
        setTab("hubEditor");
      };

      const closeHubEditor = () => { setCurrentHub(null); setHubForm(null); setExamModal(null); setTab("hubs"); loadHubStatus(); };

      const saveHub = async () => {
        if (!hubForm) return;
        setSaving(true);
        try {
          const content = {
            ...hubForm.raw,
            hero: hubForm.hero,
            quickLinks: hubForm.quickLinks,
            statsCards: hubForm.statsCards,
            exams: hubForm.exams,
          };
          const r = await api({ table: "hub_pages", action: "save", hub: currentHub, content });
          if (r.success) showToast("✅ Saved! Website ~1-2 min me update hogi");
          else showToast(r.error || "Save failed", "error");
        } catch (e) { showToast("Save error", "error"); }
        setSaving(false);
      };

      const openExamModal = (index) => {
        const ex = index === null ? {} : (hubForm.exams[index] || {});
        setExamModal({ index, form: toEditor(ex) });
      };

      const saveExamModal = () => {
        if (!examModal) return;
        const obj = fromEditor(examModal.form);
        if (!obj.name) { showToast("Name required", "error"); return; }
        const exams = [...hubForm.exams];
        if (examModal.index === null) {
          if (!obj.slug) obj.slug = (obj.name || "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
          exams.push(obj);
        } else exams[examModal.index] = obj;
        setHubForm((p) => ({ ...p, exams }));
        setExamModal(null);
        showToast("Exam updated ✔");
      };

      const deleteExam = (index) => {
        if (!window.confirm("Delete this exam?")) return;
        const exams = hubForm.exams.filter((_, i) => i !== index);
        setHubForm((p) => ({ ...p, exams }));
        showToast("🗑️ Exam deleted");
      };

      const handleTab = (k) => {
        setTab(k);
        setEditing(null); setAdding(null); setSearch(""); setCurrentHub(null); setHubForm(null); setExamModal(null);
        if (k === "dashboard") loadStats();
        else if (k === "exams") fetchTable("exams");
        else if (k === "results") fetchTable("results");
        else if (k === "admits") fetchTable("admit_cards");
        else if (k === "updates") fetchTable("updates");
        else if (k === "upcoming") fetchTable("upcoming_exams");
        else if (k === "categories") fetchTable("categories");
        else if (k === "hubs") loadHubStatus();
      };

      const doSearch = () => {
        const t = REAL_TABLE[tab];
        if (t) fetchTable(t, search.trim());
      };

      const openAdd = (k) => {
        const t = REAL_TABLE[k];
        setAdding(k);
        const empty = {};
        (FIELD_DEFS[t] || []).forEach((f) => { empty[f.key] = f.type === "bool" ? true : f.type === "number" ? "" : ""; });
        setForm(empty);
      };

      const openEdit = (k, row) => {
        setEditing({ table: k, row });
        const f = {};
        (FIELD_DEFS[k] || []).forEach((fd) => { f[fd.key] = row[fd.key] ?? ""; });
        setForm(f);
      };

      const saveRow = async () => {
        if (!editing && !adding) return;
        const k = editing ? editing.table : adding;
        const t = REAL_TABLE[k];
        try {
          const r = editing
            ? await api({ action: "update", table: t, id: editing.row.id, data: form })
            : await api({ action: "insert", table: t, data: form });
          if (!r.success) return showToast(r.error || "Save failed", "error");
          showToast(editing ? "✅ Updated" : "✅ Added");
          setEditing(null); setAdding(null);
          fetchTable(t, search.trim());
          if (t === "categories") loadStats();
        } catch (e) { showToast("Save error", "error"); }
      };

      const deleteRow = async (k, row) => {
        if (!window.confirm("Delete this row? This cannot be undone.")) return;
        const t = REAL_TABLE[k];
        try {
          const r = await api({ action: "delete", table: t, id: row.id });
          if (!r.success) return showToast(r.error || "Delete failed", "error");
          showToast("🗑️ Deleted");
          fetchTable(t, search.trim());
          loadStats();
        } catch (e) { showToast("Delete error", "error"); }
      };

      const handleLogin = () => {
        if (pw === ADMIN_PASSWORD) { setAuth(true); loadStats(); }
        else setErr("❌ Wrong password!");
      };

      const FieldInput = ({ fd, value, onChange }) => {
        if (fd.type === "select") {
          return (
            <select value={value} onChange={(e) => onChange(fd.key, e.target.value)} style={styles.input}>
              {(fd.options || []).map((o) => <option key={o} value={o}>{o}</option>)}
            </select>
          );
        }
        if (fd.type === "bool") {
          return (
            <label style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, padding: "6px 0" }}>
              <input type="checkbox" checked={!!value} onChange={(e) => onChange(fd.key, e.target.checked)} style={{ width: 18, height: 18 }} />
              Yes
            </label>
          );
        }
        if (fd.type === "textarea") {
          return <textarea rows={fd.rows || 3} value={value} onChange={(e) => onChange(fd.key, e.target.value)} style={styles.input} />;
        }
        return <input type={fd.type === "number" ? "number" : "text"} value={value} onChange={(e) => onChange(fd.key, e.target.value)} style={styles.input} />;
      };

      const renderRows = (k) => {
        const rows = tableData[k] || [];
        return (
          <div>
            <div style={styles.searchRow}>
              <input value={search} onChange={(e) => setSearch(e.target.value)} onKeyDown={(e) => e.key === "Enter" && doSearch()}
                placeholder="Search..." style={{ ...styles.input, maxWidth: 320 }} />
              <button onClick={doSearch} style={styles.btn("#2563eb")}>🔍 Search</button>
              <button onClick={() => openAdd(k)} style={styles.btn("#16a34a")}>➕ Add New</button>
              <span style={{ fontSize: 12, color: "#666", marginLeft: "auto" }}>{totals[k] !== undefined ? `${totals[k].toLocaleString()} total · showing ${rows.length}` : ""}</span>
            </div>
            {loading && <div style={{ textAlign: "center", padding: 30, color: "#999" }}>Loading...</div>}
            {!loading && rows.length === 0 && <div style={{ ...styles.card, textAlign: "center", padding: 40, color: "#999" }}>No data found. Try a different search or add new.</div>}
            {rows.map((r) => (
              <div key={r.id} style={styles.listItem}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 600, fontSize: 14, color: "#1e3a5f" }}>
                    {r.name || r.title || r.result_title || r.exam_name || "ID: " + r.id}
                  </div>
                  <div style={{ fontSize: 11, color: "#666", marginTop: 2, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    #{r.id} · {r.category || r.status || r.update_type || r.slug || ""} {r.exam_date ? "· 📅 " + r.exam_date : ""}
                  </div>
                </div>
                <button onClick={() => openEdit(k, r)} style={{ ...styles.btn("#7c3aed", true), padding: "5px 10px" }}>✏️</button>
                <button onClick={() => deleteRow(k, r)} style={{ ...styles.btn("#dc2626", true), padding: "5px 10px" }}>🗑️</button>
              </div>
            ))}
          </div>
        );
      };

      const renderHubGrid = () => (
        <div>
          <div style={{ ...styles.card, display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
            <div style={{ fontSize: 13, color: "#555", lineHeight: 1.7 }}>
              🏠 <b>14 Hub Pages</b> — Railway, Banking, SSC, UPSC, Police, Defence, Teaching, Health, Insurance, Forest, Judiciary, Post Office, PSU, State PSC.<br/>
              Har hub ka <b>title, description, stats, quick links aur exams</b> (add/edit/delete) yahan se edit hota hai. Save karne ke baad website ~1-2 min me update hoti hai (auto redeploy). ⏳
            </div>
          </div>
          {loading && <div style={{ textAlign: "center", padding: 30, color: "#999" }}>Loading...</div>}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(240px,1fr))", gap: 10 }}>
            {Object.keys(HUB_DEFAULTS).map((h) => {
              const d = HUB_DEFAULTS[h];
              const st = hubStatus[h] || {};
              return (
                <div key={h} style={{ ...styles.card, marginBottom: 0, display: "flex", flexDirection: "column", gap: 6 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <div style={{ fontSize: 26 }}>{d.emoji}</div>
                    <div style={{ fontWeight: 700, fontSize: 14, color: "#1e3a5f", flex: 1 }}>{d.name}</div>
                  </div>
                  <div style={{ display: "flex", gap: 6, alignItems: "center", flexWrap: "wrap" }}>
                    <span style={styles.badge(st.custom ? "#16a34a" : "#9ca3af")}>{st.custom ? "✅ Custom" : "Default"}</span>
                    <span style={{ fontSize: 11, color: "#666" }}>{st.exams || 0} exams</span>
                  </div>
                  <button onClick={() => openHubEditor(h)} style={styles.btn("#0891b2")}>✏️ Edit Page</button>
                </div>
              );
            })}
          </div>
        </div>
      );
    
      const renderHubEditor = () => {
        if (!hubForm) return null;
        const d = HUB_DEFAULTS[currentHub];
        const setHero = (k, v) => setHubForm((p) => ({ ...p, hero: { ...p.hero, [k]: v } }));
        return (
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap", marginBottom: 12 }}>
              <button onClick={closeHubEditor} style={styles.btn("#64748b")}>← All Hubs</button>
              <div style={{ fontSize: 17, fontWeight: 700, color: "#1e3a5f" }}>{d.emoji} {d.name} — Page Editor</div>
              <div style={{ marginLeft: "auto" }}>
                <button onClick={saveHub} disabled={saving} style={{ ...styles.btn("#16a34a") }}>
                  {saving ? "Saving..." : "💾 Save Page"}
                </button>
              </div>
            </div>
            <div style={{ fontSize: 11, color: "#888", marginBottom: 12 }}>Save karne ke baad GitHub me commit hota hai aur website auto-deploy hoti hai (~1-2 min).</div>

            <div style={styles.card}>
              <h3 style={{ margin: "0 0 10px", fontSize: 15, color: "#1e3a5f" }}>🎨 Hero Section (page ka top)</h3>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                <div>
                  <label style={{ ...styles.label }}>Badge (chhota text)</label>
                  <input value={hubForm.hero.badge || ""} onChange={(e) => setHero("badge", e.target.value)} style={styles.input} />
                </div>
                <div>
                  <label style={{ ...styles.label }}>Title</label>
                  <input value={hubForm.hero.title || ""} onChange={(e) => setHero("title", e.target.value)} style={styles.input} />
                </div>
              </div>
              <div style={{ marginTop: 10 }}>
                <label style={{ ...styles.label }}>Description / Subtitle</label>
                <textarea rows={3} value={hubForm.hero.subtitle || ""} onChange={(e) => setHero("subtitle", e.target.value)} style={styles.input} />
              </div>
              <div style={{ marginTop: 10 }}>
                <label style={{ ...styles.label }}>Background color (gradient)</label>
                <input value={hubForm.hero.gradient || ""} onChange={(e) => setHero("gradient", e.target.value)} style={styles.input} placeholder="linear-gradient(135deg,#7c2d12,#c2410c)" />
              </div>
            </div>

            <div style={styles.card}>
              <h3 style={{ margin: "0 0 10px", fontSize: 15, color: "#1e3a5f" }}>📊 Stats Cards (3 boxes)</h3>
              {hubForm.statsCards.map((s, i) => (
                <div key={i} style={{ display: "grid", gridTemplateColumns: "70px 1fr 1.2fr auto", gap: 8, marginBottom: 8, alignItems: "center" }}>
                  <input value={s[0]} onChange={(e) => setHubForm((p) => { const x = [...p.statsCards]; x[i] = [e.target.value, s[1], s[2]]; return { ...p, statsCards: x }; })} style={styles.input} placeholder="icon" />
                  <input value={s[1]} onChange={(e) => setHubForm((p) => { const x = [...p.statsCards]; x[i] = [s[0], e.target.value, s[2]]; return { ...p, statsCards: x }; })} style={styles.input} placeholder="value" />
                  <input value={s[2]} onChange={(e) => setHubForm((p) => { const x = [...p.statsCards]; x[i] = [s[0], s[1], e.target.value]; return { ...p, statsCards: x }; })} style={styles.input} placeholder="label" />
                  <button onClick={() => setHubForm((p) => ({ ...p, statsCards: p.statsCards.filter((_, j) => j !== i) }))} style={{ ...styles.btn("#dc2626", true) }}>🗑️</button>
                </div>
              ))}
              <button onClick={() => setHubForm((p) => ({ ...p, statsCards: [...p.statsCards, ["", "", ""]] }))} style={styles.btn("#16a34a")}>➕ Add Stat</button>
            </div>

            <div style={styles.card}>
              <h3 style={{ margin: "0 0 10px", fontSize: 15, color: "#1e3a5f" }}>🔗 Quick Links</h3>
              {hubForm.quickLinks.map((q, i) => (
                <div key={i} style={{ display: "grid", gridTemplateColumns: "1fr 1.4fr auto", gap: 8, marginBottom: 8, alignItems: "center" }}>
                  <input value={q[0]} onChange={(e) => setHubForm((p) => { const x = [...p.quickLinks]; x[i] = [e.target.value, q[1]]; return { ...p, quickLinks: x }; })} style={styles.input} placeholder="/results" />
                  <input value={q[1]} onChange={(e) => setHubForm((p) => { const x = [...p.quickLinks]; x[i] = [q[0], e.target.value]; return { ...p, quickLinks: x }; })} style={styles.input} placeholder="label" />
                  <button onClick={() => setHubForm((p) => ({ ...p, quickLinks: p.quickLinks.filter((_, j) => j !== i) }))} style={{ ...styles.btn("#dc2626", true) }}>🗑️</button>
                </div>
              ))}
              <button onClick={() => setHubForm((p) => ({ ...p, quickLinks: [...p.quickLinks, ["", ""]] }))} style={styles.btn("#16a34a")}>➕ Add Link</button>
            </div>

            <div style={styles.card}>
              <div style={{ display: "flex", alignItems: "center", marginBottom: 10 }}>
                <h3 style={{ margin: 0, fontSize: 15, color: "#1e3a5f" }}>📝 Exams ({hubForm.exams.length})</h3>
                <div style={{ marginLeft: "auto" }}>
                  <button onClick={() => openExamModal(null)} style={styles.btn("#16a34a")}>➕ Add Exam</button>
                </div>
              </div>
              {hubForm.exams.map((ex, i) => (
                <div key={i} style={styles.listItem}>
                  <div style={{ fontSize: 18 }}>{ex.emoji || "📄"}</div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: 600, fontSize: 13.5, color: "#1e3a5f" }}>{ex.name || ex.slug}</div>
                    <div style={{ fontSize: 11, color: "#666", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {ex.fullName || ""} · {(ex.tags || []).join(", ")}
                    </div>
                  </div>
                  <button onClick={() => openExamModal(i)} style={{ ...styles.btn("#7c3aed", true), padding: "5px 10px" }}>✏️</button>
                  <button onClick={() => deleteExam(i)} style={{ ...styles.btn("#dc2626", true), padding: "5px 10px" }}>🗑️</button>
                </div>
              ))}
              {hubForm.exams.length === 0 && <div style={{ textAlign: "center", padding: 30, color: "#999", fontSize: 13 }}>Koi exam nahi. ➕ Add Exam se jodo.</div>}
            </div>

            <div style={{ textAlign: "center", marginTop: 6 }}>
              <button onClick={saveHub} disabled={saving} style={{ ...styles.btn("#16a34a"), fontSize: 15, padding: "12px 30px" }}>
                {saving ? "Saving..." : "💾 Save Page"}
              </button>
            </div>
          </div>
        );
      };

      // Login screen
      if (!auth) {
        return (
          <div style={{ minHeight: "100vh", background: "linear-gradient(135deg,#0f172a,#1e3a5f)", display: "flex", alignItems: "center", justifyContent: "center", padding: 20, fontFamily: "'Segoe UI',Arial,sans-serif" }}>
            <div style={{ background: "#fff", borderRadius: 20, padding: "32px 24px", width: "100%", maxWidth: 380, boxShadow: "0 20px 60px rgba(0,0,0,0.3)" }}>
              <div style={{ textAlign: "center", marginBottom: 20 }}>
                <div style={{ fontSize: 40, marginBottom: 8 }}>🔐</div>
                <h1 style={{ fontSize: 22, color: "#1e3a5f", margin: 0 }}>SarkariSetu Admin</h1>
                <p style={{ fontSize: 12, color: "#888", margin: "4px 0 0" }}>हर table + हर hub page का पूरा control — Edit, Add, Delete</p>
              </div>
              <input type="password" value={pw} onChange={(e) => setPw(e.target.value)} onKeyDown={(e) => e.key === "Enter" && handleLogin()}
                placeholder="Enter admin password" style={{ width: "100%", padding: "12px 14px", fontSize: 15, border: "2px solid #e5e7eb", borderRadius: 10, marginBottom: 12, outline: "none", boxSizing: "border-box" }} />
              <button onClick={handleLogin} style={{ width: "100%", padding: 12, background: "linear-gradient(135deg,#2563eb,#1e40af)", color: "#fff", border: "none", borderRadius: 10, fontSize: 16, fontWeight: 600, cursor: "pointer" }}>Sign In 🔓</button>
              {err && <p style={{ color: "#dc2626", textAlign: "center", marginTop: 12, fontSize: 13 }}>{err}</p>}
            </div>
          </div>
        );
      }

      return (
        <div style={styles.page}>
          {toast && <div style={styles.toast(toast.type)}>{toast.msg}</div>}

          <div style={styles.header}>
            <div style={{ maxWidth: 1100, margin: "0 auto" }}>
              <div style={styles.headerTitle}>⚙️ SarkariSetu Admin Panel</div>
              <div style={styles.headerSub}>Exams · Results · Admit Cards · Updates · Upcoming · Categories · Hub Pages — full CRUD control</div>
            </div>
          </div>

          <div style={styles.container}>
            <div style={styles.tabBar}>
              {TABLES.map((t) => (
                <button key={t.key} onClick={() => handleTab(t.key)} style={styles.tabBtn(tab === t.key, t.color)}>
                  <span>{t.icon}</span> {t.label}
                </button>
              ))}
            </div>

            {tab === "dashboard" && (
              <div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(170px,1fr))", gap: 10, marginBottom: 16 }}>
                  {[
                    { icon: "📝", label: "Total Exams", count: stats.exams, color: "#2563eb" },
                    { icon: "🏆", label: "Results", count: stats.results, color: "#16a34a" },
                    { icon: "🎫", label: "Admit Cards", count: stats.admits, color: "#ea580c" },
                    { icon: "🔄", label: "Updates", count: stats.updates, color: "#dc2626" },
                    { icon: "📅", label: "Upcoming Exams", count: stats.upcoming, color: "#7c3aed" },
                    { icon: "🗂️", label: "Categories", count: stats.categories, color: "#475569" },
                    { icon: "🏠", label: "Hub Pages", count: 14, color: "#0891b2" },
                  ].map((s, i) => (
                    <div key={i} style={styles.statCard(s.color)}>
                      <div style={{ fontSize: 30 }}>{s.icon}</div>
                      <div style={{ fontSize: 26, fontWeight: 700, color: s.color }}>{(s.count || 0).toLocaleString()}</div>
                      <div style={{ fontSize: 12, color: "#666", fontWeight: 500 }}>{s.label}</div>
                    </div>
                  ))}
                </div>
                <div style={styles.card}>
                  <h3 style={{ margin: "0 0 10px", fontSize: 15, color: "#1e3a5f" }}>ℹ️ कैसे use करें</h3>
                  <div style={{ fontSize: 13, color: "#555", lineHeight: 1.9 }}>
                    • ऊपर के tabs से कोई भी section खोलो — Exams, Results, Admit Cards, Updates, Upcoming, Categories, Hub Pages<br/>
                    • <b>🔍 Search</b> — नाम से खोजो<br/>
                    • <b>➕ Add New</b> — नया data जोड़ो<br/>
                    • <b>✏️</b> — किसी भी row को edit करो<br/>
                    • <b>🗑️</b> — row delete करो<br/>
                    • <b>🏠 Hub Pages</b> — Railway/Banking/SSC जैसे 14 hubs का title, description, stats, links और exams edit करो (Save के बाद ~1-2 min में live)<br/>
                    • Results/Admit Cards/Updates में हर change website पर तुरंत दिखता है (उनके pages live DB से fetch करते हैं)
                  </div>
                </div>
              </div>
            )}

            {tab === "exams" && renderRows("exams")}
            {tab === "results" && renderRows("results")}
            {tab === "admits" && renderRows("admits")}
            {tab === "updates" && renderRows("updates")}
            {tab === "upcoming" && renderRows("upcoming")}
            {tab === "categories" && renderRows("categories")}
            {tab === "hubs" && !hubForm && renderHubGrid()}
            {tab === "hubEditor" && hubForm && renderHubEditor()}
          </div>

          {/* Edit/Add modal */}
          {(editing || adding) && (
            <div style={styles.modal} onClick={() => { setEditing(null); setAdding(null); }}>
              <div style={styles.modalBox} onClick={(e) => e.stopPropagation()}>
                <h3 style={{ margin: "0 0 14px", fontSize: 16, color: "#1e3a5f" }}>
                  {editing ? "✏️ Edit Row #" + editing.row.id : "➕ Add New"} — {TABLES.find((t) => t.key === (editing ? editing.table : adding))?.label}
                </h3>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                  {(FIELD_DEFS[editing ? editing.table : adding] || []).map((fd) => (
                    <div key={fd.key} style={{ gridColumn: fd.type === "textarea" || fd.type === "bool" ? "1 / -1" : undefined }}>
                      <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#555", marginBottom: 4 }}>{fd.label}</label>
                      <FieldInput fd={fd} value={form[fd.key]} onChange={(k, v) => setForm((p) => ({ ...p, [k]: v }))} />
                    </div>
                  ))}
                </div>
                <div style={{ display: "flex", gap: 8, marginTop: 16 }}>
                  <button onClick={saveRow} style={styles.btn("#16a34a")}>✅ Save</button>
                  <button onClick={() => { setEditing(null); setAdding(null); }} style={{ ...styles.btn("#9ca3af") }}>Cancel</button>
                </div>
              </div>
            </div>
          )}

          {/* Exam modal (hub editor) */}
          {examModal && (
            <div style={styles.modal} onClick={() => setExamModal(null)}>
              <div style={{ ...styles.modalBox, maxWidth: 720 }} onClick={(e) => e.stopPropagation()}>
                <h3 style={{ margin: "0 0 14px", fontSize: 16, color: "#1e3a5f" }}>
                  {examModal.index === null ? "➕ Add Exam" : "✏️ Edit Exam"} — {currentHub ? HUB_DEFAULTS[currentHub].name : ""}
                </h3>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                  {EXAM_FIELDS.map((fd) => (
                    <div key={fd.key} style={{ gridColumn: fd.type === "textarea" ? "1 / -1" : undefined }}>
                      <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#555", marginBottom: 4 }}>{fd.label}</label>
                      <FieldInput fd={{ ...fd, rows: 4 }} value={examModal.form[fd.key] || ""} onChange={(k, v) => setExamModal((p) => ({ ...p, form: { ...p.form, [k]: v } }))} />
                    </div>
                  ))}
                </div>
                <div style={{ display: "flex", gap: 8, marginTop: 16 }}>
                  <button onClick={saveExamModal} style={styles.btn("#16a34a")}>✅ Save Exam</button>
                  <button onClick={() => setExamModal(null)} style={{ ...styles.btn("#9ca3af") }}>Cancel</button>
                </div>
              </div>
            </div>
          )}
        </div>
      );
    }
    