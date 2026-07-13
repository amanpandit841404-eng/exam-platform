"use client";
export default function PrivacyPolicy() {
  return (
    <div style={{ maxWidth: 800, margin: "0 auto", padding: "20px 16px 80px", fontFamily: "sans-serif" }}>
      <div style={{ background: "#1e3a5f", borderRadius: 12, padding: "20px 16px", marginBottom: 24, color: "#fff" }}>
        <a href="/" style={{ color: "#93c5fd", fontSize: 13, textDecoration: "none" }}>← Home</a>
        <h1 style={{ fontSize: 22, fontWeight: 700, margin: "8px 0 4px" }}>Privacy Policy</h1>
        <p style={{ fontSize: 13, opacity: 0.8, margin: 0 }}>Last updated: July 2026</p>
      </div>

      {[
        {
          title: "1. Information We Collect",
          content: "We collect information you provide directly to us, such as when you use our search features or contact us. We also automatically collect certain information when you visit our website, including your IP address, browser type, and pages visited."
        },
        {
          title: "2. How We Use Information",
          content: "We use the information we collect to provide, maintain, and improve our services, to understand how users interact with our website, and to send you updates about exam results, admit cards, and notifications if you opt in."
        },
        {
          title: "3. Google Analytics",
          content: "We use Google Analytics to analyze website traffic and usage patterns. Google Analytics collects information such as how often users visit the site, what pages they visit, and what other sites they used prior to coming to our site. We use this information to improve our website. Google Analytics collects only the IP address assigned to you on the date you visit this site. We do not combine the information collected through Google Analytics with personally identifiable information."
        },
        {
          title: "4. Google AdSense",
          content: "We use Google AdSense to display advertisements on our website. Google AdSense uses cookies to serve ads based on your prior visits to our website or other websites. You may opt out of personalized advertising by visiting Google Ads Settings."
        },
        {
          title: "5. Cookies",
          content: "Our website uses cookies to enhance your experience. Cookies are small text files stored on your device. We use cookies to remember your language preference, dark mode setting, and watchlist. You can disable cookies in your browser settings, but this may affect website functionality."
        },
        {
          title: "6. Third-Party Links",
          content: "Our website contains links to official government websites and exam portals. We are not responsible for the privacy practices of these external sites. We encourage you to review their privacy policies."
        },
        {
          title: "7. Data Security",
          content: "We implement appropriate security measures to protect your information. However, no method of transmission over the Internet is 100% secure."
        },
        {
          title: "8. Children\'s Privacy",
          content: "Our website is intended for users who are preparing for government exams. We do not knowingly collect personal information from children under 13."
        },
        {
          title: "9. Changes to This Policy",
          content: "We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new policy on this page with an updated date."
        },
        {
          title: "10. Contact Us",
          content: "If you have any questions about this Privacy Policy, please contact us at: sarkarisetu.india@gmail.com"
        }
      ].map((section, i) => (
        <div key={i} style={{ background: "#fff", borderRadius: 10, padding: 16, marginBottom: 12, border: "1px solid #e5e7eb" }}>
          <h2 style={{ fontSize: 15, fontWeight: 700, color: "#1e3a5f", margin: "0 0 8px" }}>{section.title}</h2>
          <p style={{ fontSize: 13, color: "#4b5563", lineHeight: 1.6, margin: 0 }}>{section.content}</p>
        </div>
      ))}

      <div style={{ background: "#f0f9ff", borderRadius: 10, padding: 16, border: "1px solid #bae6fd", textAlign: "center" }}>
        <p style={{ fontSize: 12, color: "#0369a1", margin: 0 }}>
          ⚡ SarkariSetu India — Not affiliated with any government body.<br/>
          This website provides information about government exams for educational purposes only.
        </p>
      </div>
    </div>
  );
}
