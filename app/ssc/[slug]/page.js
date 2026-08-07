"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

export default function SSCDetail() {
  const params = useParams();
  const slug = params?.slug || "";
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("sarkari-dark-mode");
    if (saved === "true") setDarkMode(true);
    async function load() {
      try {
        const res = await fetch("/ssc-data/exams.json");
        const j = await res.json();
        setData(j);
        const ex = (j?.exams || []).find((x) => x.slug === slug);
        if (ex) {
          document.title = ex.name + " - Eligibility, Exam Pattern, Salary | SarkariSetu India";
        }
      } catch (e) {
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [slug]);

  const bg = darkMode ? "#0f172a" : "#f1f5f9";
  const cardBg = darkMode ? "#1e293b" : "#ffffff";
  const textMain = darkMode ? "#f1f5f9" : "#1e3a5f";
  const textSub = darkMode ? "#94a3b8" : "#6b7280";
  const border = darkMode ? "#334155" : "#e5e7eb";

  const exam = data?.exams?.find((x) => x.slug === slug);

  if (!loading && !exam) {
    return (
      <div style={{ minHeight: "100vh", background: bg, fontFamily: "sans-serif", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 30 }}>
        <div style={{ fontSize: 40 }}>🏢</div>
        <div style={{ fontSize: 18, fontWeight: 800, color: textMain, marginTop: 10 }}>Exam नहीं मिला</div>
        <a href="/ssc" style={{ marginTop: 14, color: "#4f46e5", fontWeight: 700, textDecoration: "none", fontSize: 14 }}>← SSC Center पर वापस जाएँ</a>
      </div>
    );
  }

  if (!exam) {
    return <div style={{ minHeight: "100vh", background: bg, textAlign: "center", paddingTop: 80, color: textSub, fontFamily: "sans-serif" }}>⏳ लोड हो रहा है...</div>;
  }

  const related = (data?.exams || []).filter((x) => x.slug !== slug).slice(0, 4);

  return (
    <div style={{ minHeight: "100vh", background: bg, fontFamily: "sans-serif", paddingBottom: 80 }}>
      {/* Hero */}
      <div style={{ background: "linear-gradient(135deg,#312e81,#4f46e5)", padding: "18px 16px 44px", color: "#fff" }}>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <a href="/ssc" style={{ color: "#fed7aa", fontSize: 13, textDecoration: "none", fontWeight: 700 }}>← SSC Exams Center</a>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginTop: 10 }}>
            <div style={{ fontSize: 40 }}>{exam.emoji}</div>
            <div>
              <h1 style={{ margin: 0, fontSize: 24, fontWeight: 800 }}>{exam.name}</h1>
              <div style={{ fontSize: 12.5, opacity: 0.92, marginTop: 3 }}>{exam.fullName}</div>
            </div>
          </div>
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginTop: 10 }}>
            {exam.tags.map((t) => (
              <span key={t} style={{ fontSize: 11, background: "rgba(255,255,255,0.18)", padding: "4px 10px", borderRadius: 999, fontWeight: 700 }}>{t}</span>
            ))}
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 900, margin: "0 auto", padding: "0 14px" }}>
        {/* Status + Fee card */}
        <div style={{ marginTop: -26, background: cardBg, border: `1px solid ${border}`, borderRadius: 16, padding: "14px 16px", boxShadow: darkMode ? "none" : "0 4px 14px rgba(0,0,0,0.06)" }}>
          <div style={{ fontSize: 13.5, fontWeight: 800, color: textMain }}>📢 Latest Status</div>
          <div style={{ fontSize: 12.5, color: textSub, lineHeight: 1.6, marginTop: 5 }}>{exam.latestStatus}</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginTop: 12 }}>
            <div style={{ background: darkMode ? "#334155" : "#eef2ff", borderRadius: 10, padding: "10px 12px" }}>
              <div style={{ fontSize: 11, color: textSub, fontWeight: 700 }}>💰 EXAM FEE</div>
              <div style={{ fontSize: 12.5, fontWeight: 800, color: textMain, marginTop: 3, lineHeight: 1.45 }}>{exam.examFee}</div>
            </div>
            <div style={{ background: darkMode ? "#334155" : "#eef2ff", borderRadius: 10, padding: "10px 12px" }}>
              <div style={{ fontSize: 11, color: textSub, fontWeight: 700 }}>💼 SALARY</div>
              <div style={{ fontSize: 12.5, fontWeight: 800, color: textMain, marginTop: 3, lineHeight: 1.45 }}>{exam.salary}</div>
            </div>
          </div>
        </div>

        {/* Overview */}
        <Section title="📖 Overview" darkMode={darkMode} border={border} cardBg={cardBg} textMain={textMain} textSub={textSub}>
          <div style={{ fontSize: 13.5, lineHeight: 1.75, color: textMain }}>{exam.overview}</div>
        </Section>

        {/* Posts */}
        <Section title="📋 Posts / Vacancies" darkMode={darkMode} border={border} cardBg={cardBg} textMain={textMain} textSub={textSub}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(240px,1fr))", gap: 8 }}>
            {exam.posts.map((p) => (
              <div key={p} style={{ fontSize: 12.5, color: textMain, background: darkMode ? "#334155" : "#f8fafc", border: `1px solid ${border}`, borderRadius: 9, padding: "8px 11px", fontWeight: 600 }}>✅ {p}</div>
            ))}
          </div>
        </Section>

        {/* Eligibility */}
        <Section title="🎓 Eligibility" darkMode={darkMode} border={border} cardBg={cardBg} textMain={textMain} textSub={textSub}>
          <div style={{ fontSize: 13.5, lineHeight: 1.75, color: textMain }}>{exam.eligibility}</div>
        </Section>

        {/* Exam Pattern */}
        <Section title="📝 Exam Pattern" darkMode={darkMode} border={border} cardBg={cardBg} textMain={textMain} textSub={textSub}>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {exam.examPattern.map((s, i) => (
              <div key={s.stage} style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
                <div style={{ minWidth: 26, height: 26, borderRadius: "50%", background: "linear-gradient(135deg,#312e81,#4f46e5)", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12.5, fontWeight: 800, marginTop: 1 }}>{i + 1}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13.5, fontWeight: 800, color: textMain }}>{s.stage}</div>
                  <div style={{ fontSize: 12.5, color: textSub, lineHeight: 1.55, marginTop: 2 }}>{s.detail}</div>
                </div>
              </div>
            ))}
          </div>
        </Section>

        {/* Syllabus */}
        <Section title="📚 Syllabus Topics" darkMode={darkMode} border={border} cardBg={cardBg} textMain={textMain} textSub={textSub}>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {exam.syllabus.map((s) => (
              <span key={s} style={{ fontSize: 12.5, fontWeight: 700, color: textMain, background: darkMode ? "#334155" : "#eef2ff", border: `1px solid ${border}`, borderRadius: 999, padding: "7px 13px" }}>{s}</span>
            ))}
          </div>
        </Section>

        {/* Selection process */}
        <Section title="🪜 Selection Process" darkMode={darkMode} border={border} cardBg={cardBg} textMain={textMain} textSub={textSub}>
          <div style={{ fontSize: 13, fontWeight: 700, color: "#4f46e5", lineHeight: 1.7 }}>{exam.selectionProcess}</div>
        </Section>

        {/* Official website */}
        <div style={{ margin: "14px 0", textAlign: "center" }}>
          <a href={exam.officialWebsite} target="_blank" rel="noreferrer"
            style={{ display: "inline-block", textDecoration: "none", background: "linear-gradient(135deg,#312e81,#4f46e5)", color: "#fff", fontWeight: 800, fontSize: 15, padding: "13px 28px", borderRadius: 999 }}>
            🌐 Official Website पर जाएँ ↗
          </a>
        </div>

        {/* Disclaimer */}
        <div style={{ background: darkMode ? "#1e293b" : "#fff7ed", border: "1px solid " + (darkMode ? "#334155" : "#bbf7d0"), borderRadius: 14, padding: "13px 15px", marginTop: 8 }}>
          <div style={{ fontSize: 12.5, color: textSub, lineHeight: 1.65 }}>
            ⚠️ {data?.note || "जानकारी अनुमानित है। फीस, तारीखें और पैटर्न बदल सकते हैं — हमेशा official notification ज़रूर चेक करें।"}
          </div>
        </div>

        {/* Related */}
        {related.length > 0 && (
          <div style={{ marginTop: 22 }}>
            <h2 style={{ fontSize: 16, fontWeight: 800, color: textMain, margin: "0 0 10px" }}>🏢 और SSC Exams</h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(160px,1fr))", gap: 10 }}>
              {related.map((r) => (
                <a key={r.slug} href={`/ssc/${r.slug}`} style={{ textDecoration: "none", background: cardBg, border: `1px solid ${border}`, borderRadius: 12, padding: "12px", display: "block" }}>
                  <div style={{ fontSize: 22 }}>{r.emoji}</div>
                  <div style={{ fontSize: 13, fontWeight: 800, color: textMain, marginTop: 5 }}>{r.name}</div>
                  <div style={{ fontSize: 11, color: textSub, marginTop: 3 }}>{r.tags[0]}</div>
                </a>
              ))}
            </div>
          </div>
        )}

        <div style={{ textAlign: "center", color: textSub, fontSize: 11.5, marginTop: 22, lineHeight: 1.6 }}>
          🏢 SarkariSetu India — आपका SSC भर्ती का पूरा साथी
        </div>
      </div>
    </div>
  );
}

function Section({ title, children, darkMode, border, cardBg, textMain, textSub }) {
  return (
    <div style={{ marginTop: 14, background: cardBg, border: `1px solid ${border}`, borderRadius: 16, padding: "15px 16px" }}>
      <div style={{ fontSize: 15.5, fontWeight: 800, color: textMain, marginBottom: 9 }}>{title}</div>
      {children}
    </div>
  );
}
