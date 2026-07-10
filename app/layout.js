export const metadata = {
  title: 'SarkariSetu India - Sarkari Exam Results, Admit Cards, Syllabus 2026',
  description: 'SarkariSetu India - India ka sabse bada exam portal. Sarkari exam results, admit cards, syllabus, application form dates, answer keys. UPSC, SSC, Railway, Banking, NEET, JEE aur sabhi sarkari exams ki latest updates.',
  keywords: 'sarkari result, sarkari exams, sarkari result 2026, upsc, ssc, railway, banking, neet, jee, admit card, exam result, sarkari naukri, government jobs',
  openGraph: {
    title: 'SarkariSetu India - Sarkari Exam Results, Admit Cards, Syllabus 2026',
    description: 'India ka sabse bada exam portal - 33,000+ exams, results, admit cards, syllabus',
    url: 'https://exam-platform-beta.vercel.app',
    siteName: 'SarkariSetu India',
    locale: 'hi_IN',
    type: 'website',
  },
  robots: {
    index: true,
    follow: true,
  },
  verification: {
    google: '', // Google Search Console verification code yaha aayega
  },
}

export default function RootLayout({ children }) {
  return (
    <html lang="hi">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#16a34a" />
        <link rel="canonical" href="https://exam-platform-beta.vercel.app" />
      </head>
      <body style={{margin:0, background:'#E4E1DC'}}>
        {children}
      </body>
    </html>
  )
}
