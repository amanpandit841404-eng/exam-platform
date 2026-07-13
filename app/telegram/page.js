"use client";
export default function TelegramPage() {
  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(135deg, #0088cc 0%, #006699 100%)", fontFamily: "sans-serif", display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }}>
      <div style={{ maxWidth: 400, width: "100%", textAlign: "center" }}>
        <div style={{ fontSize: 80, marginBottom: 16 }}>📱</div>
        <h1 style={{ fontSize: 28, fontWeight: 900, color: "#fff", margin: "0 0 8px" }}>SarkariSetu India</h1>
        <p style={{ fontSize: 16, color: "rgba(255,255,255,0.9)", margin: "0 0 8px" }}>Telegram Channel</p>
        <p style={{ fontSize: 14, color: "rgba(255,255,255,0.75)", margin: "0 0 32px", lineHeight: 1.6 }}>
          Latest Sarkari Results, Admit Cards, Notifications — सबसे पहले Telegram पर!
        </p>

        <div style={{ background: "rgba(255,255,255,0.15)", borderRadius: 16, padding: 20, marginBottom: 24 }}>
          {[
            { icon: "🏆", text: "Result alerts — तुरंत notification" },
            { icon: "🎫", text: "Admit card — release होते ही" },
            { icon: "📢", text: "Sarkari notifications daily" },
            { icon: "✂️", text: "Cutoff marks — category-wise" },
            { icon: "💼", text: "New vacancy — हर रोज़" },
          ].map((item, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, padding: "8px 0", borderBottom: i < 4 ? "1px solid rgba(255,255,255,0.1)" : "none", textAlign: "left" }}>
              <span style={{ fontSize: 20 }}>{item.icon}</span>
              <span style={{ fontSize: 14, color: "#fff", fontWeight: 500 }}>{item.text}</span>
            </div>
          ))}
        </div>

        <a href="https://t.me/sarkarisetu" target="_blank" rel="noopener noreferrer"
          style={{ display: "block", background: "#fff", color: "#0088cc", borderRadius: 12, padding: "16px 24px", textDecoration: "none", fontSize: 16, fontWeight: 800, marginBottom: 12, boxShadow: "0 4px 16px rgba(0,0,0,0.2)" }}>
          📲 Join Telegram Channel
        </a>

        <a href="/"
          style={{ display: "block", background: "rgba(255,255,255,0.15)", color: "#fff", borderRadius: 12, padding: "12px 24px", textDecoration: "none", fontSize: 14, fontWeight: 600 }}>
          ← Back to Website
        </a>

        <p style={{ fontSize: 11, color: "rgba(255,255,255,0.5)", marginTop: 20 }}>
          Free • No spam • Unsubscribe anytime
        </p>
      </div>
    </div>
  );
}
