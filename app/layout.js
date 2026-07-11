"use client";
    import { useState, useEffect } from "react";
    import "./globals.css";

    export default function RootLayout({ children }) {
      const [dark, setDark] = useState(false);
      const [lang, setLang] = useState("hi");

      useEffect(() => {
        const savedDark = localStorage.getItem("sarkarisetu_dark");
        const savedLang = localStorage.getItem("sarkarisetu_lang") || "hi";
        if (savedDark === "true") { setDark(true); }
        setLang(savedLang);
      }, []);

      const toggleDark = () => {
        const next = !dark;
        setDark(next);
        localStorage.setItem("sarkarisetu_dark", next);
      };

      const toggleLang = () => {
        const next = lang === "hi" ? "en" : "hi";
        setLang(next);
        localStorage.setItem("sarkarisetu_lang", next);
        window.location.reload();
      };

      return (
        <html lang={lang}>
          <head>
            <meta charSet="utf-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1" />
            <link rel="manifest" href="/manifest.json" />
            <meta name="theme-color" content="#1e3a5f" />
            <meta name="description" content="SarkariSetu India - Latest exam results, admit cards, syllabus and notifications." />
            <meta name="keywords" content="sarkari result, exam results, admit card, ssc, upsc, neet, jee" />
            <title>SarkariSetu India - Exam Results & Government Jobs</title>
          </head>
          <body style={{ background: dark ? "#0f172a" : "#f8fafc", color: dark ? "#e2e8f0" : "#151515", minHeight: "100vh", margin: 0, padding: 0 }}>
            <div style={{ position: "fixed", top: 10, right: 10, zIndex: 9999, display: "flex", gap: 6 }}>
              <button onClick={toggleDark}
                style={{ width: 36, height: 36, borderRadius: "50%", border: "none", cursor: "pointer",
                  background: dark ? "#374151" : "#fff", color: dark ? "#fbbf24" : "#1e3a5f", fontSize: 16,
                  boxShadow: "0 2px 8px rgba(0,0,0,0.15)" }}>
                {dark ? "☀️" : "🌙"}
              </button>
              <button onClick={toggleLang}
                style={{ width: 36, height: 36, borderRadius: "50%", border: "none", cursor: "pointer",
                  background: "#fff", color: "#1e3a5f", fontSize: 11, fontWeight: 700,
                  boxShadow: "0 2px 8px rgba(0,0,0,0.15)" }}>
                {lang === "hi" ? "EN" : "हि"}
              </button>
            </div>
            {children}
          </body>
        </html>
      );
    }
    