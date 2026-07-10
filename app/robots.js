export default function robots() {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: '/admin',
    },
    sitemap: 'https://exam-platform-beta.vercel.app/sitemap.xml',
  };
}
