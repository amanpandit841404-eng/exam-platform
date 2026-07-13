"use client";
export default function AboutPage() {
  return (
    <div style={{ maxWidth: 800, margin: "0 auto", padding: "20px 16px 80px", fontFamily: "sans-serif" }}>
      <div style={{ background: "linear-gradient(135deg, #1e3a5f, #2563eb)", borderRadius: 12, padding: "24px 16px", marginBottom: 24, color: "#fff", textAlign: "center" }}>
        <a href="/" style={{ color: "#93c5fd", fontSize: 13, textDecoration: "none", display: "block", textAlign: "left", marginBottom: 12 }}>← Home</a>
        <div style={{ fontSize: 48, marginBottom: 8 }}>🎯</div>
        <h1 style={{ fontSize: 24, fontWeight: 700, margin: "0 0 8px" }}>SarkariSetu India</h1>
        <p style={{ fontSize: 14, opacity: 0.9, margin: 0 }}>India ka #1 Exam Information Platform</p>
      </div>

      <div style={{ background: "#fff", borderRadius: 10, padding: 20, marginBottom: 16, border: "1px solid #e5e7eb" }}>
        <h2 style={{ fontSize: 17, fontWeight: 700, color: "#1e3a5f", margin: "0 0 12px" }}>🌟 हमारे बारे में</h2>
        <p style={{ fontSize: 14, color: "#4b5563", lineHeight: 1.7, margin: 0 }}>
          SarkariSetu India एक free educational platform है जो लाखों सरकारी नौकरी के उम्मीदवारों को 
          latest exam results, admit cards, syllabus, और answer keys की जानकारी देता है।
          हमारा लक्ष्य है कि हर student को सही समय पर सही जानकारी मिले।
        </p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 16 }}>
        {[
          { icon: "📚", number: "52,000+", label: "Exams Covered" },
          { icon: "🏆", number: "500+", label: "Results Updated" },
          { icon: "🎫", number: "500+", label: "Admit Cards" },
          { icon: "👥", number: "Growing", label: "Daily Visitors" }
        ].map((stat, i) => (
          <div key={i} style={{ background: "#f8fafc", borderRadius: 10, padding: 16, textAlign: "center", border: "1px solid #e5e7eb" }}>
            <div style={{ fontSize: 28 }}>{stat.icon}</div>
            <div style={{ fontSize: 20, fontWeight: 700, color: "#1e3a5f" }}>{stat.number}</div>
            <div style={{ fontSize: 12, color: "#6b7280" }}>{stat.label}</div>
          </div>
        ))}
      </div>

      <div style={{ background: "#fff", borderRadius: 10, padding: 20, marginBottom: 16, border: "1px solid #e5e7eb" }}>
        <h2 style={{ fontSize: 17, fontWeight: 700, color: "#1e3a5f", margin: "0 0 12px" }}>🎯 हम क्या Cover करते हैं</h2>
        {[
          { icon: "🏛️", title: "UPSC", desc: "IAS, IPS, IFS और सभी Civil Services" },
          { icon: "📋", title: "SSC", desc: "CGL, CHSL, MTS, GD Constable" },
          { icon: "🏦", title: "Banking", desc: "IBPS PO, Clerk, SBI, RBI" },
          { icon: "🚂", title: "Railway", desc: "RRB NTPC, Group D, ALP" },
          { icon: "🎓", title: "Education", desc: "NEET, JEE, CUET, NDA" },
          { icon: "🏢", title: "State PSC", desc: "सभी राज्यों की PSC परीक्षाएं" }
        ].map((item, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 0", borderBottom: i < 5 ? "1px solid #f3f4f6" : "none" }}>
            <span style={{ fontSize: 24 }}>{item.icon}</span>
            <div>
              <div style={{ fontSize: 14, fontWeight: 600, color: "#1e3a5f" }}>{item.title}</div>
              <div style={{ fontSize: 12, color: "#6b7280" }}>{item.desc}</div>
            </div>
          </div>
        ))}
      </div>

      <div style={{ background: "#fff", borderRadius: 10, padding: 20, marginBottom: 16, border: "1px solid #e5e7eb" }}>
        <h2 style={{ fontSize: 17, fontWeight: 700, color: "#1e3a5f", margin: "0 0 12px" }}>⚠️ Disclaimer</h2>
        <p style={{ fontSize: 13, color: "#4b5563", lineHeight: 1.6, margin: 0 }}>
          SarkariSetu India किसी भी सरकारी संस्था, बोर्ड, या आयोग से संबद्ध नहीं है। 
          यह एक independent information platform है। सभी official notifications के लिए 
          संबंधित official websites देखें। हम accuracy के लिए प्रयास करते हैं लेकिन 
          किसी भी जानकारी की पुष्टि official source से करें।
        </p>
      </div>

      <div style={{ background: "#1e3a5f", borderRadius: 10, padding: 16, textAlign: "center" }}>
        <p style={{ fontSize: 13, color: "#93c5fd", margin: "0 0 8px" }}>📧 Contact us</p>
        <p style={{ fontSize: 14, color: "#fff", fontWeight: 600, margin: 0 }}>sarkarisetu.india@gmail.com</p>
      </div>
    </div>
  );
}
