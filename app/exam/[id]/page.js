"use client";
    import { useState, useEffect } from "react";
    import { supabase } from "../../lib/supabase";
    import { useParams } from "next/navigation";
    export default function ExamDetailPage() {
      const params = useParams();
      const [exam, setExam] = useState(null);
      const [updates, setUpdates] = useState([]);
      const [loading, setLoading] = useState(true);
      const [watched, setWatched] = useState(false);
      const [lang, setLang] = useState("hi");
  const [dark, setDark] = useState(false);
      useEffect(() => {
        setLang(localStorage.getItem("sarkarisetu_lang") || "hi");
    setDark(localStorage.getItem("sarkarisetu_dark") === "true");
        const watchlist = JSON.parse(localStorage.getItem("sarkarisetu_watchlist") || "[]");
        setWatched(watchlist.some(w => w.id == params.id));
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
        const url = window.location.href;
        window.open(`https://wa.me/?text=${encodeURIComponent("📝 Check " + (exam?.name || "Exam") + " on SarkariSetu: " + url)}`, "_blank");
      };
      const t = (hi, en) => lang === "hi" ? hi : en;
      if (loading) return <div style={{ textAlign: "center", padding: 60, fontFamily: "Arial,sans-serif", color: "#999" }}>Loading...</div>;
      if (!exam) return <div style={{ textAlign: "center", padding: 60, fontFamily: "Arial,sans-serif", color: "#999" }}>Exam not found</div>;
      const typeIcons = { result: "🏆", admit_card: "🎫", syllabus: "📚", answer_key: "🔑", general: "📢" };
      const typeColors = { result: "#16a34a", admit_card: "#ea580c", syllabus: "#7c3aed", answer_key: "#2563eb", general: "#6b7280" };
      const latestResult = updates.find(u => u.update_type === "result");
      const latestAdmit = updates.find(u => u.update_type === "admit_card");
      return (
        <div style={{ fontFamily: "Arial,sans-serif", maxWidth: 800, margin: "0 auto", padding: 12, background: dark ? "#0f172a" : "#f8fafc", minHeight: "100vh" }}>
          <div style={{ background: "linear-gradient(135deg,#1e3a5f,#2563eb)", borderRadius: 14, padding: 20, color: "#fff", marginBottom: 16 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <div style={{ flex: 1 }}>
                <h1 style={{ fontSize: 20, fontWeight: 700, margin: 0 }}>{exam.name || exam.full_name}</h1>
                {exam.category && <div style={{ fontSize: 12, opacity: 0.8, marginTop: 4 }}>{exam.category}</div>}
                {exam.state && <div style={{ fontSize: 12, opacity: 0.8 }}>📍 {exam.state}</div>}
              </div>
              <div style={{ display: "flex", gap: 6 }}>
                <button onClick={shareWA} style={{ width: 36, height: 36, borderRadius: "50%", border: "none", background: "#25D366", color: "#fff", cursor: "pointer", fontSize: 16, display: "flex", alignItems: "center", justifyContent: "center" }}>📱</button>
                <button onClick={toggleWatch} style={{ width: 36, height: 36, borderRadius: "50%", border: "none", background: "rgba(255,255,255,0.2)", color: "#fff", cursor: "pointer", fontSize: 16, display: "flex", alignItems: "center", justifyContent: "center" }}>{watched ? "🔔" : "🔕"}</button>
              </div>
            </div>
            <a href={`/check-result/${params.id}`} style={{ display: "inline-block", marginTop: 8, padding: "6px 14px", background: "rgba(255,255,255,0.2)", color: "#fff", borderRadius: 8, textDecoration: "none", fontSize: 12, fontWeight: 600 }}>🔍 {t("परिणाम देखें", "Check Result")}</a>
            {exam.official_website && (
              <a href={exam.official_website} target="_blank" rel="noopener noreferrer"
                style={{ display: "inline-block", marginTop: 8, marginLeft: 8, padding: "6px 14px", background: "#f59e0b", color: "#fff", borderRadius: 8, textDecoration: "none", fontSize: 12, fontWeight: 600 }}>
                🌐 {t("आधिकारिक वेबसाइट ↗", "Official Website ↗")}
              </a>
            )}
          </div>
          {(latestResult || latestAdmit) && (
            <div style={{ marginBottom: 16 }}>
              {latestResult && (
                <a href={latestResult.official_link || "#"} target={latestResult.official_link ? "_blank" : "_self"}
                  style={{ display: "block", background: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: 10, padding: 14, textDecoration: "none", marginBottom: 8 }}>
                  <div style={{ fontSize: 13, color: "#16a34a", fontWeight: 600 }}>🏆 {t("परिणाम घोषित", "Result Declared")}</div>
                  <div style={{ fontSize: 15, color: "#1e3a5f", fontWeight: 700, margin: "4px 0" }}>{latestResult.title}</div>
                  <div style={{ fontSize: 13, color: "#2563eb", textDecoration: "underline" }}>🔗 {t("परिणाम देखें →", "View Result →")}</div>
                </a>
              )}
              {latestAdmit && (
                <a href={latestAdmit.official_link || "#"} target={latestAdmit.official_link ? "_blank" : "_self"}
                  style={{ display: "block", background: "#fff8f0", border: "1px solid #fed7aa", borderRadius: 10, padding: 14, textDecoration: "none" }}>
                  <div style={{ fontSize: 13, color: "#ea580c", fontWeight: 600 }}>🎫 {t("प्रवेश पत्र जारी", "Admit Card Released")}</div>
                  <div style={{ fontSize: 15, color: "#1e3a5f", fontWeight: 700, margin: "4px 0" }}>{latestAdmit.title}</div>
                  <div style={{ fontSize: 13, color: "#2563eb", textDecoration: "underline" }}>🔗 {t("डाउनलोड करें →", "Download →")}</div>
                </a>
              )}
            </div>
          )}
          {updates.length > 0 && (
            <div style={{ background: dark ? "#1e293b" : "#ffffff", borderRadius: 12, padding: 16, marginBottom: 12, border: dark ? "1px solid #334155" : "1px solid #e5e7eb" }}>
              <h3 style={{ fontSize: 15, fontWeight: 700, color: dark ? "#e2e8f0" : "#151515", margin: "0 0 10px" }}>📢 {t("नवीनतम अपडेट", "Latest Updates")}</h3>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {updates.slice(0, 10).map(u => (
                  <div key={u.id} style={{ padding: 10, background: dark ? "#0f172a" : "#f8fafc", borderRadius: 8, border: dark ? "1px solid #334155" : "1px solid #e5e7eb" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 2 }}>
                      <span>{typeIcons[u.update_type] || "📢"}</span>
                      <span style={{ fontSize: 11, padding: "1px 6px", borderRadius: 8, background: typeColors[u.update_type] || "#6b7280", color: "#fff" }}>{u.update_type?.replace("_", " ")}</span>
                    </div>
                    <div style={{ fontSize: 13, fontWeight: 600, color: dark ? "#e2e8f0" : "#151515", marginTop: 2 }}>{u.title}</div>
                    {u.description && <div style={{ fontSize: 12, color: dark ? "#94a3b8" : "#717171", marginTop: 2 }}>{u.description}</div>}
                    {u.official_link && (
                      <a href={u.official_link} target="_blank" rel="noopener noreferrer"
                        style={{ fontSize: 12, color: "#2563eb", display: "inline-block", marginTop: 4, textDecoration: "underline" }}>
                        🔗 {t("आधिकारिक लिंक →", "Official Link →")}
                      </a>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
          <div style={{ background: dark ? "#1e293b" : "#ffffff", borderRadius: 12, padding: 16, border: dark ? "1px solid #334155" : "1px solid #e5e7eb" }}>
            <h3 style={{ fontSize: 15, fontWeight: 700, color: dark ? "#e2e8f0" : "#151515", margin: "0 0 10px" }}>📖 {t("परीक्षा विवरण", "Exam Details")}</h3>
            <table style={{ width: "100%", fontSize: 13, borderCollapse: "collapse" }}>
              <tbody>
                {[
                  [t("परीक्षा का नाम", "Exam Name"), exam.name],
                  [t("पूरा नाम", "Full Name"), exam.full_name],
                  [t("श्रेणी", "Category"), exam.category],
                  [t("राज्य", "State"), exam.state || t("राष्ट्रीय", "National")],
                  [t("विवरण", "Description"), exam.description?.slice(0, 300)],
                ].map(([label, value], i) => (
                  <tr key={i} style={{ borderBottom: dark ? "1px solid #334155" : "1px solid #e5e7eb" }}>
                    <td style={{ padding: "8px 4px", color: dark ? "#94a3b8" : "#717171", width: 120, fontWeight: 500 }}>{label}</td>
                    <td style={{ padding: "8px 4px", color: dark ? "#e2e8f0" : "#151515" }}>{value || "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 16 }}>
            {[{ label: "🏆 "+t("परिणाम","Results"), href:"/results" },{ label: "🎫 "+t("प्रवेश पत्र","Admit Cards"), href:"/admit-cards" },{ label: "📚 "+t("सिलेबस","Syllabus"), href:"/syllabus" },{ label: "🔑 "+t("उत्तर कुंजी","Answer Keys"), href:"/answer-keys" }].map(q => (
              <a key={q.label} href={q.href} style={{ flex:1, minWidth:100, textAlign:"center", padding:"10px 8px", background:dark ? "#1e293b" : "#ffffff", borderRadius:8, textDecoration:"none", color:dark ? "#e2e8f0" : "#151515", fontSize:12, fontWeight:500, border:dark ? "1px solid #334155" : "1px solid #e5e7eb" }}>{q.label}</a>
            ))}
          </div>
          <div style={{ marginTop: 20, fontSize: 11, color: dark ? "#94a3b8" : "#717171", textAlign: "center" }}>
            ⚡ SarkariSetu India • {t("सरकारी निकाय से संबद्ध नहीं","Not affiliated with any government body")}
          </div>
        </div>
      );
    }
    