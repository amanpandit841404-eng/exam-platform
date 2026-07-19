"use client";

import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
const DAYS = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];

const CAT_COLORS = {
  "SSC": "#2563eb", "UPSC": "#1e40af", "Railway": "#dc2626", "Banking": "#d97706",
  "State PSC": "#7c3aed", "Teaching": "#0891b2", "Defence": "#4f46e5", "Police": "#1e293b",
  "Medical": "#be123c", "Engineering": "#0d9488", "Law": "#4f46e5", "MBA": "#0ea5e9",
};

export default function CalendarPage() {
  const [exams, setExams] = useState([]);
  const [month, setMonth] = useState(new Date().getMonth());
  const [year, setYear] = useState(new Date().getFullYear());
  const [selectedDay, setSelectedDay] = useState(null);
  const [loading, setLoading] = useState(true);
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    document.title = "Exam Calendar 2026 - SarkariSetu India";
    const saved = localStorage.getItem("sarkari-dark-mode");
    if (saved === "true") setDarkMode(true);
  }, []);

  useEffect(() => {
    async function fetchExams() {
      setLoading(true);
      try {
        const firstDay = new Date(year, month, 1).toISOString().split("T")[0];
        const lastDay = new Date(year, month + 1, 0).toISOString().split("T")[0];
        const { data } = await supabase
          .from("upcoming_exams")
          .select("*")
          .gte("exam_date", firstDay)
          .lte("exam_date", lastDay)
          .order("exam_date");
        setExams(data || []);
      } catch (e) { console.error(e); }
      setLoading(false);
    }
    fetchExams();
  }, [month, year]);

  const bg = darkMode ? "#0f172a" : "#f1f5f9";
  const cardBg = darkMode ? "#1e293b" : "#ffffff";
  const textMain = darkMode ? "#f1f5f9" : "#1e3a5f";
  const textSub = darkMode ? "#94a3b8" : "#6b7280";
  const border = darkMode ? "#334155" : "#e5e7eb";

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayIndex = new Date(year, month, 1).getDay();
  const today = new Date();

  const examMap = {};
  exams.forEach(e => {
    if (e.exam_date) {
      const d = new Date(e.exam_date).getDate();
      if (!examMap[d]) examMap[d] = [];
      examMap[d].push(e);
    }
  });

  const prevMonth = () => { setMonth(m => m === 0 ? 11 : m - 1); if (month === 0) setYear(y => y - 1); setSelectedDay(null); };
  const nextMonth = () => { setMonth(m => m === 11 ? 0 : m + 1); if (month === 11) setYear(y => y + 1); setSelectedDay(null); };

  const getCatColor = (cat) => {
    for (const [key, color] of Object.entries(CAT_COLORS)) {
      if ((cat || "").toLowerCase().includes(key.toLowerCase())) return color;
    }
    return "#6b7280";
  };

  const selectedExams = selectedDay ? (examMap[selectedDay] || []) : [];
  const selectedDate = selectedDay ? new Date(year, month, selectedDay) : null;

  return (
    <div style={{ minHeight: "100vh", background: bg, fontFamily: "sans-serif", transition: "all 0.3s" }}>
      <div style={{ background: "linear-gradient(135deg, #1e3a5f 0%, #2563eb 100%)", color: "#fff", padding: "16px 16px 20px" }}>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <a href="/" style={{ color: "rgba(255,255,255,0.8)", fontSize: 13, textDecoration: "none" }}>⬅ Home</a>
          <h1 style={{ margin: "8px 0 4px", fontSize: 22, fontWeight: 800 }}>📅 Exam Calendar 2026</h1>
          <p style={{ margin: 0, fontSize: 13, opacity: 0.85 }}>Upcoming government exams at a glance</p>
        </div>
      </div>

      <div style={{ maxWidth: 900, margin: "0 auto", padding: "16px" }}>
        {/* Month Navigation */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
          <button onClick={prevMonth} style={{ padding: "8px 16px", background: cardBg, border: `1px solid ${border}`, borderRadius: 8, color: textMain, cursor: "pointer", fontSize: 16 }}>◀ {MONTHS[month === 0 ? 11 : month - 1]}</button>
          <h2 style={{ margin: 0, fontSize: 20, fontWeight: 700, color: textMain }}>{MONTHS[month]} {year}</h2>
          <button onClick={nextMonth} style={{ padding: "8px 16px", background: cardBg, border: `1px solid ${border}`, borderRadius: 8, color: textMain, cursor: "pointer", fontSize: 16 }}>{MONTHS[month === 11 ? 0 : month + 1]} ▶</button>
        </div>

        {/* Calendar Grid */}
        <div style={{ background: cardBg, border: `1px solid ${border}`, borderRadius: 16, overflow: "hidden" }}>
          {/* Day Headers */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", background: darkMode ? "#1e293b" : "#f8fafc", borderBottom: `1px solid ${border}` }}>
            {DAYS.map(d => (
              <div key={d} style={{ padding: "10px 4px", textAlign: "center", fontSize: 12, fontWeight: 600, color: textSub }}>{d}</div>
            ))}
          </div>
          {/* Days */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)" }}>
            {Array.from({ length: firstDayIndex }).map((_, i) => (
              <div key={`empty-${i}`} style={{ minHeight: 80, borderRight: `1px solid ${border}`, borderBottom: `1px solid ${border}`, background: darkMode ? "#0f172a" : "#f9fafb" }} />
            ))}
            {Array.from({ length: daysInMonth }).map((_, i) => {
              const day = i + 1;
              const isToday = day === today.getDate() && month === today.getMonth() && year === today.getFullYear();
              const isSelected = day === selectedDay;
              const hasExams = examMap[day] && examMap[day].length > 0;
              return (
                <div key={day} onClick={() => setSelectedDay(isSelected ? null : day)}
                  style={{ minHeight: 80, padding: "4px", borderRight: `1px solid ${border}`, borderBottom: `1px solid ${border}`, cursor: hasExams ? "pointer" : "default", background: isSelected ? "#eff6ff" : (isToday ? (darkMode ? "#1e293b" : "#fefce8") : "transparent"), position: "relative" }}>
                  <div style={{ fontSize: 12, fontWeight: isToday ? 800 : 500, color: isSelected ? "#2563eb" : (isToday ? "#d97706" : textMain), width: 24, height: 24, display: "flex", alignItems: "center", justifyContent: "center", borderRadius: "50%", background: isToday && !isSelected ? "#fef3c7" : "transparent" }}>{day}</div>
                  {hasExams && (
                    <div style={{ marginTop: 2 }}>
                      {examMap[day].slice(0, 2).map((e, idx) => (
                        <div key={idx} style={{ fontSize: 8, padding: "1px 3px", background: getCatColor(e.category), color: "#fff", borderRadius: 3, marginBottom: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                          {e.exam_name ? e.exam_name.substring(0, 12) : "Exam"}
                        </div>
                      ))}
                      {examMap[day].length > 2 && <div style={{ fontSize: 8, color: textSub, paddingLeft: 2 }}>+{examMap[day].length - 2} more</div>}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Selected Day Exams */}
        {selectedDay && (
          <div style={{ marginTop: 16, background: cardBg, border: `1px solid ${border}`, borderRadius: 16, padding: 16 }}>
            <h3 style={{ margin: "0 0 12px", fontSize: 16, fontWeight: 700, color: textMain }}>
              📅 {selectedDate ? selectedDate.toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long", year: "numeric" }) : ""}
              <span style={{ fontSize: 13, fontWeight: 400, color: textSub, marginLeft: 8 }}>({selectedExams.length} exams)</span>
            </h3>
            {selectedExams.length === 0 ? (
              <p style={{ color: textSub, fontSize: 13 }}>No exams scheduled on this day.</p>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {selectedExams.map((e, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 12px", background: darkMode ? "#0f172a" : "#f8fafc", borderRadius: 10, border: `1px solid ${border}` }}>
                    <div style={{ width: 4, height: 36, borderRadius: 2, background: getCatColor(e.category), flexShrink: 0 }} />
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 14, fontWeight: 600, color: textMain }}>{e.exam_name || "Unknown Exam"}</div>
                      <div style={{ fontSize: 11, color: textSub, marginTop: 2 }}>
                        {e.category && <span style={{ background: getCatColor(e.category), color: "#fff", padding: "1px 8px", borderRadius: 8, fontSize: 10, marginRight: 6 }}>{e.category}</span>}
                        {e.status && <span>{e.status.replace(/_/g, " ")}</span>}
                      </div>
                    </div>
                    {e.official_website && (
                      <a href={e.official_website} target="_blank" rel="noopener noreferrer" style={{ padding: "4px 10px", background: "#2563eb", color: "#fff", borderRadius: 6, fontSize: 11, textDecoration: "none", whiteSpace: "nowrap" }}>Official ↗</a>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {loading && <div style={{ textAlign: "center", padding: 20, color: textSub }}>Loading...</div>}

        {!loading && Object.keys(examMap).length === 0 && (
          <div style={{ textAlign: "center", padding: 40, color: textSub }}>
            <div style={{ fontSize: 48, marginBottom: 12 }}>📅</div>
            <p>No exams found for {MONTHS[month]} {year}</p>
          </div>
        )}
      </div>
    </div>
  );
}
