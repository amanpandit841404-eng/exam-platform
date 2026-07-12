export default function robots() {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin', '/api/', '/quick-add', '/_next/'],
      },
    ],
    sitemap: 'https://exam-platform-beta.vercel.app/sitemap.xml',
  };
}
