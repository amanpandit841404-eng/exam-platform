"use client";
import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

export default function AdmitCardsPage() {
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    document.title = "Admit Card 2026 Download | SarkariSetu India";
    supabase.from("admit_cards").select("*").order("created_at", { ascending: false })
      .then(({ data }) => { if (data) setCards(data); setLoading(false); });
  }, []);

  const categories = ["all", "SSC", "UPSC", "Banking", "Railway", "State PSC", "Defence", "Teaching"];

  const filtered = cards.filter(c => {
    const matchSearch = !search || c.exam_name?.toLowerCase().includes(search.toLowerCase()) || c.title?.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === "all" || c.category === filter;
    return matchSearch && matchFilter;
  });

  return (
    <div style={{ minHeight: "100vh", background: "#f8fafc", fontFamily: "sans-serif" }}>
      {/* Header */}
      <div style={{ background: "linear-gradient(135deg,#ea580c 0%,#dc2626 100%)", color: "#fff", padding: "20px 16px 24px", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: -30, right: -30, width: 150, height: 150, borderRadius: "50%", background: "rgba(255,255,255,0.05)" }} />
        <div style={{ maxWidth: 800, margin: "0 auto" }}>
          <a href="/" style={{ color: "rgba(255,255,255,0.8)", fontSize: 13, textDecoration: "none" }}>← Home</a>
          <h1 style={{ margin: "8px 0 4px", fontSize: 22, fontWeight: 800 }}>🎫 Admit Card Download</h1>
          <p style={{ margin: "0 0 16px", fontSize: 13, opacity: 0.85 }}>{cards.length} admit cards available • Download now</p>
          <div style={{ position: "relative" }}>
            <span style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", fontSize: 16 }}>🔍</span>
            <input placeholder="Search admit cards... (SSC, IBPS, Railway...)"
              value={search} onChange={e => setSearch(e.target.value)}
              style={{ width: "100%", padding: "11px 12px 11px 38px", borderRadius: 10, border: "none", fontSize: 14, boxSizing: "border-box", outline: "none" }} />
          </div>
        </div>
      </div>

      {/* Filter tabs */}
      <div style={{ display: "flex", gap: 8, padding: "10px 16px", overflowX: "auto", background: "#fff", borderBottom: "1px solid #e5e7eb" }}>
        {categories.map(cat => (
          <button key={cat} onClick={() => setFilter(cat)}
            style={{ padding: "6px 14px", borderRadius: 20, border: "none", cursor: "pointer", whiteSpace: "nowrap", fontSize: 12, fontWeight: 600,
              background: filter === cat ? "#ea580c" : "#f3f4f6",
              color: filter === cat ? "#fff" : "#4b5563" }}>
            {cat === "all" ? "🌐 All" : cat}
          </button>
        ))}
      </div>

      <div style={{ maxWidth: 800, margin: "0 auto", padding: "12px 16px" }}>
        {loading ? (
          <div style={{ textAlign: "center", padding: 60, color: "#6b7280" }}>
            <div style={{ fontSize: 40, marginBottom: 8 }}>⏳</div>
            <p>Loading admit cards...</p>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {filtered.map((c, i) => (
              <div key={c.id || i} style={{ background: "#fff", borderRadius: 12, padding: "14px 16px", border: "1px solid #e5e7eb", boxShadow: "0 1px 4px rgba(0,0,0,0.04)" }}>
                <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 10 }}>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4 }}>
                      <span style={{ fontSize: 16 }}>🎫</span>
                      <p style={{ margin: 0, fontWeight: 700, fontSize: 14, color: "#1e3a5f", lineHeight: 1.3 }}>{c.exam_name || c.title}</p>
                    </div>
                    {c.title && c.title !== c.exam_name && <p style={{ margin: "0 0 6px", fontSize: 12, color: "#6b7280" }}>{c.title}</p>}
                    <div style={{ display: "flex", gap: 6, flexWrap: "wrap", alignItems: "center" }}>
                      <span style={{ fontSize: 11, padding: "2px 8px", background: "#fff7ed", color: "#ea580c", borderRadius: 10, fontWeight: 700 }}>📥 Available</span>
                      {c.category && <span style={{ fontSize: 11, padding: "2px 8px", background: "#eff6ff", color: "#2563eb", borderRadius: 10, fontWeight: 600 }}>{c.category}</span>}
                      {c.exam_date && <span style={{ fontSize: 11, color: "#9ca3af" }}>📅 Exam: {new Date(c.exam_date).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</span>}
                    </div>
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 6, flexShrink: 0 }}>
                    {c.download_url && (
                      <a href={c.download_url} target="_blank" rel="noopener noreferrer"
                        style={{ padding: "8px 14px", background: "linear-gradient(135deg,#ea580c,#dc2626)", color: "#fff", borderRadius: 8, textDecoration: "none", fontSize: 12, fontWeight: 700, whiteSpace: "nowrap", textAlign: "center" }}>
                        Download ↗
                      </a>
                    )}
                    <a href={`/admit-cards/${c.id}`}
                      style={{ padding: "6px 14px", background: "#f3f4f6", color: "#1e3a5f", borderRadius: 8, textDecoration: "none", fontSize: 12, fontWeight: 600, whiteSpace: "nowrap", textAlign: "center" }}>
                      Details
                    </a>
                  </div>
                </div>
              </div>
            ))}
            {filtered.length === 0 && (
              <div style={{ textAlign: "center", padding: 60, color: "#6b7280" }}>
                <div style={{ fontSize: 48, marginBottom: 8 }}>😕</div>
                <p style={{ fontWeight: 600 }}>No admit cards found for "{search}"</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
