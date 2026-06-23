export const metadata = {
  title: 'SarkariSetu India - Exam Results, Admit Cards, Notifications',
  description: 'India ka sabse bada Exam Hub - 520+ exams, results, admit cards, syllabus',
}

export default function RootLayout({ children }) {
  return (
    <html lang="hi">
      <body style={{margin:0, background:'#E4E1DC'}}>
        {children}
      </body>
    </html>
  )
}

