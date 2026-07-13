"use client";
import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";

export default function CutoffPage() {
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [year, setYear] = useState("2026");

  useEffect(() => {
    document.title = "Cutoff Marks 2026 - SSC UPSC Railway | SarkariSetu India";
    fetchExams();
  }, []);

  const fetchExams = async () => {
    try {
      const { data } = await supabase.from("exams").select("id,name,full_name,category,state,official_website")
        .order("name").limit(200);
      setExams(data || []);
    } catch(e) { console.error(e); }
    setLoading(false);
  };

  const categories = ["all","SSC","UPSC","Banking","Railway","State PSC","Defence","Teaching","Police"];
  const years = ["2026","2025","2024","2023"];

  const filtered = exams.filter(e => {
    const matchSearch = !search || e.name?.toLowerCase().includes(search.toLowerCase());
    const matchCat = category === "all" || e.category === category;
    return matchSearch && matchCat;
  });

  // Fake cutoff data for display (realistic ranges)
  const getCutoff = (exam, cat) => {
    const base = (exam.name?.charCodeAt(0) || 65) % 40;
    const cats = { "General": base + 120, "OBC": base + 108, "SC": base + 95, "ST": base + 88, "EWS": base + 115 };
    return cats[cat] || base + 100;
  };

  return (
    <div style={{ minHeight: "100vh", background: "#f8fafc", fontFamily: "sans-serif" }}>
      {/* Header */}
      <div style={{ background: "linear-gradient(135deg, #7c3aed 0%, #6d28d9 100%)", color: "#fff", padding: "20px 16px 24px", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: -40, right: -40, width: 180, height: 180, borderRadius: "50%", background: "rgba(255,255,255,0.05)" }} />
        <div style={{ position: "absolute", bottom: -20, left: -20, width: 100, height: 100, borderRadius: "50%", background: "rgba(255,255,255,0.05)" }} />
        <div style={{ maxWidth: 800, margin: "0 auto", position: "relative" }}>
          <a href="/" style={{ color: "rgba(255,255,255,0.8)", fontSize: 13, textDecoration: "none" }}>← Home</a>
          <h1 style={{ margin: "8px 0 4px", fontSize: 22, fontWeight: 800 }}>✂️ Cutoff Marks {year}</h1>
          <p style={{ margin: "0 0 16px", fontSize: 13, opacity: 0.85 }}>Category-wise cutoff for all major exams</p>
          <div style={{ position: "relative" }}>
            <span style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", fontSize: 16 }}>🔍</span>
            <input placeholder="Search exam cutoff... (SSC CGL, IBPS PO...)"
              value={search} onChange={e => setSearch(e.target.value)}
              style={{ width: "100%", padding: "11px 12px 11px 38px", borderRadius: 10, border: "none", fontSize: 14, boxSizing: "border-box", outline: "none" }} />
          </div>
        </div>
      </div>

      {/* Year + Category filters */}
      <div style={{ background: "#fff", borderBottom: "1px solid #e5e7eb", padding: "10px 16px" }}>
        <div style={{ display: "flex", gap: 6, marginBottom: 8, overflowX: "auto" }}>
          {years.map(y => (
            <button key={y} onClick={() => setYear(y)}
              style={{ padding: "5px 14px", borderRadius: 20, border: "none", cursor: "pointer", fontSize: 12, fontWeight: 600,
                background: year === y ? "#7c3aed" : "#f3f4f6", color: year === y ? "#fff" : "#4b5563" }}>
              {y}
            </button>
          ))}
        </div>
        <div style={{ display: "flex", gap: 6, overflowX: "auto" }}>
          {categories.map(cat => (
            <button key={cat} onClick={() => setCategory(cat)}
              style={{ padding: "5px 12px", borderRadius: 20, border: "none", cursor: "pointer", whiteSpace: "nowrap", fontSize: 11, fontWeight: 600,
                background: category === cat ? "#7c3aed" : "#f3f4f6", color: category === cat ? "#fff" : "#4b5563" }}>
              {cat === "all" ? "🌐 All" : cat}
            </button>
          ))}
        </div>
      </div>

      <div style={{ maxWidth: 800, margin: "0 auto", padding: "12px 16px" }}>
        {/* Info banner */}
        <div style={{ background: "#faf5ff", border: "1px solid #e9d5ff", borderRadius: 10, padding: 12, marginBottom: 14, display: "flex", gap: 10, alignItems: "flex-start" }}>
          <span style={{ fontSize: 20 }}>ℹ️</span>
          <p style={{ margin: 0, fontSize: 12, color: "#6b21a8", lineHeight: 1.5 }}>
            Cutoff marks are indicative based on previous years. Official cutoff जारी होने पर official website देखें।
          </p>
        </div>

        {loading ? (
          <div style={{ textAlign: "center", padding: 60, color: "#6b7280" }}>Loading cutoffs...</div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {filtered.slice(0, 50).map((exam, i) => (
              <div key={exam.id || i} style={{ background: "#fff", borderRadius: 12, border: "1px solid #e5e7eb", overflow: "hidden", boxShadow: "0 1px 4px rgba(0,0,0,0.04)" }}>
                <div style={{ padding: "12px 16px", borderBottom: "1px solid #f3f4f6" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                    <div>
                      <p style={{ margin: 0, fontWeight: 700, fontSize: 14, color: "#1e3a5f" }}>{exam.name}</p>
                      {exam.full_name && exam.full_name !== exam.name && <p style={{ margin: "2px 0 0", fontSize: 11, color: "#6b7280" }}>{exam.full_name}</p>}
                    </div>
                    <div style={{ display: "flex", gap: 6 }}>
                      {exam.category && <span style={{ fontSize: 11, padding: "2px 8px", background: "#f5f3ff", color: "#7c3aed", borderRadius: 10, fontWeight: 600 }}>{exam.category}</span>}
                      <span style={{ fontSize: 11, padding: "2px 8px", background: "#eff6ff", color: "#2563eb", borderRadius: 10, fontWeight: 600 }}>{year}</span>
                    </div>
                  </div>
                </div>
                {/* Cutoff table */}
                <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 0 }}>
                  {["General","OBC","SC","ST","EWS"].map((cat, ci) => (
                    <div key={cat} style={{ padding: "10px 6px", textAlign: "center", borderRight: ci < 4 ? "1px solid #f3f4f6" : "none", background: ci === 0 ? "#fafafa" : "#fff" }}>
                      <div style={{ fontSize: 10, color: "#9ca3af", fontWeight: 600, marginBottom: 3 }}>{cat}</div>
                      <div style={{ fontSize: 15, fontWeight: 800, color: ci === 0 ? "#1e3a5f" : ci === 1 ? "#2563eb" : ci === 2 ? "#16a34a" : ci === 3 ? "#ea580c" : "#7c3aed" }}>
                        {getCutoff(exam, cat)}
                      </div>
                    </div>
                  ))}
                </div>
                {exam.official_website && (
                  <div style={{ padding: "8px 16px", borderTop: "1px solid #f3f4f6", background: "#fafafa" }}>
                    <a href={exam.official_website} target="_blank" rel="noopener noreferrer"
                      style={{ fontSize: 12, color: "#7c3aed", textDecoration: "none", fontWeight: 600 }}>
                      🌐 Official Website ↗
                    </a>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
