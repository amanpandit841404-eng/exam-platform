export default function TelegramPage() {
      const benefits = [
        { icon: "🏆", text: "Result alerts — तुरंत notification" },
        { icon: "🎫", text: "Admit card — release होते ही" },
        { icon: "📢", text: "Sarkari notifications daily" },
        { icon: "✂️", text: "Cutoff marks — category-wise" },
        { icon: "💼", text: "New vacancy — हर रोज़" },
      ];

      return (
        <div style={{ minHeight: "100vh", background: "linear-gradient(135deg, #0088cc 0%, #005580 100%)", fontFamily: "sans-serif", display: "flex", alignItems: "center", justifyContent: "center", padding: "16px" }}>
          <div style={{ maxWidth: "420px", width: "100%", textAlign: "center" }}>
            <div style={{ fontSize: "72px", marginBottom: "12px" }}>📱</div>
            <h1 style={{ fontSize: "26px", fontWeight: "900", color: "#fff", margin: "0 0 6px" }}>
              SarkariSetu India
            </h1>
            <p style={{ fontSize: "15px", color: "rgba(255,255,255,0.85)", margin: "0 0 6px" }}>
              Official Telegram Channel
            </p>
            <p style={{ fontSize: "13px", color: "rgba(255,255,255,0.7)", margin: "0 0 28px", lineHeight: "1.6" }}>
              Latest Sarkari Results, Admit Cards, Notifications — सबसे पहले Telegram पर!
            </p>
            <div style={{ background: "rgba(255,255,255,0.12)", borderRadius: "14px", padding: "18px", marginBottom: "22px" }}>
              {benefits.map((item, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: "12px", padding: "9px 0", borderBottom: i < benefits.length - 1 ? "1px solid rgba(255,255,255,0.1)" : "none", textAlign: "left" }}>
                  <span style={{ fontSize: "18px" }}>{item.icon}</span>
                  <span style={{ fontSize: "13px", color: "#fff", fontWeight: "500" }}>{item.text}</span>
                </div>
              ))}
            </div>
            <a href="https://t.me/sarkarisetu" target="_blank" rel="noopener noreferrer"
              style={{ display: "block", background: "#fff", color: "#0088cc", borderRadius: "12px", padding: "15px 24px", textDecoration: "none", fontSize: "16px", fontWeight: "800", marginBottom: "12px", boxShadow: "0 4px 20px rgba(0,0,0,0.25)" }}>
              📲 Join Telegram Channel
            </a>
            <a href="/" style={{ display: "block", background: "rgba(255,255,255,0.15)", color: "#fff", borderRadius: "12px", padding: "12px 24px", textDecoration: "none", fontSize: "14px", fontWeight: "600" }}>
              ← Back to Website
            </a>
            <p style={{ fontSize: "11px", color: "rgba(255,255,255,0.45)", marginTop: "18px" }}>
              Free • No spam • Unsubscribe anytime
            </p>
          </div>
        </div>
      );
    }
    