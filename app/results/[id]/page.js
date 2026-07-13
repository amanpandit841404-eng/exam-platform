"use client";
import { useState, useEffect } from "react";
import { supabase } from "../../lib/supabase";
import { useParams } from "next/navigation";

export default function ResultDetailPage() {
  const params = useParams();
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (params.id) fetchResult();
  }, [params.id]);

  const fetchResult = async () => {
    try {
      const { data } = await supabase.from("results").select("*").eq("id", params.id).single();
      setResult(data);
      if (data) document.title = `${data.title} - SarkariSetu India`;
    } catch(e) { console.error(e); }
    setLoading(false);
  };

  if (loading) return <div style={{ textAlign: "center", padding: 60, fontFamily: "sans-serif", color: "#6b7280" }}>Loading...</div>;
  if (!result) return <div style={{ textAlign: "center", padding: 60, fontFamily: "sans-serif", color: "#6b7280" }}>Result not found</div>;

  return (
    <div style={{ maxWidth: 700, margin: "0 auto", padding: "0 0 80px", fontFamily: "sans-serif", background: "#f8fafc", minHeight: "100vh" }}>
      {/* Header */}
      <div style={{ background: "linear-gradient(135deg, #16a34a 0%, #15803d 100%)", padding: "20px 16px 28px" }}>
        <a href="/results" style={{ color: "rgba(255,255,255,0.8)", fontSize: 13, textDecoration: "none", display: "block", marginBottom: 12 }}>← Back to Results</a>
        <div style={{ display: "inline-block", background: "rgba(255,255,255,0.2)", borderRadius: 8, padding: "4px 12px", fontSize: 12, color: "#fff", fontWeight: 600, marginBottom: 8 }}>🏆 RESULT DECLARED</div>
        <h1 style={{ fontSize: 20, fontWeight: 800, color: "#fff", margin: "0 0 8px", lineHeight: 1.3 }}>{result.title}</h1>
        {result.exam_name && <p style={{ fontSize: 13, color: "rgba(255,255,255,0.85)", margin: 0 }}>📋 {result.exam_name}</p>}
      </div>

      <div style={{ padding: "16px" }}>
        {/* Main CTA */}
        {result.result_url && (
          <a href={result.result_url} target="_blank" rel="noopener noreferrer"
            style={{ display: "block", background: "linear-gradient(135deg, #16a34a, #15803d)", color: "#fff", borderRadius: 12, padding: 18, textDecoration: "none", textAlign: "center", marginBottom: 16, boxShadow: "0 4px 12px rgba(22,163,74,0.3)" }}>
            <div style={{ fontSize: 28, marginBottom: 4 }}>🏆</div>
            <div style={{ fontSize: 17, fontWeight: 800 }}>Check Your Result</div>
            <div style={{ fontSize: 12, opacity: 0.9, marginTop: 2 }}>Click to visit official result page ↗</div>
          </a>
        )}

        {/* Details card */}
        <div style={{ background: "#fff", borderRadius: 12, padding: 16, marginBottom: 12, border: "1px solid #e5e7eb" }}>
          <h2 style={{ fontSize: 15, fontWeight: 700, color: "#1e3a5f", margin: "0 0 12px" }}>📋 Result Details</h2>
          <table style={{ width: "100%", fontSize: 13, borderCollapse: "collapse" }}>
            <tbody>
              {[
                ["Result Title", result.title],
                ["Exam Name", result.exam_name],
                ["Category", result.category],
                ["Result Date", result.result_date ? new Date(result.result_date).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" }) : null],
                ["Status", result.status || "Declared"],
              ].filter(([,v]) => v).map(([label, value], i) => (
                <tr key={i} style={{ borderBottom: "1px solid #f3f4f6" }}>
                  <td style={{ padding: "8px 4px", color: "#6b7280", width: 130, fontWeight: 500 }}>{label}</td>
                  <td style={{ padding: "8px 4px", color: "#1e3a5f", fontWeight: 600 }}>{value}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Description */}
        {result.description && (
          <div style={{ background: "#fff", borderRadius: 12, padding: 16, marginBottom: 12, border: "1px solid #e5e7eb" }}>
            <h2 style={{ fontSize: 15, fontWeight: 700, color: "#1e3a5f", margin: "0 0 8px" }}>ℹ️ About This Result</h2>
            <p style={{ fontSize: 13, color: "#4b5563", lineHeight: 1.7, margin: 0 }}>{result.description}</p>
          </div>
        )}

        {/* Steps to check */}
        <div style={{ background: "#eff6ff", borderRadius: 12, padding: 16, marginBottom: 12, border: "1px solid #bfdbfe" }}>
          <h2 style={{ fontSize: 15, fontWeight: 700, color: "#1e3a5f", margin: "0 0 12px" }}>📝 Result कैसे देखें</h2>
          {[
            "ऊपर 'Check Your Result' button पर click करें",
            "Official website खुलेगी",
            "अपना Roll Number / Registration Number डालें",
            "Date of Birth डालें",
            "Submit करें और result देखें",
            "Result का screenshot/printout लें"
          ].map((step, i) => (
            <div key={i} style={{ display: "flex", gap: 10, alignItems: "flex-start", marginBottom: 8 }}>
              <span style={{ width: 22, height: 22, borderRadius: "50%", background: "#2563eb", color: "#fff", fontSize: 11, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>{i+1}</span>
              <span style={{ fontSize: 13, color: "#1e3a5f", lineHeight: 1.5 }}>{step}</span>
            </div>
          ))}
        </div>

        {/* Quick links */}
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {[
            { label: "🎫 Admit Cards", href: "/admit-cards" },
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
