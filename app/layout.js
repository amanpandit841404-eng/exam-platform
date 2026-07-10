import './globals.css';

export const metadata = {
  title: 'SarkariSetu India - Sarkari Exam Results, Admit Cards, Syllabus 2026',
  description: 'SarkariSetu India - India ka sabse bada exam portal. Sarkari exam results, admit cards, syllabus, application form dates, answer keys. UPSC, SSC, Railway, Banking, NEET, JEE aur sabhi sarkari exams ki latest updates.',
  keywords: 'sarkari result, sarkari exams, sarkari result 2026, upsc, ssc, railway, banking, neet, jee, admit card, exam result, sarkari naukri, government jobs',
  openGraph: {
    title: 'SarkariSetu India - Sarkari Exam Results, Admit Cards, Syllabus 2026',
    description: 'India ka sabse bada exam portal - 52,000+ exams, results, admit cards, syllabus',
    url: 'https://exam-platform-beta.vercel.app',
    siteName: 'SarkariSetu India',
    locale: 'hi_IN',
    type: 'website',
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function RootLayout({ children }) {
  return (
    <html lang="hi">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#16a34a" />
        <link rel="canonical" href="https://exam-platform-beta.vercel.app" />
      <link rel="manifest" href="/manifest.json" />
<meta name="apple-mobile-web-app-capable" content="yes" />
<meta name="apple-mobile-web-app-status-bar-style" content="green" />
</head>
      <body className="m-0 bg-gray-50" style={{fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'}}>
        {children}
      </body>
    </html>
  )
}
