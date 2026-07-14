import { NextResponse } from "next/server";

    export function GET() {
      const body = \`User-agent: *
    Allow: /

    # Important pages
    Allow: /exam/
    Allow: /results/
    Allow: /admit-cards/
    Allow: /syllabus
    Allow: /answer-keys
    Allow: /cutoff
    Allow: /merit-list
    Allow: /vacancy
    Allow: /jobs
    Allow: /category/
    Allow: /notifications

    # Disallow admin
    Disallow: /admin/
    Disallow: /api/
    Disallow: /quick-add/

    Sitemap: https://sarkarisetu.in/sitemap.xml
    Sitemap: https://exam-platform-beta.vercel.app/sitemap.xml
    \`;
      return new NextResponse(body, {
        headers: { "Content-Type": "text/plain" }
      });
    }
    