
'use client';
import { useParams } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Link from 'next/link';
import { journals, articles } from '@/lib/data';
import { BookOpen, Calendar, ChevronRight, LayoutGrid, List } from 'lucide-react';

import JournalHero from '@/components/JournalHero';

export default function JournalArchivesPage() {
  const { slug } = useParams();
  const journal = journals.find(j => j.slug === slug) || journals[0];
  const journalArticles = articles.filter(a => a.journal.toLowerCase() === journal.id.toLowerCase());

  return (
    <div className="min-h-screen flex flex-col font-sans bg-white selection:bg-[#4BA6B9]/10">
      <Header />
      
      <JournalHero journal={journal} activeTab="archives" />

      {/* Breadcrumb Band */}
      <div className="w-full bg-[#FAFBFC] py-4 px-6 border-b border-[#F1F5F9] text-[10px] font-bold uppercase tracking-widest text-[#999999]">
         <div className="max-w-[1240px] mx-auto space-x-3 flex items-center">
            <Link href="/" className="hover:text-[#4BA6B9]">Main</Link>
            <ChevronRight size={10} />
            <Link href={`/journals/${journal.slug}`} className="hover:text-[#4BA6B9]">{journal.title}</Link>
            <ChevronRight size={10} />
            <span className="text-[#1A1A1A]">Archives</span>
         </div>
      </div>

      <main className="flex-grow pb-40 px-6">
        <div className="max-w-[1240px] mx-auto mt-20 space-y-24">
           {/* Listing Past Issues */}
           <div className="space-y-12">
              <div className="flex border-b border-[#F1F5F9] pb-6 justify-between items-end">
                 <h2 className="text-2xl font-sans font-bold text-[#1A1A1A] ">All Issues</h2>
                 <div className="flex gap-4">
                    <button className="p-2 border border-[#E2E8F0] rounded bg-[#F8FAFC] text-[#4BA6B9]"><LayoutGrid size={18} /></button>
                    <button className="p-2 border border-[#E2E8F0] rounded bg-white text-[#999999]"><List size={18} /></button>
                 </div>
              </div>

              <div className="flex flex-col items-center justify-center py-40 space-y-8 bg-[#FAFBFC] rounded-3xl border-2 border-dashed border-[#E2E8F0]">
                 <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center shadow-xl border border-[#F1F5F9]">
                    <LayoutGrid size={32} className="text-[#BBBBBB]" />
                 </div>
                 <div className="text-center space-y-4">
                    <h3 className="text-2xl font-sans font-bold text-[#1A1A1A] uppercase tracking-tight">No archives found</h3>
                    <p className="text-sm font-bold text-[#999999] uppercase tracking-widest max-w-sm mx-auto leading-relaxed">This journal is currently operating its initial volume. Past issues will appear here once archived.</p>
                 </div>
              </div>
           </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
