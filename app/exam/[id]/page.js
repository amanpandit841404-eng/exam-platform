"use client";
    import { useState, useEffect } from "react";
    import { supabase } from "../../lib/supabase";
    import { useParams } from "next/navigation";
    export default function ExamDetailPage() {
      const params = useParams();
      const [exam, setExam] = useState(null);
      const [updates, setUpdates] = useState([]);
      const [loading, setLoading] = useState(true);
      useEffect(() => {
        if (params.id) { fetchExam(); fetchUpdates(); }
      }, [params.id]);
      const fetchExam = async () => {
        try {
          const { data } = await supabase.from("exams").select("*").eq("id", params.id).single();
          setExam(data);
        } catch (e) { console.error(e); }
      };
      const fetchUpdates = async () => {
        try {
          const { data } = await supabase.from("updates").select("*").eq("exam_id", params.id).order("created_at", { ascending: false });
          setUpdates(data || []);
        } catch (e) { console.error(e); }
        setLoading(false);
      };
      if (loading) return <div style={{ textAlign: "center", padding: 60, fontFamily: "Arial,sans-serif", color: "#999" }}>Loading...</div>;
      if (!exam) return <div style={{ textAlign: "center", padding: 60, fontFamily: "Arial,sans-serif", color: "#999" }}>Exam not found</div>;
      const typeIcons = { result: "🏆", admit_card: "🎫", syllabus: "📚", answer_key: "🔑", general: "📢" };
      const typeColors = { result: "#16a34a", admit_card: "#ea580c", syllabus: "#7c3aed", answer_key: "#2563eb", general: "#6b7280" };
      const latestResult = updates.find(u => u.update_type === "result");
      const latestAdmit = updates.find(u => u.update_type === "admit_card");
      return (
        <div style={{ fontFamily: "Arial,sans-serif", maxWidth: 800, margin: "0 auto", padding: 12, background: "#f8fafc", minHeight: "100vh" }}>
          <div style={{ background: "linear-gradient(135deg,#1e3a5f,#2563eb)", borderRadius: 14, padding: 20, color: "#fff", marginBottom: 16 }}>
            <h1 style={{ fontSize: 20, fontWeight: 700, margin: 0 }}>{exam.name || exam.full_name}</h1>
            {exam.category && <div style={{ fontSize: 12, opacity: 0.8, marginTop: 4 }}>{exam.category}</div>}
            {exam.state && <div style={{ fontSize: 12, opacity: 0.8 }}>📍 {exam.state}</div>}
          </div>
          {(latestResult || latestAdmit) && (
            <div style={{ marginBottom: 16 }}>
              {latestResult && (
                <a href={latestResult.official_link || "#"} target={latestResult.official_link ? "_blank" : "_self"}
                  style={{ display: "block", background: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: 10, padding: 14, textDecoration: "none", marginBottom: 8 }}>
                  <div style={{ fontSize: 13, color: "#16a34a", fontWeight: 600 }}>🏆 Result Declared</div>
                  <div style={{ fontSize: 15, color: "#1e3a5f", fontWeight: 700, margin: "4px 0" }}>{latestResult.title}</div>
                  <div style={{ fontSize: 13, color: "#2563eb", textDecoration: "underline" }}>🔗 View Result Details →</div>
                </a>
              )}
              {latestAdmit && (
                <a href={latestAdmit.official_link || "#"} target={latestAdmit.official_link ? "_blank" : "_self"}
                  style={{ display: "block", background: "#fff8f0", border: "1px solid #fed7aa", borderRadius: 10, padding: 14, textDecoration: "none" }}>
                  <div style={{ fontSize: 13, color: "#ea580c", fontWeight: 600 }}>🎫 Admit Card Released</div>
                  <div style={{ fontSize: 15, color: "#1e3a5f", fontWeight: 700, margin: "4px 0" }}>{latestAdmit.title}</div>
                  <div style={{ fontSize: 13, color: "#2563eb", textDecoration: "underline" }}>🔗 Download Admit Card →</div>
                </a>
              )}
            </div>
          )}
          {updates.length > 0 && (
            <div style={{ background: "#fff", borderRadius: 12, padding: 16, marginBottom: 12, border: "1px solid #e5e7eb" }}>
              <h3 style={{ fontSize: 15, fontWeight: 700, color: "#1e3a5f", margin: "0 0 10px" }}>📢 Latest Updates</h3>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {updates.slice(0, 10).map(u => (
                  <div key={u.id} style={{ padding: 10, background: "#f9fafb", borderRadius: 8, border: "1px solid #f0f0f0" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 2 }}>
                      <span>{typeIcons[u.update_type] || "📢"}</span>
                      <span style={{ fontSize: 11, padding: "1px 6px", borderRadius: 8, background: typeColors[u.update_type] || "#6b7280", color: "#fff" }}>{u.update_type?.replace("_", " ")}</span>
                    </div>
                    <div style={{ fontSize: 13, fontWeight: 600, color: "#1e3a5f", marginTop: 2 }}>{u.title}</div>
                    {u.description && <div style={{ fontSize: 12, color: "#666", marginTop: 2 }}>{u.description}</div>}
                    {u.official_link && (
                      <a href={u.official_link} target="_blank" rel="noopener noreferrer"
                        style={{ fontSize: 12, color: "#2563eb", display: "inline-block", marginTop: 4, textDecoration: "underline" }}>
                        🔗 Official Link →
                      </a>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
          <div style={{ background: "#fff", borderRadius: 12, padding: 16, border: "1px solid #e5e7eb" }}>
            <h3 style={{ fontSize: 15, fontWeight: 700, color: "#1e3a5f", margin: "0 0 10px" }}>📖 Exam Details</h3>
            <table style={{ width: "100%", fontSize: 13, borderCollapse: "collapse" }}>
              <tbody>
                {[
                  ["Exam Name", exam.name],
                  ["Full Name", exam.full_name],
                  ["Category", exam.category],
                  ["State", exam.state || "National"],
                  ["Description", exam.description?.slice(0, 300)],
                ].map(([label, value], i) => (
                  <tr key={i} style={{ borderBottom: "1px solid #f0f0f0" }}>
                    <td style={{ padding: "8px 4px", color: "#666", width: 120, fontWeight: 500 }}>{label}</td>
                    <td style={{ padding: "8px 4px", color: "#333" }}>{value || "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 16 }}>
            {[{ label:"🏆 Results", href:"/results" },{ label:"🎫 Admit Cards", href:"/admit-cards" },{ label:"📚 Syllabus", href:"/syllabus" },{ label:"🔑 Answer Keys", href:"/answer-keys" },{ label:"📢 Notifications", href:"/notifications" }].map(q => (
              <a key={q.label} href={q.href} style={{ flex:1, minWidth:100, textAlign:"center", padding:"10px 8px", background:"#fff", borderRadius:8, textDecoration:"none", color:"#333", fontSize:12, fontWeight:500, border:"1px solid #e5e7eb" }}>{q.label}</a>
            ))}
          </div>
          <div style={{ marginTop: 20, fontSize: 11, color: "#999", textAlign: "center" }}>SarkariSetu India • Not affiliated with any government body</div>
        </div>
      );
    }
    