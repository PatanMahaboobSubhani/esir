'use client';
import { useParams } from 'next/navigation';
import { useState, useEffect, useMemo } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Link from 'next/link';
import { journals } from '@/lib/data';
import {
  Calendar, ChevronRight, Search, Eye, ExternalLink,
  BookOpen, User, SortAsc, SortDesc, Loader2, AlertCircle
} from 'lucide-react';
import JournalHero from '@/components/JournalHero';

export default function CurrentIssuePage() {
  const { slug } = useParams();
  const journal = journals.find(j => j.slug === slug) || journals[0];

  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOrder, setSortOrder] = useState('newest');

  useEffect(() => {
    async function fetchArticles() {
      try {
        setLoading(true);
        setError(null);
        const res = await fetch(`/api/articles?journal=${journal.id}`);
        const data = await res.json();
        if (data.success) {
          setArticles(data.articles || []);
        } else {
          setError('Failed to load articles.');
        }
      } catch (err) {
        setError('Network error. Please try again.');
      } finally {
        setLoading(false);
      }
    }
    fetchArticles();
  }, [journal.id]);

  const filteredArticles = useMemo(() => {
    const filtered = articles.filter(art => {
      if (!searchTerm.trim()) return true;
      const q = searchTerm.toLowerCase();
      return art.title?.toLowerCase().includes(q) || art.authors?.toLowerCase().includes(q);
    });

    return filtered.sort((a, b) => {
      const dateA = new Date(a.published_date).getTime();
      const dateB = new Date(b.published_date).getTime();
      return sortOrder === 'newest' ? dateB - dateA : dateA - dateB;
    });
  }, [articles, searchTerm, sortOrder]);

  const formatDate = (dateStr) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  };

  const buildDoi = (art) => {
    const year = new Date(art.published_date).getFullYear();
    if (art.doi) return art.doi;
    return `https://doi.org/10.63180/${art.journal_id}.eisr.${year}.1.${art.id}`;
  };

  return (
    <div className="min-h-screen flex flex-col font-sans bg-white">
      <Header />
      <JournalHero journal={journal} activeTab="current" />

      {/* Breadcrumb */}
      <div className="w-full bg-[#FAFBFC] py-4 px-6 border-b border-[#F1F5F9] text-[10px] font-bold uppercase tracking-widest text-[#999999]">
        <div className="max-w-[1240px] mx-auto space-x-3 flex items-center">
          <Link href="/" className="hover:text-[#4BA6B9]">Main</Link>
          <ChevronRight size={10} />
          <Link href={`/journals/${journal.slug}`} className="hover:text-[#4BA6B9]">{journal.title}</Link>
          <ChevronRight size={10} />
          <span className="text-[#1A1A1A]">Current Issue</span>
        </div>
      </div>

      <main className="flex-grow pb-40 px-6">
        <div className="max-w-[1240px] mx-auto mt-16">

          {/* Section Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#F1F5F9] pb-6 mb-10">
            <div>
              <h3 className="text-2xl font-bold text-[#1A1A1A] uppercase tracking-tight">
                Current Published Articles
              </h3>
              {!loading && !error && (
                <p className="text-sm text-[#888] mt-1">
                  {filteredArticles.length} article{filteredArticles.length !== 1 ? 's' : ''} published in <span className="font-semibold text-[#4BA6B9]">{journal.acronym}</span>
                </p>
              )}
            </div>

            {/* Controls */}
            {!loading && !error && articles.length > 0 && (
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                {/* Search */}
                <div className="relative">
                  <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#AAAAAA]" />
                  <input
                    type="text"
                    placeholder="Search title or author…"
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                    className="pl-9 pr-4 py-2.5 text-sm border border-[#E2E8F0] rounded-xl bg-[#FAFBFC] text-[#1A1A1A] placeholder-[#BBBBBB] focus:outline-none focus:border-[#4BA6B9] focus:ring-1 focus:ring-[#4BA6B9]/30 w-64 transition"
                  />
                </div>
                {/* Sort */}
                <button
                  onClick={() => setSortOrder(p => p === 'newest' ? 'oldest' : 'newest')}
                  className="flex items-center gap-2 px-4 py-2.5 text-sm font-semibold border border-[#E2E8F0] rounded-xl bg-white text-[#555] hover:bg-[#F8FAFB] transition"
                >
                  {sortOrder === 'newest' ? <SortDesc size={15} /> : <SortAsc size={15} />}
                  {sortOrder === 'newest' ? 'Newest First' : 'Oldest First'}
                </button>
              </div>
            )}
          </div>

          {/* ── LOADING STATE ── */}
          {loading && (
            <div className="flex flex-col items-center justify-center py-40 space-y-5">
              <Loader2 size={44} className="text-[#4BA6B9] animate-spin" />
              <p className="text-sm font-bold uppercase tracking-widest text-[#AAAAAA]">Loading articles…</p>
            </div>
          )}

          {/* ── ERROR STATE ── */}
          {!loading && error && (
            <div className="flex flex-col items-center justify-center py-40 space-y-5 bg-red-50 rounded-3xl border-2 border-dashed border-red-200">
              <AlertCircle size={44} className="text-red-400" />
              <p className="text-sm font-bold uppercase tracking-widest text-red-400">{error}</p>
            </div>
          )}

          {/* ── EMPTY STATE ── */}
          {!loading && !error && articles.length === 0 && (
            <div className="flex flex-col items-center justify-center py-40 space-y-8 bg-[#FAFBFC] rounded-3xl border-2 border-dashed border-[#E2E8F0]">
              <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center shadow-xl border border-[#F1F5F9]">
                <Calendar size={32} className="text-[#BBBBBB]" />
              </div>
              <div className="text-center space-y-4">
                <h3 className="text-2xl font-bold text-[#1A1A1A] uppercase tracking-tight">No issues published yet</h3>
                <p className="text-sm font-bold text-[#999999] uppercase tracking-widest max-w-sm mx-auto leading-relaxed">
                  The debut issue of this journal is currently in preparation. All accepted articles will be published shortly.
                </p>
              </div>
            </div>
          )}

          {/* ── NO SEARCH RESULTS ── */}
          {!loading && !error && articles.length > 0 && filteredArticles.length === 0 && (
            <div className="flex flex-col items-center justify-center py-24 space-y-4 bg-[#FAFBFC] rounded-3xl border-2 border-dashed border-[#E2E8F0]">
              <Search size={36} className="text-[#CCCCCC]" />
              <p className="text-sm font-bold uppercase tracking-widest text-[#AAAAAA]">No articles match your search</p>
              <button onClick={() => setSearchTerm('')} className="text-sm text-[#4BA6B9] font-semibold hover:underline">
                Clear search
              </button>
            </div>
          )}

          {/* ── ARTICLES LIST ── */}
          {!loading && !error && filteredArticles.length > 0 && (
            <div className="space-y-5">
              {filteredArticles.map((art, idx) => {
                const doi = buildDoi(art);
                const pubDate = formatDate(art.published_date);
                return (
                  <article
                    key={art.id}
                    className="group bg-white border border-[#EAECF0] rounded-2xl p-7 hover:border-[#4BA6B9]/40 hover:shadow-lg transition-all duration-200"
                  >
                    {/* Top row: journal tag + date */}
                    <div className="flex flex-wrap items-center gap-3 mb-3">
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#EBF7FA] text-[#2E8FA3] text-[10px] font-extrabold uppercase tracking-widest rounded-full">
                        <BookOpen size={11} />
                        {journal.acronym}
                      </span>
                      <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-[#999] uppercase tracking-wide">
                        <Calendar size={11} />
                        {pubDate}
                      </span>
                      {art.views > 0 && (
                        <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-[#999] uppercase tracking-wide">
                          <Eye size={11} />
                          {art.views.toLocaleString()} views
                        </span>
                      )}
                      <span className="ml-auto text-[11px] font-bold text-[#CCCCCC] uppercase tracking-widest">#{idx + 1}</span>
                    </div>

                    {/* Title */}
                    <Link href={`/articles/${art.id}`}>
                      <h2 className="text-xl font-bold text-[#1A1A1A] leading-snug group-hover:text-[#2E8FA3] transition-colors cursor-pointer mb-2">
                        {art.title}
                      </h2>
                    </Link>

                    {/* Authors */}
                    {art.authors && (
                      <div className="flex items-start gap-2 mb-4">
                        <User size={14} className="text-[#4BA6B9] mt-0.5 shrink-0" />
                        <p className="text-sm text-[#555] font-medium leading-relaxed">
                          {art.authors}
                        </p>
                      </div>
                    )}

                    {/* Divider */}
                    <div className="border-t border-[#F1F5F9] pt-4 flex flex-wrap items-center justify-between gap-3">
                      {/* DOI */}
                      <a
                        href={doi}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#4BA6B9] hover:text-[#2E8FA3] hover:underline transition-colors"
                      >
                        <ExternalLink size={12} />
                        {doi}
                      </a>

                      {/* View Article CTA */}
                      <Link
                        href={`/articles/${art.id}`}
                        className="inline-flex items-center gap-2 px-5 py-2 text-xs font-bold uppercase tracking-widest bg-[#1A1A1A] text-white rounded-xl hover:bg-[#4BA6B9] transition-colors"
                      >
                        View Article
                        <ChevronRight size={13} />
                      </Link>
                    </div>
                  </article>
                );
              })}
            </div>
          )}

        </div>
      </main>

      <Footer />
    </div>
  );
}
