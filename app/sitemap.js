import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://fbcvxefvvifmxaiqxiuq.supabase.co";
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "sb_publishable_BShV19iGgcoKLiIsyvQ2Lg_1Lhe9uPV";
const supabase = createClient(supabaseUrl, supabaseKey);

export default async function sitemap() {
  const baseUrl = "https://sarkarisetu.in";
  const now = new Date().toISOString();

  // Static pages
  const staticPages = [
    { url: baseUrl, lastModified: now, changeFrequency: "hourly", priority: 1.0 },
    { url: `${baseUrl}/results`, lastModified: now, changeFrequency: "hourly", priority: 0.9 },
    { url: `${baseUrl}/admit-cards`, lastModified: now, changeFrequency: "hourly", priority: 0.9 },
    { url: `${baseUrl}/syllabus`, lastModified: now, changeFrequency: "daily", priority: 0.8 },
    { url: `${baseUrl}/answer-keys`, lastModified: now, changeFrequency: "daily", priority: 0.8 },
    { url: `${baseUrl}/notifications`, lastModified: now, changeFrequency: "hourly", priority: 0.8 },
    { url: `${baseUrl}/jobs`, lastModified: now, changeFrequency: "daily", priority: 0.8 },
    { url: `${baseUrl}/cutoff`, lastModified: now, changeFrequency: "daily", priority: 0.8 },
    { url: `${baseUrl}/merit-list`, lastModified: now, changeFrequency: "daily", priority: 0.7 },
    { url: `${baseUrl}/vacancy`, lastModified: now, changeFrequency: "daily", priority: 0.8 },
    { url: `${baseUrl}/hall-ticket`, lastModified: now, changeFrequency: "daily", priority: 0.7 },
    { url: `${baseUrl}/search`, lastModified: now, changeFrequency: "weekly", priority: 0.6 },
    { url: `${baseUrl}/about`, lastModified: now, changeFrequency: "monthly", priority: 0.4 },
    { url: `${baseUrl}/contact`, lastModified: now, changeFrequency: "monthly", priority: 0.4 },
    { url: `${baseUrl}/privacy-policy`, lastModified: now, changeFrequency: "monthly", priority: 0.3 },
  ];

  // Category pages
  const categories = ["ssc","upsc","banking","railway","state-psc","defence","teaching","police","engineering","medical","law","agriculture"];
  const categoryPages = categories.map(slug => ({
    url: `${baseUrl}/category/${slug}`,
    lastModified: now,
    changeFrequency: "daily",
    priority: 0.8,
  }));

  // Exam pages - fetch top 5000 exams
  let examPages = [];
  try {
    const { data } = await supabase.from("exams").select("id,updated_at").order("id").limit(5000);
    if (data) {
      examPages = data.map(exam => ({
        url: `${baseUrl}/exam/${exam.id}`,
        lastModified: exam.updated_at || now,
        changeFrequency: "weekly",
        priority: 0.7,
      }));
    }
  } catch(e) { console.error("Sitemap exam fetch error:", e); }

  // Result pages
  let resultPages = [];
  try {
    const { data } = await supabase.from("results").select("id,created_at").order("id").limit(500);
    if (data) {
      resultPages = data.map(r => ({
        url: `${baseUrl}/results/${r.id}`,
        lastModified: r.created_at || now,
        changeFrequency: "weekly",
        priority: 0.8,
      }));
    }
  } catch(e) {}

  // Admit card pages
  let admitPages = [];
  try {
    const { data } = await supabase.from("admit_cards").select("id,created_at").order("id").limit(500);
    if (data) {
      admitPages = data.map(a => ({
        url: `${baseUrl}/admit-cards/${a.id}`,
        lastModified: a.created_at || now,
        changeFrequency: "weekly",
        priority: 0.8,
      }));
    }
  } catch(e) {}

  return [...staticPages, ...categoryPages, ...examPages, ...resultPages, ...admitPages];
}
