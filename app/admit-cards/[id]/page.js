"use client";
import { useState, useEffect } from "react";
import { supabase } from "../../lib/supabase";
import { useParams } from "next/navigation";

export default function AdmitCardDetailPage() {
  const params = useParams();
  const [card, setCard] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (params.id) fetchCard();
  }, [params.id]);

  const fetchCard = async () => {
    try {
      const { data } = await supabase.from("admit_cards").select("*").eq("id", params.id).single();
      setCard(data);
      if (data) document.title = `${data.title} Admit Card - SarkariSetu India`;
    } catch(e) { console.error(e); }
    setLoading(false);
  };

  if (loading) return <div style={{ textAlign: "center", padding: 60, fontFamily: "sans-serif", color: "#6b7280" }}>Loading...</div>;
  if (!card) return <div style={{ textAlign: "center", padding: 60, fontFamily: "sans-serif", color: "#6b7280" }}>Admit Card not found</div>;

  return (
    <div style={{ maxWidth: 700, margin: "0 auto", padding: "0 0 80px", fontFamily: "sans-serif", background: "#f8fafc", minHeight: "100vh" }}>
      {/* Header */}
      <div style={{ background: "linear-gradient(135deg, #ea580c 0%, #dc2626 100%)", padding: "20px 16px 28px" }}>
        <a href="/admit-cards" style={{ color: "rgba(255,255,255,0.8)", fontSize: 13, textDecoration: "none", display: "block", marginBottom: 12 }}>← Back to Admit Cards</a>
        <div style={{ display: "inline-block", background: "rgba(255,255,255,0.2)", borderRadius: 8, padding: "4px 12px", fontSize: 12, color: "#fff", fontWeight: 600, marginBottom: 8 }}>🎫 ADMIT CARD RELEASED</div>
        <h1 style={{ fontSize: 20, fontWeight: 800, color: "#fff", margin: "0 0 8px", lineHeight: 1.3 }}>{card.title}</h1>
        {card.exam_name && <p style={{ fontSize: 13, color: "rgba(255,255,255,0.85)", margin: 0 }}>📋 {card.exam_name}</p>}
      </div>

      <div style={{ padding: "16px" }}>
        {/* Main CTA */}
        {card.download_url && (
          <a href={card.download_url} target="_blank" rel="noopener noreferrer"
            style={{ display: "block", background: "linear-gradient(135deg, #ea580c, #dc2626)", color: "#fff", borderRadius: 12, padding: 18, textDecoration: "none", textAlign: "center", marginBottom: 16, boxShadow: "0 4px 12px rgba(234,88,12,0.3)" }}>
            <div style={{ fontSize: 28, marginBottom: 4 }}>⬇️</div>
            <div style={{ fontSize: 17, fontWeight: 800 }}>Download Admit Card</div>
            <div style={{ fontSize: 12, opacity: 0.9, marginTop: 2 }}>Click to download from official website ↗</div>
          </a>
        )}

        {/* Details */}
        <div style={{ background: "#fff", borderRadius: 12, padding: 16, marginBottom: 12, border: "1px solid #e5e7eb" }}>
          <h2 style={{ fontSize: 15, fontWeight: 700, color: "#1e3a5f", margin: "0 0 12px" }}>📋 Admit Card Details</h2>
          <table style={{ width: "100%", fontSize: 13, borderCollapse: "collapse" }}>
            <tbody>
              {[
                ["Title", card.title],
                ["Exam Name", card.exam_name],
                ["Category", card.category],
                ["Exam Date", card.exam_date ? new Date(card.exam_date).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" }) : null],
                ["Release Date", card.release_date ? new Date(card.release_date).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" }) : null],
                ["Status", card.status || "Available"],
              ].filter(([,v]) => v).map(([label, value], i) => (
                <tr key={i} style={{ borderBottom: "1px solid #f3f4f6" }}>
                  <td style={{ padding: "8px 4px", color: "#6b7280", width: 130, fontWeight: 500 }}>{label}</td>
                  <td style={{ padding: "8px 4px", color: "#1e3a5f", fontWeight: 600 }}>{value}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Steps */}
        <div style={{ background: "#fff8f0", borderRadius: 12, padding: 16, marginBottom: 12, border: "1px solid #fed7aa" }}>
          <h2 style={{ fontSize: 15, fontWeight: 700, color: "#ea580c", margin: "0 0 12px" }}>📝 Admit Card कैसे Download करें</h2>
          {[
            "ऊपर 'Download Admit Card' button पर click करें",
            "Official website खुलेगी",
            "Registration Number / Roll Number डालें",
            "Date of Birth / Password डालें",
            "Submit करें",
            "Admit Card download करें और print निकालें",
            "Exam center, date, time ध्यान से पढ़ें"
          ].map((step, i) => (
            <div key={i} style={{ display: "flex", gap: 10, alignItems: "flex-start", marginBottom: 8 }}>
              <span style={{ width: 22, height: 22, borderRadius: "50%", background: "#ea580c", color: "#fff", fontSize: 11, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>{i+1}</span>
              <span style={{ fontSize: 13, color: "#1e3a5f", lineHeight: 1.5 }}>{step}</span>
            </div>
          ))}
        </div>

        {/* Important note */}
        <div style={{ background: "#fef2f2", borderRadius: 12, padding: 14, marginBottom: 16, border: "1px solid #fecaca" }}>
          <h3 style={{ fontSize: 13, fontWeight: 700, color: "#dc2626", margin: "0 0 6px" }}>⚠️ Important Note</h3>
          <p style={{ fontSize: 12, color: "#4b5563", margin: 0, lineHeight: 1.6 }}>
            Admit Card के बिना exam hall में entry नहीं मिलेगी। 
            Admit Card का printout लेकर जाएं। साथ में valid Photo ID (Aadhar/PAN) भी लेकर जाएं।
          </p>
        </div>

        {/* Quick links */}
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {[
            { label: "🏆 Results", href: "/results" },
            { label: "📚 Syllabus", href: "/syllabus" },
            { label: "🔑 Answer Keys", href: "/answer-keys" },
            { label: "🏠 Home", href: "/" }
          ].map(q => (
            <a key={q.href} href={q.href} style={{ flex: 1, minWidth: 100, textAlign: "center", padding: "10px 8px", background: "#fff", borderRadius: 8, textDecoration: "none", color: "#1e3a5f", fontSize: 12, fontWeight: 600, border: "1px solid #e5e7eb" }}>{q.label}</a>
          ))}
        </div>
      </div>
    </div>
  );
}
