import Header from '@/components/Header';
import Footer from '@/components/Footer';
import pool from '@/lib/db';
import ArticlesClient from './ArticlesClient';

export const metadata = {
  title: "Published Articles | Eye-Innovations Scientific Research",
  description: "Browse the repository of peer-reviewed scientific articles published by EISR.",
};

// Disable caching for this page to ensure new publications show up immediately
export const revalidate = 0;

export default async function ArticlesPage() {
  let publishedArticles = [];
  try {
    const [rows] = await pool.query(`
      SELECT 
        s.id, s.title, s.journal_id, COALESCE(s.scheduled_at, s.created_at) as published_date,
        IFNULL(GROUP_CONCAT(sc.name ORDER BY sc.id SEPARATOR ', '), u.fullName) as authors
      FROM submissions s
      JOIN users u ON s.user_id = u.id
      LEFT JOIN submission_contributors sc ON s.id = sc.submission_id
      WHERE (s.status = 'Published' OR s.status = 'Scheduled') AND (s.scheduled_at IS NULL OR s.scheduled_at <= ?)
      GROUP BY s.id
      ORDER BY COALESCE(s.scheduled_at, s.created_at) DESC
    `, [new Date()]);
    publishedArticles = rows;
  } catch (error) {
    console.error('Error fetching published articles:', error);
  }

  return (
    <div className="min-h-screen flex flex-col font-sans bg-[#f8fafc] selection:bg-[#005f96]/10">
      <Header />
      
      <main className="flex-grow pb-20 px-6 mt-12">
        <section className="max-w-[1000px] mx-auto mb-10">
          <h1 className="text-3xl font-bold text-[#1e293b] mb-8">Published Articles</h1>
          
          <ArticlesClient initialArticles={publishedArticles} />

        </section>
      </main>
      
      <Footer />
    </div>
  );
}
