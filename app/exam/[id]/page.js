"use client";
    import { useState, useEffect } from "react";
    import { supabase } from "../../lib/supabase";
    import { useParams } from "next/navigation";

    const studyCatSlug = (category) => {
      const c = (category || "").toLowerCase();
      if (c.includes("professional certification")) return null;
      if (c.includes("ssc")) return "ssc";
      if (c.includes("upsc")) return "upsc";
      if (c.includes("bank") || c.includes("ibps") || c.includes("rbi") || c.includes("nabard")) return "banking";
      if (c.includes("rrb") || c.includes("rrc") || c.includes("rpf") || c.includes("railway")) return "railway";
      if (c.includes("psc") || c.includes("state public")) return "state-psc";
      if (c.includes("defen") || c.includes("army") || c.includes("navy") || c.includes("air force") || c.includes("nda") || c.includes("cds")) return "defence";
      if (c.includes("teach") || c.includes("tet") || c.includes("kvs") || c.includes("nvs") || c.includes("dsssb")) return "teaching";
      if (c.includes("police")) return "police";
      if (c.includes("engineer") || c.includes("gate") || c.includes("jee")) return "engineering";
      if (c.includes("medical") || c.includes("neet") || c.includes("nursing") || c.includes("pharma")) return "medical";
      if (c.includes("law") || c.includes("court") || c.includes("judic") || c.includes("clat")) return "law";
      if (c.includes("agriculture") || c.includes("icar")) return "agriculture";
      if (c.includes("university") || c.includes("cuet")) return "university-admission";
      return null;
    };

    const slugify = (s) => (s || "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

    export default function ExamPage() {
      const { id } = useParams();
      const [exam, setExam] = useState(null);
      const [loading, setLoading] = useState(true);
      const [results, setResults] = useState([]);
      const [admitCards, setAdmitCards] = useState([]);
      const [updates, setUpdates] = useState([]);
      const [studyData, setStudyData] = useState(null);
      const [activeTab, setActiveTab] = useState("overview");

      useEffect(() => {
        if (id) fetchExam();
      }, [id]);

      const fetchExam = async () => {
        setLoading(true);
        try {
          const { data } = await supabase.from("exams").select("*").eq("id", id).single();
          if (data) {
            setExam(data);
            document.title = data.name + " 2026 — Notification, Dates, Result, Admit Card | SarkariSetu India";
            fetchRelated(data);
            fetchStudy(data);
          }
        } catch (e) { console.error(e); }
        setLoading(false);
      };

      const fetchRelated = async (data) => {
        try {
          const keyword = data.name.split(" ").slice(0, 3).join(" ");
          const [rRes, aRes, uRes] = await Promise.all([
            supabase.from("results").select("*").ilike("exam_name", `%${keyword}%`).order("id", { ascending: false }).limit(5),
            supabase.from("admit_cards").select("*").ilike("exam_name", `%${keyword}%`).order("id", { ascending: false }).limit(5),
            supabase.from("updates").select("*").or(`title.ilike.%${keyword}%,exam_id.eq.${data.id}`).order("id", { ascending: false }).limit(10),
          ]);
          if (rRes.data) setResults(rRes.data);
          if (aRes.data) setAdmitCards(aRes.data);
          if (uRes.data) setUpdates(uRes.data);
        } catch (e) { console.error(e); }
      };

      const fetchStudy = async (exam) => {
        try {
          const slug = studyCatSlug(exam.category);
          if (!slug) return;
          const res = await fetch("/exams-data/" + slug + ".json");
          const j = await res.json();
          const entries = j.entries || {};
          const name = exam.name || "";
          let match = entries[name];
          if (!match) {
            const keys = Object.keys(entries).sort((a, b) => b.length - a.length);
            for (const k of keys) {
              if (name.startsWith(k) || k.startsWith(name)) { match = entries[k]; break; }
            }
          }
          setStudyData(match || j.default || null);
        } catch (e) {}
      };

      if (loading) return (
        <div style={{ minHeight: "100vh", background: "#f8fafc", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: 40, marginBottom: 12 }}>⏳</div>
            <p style={{ color: "#64748b", fontSize: 14 }}>Loading exam details...</p>
          </div>
        </div>
      );

      if (!exam) return (
        <div style={{ minHeight: "100vh", background: "#f8fafc", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: 40, marginBottom: 12 }}>❌</div>
            <p style={{ color: "#64748b", fontSize: 14 }}>Exam not found</p>
            <a href="/" style={{ color: "#2563eb", fontSize: 13 }}>← Back to Home</a>
          </div>
        </div>
      );

      const catSlug = slugify(exam.category || "");
      const tabs = [
        { key: "overview", label: "📋 Overview" },
        { key: "dates", label: "📅 Dates" },
        { key: "eligibility", label: "🎓 Eligibility" },
        { key: "syllabus", label: "📚 Syllabus" },
        { key: "admit", label: "🎫 Admit Card" },
        { key: "result", label: "🏆 Result" },
        { key: "updates", label: "🔔 Updates" },
      ];

      // Parse study data fields
      const fees = studyData?.fees || null;
      const examPattern = studyData?.format || null;
      const officialSite = exam.official_website || studyData?.site || null;

      // Notification/dates from updates
      const notifUpdate = updates.find(u => u.update_type === "notification" || (u.title || "").toLowerCase().includes("notif"));
      const dateUpdate = updates.find(u => (u.title || "").toLowerCase().includes("date") || u.update_type === "exam_date");
      const answerKeyUpdate = updates.find(u => u.update_type === "answer_key" || (u.title || "").toLowerCase().includes("answer key"));
      const cutoffUpdate = updates.find(u => u.update_type === "cutoff" || (u.title || "").toLowerCase().includes("cutoff") || (u.title || "").toLowerCase().includes("cut off"));
      const syllabusUpdate = updates.find(u => u.update_type === "syllabus" || (u.title || "").toLowerCase().includes("syllabus"));
      const vacancyUpdate = updates.find(u => (u.title || "").toLowerCase().includes("vacanc") || (u.title || "").toLowerCase().includes("post") || u.update_type === "notification");

      const cardStyle = { background: "#fff", borderRadius: 14, padding: "18px 20px", marginBottom: 14, border: "1px solid #e5e7eb", boxShadow: "0 1px 4px rgba(0,0,0,0.05)" };
      const sectionTitle = (icon, title) => (
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
          <span style={{ fontSize: 20 }}>{icon}</span>
          <h2 style={{ margin: 0, fontSize: 17, fontWeight: 700, color: "#1e3a5f" }}>{title}</h2>
        </div>
      );

      const infoRow = (label, value, link) => value ? (
        <div style={{ display: "flex", gap: 10, padding: "9px 0", borderBottom: "1px solid #f1f5f9", alignItems: "flex-start" }}>
          <span style={{ fontSize: 12, color: "#64748b", minWidth: 130, fontWeight: 600 }}>{label}</span>
          {link ? <a href={link} target="_blank" rel="noopener noreferrer" style={{ fontSize: 13, color: "#2563eb", fontWeight: 600, wordBreak: "break-all" }}>{value} ↗</a>
            : <span style={{ fontSize: 13, color: "#1e3a5f", fontWeight: 500 }}>{value}</span>}
        </div>
      ) : null;

      const tagBadge = (text, color) => (
        <span style={{ background: color + "18", color, padding: "3px 10px", borderRadius: 20, fontSize: 11, fontWeight: 700, marginRight: 6, marginBottom: 4, display: "inline-block" }}>{text}</span>
      );

      return (
        <div style={{ minHeight: "100vh", background: "#f8fafc", paddingBottom: 100 }}>
          {/* Hero Header */}
          <div style={{ background: "linear-gradient(135deg, #1e3a5f, #2563eb)", padding: "24px 16px 20px", color: "#fff" }}>
            <div style={{ maxWidth: 720, margin: "0 auto" }}>
              <a href={catSlug ? `/category/${catSlug}` : "/"} style={{ color: "#93c5fd", fontSize: 12, textDecoration: "none", display: "block", marginBottom: 8 }}>
                ← {exam.category || "All Exams"}
              </a>
              <h1 style={{ margin: "0 0 8px", fontSize: 22, fontWeight: 800, lineHeight: 1.3 }}>{exam.name}</h1>
              {exam.full_name && exam.full_name !== exam.name && (
                <p style={{ margin: "0 0 10px", fontSize: 13, color: "#bfdbfe", lineHeight: 1.4 }}>{exam.full_name}</p>
              )}
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 8 }}>
                {exam.category && tagBadge(exam.category, "#60a5fa")}
                {exam.state && tagBadge(exam.state, "#34d399")}
                {exam.is_active ? tagBadge("🟢 Active", "#4ade80") : tagBadge("⚪ Inactive", "#94a3b8")}
              </div>
            </div>
          </div>

          {/* Quick Action Buttons */}
          <div style={{ background: "#fff", borderBottom: "1px solid #e5e7eb", padding: "12px 16px", overflowX: "auto" }}>
            <div style={{ maxWidth: 720, margin: "0 auto", display: "flex", gap: 8, flexWrap: "nowrap", minWidth: "max-content" }}>
              {officialSite && (
                <a href={officialSite} target="_blank" rel="noopener noreferrer"
                  style={{ padding: "8px 16px", background: "#2563eb", color: "#fff", borderRadius: 8, fontSize: 12, fontWeight: 700, textDecoration: "none", whiteSpace: "nowrap" }}>
                  🔗 Apply / Official Site
                </a>
              )}
              {notifUpdate?.official_link && (
                <a href={notifUpdate.official_link} target="_blank" rel="noopener noreferrer"
                  style={{ padding: "8px 16px", background: "#16a34a", color: "#fff", borderRadius: 8, fontSize: 12, fontWeight: 700, textDecoration: "none", whiteSpace: "nowrap" }}>
                  📝 Notification PDF
                </a>
              )}
              {admitCards[0]?.download_url && (
                <a href={admitCards[0].download_url} target="_blank" rel="noopener noreferrer"
                  style={{ padding: "8px 16px", background: "#ea580c", color: "#fff", borderRadius: 8, fontSize: 12, fontWeight: 700, textDecoration: "none", whiteSpace: "nowrap" }}>
                  🎫 Download Admit Card
                </a>
              )}
              {results[0]?.result_url && (
                <a href={results[0].result_url} target="_blank" rel="noopener noreferrer"
                  style={{ padding: "8px 16px", background: "#7c3aed", color: "#fff", borderRadius: 8, fontSize: 12, fontWeight: 700, textDecoration: "none", whiteSpace: "nowrap" }}>
                  🏆 Check Result
                </a>
              )}
              {answerKeyUpdate?.official_link && (
                <a href={answerKeyUpdate.official_link} target="_blank" rel="noopener noreferrer"
                  style={{ padding: "8px 16px", background: "#0891b2", color: "#fff", borderRadius: 8, fontSize: 12, fontWeight: 700, textDecoration: "none", whiteSpace: "nowrap" }}>
                  🔑 Answer Key
                </a>
              )}
            </div>
          </div>

          {/* Tab Navigation */}
          <div style={{ background: "#fff", borderBottom: "1px solid #e5e7eb", overflowX: "auto" }}>
            <div style={{ maxWidth: 720, margin: "0 auto", display: "flex", minWidth: "max-content" }}>
              {tabs.map(t => (
                <button key={t.key} onClick={() => setActiveTab(t.key)}
                  style={{ padding: "12px 16px", border: "none", background: "none", fontSize: 12, fontWeight: activeTab === t.key ? 700 : 500,
                    color: activeTab === t.key ? "#2563eb" : "#64748b", borderBottom: activeTab === t.key ? "2px solid #2563eb" : "2px solid transparent",
                    cursor: "pointer", whiteSpace: "nowrap" }}>
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          <div style={{ maxWidth: 720, margin: "0 auto", padding: "20px 16px" }}>

            {/* OVERVIEW TAB */}
            {activeTab === "overview" && (
              <>
                {/* Key Info Card */}
                <div style={cardStyle}>
                  {sectionTitle("📋", "Exam Overview")}
                  {infoRow("📝 Exam Name", exam.full_name || exam.name)}
                  {infoRow("🏛️ Conducting Body", exam.category)}
                  {infoRow("📍 State / Level", exam.state || "National Level")}
                  {infoRow("💰 Application Fee", fees || "Official website देखें")}
                  {infoRow("📄 Vacancy", vacancyUpdate ? vacancyUpdate.title : null)}
                  {infoRow("🌐 Official Website", officialSite, officialSite)}
                  {exam.description && (
                    <div style={{ marginTop: 10, padding: "10px 0", borderTop: "1px solid #f1f5f9" }}>
                      <p style={{ margin: 0, fontSize: 13, color: "#475569", lineHeight: 1.6 }}>{exam.description}</p>
                    </div>
                  )}
                </div>

                {/* Latest Updates */}
                {updates.length > 0 && (
                  <div style={cardStyle}>
                    {sectionTitle("🔔", "Latest Updates")}
                    {updates.slice(0, 5).map((u, i) => (
                      <div key={i} style={{ display: "flex", gap: 10, padding: "8px 0", borderBottom: i < 4 ? "1px solid #f1f5f9" : "none", alignItems: "flex-start" }}>
                        <span style={{ fontSize: 16, flexShrink: 0 }}>
                          {u.update_type === "result" ? "🏆" : u.update_type === "admit_card" ? "🎫" : u.update_type === "answer_key" ? "🔑" : u.update_type === "notification" ? "📝" : "🔔"}
                        </span>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontSize: 13, fontWeight: 600, color: "#1e3a5f" }}>{u.title}</div>
                          {u.description && <div style={{ fontSize: 11, color: "#64748b", marginTop: 2 }}>{u.description.slice(0, 100)}</div>}
                          {u.official_link && <a href={u.official_link} target="_blank" rel="noopener noreferrer" style={{ fontSize: 11, color: "#2563eb" }}>View ↗</a>}
                        </div>
                        {u.publish_date && <span style={{ fontSize: 10, color: "#94a3b8", flexShrink: 0 }}>{u.publish_date}</span>}
                      </div>
                    ))}
                  </div>
                )}

                {/* Exam Pattern */}
                {examPattern && (
                  <div style={cardStyle}>
                    {sectionTitle("🧠", "Exam Pattern")}
                    <p style={{ margin: 0, fontSize: 13, color: "#475569", lineHeight: 1.7 }}>{examPattern}</p>
                  </div>
                )}
              </>
            )}

            {/* DATES TAB */}
            {activeTab === "dates" && (
              <div style={cardStyle}>
                {sectionTitle("📅", "Important Dates")}
                <div style={{ background: "#fef9c3", border: "1px solid #fde047", borderRadius: 10, padding: "10px 14px", marginBottom: 14, fontSize: 12, color: "#854d0e" }}>
                  ⚠️ Dates official website से verify करें। यहाँ दी गई dates approximate हैं।
                </div>
                {exam.exam_date && infoRow("📅 Exam Date", new Date(exam.exam_date).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" }))}
                {dateUpdate && infoRow("📅 " + (dateUpdate.title || "Important Date"), dateUpdate.description || dateUpdate.title, dateUpdate.official_link)}
                {notifUpdate && infoRow("📝 Notification", notifUpdate.title, notifUpdate.official_link)}
                {updates.filter(u => (u.title || "").toLowerCase().includes("date") || (u.title || "").toLowerCase().includes("schedule")).slice(0, 5).map((u, i) => (
                  <div key={i}>{infoRow("📌 " + (u.update_type || "Update"), u.title, u.official_link)}</div>
                ))}
                {!exam.exam_date && updates.filter(u => (u.title || "").toLowerCase().includes("date")).length === 0 && (
                  <div style={{ textAlign: "center", padding: 20, color: "#94a3b8", fontSize: 13 }}>
                    <p>📅 Dates अभी announce नहीं हुई हैं।</p>
                    {officialSite && <a href={officialSite} target="_blank" rel="noopener noreferrer" style={{ color: "#2563eb", fontSize: 12 }}>Official website check करें ↗</a>}
                  </div>
                )}
              </div>
            )}

            {/* ELIGIBILITY TAB */}
            {activeTab === "eligibility" && (
              <>
                <div style={cardStyle}>
                  {sectionTitle("🎓", "Eligibility Criteria")}
                  <div style={{ background: "#eff6ff", border: "1px solid #bfdbfe", borderRadius: 10, padding: "10px 14px", marginBottom: 14, fontSize: 12, color: "#1e40af" }}>
                    ℹ️ Exact eligibility official notification से confirm करें।
                  </div>
                  {studyData?.overview && (
                    <p style={{ fontSize: 13, color: "#475569", lineHeight: 1.7, marginBottom: 12 }}>{studyData.overview.slice(0, 400)}</p>
                  )}
                  {infoRow("💰 Application Fee", fees)}
                  {infoRow("⏳ Certificate Validity", studyData?.validity)}
                  {officialSite && infoRow("🌐 Official Site", officialSite, officialSite)}
                  {!studyData && (
                    <div style={{ textAlign: "center", padding: 20, color: "#94a3b8", fontSize: 13 }}>
                      <p>Eligibility details के लिए official notification देखें।</p>
                      {officialSite && <a href={officialSite} target="_blank" rel="noopener noreferrer" style={{ color: "#2563eb", fontSize: 12 }}>Official website ↗</a>}
                    </div>
                  )}
                </div>
              </>
            )}

            {/* SYLLABUS TAB */}
            {activeTab === "syllabus" && (
              <div style={cardStyle}>
                {sectionTitle("📚", "Syllabus & Exam Pattern")}
                {syllabusUpdate && (
                  <div style={{ background: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: 10, padding: "10px 14px", marginBottom: 14 }}>
                    <div style={{ fontSize: 13, fontWeight: 600, color: "#166534" }}>{syllabusUpdate.title}</div>
                    {syllabusUpdate.official_link && <a href={syllabusUpdate.official_link} target="_blank" rel="noopener noreferrer" style={{ fontSize: 12, color: "#16a34a" }}>Download Syllabus PDF ↗</a>}
                  </div>
                )}
                {examPattern && (
                  <div style={{ marginBottom: 14 }}>
                    <div style={{ fontSize: 13, fontWeight: 700, color: "#1e3a5f", marginBottom: 6 }}>🧠 Exam Pattern</div>
                    <p style={{ margin: 0, fontSize: 13, color: "#475569", lineHeight: 1.7 }}>{examPattern}</p>
                  </div>
                )}
                {studyData?.overview && (
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 700, color: "#1e3a5f", marginBottom: 6 }}>📖 About This Exam</div>
                    <p style={{ margin: 0, fontSize: 13, color: "#475569", lineHeight: 1.7 }}>{studyData.overview}</p>
                  </div>
                )}
                {!syllabusUpdate && !examPattern && !studyData && (
                  <div style={{ textAlign: "center", padding: 20, color: "#94a3b8", fontSize: 13 }}>
                    <p>Syllabus के लिए official website देखें।</p>
                    {officialSite && <a href={officialSite} target="_blank" rel="noopener noreferrer" style={{ color: "#2563eb", fontSize: 12 }}>Official website ↗</a>}
                  </div>
                )}
              </div>
            )}

            {/* ADMIT CARD TAB */}
            {activeTab === "admit" && (
              <div style={cardStyle}>
                {sectionTitle("🎫", "Admit Card")}
                {admitCards.length > 0 ? admitCards.map((a, i) => (
                  <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 0", borderBottom: i < admitCards.length - 1 ? "1px solid #f1f5f9" : "none", gap: 10 }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 13, fontWeight: 600, color: "#1e3a5f" }}>{a.title || a.exam_name}</div>
                      {a.active_from && <div style={{ fontSize: 11, color: "#64748b", marginTop: 2 }}>Available from: {a.active_from}</div>}
                      {a.active_to && <div style={{ fontSize: 11, color: "#dc2626", marginTop: 1 }}>Last date: {a.active_to}</div>}
                    </div>
                    {a.download_url && (
                      <a href={a.download_url} target="_blank" rel="noopener noreferrer"
                        style={{ padding: "7px 14px", background: "#ea580c", color: "#fff", borderRadius: 8, fontSize: 12, fontWeight: 700, textDecoration: "none", whiteSpace: "nowrap" }}>
                        Download ↗
                      </a>
                    )}
                  </div>
                )) : (
                  <div style={{ textAlign: "center", padding: 20, color: "#94a3b8", fontSize: 13 }}>
                    <p>🎫 Admit Card अभी available नहीं है।</p>
                    {officialSite && <a href={officialSite} target="_blank" rel="noopener noreferrer" style={{ color: "#2563eb", fontSize: 12 }}>Official website check करें ↗</a>}
                  </div>
                )}
              </div>
            )}

            {/* RESULT TAB */}
            {activeTab === "result" && (
              <>
                <div style={cardStyle}>
                  {sectionTitle("🏆", "Results")}
                  {results.length > 0 ? results.map((r, i) => (
                    <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 0", borderBottom: i < results.length - 1 ? "1px solid #f1f5f9" : "none", gap: 10 }}>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: 13, fontWeight: 600, color: "#1e3a5f" }}>{r.result_title || r.exam_name}</div>
                        {r.result_date && <div style={{ fontSize: 11, color: "#64748b", marginTop: 2 }}>Date: {r.result_date}</div>}
                        <span style={{ fontSize: 10, background: r.status === "published" ? "#dcfce7" : "#fef9c3", color: r.status === "published" ? "#166534" : "#854d0e", padding: "2px 8px", borderRadius: 10, fontWeight: 600 }}>
                          {r.status || "expected"}
                        </span>
                      </div>
                      {r.result_url && (
                        <a href={r.result_url} target="_blank" rel="noopener noreferrer"
                          style={{ padding: "7px 14px", background: "#7c3aed", color: "#fff", borderRadius: 8, fontSize: 12, fontWeight: 700, textDecoration: "none", whiteSpace: "nowrap" }}>
                          Check ↗
                        </a>
                      )}
                    </div>
                  )) : (
                    <div style={{ textAlign: "center", padding: 20, color: "#94a3b8", fontSize: 13 }}>
                      <p>🏆 Result अभी declare नहीं हुआ।</p>
                      {officialSite && <a href={officialSite} target="_blank" rel="noopener noreferrer" style={{ color: "#2563eb", fontSize: 12 }}>Official website check करें ↗</a>}
                    </div>
                  )}
                </div>
                {cutoffUpdate && (
                  <div style={cardStyle}>
                    {sectionTitle("📊", "Cut Off")}
                    <div style={{ fontSize: 13, fontWeight: 600, color: "#1e3a5f", marginBottom: 6 }}>{cutoffUpdate.title}</div>
                    {cutoffUpdate.description && <p style={{ margin: "0 0 8px", fontSize: 13, color: "#475569" }}>{cutoffUpdate.description}</p>}
                    {cutoffUpdate.official_link && <a href={cutoffUpdate.official_link} target="_blank" rel="noopener noreferrer" style={{ fontSize: 12, color: "#2563eb" }}>View Cut Off ↗</a>}
                  </div>
                )}
                {answerKeyUpdate && (
                  <div style={cardStyle}>
                    {sectionTitle("🔑", "Answer Key")}
                    <div style={{ fontSize: 13, fontWeight: 600, color: "#1e3a5f", marginBottom: 6 }}>{answerKeyUpdate.title}</div>
                    {answerKeyUpdate.official_link && <a href={answerKeyUpdate.official_link} target="_blank" rel="noopener noreferrer" style={{ fontSize: 12, color: "#2563eb" }}>Download Answer Key ↗</a>}
                  </div>
                )}
              </>
            )}

            {/* UPDATES TAB */}
            {activeTab === "updates" && (
              <div style={cardStyle}>
                {sectionTitle("🔔", "All Updates & Notifications")}
                {updates.length > 0 ? updates.map((u, i) => (
                  <div key={i} style={{ display: "flex", gap: 10, padding: "10px 0", borderBottom: i < updates.length - 1 ? "1px solid #f1f5f9" : "none", alignItems: "flex-start" }}>
                    <span style={{ fontSize: 18, flexShrink: 0 }}>
                      {u.update_type === "result" ? "🏆" : u.update_type === "admit_card" ? "🎫" : u.update_type === "answer_key" ? "🔑" : u.update_type === "notification" ? "📝" : u.update_type === "syllabus" ? "📚" : u.update_type === "cutoff" ? "📊" : "🔔"}
                    </span>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 13, fontWeight: 600, color: "#1e3a5f" }}>{u.title}</div>
                      {u.description && <div style={{ fontSize: 12, color: "#64748b", marginTop: 3, lineHeight: 1.5 }}>{u.description.slice(0, 150)}</div>}
                      <div style={{ display: "flex", gap: 8, marginTop: 4, alignItems: "center" }}>
                        {u.official_link && <a href={u.official_link} target="_blank" rel="noopener noreferrer" style={{ fontSize: 11, color: "#2563eb", fontWeight: 600 }}>View ↗</a>}
                        {u.publish_date && <span style={{ fontSize: 10, color: "#94a3b8" }}>{u.publish_date}</span>}
                        {u.is_verified && <span style={{ fontSize: 10, background: "#dcfce7", color: "#166534", padding: "1px 6px", borderRadius: 8, fontWeight: 600 }}>✓ Verified</span>}
                      </div>
                    </div>
                  </div>
                )) : (
                  <div style={{ textAlign: "center", padding: 20, color: "#94a3b8", fontSize: 13 }}>
                    <p>कोई update नहीं मिला।</p>
                    {officialSite && <a href={officialSite} target="_blank" rel="noopener noreferrer" style={{ color: "#2563eb", fontSize: 12 }}>Official website check करें ↗</a>}
                  </div>
                )}
              </div>
            )}

            {/* PYQ Section (always visible at bottom) */}
            <div style={{ ...cardStyle, background: "linear-gradient(135deg, #fef3c7, #fffbeb)", border: "1px solid #fde68a" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <span style={{ fontSize: 28 }}>📖</span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 14, fontWeight: 700, color: "#92400e" }}>Previous Year Papers (PYQ)</div>
                  <div style={{ fontSize: 12, color: "#b45309", marginTop: 2 }}>Practice करो, score बढ़ाओ</div>
                </div>
                <a href={officialSite || "/"} target={officialSite ? "_blank" : "_self"} rel="noopener noreferrer"
                  style={{ padding: "8px 14px", background: "#d97706", color: "#fff", borderRadius: 8, fontSize: 12, fontWeight: 700, textDecoration: "none" }}>
                  {officialSite ? "Official Site ↗" : "Coming Soon"}
                </a>
              </div>
            </div>

            {/* Official Website CTA */}
            {officialSite && (
              <a href={officialSite} target="_blank" rel="noopener noreferrer"
                style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, background: "#fff", border: "2px solid #2563eb", borderRadius: 12, padding: 14, textDecoration: "none", marginBottom: 14 }}>
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