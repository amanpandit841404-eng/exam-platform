"use client";
    import { useState, useEffect } from "react";
    import "./globals.css";

    export default function RootLayout({ children }) {
      return (
        <html lang="hi">
          <head>
            <meta charSet="utf-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1" />
            <link rel="manifest" href="/manifest.json" />
            <meta name="theme-color" content="#1e3a5f" />
            <meta name="description" content="SarkariSetu India - Latest Sarkari Result, Admit Card, Syllabus, Answer Key 2026. SSC, UPSC, NEET, JEE, IBPS, Railway results." />
            <meta name="keywords" content="sarkari result, sarkari setu, exam results, admit card, ssc cgl result, upsc result, neet result, jee result, ibps result, railway result 2026" />
            <meta name="robots" content="index, follow" />
            <meta property="og:title" content="SarkariSetu India - Sarkari Result 2026" />
            <meta property="og:description" content="Latest Sarkari Result, Admit Card, Syllabus 2026" />
            <meta property="og:type" content="website" />
            <title>SarkariSetu India - Sarkari Result, Admit Card 2026</title>
            {/* Google Analytics GA4 */}
            <script async src="https://www.googletagmanager.com/gtag/js?id=G-FQ838B63YN"></script>
            <script dangerouslySetInnerHTML={{ __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-FQ838B63YN');
            ` }} />
          </head>
          <body style={{ margin: 0, padding: 0, paddingBottom: 60 }}>
            {children}
            <BottomNav />
          </body>
        </html>
      );
    }

    function BottomNav() {
      const [path, setPath] = useState("/");
      useEffect(() => { setPath(window.location.pathname); }, []);
      const links = [
        { href: "/", icon: "🏠", label: "Home" },
        { href: "/results", icon: "🏆", label: "Results" },
        { href: "/admit-cards", icon: "📄", label: "Admit Card" },
        { href: "/search", icon: "🔍", label: "Search" },
        { href: "/notifications", icon: "📢", label: "Updates" },
      ];
      return (
        <nav style={{
          position: "fixed", bottom: 0, left: 0, right: 0, zIndex: 1000,
          background: "#fff", borderTop: "1px solid #e5e7eb",
          display: "flex", justifyContent: "space-around", alignItems: "center",
          padding: "6px 0 4px", boxShadow: "0 -2px 10px rgba(0,0,0,0.08)"
        }}>
          {links.map(link => {
            const active = path === link.href;
            return (
              <a key={link.href} href={link.href} style={{ textDecoration: "none", display: "flex", flexDirection: "column", alignItems: "center", gap: 1, flex: 1, padding: "2px 0" }}>
                <span style={{ fontSize: 20 }}>{link.icon}</span>
                <span style={{ fontSize: 10, fontWeight: active ? 700 : 500, color: active ? "#1e3a5f" : "#9ca3af" }}>{link.label}</span>
                {active && <div style={{ width: 4, height: 4, borderRadius: "50%", background: "#1e3a5f", marginTop: 1 }} />}
              </a>
            );
          })}
        </nav>
      );
    }
    