"use client";
import { useState, useEffect } from "react";
import { supabase } from "../../lib/supabase";
import { useParams } from "next/navigation";

export default function ExamDetailPage() {
  const params = useParams();
  const [exam, setExam] = useState(null);
  const [updates, setUpdates] = useState([]);
  const [latestResult, setLatestResult] = useState(null);
  const [latestAdmit, setLatestAdmit] = useState(null);
  const [loading, setLoading] = useState(true);
  const [watched, setWatched] = useState(false);

  useEffect(() => {
    const watchlist = JSON.parse(localStorage.getItem("sarkarisetu_watchlist") || "[]");
    setWatched(watchlist.some(w => w.id == params.id));
    if (params.id) { fetchExam(); fetchUpdates(); }
  }, [params.id]);

  const fetchExam = async () => {
    try {
      const { data } = await supabase.from("exams").select("*").eq("id", params.id).single();
      setExam(data);
      if (data) {
        document.title = data.name + " - Official Website, Result, Admit Card | SarkariSetu India";
        // Fetch related result and admit card
        const [rRes, aRes] = await Promise.all([
          supabase.from("results").select("*").ilike("exam_name", `%${data.name.split(" ")[0]}%`).limit(1),
          supabase.from("admit_cards").select("*").ilike("exam_name", `%${data.name.split(" ")[0]}%`).limit(1),
        ]);
        if (rRes.data?.[0]) setLatestResult(rRes.data[0]);
        if (aRes.data?.[0]) setLatestAdmit(aRes.data[0]);
      }
    } catch(e) { console.error(e); }
  };

  const fetchUpdates = async () => {
    try {
      const { data } = await supabase.from("updates").select("*").eq("exam_id", params.id).order("created_at", { ascending: false }).limit(10);
      setUpdates(data || []);
    } catch(e) { console.error(e); }
    setLoading(false);
  };

  const toggleWatch = () => {
    const wl = JSON.parse(localStorage.getItem("sarkarisetu_watchlist") || "[]");
    if (watched) {
      localStorage.setItem("sarkarisetu_watchlist", JSON.stringify(wl.filter(w => w.id != params.id)));
    } else {
      wl.push({ name: exam?.name, id: params.id });
      localStorage.setItem("sarkarisetu_watchlist", JSON.stringify(wl));
    }
    setWatched(!watched);
  };

  const shareWA = () => {
    const text = `${exam?.name} - Official Website & Latest Updates%0A${window.location.href}%0A%0ASarkariSetu India par dekho!`;
    window.open(`https://wa.me/?text=${text}`);
  };

  if (loading) return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "sans-serif" }}>
      <div style={{ textAlign: "center" }}>
        <div style={{ fontSize: 48, marginBottom: 12 }}>⏳</div>
        <p style={{ color: "#6b7280" }}>Loading exam details...</p>
      </div>
    </div>
  );

  if (!exam) return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "sans-serif" }}>
      <div style={{ textAlign: "center" }}>
        <div style={{ fontSize: 48, marginBottom: 12 }}>😕</div>
        <p style={{ color: "#6b7280" }}>Exam not found</p>
        <a href="/" style={{ color: "#2563eb" }}>← Go Home</a>
      </div>
    </div>
  );

  return (
    <div style={{ maxWidth: 700, margin: "0 auto", padding: "0 0 80px", fontFamily: "sans-serif", background: "#f8fafc", minHeight: "100vh" }}>

      {/* HEADER */}
      <div style={{ background: "linear-gradient(135deg, #1e3a5f 0%, #2563eb 100%)", padding: "16px 16px 20px", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: -30, right: -30, width: 150, height: 150, borderRadius: "50%", background: "rgba(255,255,255,0.05)" }} />
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", position: "relative" }}>
          <a href="/" style={{ color: "rgba(255,255,255,0.8)", fontSize: 13, textDecoration: "none" }}>← Home</a>
          <div style={{ display: "flex", gap: 8 }}>
            <button onClick={shareWA} style={{ width: 34, height: 34, borderRadius: "50%", border: "none", background: "#25D366", color: "#fff", cursor: "pointer", fontSize: 16, display: "flex", alignItems: "center", justifyContent: "center" }}>📤</button>
            <button onClick={toggleWatch} style={{ width: 34, height: 34, borderRadius: "50%", border: "none", background: "rgba(255,255,255,0.2)", color: "#fff", cursor: "pointer", fontSize: 16, display: "flex", alignItems: "center", justifyContent: "center" }}>{watched ? "🔔" : "🔕"}</button>
          </div>
        </div>
        <h1 style={{ fontSize: 20, fontWeight: 800, color: "#fff", margin: "10px 0 4px", lineHeight: 1.3, position: "relative" }}>{exam.name}</h1>
        {exam.full_name && exam.full_name !== exam.name && <p style={{ fontSize: 12, color: "rgba(255,255,255,0.8)", margin: "0 0 4px" }}>{exam.full_name}</p>}
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap", position: "relative" }}>
          {exam.category && <span style={{ fontSize: 11, padding: "2px 8px", background: "rgba(255,255,255,0.2)", color: "#fff", borderRadius: 10 }}>{exam.category}</span>}
          {exam.state && <span style={{ fontSize: 11, padding: "2px 8px", background: "rgba(255,255,255,0.2)", color: "#fff", borderRadius: 10 }}>📍 {exam.state}</span>}
        </div>
      </div>

      <div style={{ padding: "14px 16px", display: "flex", flexDirection: "column", gap: 12 }}>

        {/* ===== OFFICIAL WEBSITE - MOST PROMINENT ===== */}
        {exam.official_website && (
          <a href={exam.official_website} target="_blank" rel="noopener noreferrer"
            style={{ display: "block", background: "linear-gradient(135deg, #1e3a5f 0%, #2563eb 100%)", borderRadius: 14, padding: "18px 20px", textDecoration: "none", boxShadow: "0 4px 16px rgba(37,99,235,0.35)", position: "relative", overflow: "hidden" }}>
            <div style={{ position: "absolute", top: -20, right: -20, width: 100, height: 100, borderRadius: "50%", background: "rgba(255,255,255,0.08)" }} />
            <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
              <div style={{ width: 48, height: 48, borderRadius: 12, background: "rgba(255,255,255,0.15)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24, flexShrink: 0 }}>🌐</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 11, color: "rgba(255,255,255,0.75)", fontWeight: 600, marginBottom: 2 }}>OFFICIAL WEBSITE</div>
                <div style={{ fontSize: 16, fontWeight: 800, color: "#fff" }}>Visit Official Site ↗</div>
                <div style={{ fontSize: 11, color: "rgba(255,255,255,0.7)", marginTop: 2, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{exam.official_website}</div>
              </div>
              <div style={{ fontSize: 24, color: "rgba(255,255,255,0.6)" }}>›</div>
            </div>
          </a>
        )}

        {/* QUICK ACTION BUTTONS */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
          <a href={`/check-result/${params.id}`}
            style={{ background: "#fff", borderRadius: 12, padding: "14px 12px", textDecoration: "none", border: "1px solid #e5e7eb", textAlign: "center", boxShadow: "0 1px 4px rgba(0,0,0,0.04)" }}>
            <div style={{ fontSize: 24, marginBottom: 4 }}>🏆</div>
            <div style={{ fontSize: 13, fontWeight: 700, color: "#16a34a" }}>Check Result</div>
            <div style={{ fontSize: 11, color: "#6b7280" }}>Latest result</div>
          </a>
          <a href={`/admit-cards`}
            style={{ background: "#fff", borderRadius: 12, padding: "14px 12px", textDecoration: "none", border: "1px solid #e5e7eb", textAlign: "center", boxShadow: "0 1px 4px rgba(0,0,0,0.04)" }}>
            <div style={{ fontSize: 24, marginBottom: 4 }}>🎫</div>
            <div style={{ fontSize: 13, fontWeight: 700, color: "#ea580c" }}>Admit Card</div>
            <div style={{ fontSize: 11, color: "#6b7280" }}>Download now</div>
          </a>
          <a href={`/syllabus`}
            style={{ background: "#fff", borderRadius: 12, padding: "14px 12px", textDecoration: "none", border: "1px solid #e5e7eb", textAlign: "center", boxShadow: "0 1px 4px rgba(0,0,0,0.04)" }}>
            <div style={{ fontSize: 24, marginBottom: 4 }}>📚</div>
            <div style={{ fontSize: 13, fontWeight: 700, color: "#7c3aed" }}>Syllabus</div>
            <div style={{ fontSize: 11, color: "#6b7280" }}>Full syllabus</div>
          </a>
          <a href={`/cutoff`}
            style={{ background: "#fff", borderRadius: 12, padding: "14px 12px", textDecoration: "none", border: "1px solid #e5e7eb", textAlign: "center", boxShadow: "0 1px 4px rgba(0,0,0,0.04)" }}>
            <div style={{ fontSize: 24, marginBottom: 4 }}>✂️</div>
            <div style={{ fontSize: 13, fontWeight: 700, color: "#0891b2" }}>Cutoff</div>
            <div style={{ fontSize: 11, color: "#6b7280" }}>Category-wise</div>
          </a>
        </div>

        {/* LATEST RESULT CARD */}
        {latestResult && (
          <a href={latestResult.result_url || `/results/${latestResult.id}`} target={latestResult.result_url ? "_blank" : "_self"} rel="noopener noreferrer"
            style={{ display: "block", background: "#f0fdf4", border: "2px solid #86efac", borderRadius: 12, padding: 14, textDecoration: "none" }}>
            <div style={{ fontSize: 11, color: "#16a34a", fontWeight: 800, marginBottom: 4 }}>🏆 RESULT DECLARED</div>
            <div style={{ fontSize: 14, fontWeight: 700, color: "#1e3a5f" }}>{latestResult.title || latestResult.exam_name}</div>
            <div style={{ fontSize: 12, color: "#16a34a", marginTop: 4, fontWeight: 600 }}>Click to check result →</div>
          </a>
        )}

        {/* LATEST ADMIT CARD */}
        {latestAdmit && (
          <a href={latestAdmit.download_url || `/admit-cards/${latestAdmit.id}`} target={latestAdmit.download_url ? "_blank" : "_self"} rel="noopener noreferrer"
            style={{ display: "block", background: "#fff7ed", border: "2px solid #fdba74", borderRadius: 12, padding: 14, textDecoration: "none" }}>
            <div style={{ fontSize: 11, color: "#ea580c", fontWeight: 800, marginBottom: 4 }}>🎫 ADMIT CARD AVAILABLE</div>
            <div style={{ fontSize: 14, fontWeight: 700, color: "#1e3a5f" }}>{latestAdmit.title || latestAdmit.exam_name}</div>
            <div style={{ fontSize: 12, color: "#ea580c", marginTop: 4, fontWeight: 600 }}>Click to download →</div>
          </a>
        )}

        {/* EXAM DETAILS TABLE */}
        <div style={{ background: "#fff", borderRadius: 12, padding: 16, border: "1px solid #e5e7eb" }}>
          <h3 style={{ fontSize: 15, fontWeight: 700, color: "#1e3a5f", margin: "0 0 12px" }}>📋 Exam Details</h3>
          <table style={{ width: "100%", fontSize: 13, borderCollapse: "collapse" }}>
            <tbody>
              {[
                ["Exam Name", exam.name],
                ["Full Name", exam.full_name],
                ["Category", exam.category],
                ["State", exam.state || "National"],
                ["Description", exam.description?.slice(0, 200)],
              ].filter(([,v]) => v).map(([label, value], i) => (
                <tr key={i} style={{ borderBottom: "1px solid #f3f4f6" }}>
                  <td style={{ padding: "8px 4px", color: "#6b7280", width: 110, fontWeight: 500, verticalAlign: "top" }}>{label}</td>
                  <td style={{ padding: "8px 4px", color: "#1e3a5f", fontWeight: 500 }}>{value}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* UPDATES */}
        {updates.length > 0 && (
          <div style={{ background: "#fff", borderRadius: 12, padding: 16, border: "1px solid #e5e7eb" }}>
            <h3 style={{ fontSize: 15, fontWeight: 700, color: "#1e3a5f", margin: "0 0 12px" }}>📢 Latest Updates</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {updates.map((u, i) => (
                <div key={i} style={{ paddingBottom: 10, borderBottom: i < updates.length-1 ? "1px solid #f3f4f6" : "none" }}>
                  <div style={{ display: "flex", gap: 6, marginBottom: 4 }}>
                    <span style={{ fontSize: 11, padding: "1px 6px", background: "#eff6ff", color: "#2563eb", borderRadius: 6, fontWeight: 600 }}>{u.type || "Update"}</span>
                    {u.created_at && <span style={{ fontSize: 11, color: "#9ca3af" }}>{new Date(u.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}</span>}
                  </div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: "#1e3a5f" }}>{u.title}</div>
                  {u.description && <div style={{ fontSize: 12, color: "#6b7280", marginTop: 2 }}>{u.description}</div>}
                  {u.official_link && (
                    <a href={u.official_link} target="_blank" rel="noopener noreferrer"
                      style={{ fontSize: 12, color: "#2563eb", display: "inline-block", marginTop: 4, fontWeight: 600 }}>
                      🔗 Official Link →
                    </a>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* OFFICIAL WEBSITE AGAIN AT BOTTOM */}
        {exam.official_website && (
          <a href={exam.official_website} target="_blank" rel="noopener noreferrer"
            style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, background: "#fff", border: "2px solid #2563eb", borderRadius: 12, padding: 14, textDecoration: "none" }}>
            <span style={{ fontSize: 20 }}>🌐</span>
            <span style={{ fontSize: 14, fontWeight: 700, color: "#2563eb" }}>Visit {exam.name} Official Website ↗</span>
          </a>
        )}

        <div style={{ fontSize: 11, color: "#9ca3af", textAlign: "center" }}>
          ⚡ SarkariSetu India • Not affiliated with any government body
        </div>
      </div>
    </div>
  );
}
