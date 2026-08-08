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
  const bankingSlugs = ["ibps-po", "ibps-clerk", "ibps-so", "ibps-rrb", "sbi-po", "sbi-clerk", "rbi-grade-b", "rbi-assistant", "nabard-grade-a", "lic-aao", "sebi-grade-a"];
  const sscSlugs = ["ssc-cgl", "ssc-chsl", "ssc-mts", "ssc-gd", "ssc-cpo", "ssc-je", "ssc-stenographer", "ssc-selection-post", "ssc-jht", "ssc-delhi-police-constable", "ssc-scientific-assistant", "ssc-havaldar"];
  const upscSlugs = ["upsc-cse", "upsc-nda", "upsc-cds", "upsc-capf-ac", "upsc-cisf-ac", "upsc-ese", "upsc-cms", "upsc-ies-iss", "upsc-cgse", "upsc-epfo", "upsc-so-steno", "upsc-ifs"];
  const railwayPages = [{ url: `${baseUrl}/railway`, lastModified: now, changeFrequency: "daily", priority: 0.9 }].concat(
    railwaySlugs.map(slug => ({ url: `${baseUrl}/railway/${slug}`, lastModified: now, changeFrequency: "weekly", priority: 0.8 }))
  );
  const bankingPages = [{ url: `${baseUrl}/banking`, lastModified: now, changeFrequency: "daily", priority: 0.9 }].concat(
    bankingSlugs.map(slug => ({ url: `${baseUrl}/banking/${slug}`, lastModified: now, changeFrequency: "weekly", priority: 0.8 }))
  );
  const sscPages = [{ url: `${baseUrl}/ssc`, lastModified: now, changeFrequency: "daily", priority: 0.9 }].concat(
    sscSlugs.map(slug => ({ url: `${baseUrl}/ssc/${slug}`, lastModified: now, changeFrequency: "weekly", priority: 0.8 }))
  );
  const upscPages = [{ url: `${baseUrl}/upsc`, lastModified: now, changeFrequency: "daily", priority: 0.9 }].concat(
    upscSlugs.map(slug => ({ url: `${baseUrl}/upsc/${slug}`, lastModified: now, changeFrequency: "weekly", priority: 0.8 }))
  );
  const defenceSlugs = ["agniveer-army", "agniveer-vayu", "agniveer-navy", "afcat", "inet", "coast-guard-navik", "coast-guard-yantrik", "coast-guard-ac", "territorial-army", "army-ssc-tech", "mns", "drdo-ceptam"];
  const statePscSlugs = ["up-pcs", "bpsc", "mppsc", "rpsc-ras", "mpsc", "tnpsc", "appsc", "tspsc", "kpsc-kas", "wbpsc", "kerala-psc", "gpsc"];
  const teachingSlugs = ["ctet", "uptet", "reet", "kvs", "nvs", "dsssb", "bihar-tet", "mp-tet", "htet", "ugc-net", "bed-entrance", "awes"];
  const policeSlugs = ["up-police-constable", "up-police-si", "bihar-police", "mp-police", "rajasthan-police", "maharashtra-police", "gujarat-police", "karnataka-police", "tn-police", "wb-police", "punjab-police", "haryana-police"];
  const psuSlugs = ["iocl", "ongc", "bhel", "ntpc", "sail", "gail", "bel", "hal", "aai", "coal-india", "nmdc", "nhpc"];
  const insuranceSlugs = ["lic-ado", "niacl-ao", "nicl-ao", "uiic-ao", "irdai-am", "gic", "oicl-ao", "lic-hfl", "aic", "ecgc", "niacl-assistant", "nicl-assistant"];
  const postOfficeSlugs = ["gds", "postman", "mail-guard", "mts", "postal-assistant", "sorting-assistant", "accountant", "steno", "udc", "driver", "ippb-ja", "india-post-apprentice"];
  const healthSlugs = ["aiims-norcet", "rrb-staff-nurse", "nhm-staff-nurse", "esic-nursing-officer", "esic-paramedical", "up-cho", "aiims-paramedical", "aiims-bsc-nursing", "icmr-recruitment", "bihar-cho", "state-nursing-officer", "esic-pharmacist"];
  const forestSlugs = ["ifs", "forest-guard", "forest-range-officer", "forester", "up-forest-guard", "mp-forest-guard", "bihar-forest-guard", "rajasthan-forest-guard", "uttarakhand-forest-guard", "chhattisgarh-forest-guard", "maharashtra-forest-guard", "fri-icfre"];
  const judiciarySlugs = ["clat", "clat-pg", "ailet", "slat", "mh-cet-law", "ap-lawcet", "ts-lawcet", "cuet-pg-law", "pcs-j", "upsc-law-officer", "legal-officer-bank", "law-clerk-hc"];
  const defencePages = [{ url: `${baseUrl}/defence`, lastModified: now, changeFrequency: "daily", priority: 0.9 }].concat(
    defenceSlugs.map(slug => ({ url: `${baseUrl}/defence/${slug}`, lastModified: now, changeFrequency: "weekly", priority: 0.8 }))
  );
  const statePscPages = [{ url: `${baseUrl}/state-psc`, lastModified: now, changeFrequency: "daily", priority: 0.9 }].concat(
    statePscSlugs.map(slug => ({ url: `${baseUrl}/state-psc/${slug}`, lastModified: now, changeFrequency: "weekly", priority: 0.8 }))
  );

  const teachingPages = [{ url: `${baseUrl}/teaching`, lastModified: now, changeFrequency: "daily", priority: 0.9 }].concat(
    teachingSlugs.map(slug => ({ url: `${baseUrl}/teaching/${slug}`, lastModified: now, changeFrequency: "weekly", priority: 0.8 }))
  );
  const policePages = [{ url: `${baseUrl}/police`, lastModified: now, changeFrequency: "daily", priority: 0.9 }].concat(
    policeSlugs.map(slug => ({ url: `${baseUrl}/police/${slug}`, lastModified: now, changeFrequency: "weekly", priority: 0.8 }))
  );
  const psuPages = [{ url: `${baseUrl}/psu`, lastModified: now, changeFrequency: "daily", priority: 0.9 }].concat(
    psuSlugs.map(slug => ({ url: `${baseUrl}/psu/${slug}`, lastModified: now, changeFrequency: "weekly", priority: 0.8 }))
  );
  const insurancePages = [{ url: `${baseUrl}/insurance`, lastModified: now, changeFrequency: "daily", priority: 0.9 }].concat(
    insuranceSlugs.map(slug => ({ url: `${baseUrl}/insurance/${slug}`, lastModified: now, changeFrequency: "weekly", priority: 0.8 }))
  );
  const postOfficePages = [{ url: `${baseUrl}/post-office`, lastModified: now, changeFrequency: "daily", priority: 0.9 }].concat(
    postOfficeSlugs.map(slug => ({ url: `${baseUrl}/post-office/${slug}`, lastModified: now, changeFrequency: "weekly", priority: 0.8 }))
  );
  const healthPages = [{ url: `${baseUrl}/health`, lastModified: now, changeFrequency: "daily", priority: 0.9 }].concat(
    healthSlugs.map(slug => ({ url: `${baseUrl}/health/${slug}`, lastModified: now, changeFrequency: "weekly", priority: 0.8 }))
  );
  const forestPages = [{ url: `${baseUrl}/forest`, lastModified: now, changeFrequency: "daily", priority: 0.9 }].concat(
    forestSlugs.map(slug => ({ url: `${baseUrl}/forest/${slug}`, lastModified: now, changeFrequency: "weekly", priority: 0.8 }))
  );
  const judiciaryPages = [{ url: `${baseUrl}/judiciary`, lastModified: now, changeFrequency: "daily", priority: 0.9 }].concat(
    judiciarySlugs.map(slug => ({ url: `${baseUrl}/judiciary/${slug}`, lastModified: now, changeFrequency: "weekly", priority: 0.8 }))
  );
  return [...staticPages, ...categoryPages, ...examPages, ...certPages, ...railwayPages, ...bankingPages, ...sscPages, ...upscPages, ...defencePages, ...statePscPages, ...teachingPages, ...policePages, ...psuPages, ...insurancePages, ...postOfficePages, ...healthPages, ...forestPages, ...judiciaryPages, ...resultPages, ...admitPages];
}
