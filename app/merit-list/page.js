"use client";
import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";

export default function MeritListPage() {
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");

  useEffect(() => {
    document.title = "Merit List 2026 - Check Selected Candidates | SarkariSetu India";
    fetchExams();
  }, []);

  const fetchExams = async () => {
    try {
      const { data } = await supabase.from("results").select("*").order("created_at", { ascending: false }).limit(100);
      setExams(data || []);
    } catch(e) { console.error(e); }
    setLoading(false);
  };

  const categories = ["all","SSC","UPSC","Banking","Railway","State PSC","Defence","Teaching"];

  const filtered = exams.filter(e => {
    const matchSearch = !search || e.exam_name?.toLowerCase().includes(search.toLowerCase()) || e.title?.toLowerCase().includes(search.toLowerCase());
    const matchCat = category === "all" || e.category === category;
    return matchSearch && matchCat;
  });

  return (
    <div style={{ minHeight: "100vh", background: "#f8fafc", fontFamily: "sans-serif" }}>
      {/* Header */}
      <div style={{ background: "linear-gradient(135deg, #0891b2 0%, #0e7490 100%)", color: "#fff", padding: "20px 16px 24px", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: -40, right: -40, width: 180, height: 180, borderRadius: "50%", background: "rgba(255,255,255,0.05)" }} />
        <div style={{ maxWidth: 800, margin: "0 auto", position: "relative" }}>
          <a href="/" style={{ color: "rgba(255,255,255,0.8)", fontSize: 13, textDecoration: "none" }}>← Home</a>
          <h1 style={{ margin: "8px 0 4px", fontSize: 22, fontWeight: 800 }}>📋 Merit List 2026</h1>
          <p style={{ margin: "0 0 16px", fontSize: 13, opacity: 0.85 }}>Selected candidates list — Check your name</p>
          <div style={{ position: "relative" }}>
            <span style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", fontSize: 16 }}>🔍</span>
            <input placeholder="Search merit list... (SSC CGL, IBPS PO...)"
              value={search} onChange={e => setSearch(e.target.value)}
              style={{ width: "100%", padding: "11px 12px 11px 38px", borderRadius: 10, border: "none", fontSize: 14, boxSizing: "border-box", outline: "none" }} />
          </div>
        </div>
      </div>

      {/* Filter */}
      <div style={{ display: "flex", gap: 8, padding: "10px 16px", overflowX: "auto", background: "#fff", borderBottom: "1px solid #e5e7eb" }}>
        {categories.map(cat => (
          <button key={cat} onClick={() => setCategory(cat)}
            style={{ padding: "6px 14px", borderRadius: 20, border: "none", cursor: "pointer", whiteSpace: "nowrap", fontSize: 12, fontWeight: 600,
              background: category === cat ? "#0891b2" : "#f3f4f6", color: category === cat ? "#fff" : "#4b5563" }}>
            {cat === "all" ? "🌐 All" : cat}
          </button>
        ))}
      </div>

      <div style={{ maxWidth: 800, margin: "0 auto", padding: "12px 16px" }}>
        {/* Info */}
        <div style={{ background: "#ecfeff", border: "1px solid #a5f3fc", borderRadius: 10, padding: 12, marginBottom: 14 }}>
          <p style={{ margin: 0, fontSize: 12, color: "#0e7490", lineHeight: 1.5 }}>
            📌 Merit list में अपना नाम check करने के लिए <strong>Official Website</strong> पर जाएं। 
            Roll Number और Date of Birth से search करें।
          </p>
        </div>

        {loading ? (
          <div style={{ textAlign: "center", padding: 60, color: "#6b7280" }}>Loading merit lists...</div>
        ) : filtered.length === 0 ? (
          <div style={{ textAlign: "center", padding: 60, color: "#6b7280" }}>
            <div style={{ fontSize: 48, marginBottom: 8 }}>📋</div>
            <p>No merit lists found</p>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {filtered.map((exam, i) => (
              <div key={exam.id || i} style={{ background: "#fff", borderRadius: 12, padding: 16, border: "1px solid #e5e7eb", boxShadow: "0 1px 4px rgba(0,0,0,0.04)" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 10 }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 6 }}>
                      <span style={{ fontSize: 18 }}>📋</span>
                      <p style={{ margin: 0, fontWeight: 700, fontSize: 14, color: "#1e3a5f" }}>{exam.exam_name || exam.title}</p>
                    </div>
                    <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                      <span style={{ fontSize: 11, padding: "2px 8px", background: "#ecfeff", color: "#0891b2", borderRadius: 10, fontWeight: 700 }}>✅ Merit List Out</span>
                      {exam.category && <span style={{ fontSize: 11, padding: "2px 8px", background: "#eff6ff", color: "#2563eb", borderRadius: 10 }}>{exam.category}</span>}
                      {exam.result_date && <span style={{ fontSize: 11, color: "#9ca3af" }}>📅 {new Date(exam.result_date).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</span>}
                    </div>
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                    {exam.result_url && (
                      <a href={exam.result_url} target="_blank" rel="noopener noreferrer"
                        style={{ padding: "8px 14px", background: "linear-gradient(135deg,#0891b2,#0e7490)", color: "#fff", borderRadius: 8, textDecoration: "none", fontSize: 12, fontWeight: 700, whiteSpace: "nowrap", textAlign: "center" }}>
                        Check List ↗
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
