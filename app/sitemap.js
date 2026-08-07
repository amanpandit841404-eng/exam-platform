const supabaseUrl = "https://fbcvxefvvifmxaiqxiuq.supabase.co";
const supabaseKey = "sb_publishable_BShV19iGgcoKLiIsyvQ2Lg_1Lhe9uPV";

async function restGet(path) {
  try {
    const res = await fetch(supabaseUrl + "/rest/v1/" + path, {
      headers: { apikey: supabaseKey, Authorization: "Bearer " + supabaseKey },
      cache: "no-store",
    });
    if (!res.ok) return null;
    return await res.json();
  } catch (e) {
    console.error("Sitemap fetch error:", e.message);
    return null;
  }
}

export default async function sitemap() {
  const baseUrl = "https://exam-platform-beta.vercel.app";
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
    { url: `${baseUrl}/certifications`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: `${baseUrl}/pdf-library`, lastModified: now, changeFrequency: "weekly", priority: 0.6 },
  ];

  // Category pages
  const categories = ["ssc", "upsc", "banking", "railway", "state-psc", "defence", "teaching", "police", "engineering", "medical", "law", "agriculture"];
  const categoryPages = categories.map(slug => ({
    url: `${baseUrl}/category/${slug}`,
    lastModified: now,
    changeFrequency: "daily",
    priority: 0.8,
  }));

  const certSlug = (s) => (s || "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

  // Exam pages - top 5000 exams
  let examPages = [];
  const exams = await restGet("exams?select=id,created_at&order=id.desc&limit=1000");
  if (exams && Array.isArray(exams)) {
    examPages = exams.map(exam => ({
      url: `${baseUrl}/exam/${exam.id}`,
      lastModified: exam.created_at || now,
      changeFrequency: "weekly",
      priority: 0.7,
    }));
  }

  // Certification Center pages - 29 category pages + all certification detail pages
  let certPages = [];
  const certs = await restGet("exams?select=name,category&category=ilike.*Professional%20Certification*&is_active=eq.true&order=name.asc");
  if (certs && Array.isArray(certs)) {
    const seen = {};
    certs.forEach((c) => {
      const cat = (c.category || "").replace("Professional Certification - ", "");
      const cs = certSlug(cat);
      if (!seen[cs]) {
        seen[cs] = 1;
        certPages.push({ url: `${baseUrl}/certifications/${cs}`, lastModified: now, changeFrequency: "weekly", priority: 0.8 });
      }
      certPages.push({ url: `${baseUrl}/certifications/${cs}/${certSlug(c.name)}`, lastModified: now, changeFrequency: "weekly", priority: 0.7 });
    });
  }

  // Result pages
  let resultPages = [];
  const results = await restGet("results?select=id,created_at&order=id.asc&limit=500");
  if (results && Array.isArray(results)) {
    resultPages = results.map(r => ({
      url: `${baseUrl}/results/${r.id}`,
      lastModified: r.created_at || now,
      changeFrequency: "weekly",
      priority: 0.8,
    }));
  }

  // Admit card pages
  let admitPages = [];
  const admits = await restGet("admit_cards?select=id,created_at&order=id.asc&limit=500");
  if (admits && Array.isArray(admits)) {
    admitPages = admits.map(a => ({
      url: `${baseUrl}/admit-cards/${a.id}`,
      lastModified: a.created_at || now,
      changeFrequency: "weekly",
      priority: 0.8,
    }));
  }

  // Railway Exams Center pages
  const railwaySlugs = ["rrb-ntpc", "rrb-group-d", "rrb-alp", "rrb-je", "rrb-sse", "rrb-technician", "rpf-constable", "rpf-si", "rrb-paramedical", "rrb-ministerial", "rrc-apprentice", "railway-psu"];
  const railwayPages = [{ url: `${baseUrl}/railway`, lastModified: now, changeFrequency: "daily", priority: 0.9 }].concat(
    railwaySlugs.map(slug => ({ url: `${baseUrl}/railway/${slug}`, lastModified: now, changeFrequency: "weekly", priority: 0.8 }))
  );

  return [...staticPages, ...categoryPages, ...examPages, ...certPages, ...railwayPages, ...resultPages, ...admitPages];
}
