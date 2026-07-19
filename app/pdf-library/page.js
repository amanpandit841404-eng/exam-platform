"use client";

import { useState, useEffect, useMemo } from "react";

const TOTAL_EXAMS = 3500;

const getCategory = (filename) => {
  if (filename.includes("railway")) return { cat: "🚂 Railway", color: "#dc2626", bg: "#fef2f2" };
  if (filename.includes("upsc")) return { cat: "🏛️ UPSC", color: "#1e40af", bg: "#eff6ff" };
  if (filename.includes("ssc")) return { cat: "📋 SSC", color: "#059669", bg: "#ecfdf5" };
  if (filename.includes("banking")) return { cat: "🏦 Banking", color: "#d97706", bg: "#fffbeb" };
  if (filename.includes("state-psc")) return { cat: "🏗️ State PSC", color: "#7c3aed", bg: "#f5f3ff" };
  if (filename.includes("teaching") || filename.includes("kvs") || filename.includes("dsssb")) return { cat: "📚 Teaching", color: "#0891b2", bg: "#ecfeff" };
  if (filename.includes("defence")) return { cat: "🎖️ Defence", color: "#4f46e5", bg: "#eef2ff" };
  if (filename.includes("police")) return { cat: "🚔 Police", color: "#1e293b", bg: "#f8fafc" };
  if (filename.includes("insurance")) return { cat: "🛡️ Insurance", color: "#ca8a04", bg: "#fef3c7" };
  if (filename.includes("medical") || filename.includes("paramedical") || filename.includes("health")) return { cat: "🏥 Medical", color: "#be123c", bg: "#fdf2f8" };
  if (filename.includes("engineering")) return { cat: "⚙️ Engineering", color: "#0d9488", bg: "#f0fdfa" };
  if (filename.includes("judiciary") || filename.includes("law")) return { cat: "⚖️ Law", color: "#4f46e5", bg: "#eef2ff" };
  if (filename.includes("mba") || filename.includes("management") || filename.includes("commerce") || filename.includes("finance")) return { cat: "💼 MBA/Finance", color: "#0ea5e9", bg: "#f0f9ff" };
  if (filename.includes("forest") || filename.includes("environment") || filename.includes("agriculture")) return { cat: "🌿 Agri/Forest", color: "#16a34a", bg: "#f0fdf4" };
  if (filename.includes("psu")) return { cat: "🏭 PSU", color: "#b45309", bg: "#fff7ed" };
  if (filename.includes("sainik") || filename.includes("military") || filename.includes("jnv") || filename.includes("polytechnic") || filename.includes("iti")) return { cat: "🎒 School/ITI", color: "#6366f1", bg: "#eef2ff" };
  if (filename.includes("scholarship") || filename.includes("olympiad")) return { cat: "🏅 Scholarships", color: "#f59e0b", bg: "#fffbeb" };
  if (filename.includes("research") || filename.includes("fellowship")) return { cat: "🔬 Research", color: "#8b5cf6", bg: "#f5f3ff" };
  if (filename.includes("professional") || filename.includes("certification")) return { cat: "📜 Certifications", color: "#06b6d4", bg: "#ecfeff" };
  if (filename.includes("postoffice")) return { cat: "📮 Post Office", color: "#e11d48", bg: "#fdf2f8" };
  if (filename.includes("nielit") || filename.includes("computer")) return { cat: "💻 Computer/IT", color: "#2563eb", bg: "#eff6ff" };
  if (filename.includes("hotel") || filename.includes("hospitality")) return { cat: "🏨 Hospitality", color: "#ea580c", bg: "#fff7ed" };
  if (filename.includes("design") || filename.includes("fashion")) return { cat: "🎨 Design", color: "#db2777", bg: "#fdf2f8" };
  if (filename.includes("mass") || filename.includes("communication") || filename.includes("journalism")) return { cat: "📺 Media", color: "#9333ea", bg: "#faf5ff" };
  if (filename.includes("foreign") || filename.includes("study") || filename.includes("abroad")) return { cat: "🌍 Study Abroad", color: "#0284c7", bg: "#f0f9ff" };
  if (filename.includes("aviation") || filename.includes("merchant") || filename.includes("navy") || filename.includes("architecture")) return { cat: "✈️ Aviation/Navy", color: "#0c4a6e", bg: "#f0f9ff" };
  if (filename.includes("municipal") || filename.includes("local-govt")) return { cat: "🏛️ Local Govt", color: "#334155", bg: "#f1f5f9" };
  if (filename.includes("apprenticeship") || filename.includes("trade")) return { cat: "🔧 Apprenticeship", color: "#d97706", bg: "#fffbeb" };
  if (filename.includes("specialized-sector")) return { cat: "🔬 Specialized", color: "#7c3aed", bg: "#f5f3ff" };
  if (filename.includes("specialized-academic")) return { cat: "🎓 Specialized Academic", color: "#0891b2", bg: "#ecfeff" };
  if (filename.includes("remaining") || filename.includes("coastguard") || filename.includes("aibe") || filename.includes("ib-css")) return { cat: "📋 Misc Gov't", color: "#475569", bg: "#f1f5f9" };
  return { cat: "📂 Other", color: "#6b7280", bg: "#f9fafb" };
};

const getTitle = (filename) => {
  return filename
    .replace(".pdf", "")
    .replace(/-/g, " ")
    .replace(/\b\w/g, c => c.toUpperCase())
    .replace("Ssc", "SSC")
    .replace("Upsc", "UPSC")
    .replace("Psc", "PSC")
    .replace("Dsssb", "DSSSB")
    .replace("Bed", "B.Ed")
    .replace("Kvs", "KVS")
    .replace("Ctet", "CTET")
    .replace("Jnv", "JNV")
    .replace("Iti", "ITI")
    .replace("Nielit", "NIELIT")
    .replace("Psu", "PSU")
    .replace("Capf", "CAPF")
    .replace("Aibe", "AIBE")
    .replace("Mba", "MBA")
    .replace("Neet", "NEET")
    .replace("Coastguard", "Coast Guard")
    .replace("Sainik", "Sainik")
    .replace("List", "");
};

const getExamsCount = (filename) => {
  const size = { 
    "railway": 102, "upsc": 119, "ssc": 150, "banking": 176, 
    "state-psc": 164, "teaching": 154, "defence": 65, "police": 80,
    "insurance": 35, "postoffice": 27, "forest": 53, "judiciary": 45,
    "engineering": 53, "medical": 58, "mba": 43, "hotel": 26,
    "design": 25, "mass-communication": 23, "foreign": 34, "nielit": 32,
    "apprenticeship": 24, "scholarship": 37, "research": 27,
    "professional-certifications": 328, "psu": 90, "agriculture": 33,
    "municipal": 37, "health": 47, "specialized-sector": 100,
    "aviation": 70, "jnv": 38, "kvs": 30, "commerce": 20,
    "specialized-academic": 40, "sainik": 40, "remaining": 40
  };
  for (const [key, count] of Object.entries(size)) {
    if (filename.includes(key)) return `${count}+ exams`;
  }
  return "";
};

const PDF_FILES = [
  "railway-recruitment-exams-list.pdf",
  "upsc-exams-list.pdf",
  "ssc-exams-list.pdf",
  "banking-exams-list.pdf",
  "state-psc-exams-list.pdf",
  "teaching-ctet-exams-list.pdf",
  "defence-exams-list.pdf",
  "police-exams-list.pdf",
  "insurance-exams-list.pdf",
  "postoffice-exams-list.pdf",
  "forest-environment-exams-list.pdf",
  "judiciary-law-exams-list.pdf",
  "engineering-entrance-exams-list.pdf",
  "medical-paramedical-entrance-exams-list.pdf",
  "mba-management-entrance-exams-list.pdf",
  "hotel-management-exams-list.pdf",
  "design-fashion-exams-list.pdf",
  "mass-communication-journalism-exams-list.pdf",
  "foreign-study-exams-list.pdf",
  "nielit-computer-exams-list.pdf",
  "apprenticeship-trade-exams-list.pdf",
  "scholarship-olympiad-exams-list.pdf",
  "research-fellowship-exams-list.pdf",
  "professional-certifications-list.pdf",
  "professional-certifications-master-list.pdf",
  "psu-recruitment-exams-list.pdf",
  "agriculture-allied-exams-list.pdf",
  "municipal-local-govt-exams-list.pdf",
  "health-department-recruitment-exams.pdf",
  "specialized-sector-exams-list.pdf",
  "aviation-merchant-nvy-architecture-exams-list.pdf",
  "jnv-polytechnic-iti-exams-list.pdf",
  "kvs-dsssb-bed-teaching-recruitment-exams.pdf",
  "commerce-finance-professional-exams-list.pdf",
  "specialized-academic-fields-exams-list.pdf",
  "sainik-military-school-entrance-exams.pdf",
  "remaining-exams-coastguard-aibe-ib-css.pdf",
];

export default function PdfLibrary() {
  const [search, setSearch] = useState("");
  const [selectedCat, setSelectedCat] = useState("All");
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    document.title = "PDF Exam Library - SarkariSetu India";
    const dark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    setDarkMode(dark);
  }, []);

  const bg = darkMode ? "#0f172a" : "#f1f5f9";
  const cardBg = darkMode ? "#1e293b" : "#ffffff";
  const textMain = darkMode ? "#f1f5f9" : "#1e3a5f";
  const textSub = darkMode ? "#94a3b8" : "#6b7280";
  const border = darkMode ? "#334155" : "#e5e7eb";

  const filesWithData = useMemo(() => {
    return PDF_FILES.map(f => {
      const info = getCategory(f);
      return { filename: f, title: getTitle(f), ...info, exams: getExamsCount(f) };
    });
  }, []);

  const categories = useMemo(() => {
    const cats = ["All", ...new Set(filesWithData.map(f => f.cat))];
    return cats;
  }, [filesWithData]);

  const filtered = useMemo(() => {
    return filesWithData.filter(f => {
      const matchSearch = !search || f.title.toLowerCase().includes(search.toLowerCase()) || f.cat.toLowerCase().includes(search.toLowerCase());
      const matchCat = selectedCat === "All" || f.cat === selectedCat;
      return matchSearch && matchCat;
    });
  }, [filesWithData, search, selectedCat]);

  const toggleDark = () => setDarkMode(!darkMode);

  return (
    <div style={{ minHeight: "100vh", background: bg, fontFamily: "sans-serif", transition: "all 0.3s" }}>
      <div style={{ background: "linear-gradient(135deg, #1e3a5f 0%, #2563eb 100%)", color: "#fff", padding: "20px 16px 24px", position: "sticky", top: 0, zIndex: 50 }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
            <a href="/" style={{ color: "rgba(255,255,255,0.8)", fontSize: 13, textDecoration: "none" }}>⬅ Home</a>
            <button onClick={toggleDark} style={{ background: "rgba(255,255,255,0.15)", border: "none", color: "#fff", padding: "6px 14px", borderRadius: 20, fontSize: 12, cursor: "pointer" }}>
              {darkMode ? "☀️ Light" : "🌙 Dark"}
            </button>
          </div>
          <h1 style={{ margin: "8px 0 4px", fontSize: 22, fontWeight: 800 }}>📚 Exam PDF Library</h1>
          <p style={{ margin: 0, fontSize: 13, opacity: 0.85 }}>{TOTAL_EXAMS}+ Exams | {PDF_FILES.length} PDFs | Free Download</p>
        </div>
      </div>

      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "16px" }}>
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginBottom: 16 }}>
          <div style={{ background: cardBg, border: `1px solid ${border}`, borderRadius: 12, padding: "12px 16px", flex: 1, minWidth: 120, textAlign: "center" }}>
            <div style={{ fontSize: 24, fontWeight: 800, color: "#2563eb" }}>{PDF_FILES.length}</div>
            <div style={{ fontSize: 11, color: textSub }}>Total PDFs</div>
          </div>
          <div style={{ background: cardBg, border: `1px solid ${border}`, borderRadius: 12, padding: "12px 16px", flex: 1, minWidth: 120, textAlign: "center" }}>
            <div style={{ fontSize: 24, fontWeight: 800, color: "#16a34a" }}>{TOTAL_EXAMS}+</div>
            <div style={{ fontSize: 11, color: textSub }}>Exam Entries</div>
          </div>
          <div style={{ background: cardBg, border: `1px solid ${border}`, borderRadius: 12, padding: "12px 16px", flex: 1, minWidth: 120, textAlign: "center" }}>
            <div style={{ fontSize: 24, fontWeight: 800, color: "#d97706" }}>{categories.length - 1}</div>
            <div style={{ fontSize: 11, color: textSub }}>Categories</div>
          </div>
          <div style={{ background: cardBg, border: `1px solid ${border}`, borderRadius: 12, padding: "12px 16px", flex: 1, minWidth: 120, textAlign: "center" }}>
            <div style={{ fontSize: 24, fontWeight: 800, color: "#7c3aed" }}>~900KB</div>
            <div style={{ fontSize: 11, color: textSub }}>Total Size</div>
          </div>
        </div>

        <div style={{ marginBottom: 12 }}>
          <input type="text" placeholder="🔍 Search PDFs by name or category..." value={search}
            onChange={e => setSearch(e.target.value)}
            style={{ width: "100%", padding: "12px 16px", borderRadius: 12, border: `2px solid ${border}`, background: cardBg, color: textMain, fontSize: 14, outline: "none", boxSizing: "border-box" }} />
        </div>

        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 16, overflowX: "auto", paddingBottom: 4 }}>
          {categories.map(cat => (
            <button key={cat} onClick={() => setSelectedCat(cat)}
              style={{ padding: "6px 14px", borderRadius: 20, border: selectedCat === cat ? "2px solid #2563eb" : `1px solid ${border}`, background: selectedCat === cat ? "#eff6ff" : cardBg, color: selectedCat === cat ? "#2563eb" : textSub, fontSize: 12, fontWeight: selectedCat === cat ? 700 : 400, cursor: "pointer", whiteSpace: "nowrap" }}>
              {cat === "All" ? `🏠 All (${filtered.length})` : cat.split(" ").slice(1).join(" ")}
            </button>
          ))}
        </div>

        <p style={{ fontSize: 12, color: textSub, margin: "0 0 12px" }}>Showing {filtered.length} of {PDF_FILES.length} PDFs</p>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 12 }}>
          {filtered.map((f, i) => (
            <a key={i} href={`/pdfs/${f.filename}`} target="_blank" rel="noopener noreferrer"
              style={{ display: "block", background: cardBg, border: `1px solid ${border}`, borderRadius: 16, padding: "16px", textDecoration: "none", transition: "all 0.2s" }}
              onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.1)"; }}
              onMouseLeave={e => { e.currentTarget.style.transform = ""; e.currentTarget.style.boxShadow = ""; }}>
              <div style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
                <div style={{ fontSize: 28, flexShrink: 0 }}>📄</div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 14, fontWeight: 700, color: textMain, marginBottom: 6, lineHeight: 1.3 }}>{f.title}</div>
                  <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 6 }}>
                    <span style={{ background: f.bg, color: f.color, padding: "2px 10px", borderRadius: 12, fontSize: 11, fontWeight: 600 }}>{f.cat}</span>
                    {f.exams && <span style={{ background: darkMode ? "#1e293b" : "#f3f4f6", color: textSub, padding: "2px 10px", borderRadius: 12, fontSize: 11 }}>{f.exams}</span>}
                  </div>
                  <div style={{ fontSize: 11, color: "#2563eb", fontWeight: 600 }}>📥 Open PDF →</div>
                </div>
              </div>
            </a>
          ))}
        </div>

        {filtered.length === 0 && (
          <div style={{ textAlign: "center", padding: "40px", color: textSub }}>
            <div style={{ fontSize: 48, marginBottom: 12 }}>🔍</div>
            <p>No PDFs found matching "{search}"</p>
            <button onClick={() => { setSearch(""); setSelectedCat("All"); }}
              style={{ padding: "8px 20px", background: "#2563eb", color: "#fff", border: "none", borderRadius: 8, fontSize: 13, cursor: "pointer", marginTop: 8 }}>
              Clear Filters
            </button>
          </div>
        )}

        <div style={{ textAlign: "center", marginTop: 24, padding: 20, borderTop: `1px solid ${border}` }}>
          <p style={{ fontSize: 12, color: textSub }}>
            📚 <strong>{PDF_FILES.length} PDFs</strong> covering {TOTAL_EXAMS}+ exams across all categories.
            <br />SarkariSetu India — Your Complete Exam Information Hub.
          </p>
        </div>
      </div>
    </div>
  );
}
