"use client";

    import { useEffect, useState, useMemo } from "react";
    import { supabase } from "../lib/supabase";

    const CAT_EMOJI = {
      "Cloud Computing": "☁️", "Programming & Development": "💻", "Web Development": "🌐",
      "Mobile App Development": "📱", "Artificial Intelligence": "🤖", "Data Science & Analytics": "📊",
      "Cyber Security": "🔐", "Networking": "🌐", "Database": "🗄️", "DevOps & SRE": "⚙️",
      "Software Architecture": "🏗️", "Software Testing": "🧪", "Project Management": "📋",
      "Finance & Accounting": "💰", "Law & Compliance": "⚖️", "Human Resources": "👥",
      "Healthcare": "🏥", "Engineering": "🛠️", "Design": "🎨", "Digital Marketing": "📣",
      "Supply Chain & Logistics": "🚚", "ERP & Enterprise": "🏢", "Hospitality & Tourism": "🏨",
      "Aviation": "✈️", "Maritime": "🚢", "Language Certifications": "🗣️",
      "Education & Teaching": "🎓", "Government Skill Certifications": "🏛️", "Emerging Technologies": "🚀"
    };

    const slugify = (s) => (s || "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

export default function Certifications() {
      const [certs, setCerts] = useState([]);
      const [search, setSearch] = useState("");
      const [selectedCat, setSelectedCat] = useState("All");
      const [darkMode, setDarkMode] = useState(false);
      const [loading, setLoading] = useState(true);

      useEffect(() => {
        document.title = "Professional Certifications - SarkariSetu India";
        const saved = localStorage.getItem("sarkari-dark-mode");
        if (saved === "true") setDarkMode(true);
        async function load() {
          try {
            const { data } = await supabase
              .from("exams")
              .select("name, category, official_website, description")
              .ilike("category", "Professional Certification%")
              .eq("is_active", true)
              .order("name");
            if (data) setCerts(data);
          } catch (e) {
          } finally {
            setLoading(false);
          }
        }
        load();
      }, []);

      const cats = useMemo(() => {
        const m = {};
        certs.forEach((c) => {
          const k = (c.category || "").replace("Professional Certification - ", "");
          m[k] = (m[k] || 0) + 1;
        });
        return Object.entries(m).sort((a, b) => b[1] - a[1]);
      }, [certs]);

      const filtered = useMemo(() => {
        const q = search.toLowerCase().trim();
        return certs.filter((c) => {
          const name = (c.name || "").toLowerCase();
          const cat = (c.category || "").toLowerCase();
          const mc = selectedCat === "All" || cat.includes(selectedCat.toLowerCase());
          const ms = !q || name.includes(q) || cat.includes(q);
          return mc && ms;
        });
      }, [certs, search, selectedCat]);

      const bg = darkMode ? "#0f172a" : "#f1f5f9";
      const cardBg = darkMode ? "#1e293b" : "#ffffff";
      const textMain = darkMode ? "#f1f5f9" : "#1e3a5f";
      const textSub = darkMode ? "#94a3b8" : "#6b7280";
      const border = darkMode ? "#334155" : "#e5e7eb";

      return (
        <div style={{ minHeight: "100vh", background: bg, fontFamily: "sans-serif", paddingBottom: 70 }}>
          <div style={{ background: "linear-gradient(135deg,#1e3a5f,#2a5a8f)", padding: "18px 16px 16px", color: "#fff" }}>
            <div style={{ maxWidth: 1000, margin: "0 auto" }}>
              <a href="/" style={{ color: "#cbd5e1", textDecoration: "none", fontSize: 12 }}>← Home</a>
              <h1 style={{ fontSize: 20, fontWeight: 800, margin: "6px 0 4px" }}>🎓 Professional Certifications</h1>
              <div style={{ fontSize: 12.5, color: "#cbd5e1" }}>780+ certifications · 29 category pages · एक जगह से पढ़ें और archive करें</div>
            </div>
          </div>

          <div style={{ background: cardBg, borderBottom: `1px solid ${border}`, padding: "12px 16px" }}>
            <div style={{ maxWidth: 1000, margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 8 }}>
              {[
                { icon: "📜", val: certs.length + "+", label: "Certifications", color: "#2563eb", bg: "#eff6ff" },
                { icon: "🗂️", val: cats.length, label: "Categories", color: "#16a34a", bg: "#f0fdf4" },
                { icon: "🏢", val: "290+", label: "Issuing Bodies", color: "#ea580c", bg: "#fff7ed" },
              ].map((s, i) => (
                <div key={i} style={{ background: darkMode ? "#334155" : s.bg, borderRadius: 10, padding: "10px 8px", textAlign: "center", border: `1px solid ${border}` }}>
                  <div style={{ fontSize: 18 }}>{s.icon}</div>
                  <div style={{ fontSize: 15, fontWeight: 800, color: darkMode ? "#e2e8f0" : s.color }}>{s.val}</div>
                  <div style={{ fontSize: 10, color: textSub }}>{s.label}</div>
                </div>
              ))}
            </div>
          </div>

          <div style={{ padding: "14px 16px 4px", maxWidth: 1000, margin: "0 auto" }}>
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="🔍 Certification खोजें... (AWS, Python, CISSP, NPTEL...)"
              style={{ width: "100%", padding: "12px 14px", fontSize: 14, border: `1px solid ${border}`, borderRadius: 10, background: cardBg, color: textMain, outline: "none" }}
            />
          </div>

          <div style={{ display: "flex", gap: 8, overflowX: "auto", padding: "12px 16px", maxWidth: 1000, margin: "0 auto" }}>
            <button onClick={() => setSelectedCat("All")} style={chipStyle(selectedCat === "All", darkMode, border)}>All ({certs.length})</button>
            {cats.map(([c, n]) => (
              <a key={c} href={`/certifications/${slugify(c)}`} style={chipStyle(selectedCat === c, darkMode, border)}>
                {CAT_EMOJI[c] || "📘"} {c} ({n})
              </a>
            ))}
          </div>

          <div style={{ padding: "6px 16px 16px", maxWidth: 1000, margin: "0 auto" }}>
            {loading && <div style={{ textAlign: "center", color: textSub, padding: 30 }}>Loading...</div>}
            {!loading && filtered.length === 0 && <div style={{ textAlign: "center", color: textSub, padding: 30 }}>कोई certification नहीं मिली — दूसरा keyword try करो</div>}
            {filtered.map((c, i) => (
              <div key={i} style={{ background: cardBg, border: `1px solid ${border}`, borderRadius: 10, padding: "11px 14px", marginBottom: 8 }}>
                <a href={`/certifications/${slugify(c.category.replace("Professional Certification - ", ""))}/${slugify(c.name)}`} style={{ fontSize: 14, fontWeight: 700, color: textMain, textDecoration: "none", display: "block" }}>{c.name}</a>
                <div style={{ display: "flex", gap: 8, marginTop: 6, alignItems: "center", flexWrap: "wrap" }}>
                  <span style={{ fontSize: 10.5, background: darkMode ? "#334155" : "#dbeafe", color: darkMode ? "#93c5fd" : "#1e40af", padding: "3px 9px", borderRadius: 20 }}>
                    {c.category.replace("Professional Certification - ", "")}
                  </span>
                  {c.official_website && (
                    <a href={c.official_website} target="_blank" rel="noopener noreferrer" style={{ fontSize: 11, color: "#2563eb", textDecoration: "none" }}>Official Website ↗</a>
                  )}
                  {c.description && <span style={{ fontSize: 11.5, color: textSub }}>{c.description}</span>}
                </div>
              </div>
            ))}
          </div>

          <div style={{ padding: "10px 16px 20px", maxWidth: 1000, margin: "0 auto" }}>
            <h2 style={{ fontSize: 15, fontWeight: 800, color: textMain, marginBottom: 10 }}>📥 Archive Download (Free)</h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))", gap: 10 }}>
              <a href="/pdfs/professional-certifications-fresh-list.pdf" target="_blank" rel="noopener noreferrer" style={downloadCard(darkMode, border, textMain)}>
                📄 Fresh List PDF<span style={{ display: "block", fontSize: 11, color: textSub, fontWeight: 400 }}>780 certifications · 29 categories</span>
              </a>
              <a href="/pdfs/professional-certifications-master-list.pdf" target="_blank" rel="noopener noreferrer" style={downloadCard(darkMode, border, textMain)}>
                📄 Master List PDF<span style={{ display: "block", fontSize: 11, color: textSub, fontWeight: 400 }}>Detailed master list</span>
              </a>
              <a href="/pdfs/professional-certifications-list.pdf" target="_blank" rel="noopener noreferrer" style={downloadCard(darkMode, border, textMain)}>
                📄 Certifications List<span style={{ display: "block", fontSize: 11, color: textSub, fontWeight: 400 }}>Global reference list</span>
              </a>
            </div>
          </div>

          <div style={{ textAlign: "center", fontSize: 11.5, color: textSub, padding: "0 16px 10px" }}>
            SarkariSetu India — India's #1 Exam Intelligence Platform
          </div>
        </div>
      );
    }

    function chipStyle(active, darkMode, border) {
      return {
        padding: "7px 13px", fontSize: 11.5, fontWeight: 700, borderRadius: 20, whiteSpace: "nowrap", cursor: "pointer",
        border: `1px solid ${border}`, flexShrink: 0,
        background: active ? "#1e3a5f" : (darkMode ? "#334155" : "#ffffff"),
        color: active ? "#fff" : (darkMode ? "#e2e8f0" : "#1e3a5f"),
      };
    }

    function downloadCard(darkMode, border, textMain) {
      return {
        display: "block", background: darkMode ? "#1e293b" : "#ffffff", border: `1px solid ${border}`,
        borderRadius: 12, padding: "14px", fontSize: 13, fontWeight: 700, color: textMain, textDecoration: "none",
      };
    }
    
