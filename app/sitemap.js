import { supabase } from './lib/supabase';

const BASE_URL = 'https://exam-platform-beta.vercel.app';

export default async function sitemap() {
  const staticPages = [
    { url: BASE_URL, lastModified: new Date(), changeFrequency: 'hourly', priority: 1.0 },
    { url: `${BASE_URL}/results`, lastModified: new Date(), changeFrequency: 'hourly', priority: 0.9 },
    { url: `${BASE_URL}/admit-cards`, lastModified: new Date(), changeFrequency: 'hourly', priority: 0.9 },
    { url: `${BASE_URL}/syllabus`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.8 },
    { url: `${BASE_URL}/answer-keys`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.8 },
    { url: `${BASE_URL}/notifications`, lastModified: new Date(), changeFrequency: 'hourly', priority: 0.7 },
    { url: `${BASE_URL}/search`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.5 },
  ];

  // Fetch all exams
  const { data: exams } = await supabase
    .from('exams')
    .select('id, name, updated_at, category')
    .order('id', { ascending: true });

  const examPages = (exams || []).map((exam) => ({
    url: `${BASE_URL}/exam/${exam.id}`,
    lastModified: exam.updated_at || new Date(),
    changeFrequency: 'weekly',
    priority: exam.category === 'upsc' || exam.category === 'ssc' ? 0.9 : 0.6,
  }));

  // Fetch all categories
  const { data: categories } = await supabase
    .from('categories')
    .select('name, slug');

  const categoryPages = (categories || []).map((cat) => {
    const slug = cat.slug || cat.name.toLowerCase().replace(/\s+/g, '-');
    return {
      url: `${BASE_URL}/category/${slug}`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.8,
    };
  });

  // Fetch results pages
  const { data: results } = await supabase
    .from('results')
    .select('id')
    .order('id', { ascending: false })
    .limit(1000);

  const resultPages = (results || []).map((r) => ({
    url: `${BASE_URL}/check-result/${r.id}`,
    lastModified: new Date(),
    changeFrequency: 'daily',
    priority: 0.7,
  }));

  return [...staticPages, ...categoryPages, ...examPages, ...resultPages];
}
