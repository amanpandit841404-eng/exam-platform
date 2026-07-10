"use client";

import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { useParams } from 'next/navigation';

export default function CategoryPage() {
  const params = useParams();
  const slug = params.slug;
  const [category, setCategory] = useState(null);
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalCount, setTotalCount] = useState(0);

  useEffect(() => {
    if (!slug) return;

    async function loadCategory() {
      try {
        // First try to find category by slug
        const { data: catData } = await supabase
          .from('categories')
          .select('*')
          .eq('slug', slug)
          .maybeSingle();

        const categoryName = catData?.name || slug.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
        
        if (catData) setCategory(catData);
        document.title = `${categoryName} Exams - Latest Updates | SarkariSetu India`;

        // Fetch exams in this category
        const { data: examData } = await supabase
          .from('exams')
          .select('id, name, full_name, category, created_at')
          .eq('category', catData?.name || slug)
          .order('created_at', { ascending: false });

        if (examData) {
          setExams(examData);
          setTotalCount(examData.length);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadCategory();
  }, [slug]);

  const displayName = category?.name || slug?.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()) || 'Category';

  return (
    <div style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif', maxWidth: '800px', margin: '0 auto', backgroundColor: '#f5f5f5', minHeight: '100vh' }}>
      <div style={{ backgroundColor: '#1f2937', color: 'white', padding: '16px 20px' }}>
        <a href="/" style={{ color: '#16a34a', textDecoration: 'none', fontSize: '14px' }}>← Back to Home</a>
        <h1 style={{ fontSize: '22px', margin: '10px 0 5px', color: '#fff' }}>{displayName} Exams</h1>
        <span style={{ fontSize: '14px', color: '#9ca3af' }}>{totalCount.toLocaleString()} exams in this category</span>
      </div>

      <div style={{ padding: '16px' }}>
        {loading ? (
          <p style={{ textAlign: 'center', color: '#6b7280', padding: '40px' }}>Loading exams...</p>
        ) : (
          <div style={{ backgroundColor: 'white', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
            {exams.length > 0 ? exams.map((exam, i) => (
              <a key={exam.id} href={`/exam/${exam.id}`} style={{ display: 'block', padding: '12px 16px', borderBottom: i < exams.length - 1 ? '1px solid #f3f4f6' : 'none', textDecoration: 'none', color: '#111827' }}>
                <div style={{ fontWeight: '600', fontSize: '14px', color: '#2563eb' }}>{exam.full_name || exam.name}</div>
                <div style={{ fontSize: '12px', color: '#6b7280', marginTop: '4px' }}>
                  {exam.category} | Updated recently
                </div>
              </a>
            )) : (
              <p style={{ padding: '40px', textAlign: 'center', color: '#6b7280' }}>
                No exams found in this category.
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
