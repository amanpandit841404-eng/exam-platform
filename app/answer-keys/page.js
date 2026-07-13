"use client";
import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";

export default function AnswerKeysPage() {
  const [keys, setKeys] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");

  useEffect(() => {
    document.title = "Answer Key 2026 - SSC UPSC Railway | SarkariSetu India";
    supabase.from("answer_keys").select("*").order("created_at", { ascending: false })
      .then(({ data }) => { if (data) setKeys(data); setLoading(false); });
  }, []);

  const categories = ["all","SSC","UPSC","Banking","Railway","State PSC","Defence","Teaching"];

  const filtered = keys.filter(k => {
    const matchSearch = !search || k.exam_name?.toLowerCase().includes(search.toLowerCase()) || k.title?.toLowerCase().includes(search.toLowerCase());
    const matchCat = category === "all" || k.category === category;
    return matchSearch && matchCat;
  });

  return (
    <div style={{ minHeight: "100vh", background: "#f8fafc", fontFamily: "sans-serif" }}>
      <div style={{ background: "linear-gradient(135deg, #ca8a04 0%, #b45309 100%)", color: "#fff", padding: "20px 16px 24px", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: -40, right: -40, width: 180, height: 180, borderRadius: "50%", background: "rgba(255,255,255,0.05)" }} />
        <div style={{ maxWidth: 800, margin: "0 auto", position: "relative" }}>
          <a href="/" style={{ color: "rgba(255,255,255,0.8)", fontSize: 13, textDecoration: "none" }}>Home</a>
          <h1 style={{ margin: "8px 0 4px", fontSize: 22, fontWeight: 800 }}>🔑 Answer Keys 2026</h1>
          <p style={{ margin: "0 0 16px", fontSize: 13, opacity: 0.85 }}>{keys.length} answer keys available</p>
          <div style={{ position: "relative" }}>
            <input placeholder="Search answer keys... (SSC CGL, IBPS...)"
              value={search} onChange={e => setSearch(e.target.value)}
              style={{ width: "100%", padding: "11px 16px", borderRadius: 10, border: "none", fontSize: 14, boxSizing: "border-box", outline: "none" }} />
          </div>
        </div>
      </div>

      <div style={{ display: "flex", gap: 8, padding: "10px 16px", overflowX: "auto", background: "#fff", borderBottom: "1px solid #e5e7eb" }}>
        {categories.map(cat => (
          <button key={cat} onClick={() => setCategory(cat)}
            style={{ padding: "6px 14px", borderRadius: 20, border: "none", cursor: "pointer", whiteSpace: "nowrap", fontSize: 12, fontWeight: 600,
              background: category === cat ? "#ca8a04" : "#f3f4f6", color: category === cat ? "#fff" : "#4b5563" }}>
            {cat === "all" ? "All" : cat}
          </button>
        ))}
      </div>

      <div style={{ maxWidth: 800, margin: "0 auto", padding: "12px 16px" }}>
        {loading ? (
          <div style={{ textAlign: "center", padding: 60, color: "#6b7280" }}>Loading...</div>
        ) : filtered.length === 0 ? (
          <div style={{ textAlign: "center", padding: 60, color: "#6b7280" }}>
            <div style={{ fontSize: 48 }}>🔑</div>
            <p>No answer keys found</p>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {filtered.map((k, i) => (
              <div key={k.id || i} style={{ background: "#fff", borderRadius: 12, padding: 16, border: "1px solid #e5e7eb", boxShadow: "0 1px 4px rgba(0,0,0,0.04)" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 10 }}>
                  <div style={{ flex: 1 }}>
                    <p style={{ margin: "0 0 4px", fontWeight: 700, fontSize: 14, color: "#1e3a5f" }}>{k.exam_name || k.title}</p>
                    {k.title && k.title !== k.exam_name && <p style={{ margin: "0 0 6px", fontSize: 12, color: "#6b7280" }}>{k.title}</p>}
                    <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                      <span style={{ fontSize: 11, padding: "2px 8px", background: "#fef9c3", color: "#ca8a04", borderRadius: 10, fontWeight: 700 }}>🔑 Released</span>
                      {k.category && <span style={{ fontSize: 11, padding: "2px 8px", background: "#eff6ff", color: "#2563eb", borderRadius: 10 }}>{k.category}</span>}
                      {k.exam_date && <span style={{ fontSize: 11, color: "#9ca3af" }}>📅 {new Date(k.exam_date).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</span>}
                    </div>
                    {k.sets && (
                      <div style={{ marginTop: 8, display: "flex", gap: 6, flexWrap: "wrap" }}>
                        {k.sets.split(",").map((s, si) => (
                          <span key={si} style={{ fontSize: 11, padding: "2px 8px", background: "#f3f4f6", color: "#374151", borderRadius: 6, fontWeight: 600 }}>Set {s.trim()}</span>
                        ))}
                      </div>
                    )}
                  </div>
                  {k.official_link && (
                    <a href={k.official_link} target="_blank" rel="noopener noreferrer"
                      style={{ padding: "8px 14px", background: "linear-gradient(135deg,#ca8a04,#b45309)", color: "#fff", borderRadius: 8, textDecoration: "none", fontSize: 12, fontWeight: 700, whiteSpace: "nowrap" }}>
                      Download ↗
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
