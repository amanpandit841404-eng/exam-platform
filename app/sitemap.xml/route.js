import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  const baseUrl = "https://exam-platform-beta.vercel.app";
  const now = new Date().toISOString();
  const sitemaps = [
    `${baseUrl}/sitemap-static.xml`,
    `${baseUrl}/sitemaps/sitemap-exams-1.xml`,
    `${baseUrl}/sitemaps/sitemap-exams-2.xml`,
    `${baseUrl}/sitemaps/sitemap-results.xml`,
    `${baseUrl}/sitemaps/sitemap-admits.xml`,
  ];
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${sitemaps.map((s) => `  <sitemap><loc>${s}</loc><lastmod>${now}</lastmod></sitemap>`).join("\n")}
</sitemapindex>`;
  return new NextResponse(xml, {
    headers: { "Content-Type": "application/xml" },
  });
}
