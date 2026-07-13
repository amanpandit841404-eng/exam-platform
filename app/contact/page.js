"use client";
import { useState } from "react";
export default function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [sent, setSent] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    const body = `Name: ${form.name}%0AEmail: ${form.email}%0ASubject: ${form.subject}%0AMessage: ${form.message}`;
    window.open(`mailto:sarkarisetu.india@gmail.com?subject=${encodeURIComponent(form.subject || "Contact from SarkariSetu")}&body=${body}`);
    setSent(true);
  };

  return (
    <div style={{ maxWidth: 600, margin: "0 auto", padding: "20px 16px 80px", fontFamily: "sans-serif" }}>
      <div style={{ background: "linear-gradient(135deg, #1e3a5f, #2563eb)", borderRadius: 12, padding: "20px 16px", marginBottom: 24, color: "#fff" }}>
        <a href="/" style={{ color: "#93c5fd", fontSize: 13, textDecoration: "none" }}>← Home</a>
        <h1 style={{ fontSize: 22, fontWeight: 700, margin: "8px 0 4px" }}>📬 Contact Us</h1>
        <p style={{ fontSize: 13, opacity: 0.8, margin: 0 }}>हमसे संपर्क करें</p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 20 }}>
        {[
          { icon: "📧", title: "Email", value: "sarkarisetu.india@gmail.com" },
          { icon: "⏰", title: "Response Time", value: "24-48 hours" },
          { icon: "🌐", title: "Website", value: "sarkarisetu.in" },
          { icon: "📍", title: "Location", value: "India" }
        ].map((item, i) => (
          <div key={i} style={{ background: "#fff", borderRadius: 10, padding: 14, border: "1px solid #e5e7eb", textAlign: "center" }}>
            <div style={{ fontSize: 24 }}>{item.icon}</div>
            <div style={{ fontSize: 12, color: "#6b7280", marginTop: 4 }}>{item.title}</div>
            <div style={{ fontSize: 12, fontWeight: 600, color: "#1e3a5f", marginTop: 2 }}>{item.value}</div>
          </div>
        ))}
      </div>

      {sent ? (
        <div style={{ background: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: 12, padding: 24, textAlign: "center" }}>
          <div style={{ fontSize: 48 }}>✅</div>
          <h2 style={{ color: "#16a34a", fontSize: 18, margin: "8px 0" }}>Message Ready!</h2>
          <p style={{ color: "#4b5563", fontSize: 14 }}>Your email app has opened. Please send the email.</p>
          <button onClick={() => setSent(false)} style={{ marginTop: 12, padding: "8px 20px", background: "#1e3a5f", color: "#fff", border: "none", borderRadius: 8, cursor: "pointer", fontSize: 14 }}>Send Another</button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} style={{ background: "#fff", borderRadius: 12, padding: 20, border: "1px solid #e5e7eb" }}>
          <h2 style={{ fontSize: 16, fontWeight: 700, color: "#1e3a5f", margin: "0 0 16px" }}>✉️ Send us a message</h2>
          {[
            { key: "name", label: "Your Name", placeholder: "Aman Pandit", type: "text" },
            { key: "email", label: "Email Address", placeholder: "your@email.com", type: "email" },
            { key: "subject", label: "Subject", placeholder: "Exam result not found...", type: "text" }
          ].map(field => (
            <div key={field.key} style={{ marginBottom: 14 }}>
              <label style={{ fontSize: 13, fontWeight: 600, color: "#374151", display: "block", marginBottom: 4 }}>{field.label}</label>
              <input type={field.type} placeholder={field.placeholder} value={form[field.key]}
                onChange={e => setForm({...form, [field.key]: e.target.value})}
                style={{ width: "100%", padding: "10px 12px", border: "1px solid #d1d5db", borderRadius: 8, fontSize: 14, boxSizing: "border-box", outline: "none" }} />
            </div>
          ))}
          <div style={{ marginBottom: 16 }}>
            <label style={{ fontSize: 13, fontWeight: 600, color: "#374151", display: "block", marginBottom: 4 }}>Message</label>
            <textarea placeholder="Write your message here..." value={form.message}
              onChange={e => setForm({...form, message: e.target.value})}
              rows={4} style={{ width: "100%", padding: "10px 12px", border: "1px solid #d1d5db", borderRadius: 8, fontSize: 14, boxSizing: "border-box", resize: "vertical", outline: "none" }} />
          </div>
          <button type="submit" style={{ width: "100%", padding: "12px", background: "linear-gradient(135deg, #1e3a5f, #2563eb)", color: "#fff", border: "none", borderRadius: 8, fontSize: 15, fontWeight: 700, cursor: "pointer" }}>
            📤 Send Message
          </button>
        </form>
      )}

      <div style={{ marginTop: 20, background: "#fff8f0", borderRadius: 10, padding: 14, border: "1px solid #fed7aa" }}>
        <h3 style={{ fontSize: 14, fontWeight: 700, color: "#ea580c", margin: "0 0 8px" }}>📋 Common Queries</h3>
        {[
          "Result / Admit Card not found → Use search bar",
          "Wrong information → Email us with details",
          "Advertise with us → Email for rates",
          "Technical issue → Describe the problem"
        ].map((q, i) => (
          <div key={i} style={{ fontSize: 12, color: "#4b5563", padding: "4px 0", borderBottom: i < 3 ? "1px solid #fed7aa" : "none" }}>• {q}</div>
        ))}
      </div>
    </div>
  );
}
