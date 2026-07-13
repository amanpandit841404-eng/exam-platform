"use client";
import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";

export default function HallTicketPage() {
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    document.title = "Hall Ticket Download 2026 | SarkariSetu India";
    supabase.from("admit_cards").select("*").order("created_at", { ascending: false })
      .then(({ data }) => { if (data) setCards(data); setLoading(false); });
  }, []);

  const filtered = cards.filter(c =>
    !search || c.exam_name?.toLowerCase().includes(search.toLowerCase()) || c.title?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={{ minHeight: "100vh", background: "#f8fafc", fontFamily: "sans-serif" }}>
      <div style={{ background: "linear-gradient(135deg, #be185d 0%, #9d174d 100%)", color: "#fff", padding: "20px 16px 24px" }}>
        <div style={{ maxWidth: 800, margin: "0 auto" }}>
          <a href="/" style={{ color: "rgba(255,255,255,0.8)", fontSize: 13, textDecoration: "none" }}>← Home</a>
          <h1 style={{ margin: "8px 0 4px", fontSize: 22, fontWeight: 800 }}>🎟️ Hall Ticket Download</h1>
          <p style={{ margin: "0 0 16px", fontSize: 13, opacity: 0.85 }}>Exam Hall Ticket / Admit Card 2026</p>
          <div style={{ position: "relative" }}>
            <span style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", fontSize: 16 }}>🔍</span>
            <input placeholder="Search hall ticket..."
              value={search} onChange={e => setSearch(e.target.value)}
              style={{ width: "100%", padding: "11px 12px 11px 38px", borderRadius: 10, border: "none", fontSize: 14, boxSizing: "border-box", outline: "none" }} />
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 800, margin: "0 auto", padding: "12px 16px" }}>
        <div style={{ background: "#fdf2f8", border: "1px solid #fbcfe8", borderRadius: 10, padding: 12, marginBottom: 14 }}>
          <p style={{ margin: 0, fontSize: 12, color: "#9d174d", lineHeight: 1.5 }}>
            ⚠️ Hall Ticket के बिना exam में entry नहीं मिलेगी। Exam से कम से कम 1 दिन पहले download करें।
          </p>
        </div>

        {loading ? (
          <div style={{ textAlign: "center", padding: 60, color: "#6b7280" }}>Loading...</div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {filtered.map((c, i) => (
              <div key={c.id || i} style={{ background: "#fff", borderRadius: 12, padding: 16, border: "1px solid #e5e7eb", boxShadow: "0 1px 4px rgba(0,0,0,0.04)" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 10 }}>
                  <div style={{ flex: 1 }}>
                    <p style={{ margin: "0 0 4px", fontWeight: 700, fontSize: 14, color: "#1e3a5f" }}>{c.exam_name || c.title}</p>
                    <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                      <span style={{ fontSize: 11, padding: "2px 8px", background: "#fdf2f8", color: "#be185d", borderRadius: 10, fontWeight: 700 }}>🎟️ Hall Ticket Out</span>
                      {c.exam_date && <span style={{ fontSize: 11, color: "#9ca3af" }}>📅 Exam: {new Date(c.exam_date).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}</span>}
                    </div>
                  </div>
                  {c.download_url && (
                    <a href={c.download_url} target="_blank" rel="noopener noreferrer"
                      style={{ padding: "8px 14px", background: "linear-gradient(135deg,#be185d,#9d174d)", color: "#fff", borderRadius: 8, textDecoration: "none", fontSize: 12, fontWeight: 700, whiteSpace: "nowrap" }}>
                      Download ↗
                    </a>
                  )}
                </div>
              </div>
            ))}
            {filtered.length === 0 && (
              <div style={{ textAlign: "center", padding: 60, color: "#6b7280" }}>
                <div style={{ fontSize: 48 }}>🎟️</div>
                <p>No hall tickets found</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
