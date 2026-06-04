'use client';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Mail, Globe, Search } from 'lucide-react';
import Link from 'next/link';
import { journals } from '@/lib/data';
import { useState } from 'react';

export default function ContactPage() {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredJournals = journals.filter(j => 
    j.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    j.contactEmail.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen flex flex-col font-sans bg-white selection:bg-[#4BA6B9]/10">
      <Header />
      
      <main className="flex-grow pb-20 px-6 mt-8">
        <section className="bg-white pb-8 text-center">
           <div className="max-w-[1240px] mx-auto space-y-3">
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-[#4BA6B9]">Contact • Eye-Innovations Scientific Research</span>
              <h1 className="text-3xl md:text-4xl font-sans font-black text-[#1A1A1A] tracking-tighter">Contact Directory</h1>
              <p className="text-[13px] font-bold text-[#333333] max-w-xl mx-auto opacity-70 leading-relaxed">Reach the publisher team or contact a specific journal directly.</p>
           </div>
        </section>

        {/* Publisher Email Section */}
        <section className="flex justify-center">
           <div className="w-full max-w-[700px] bg-white rounded-2xl p-6 md:p-8 border border-[#E2E8F0] shadow-xl flex flex-col md:flex-row items-center justify-between gap-6 group transition-all hover:bg-[#FBFCFD]">
              <div className="space-y-2 shrink-0 text-center md:text-left">
                 <h4 className="text-[10px] font-black uppercase tracking-widest text-[#555555]">Primary Publisher Inquiry</h4>
                 <p className="text-2xl font-black text-[#1A1A1A] tracking-tight">info@EISRpress.com</p>
              </div>
              <div className="flex items-center space-x-4">
                 <Link href="/#contact" className="px-8 py-3 bg-[#1A1A1A] rounded-xl text-[11px] font-black uppercase tracking-widest text-white shadow-lg hover:bg-[#4BA6B9] transition-all">Send Email Invitation</Link>
              </div>
           </div>
        </section>

        {/* Journals Grid */}
        <section className="mt-12 max-w-[1240px] mx-auto">
           <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-10 border-b border-[#F1F5F9] pb-6">
              <h2 className="text-xl font-black text-[#1A1A1A] tracking-tight">Scientific Journal Contacts</h2>
              
              <div className="relative group w-full md:w-80">
                 <input 
                   type="text" 
                   placeholder="Search journal or email..." 
                   className="w-full bg-[#F8F9FB] border border-[#E2E8F0] rounded-xl p-3.5 pl-6 text-[13px] font-bold placeholder:text-[#BBBBBB]/40 outline-none transition-all focus:ring-2 focus:ring-[#4BA6B9]/20"
                   value={searchQuery}
                   onChange={(e) => setSearchQuery(e.target.value)}
                 />
                 <Search className="absolute right-5 top-1/2 -translate-y-1/2 text-[#BBBBBB]/40 group-hover:text-[#4BA6B9] transition-colors" size={16} />
              </div>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredJournals.length > 0 ? (
                filteredJournals.map((j) => (
                  <div key={j.id} className="bg-white rounded-2xl p-6 md:p-8 border border-[#E2E8F0] shadow-sm hover:shadow-lg transition-all duration-500 space-y-6 group overflow-hidden relative">
                     <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="space-y-2">
                           <h4 className="text-lg font-black text-[#1A1A1A] group-hover:text-[#4BA6B9] transition-colors leading-tight">{j.title}</h4>
                           <p className="text-[12px] text-[#4BA6B9] font-black uppercase tracking-tight">{j.contactEmail}</p>
                        </div>
                     </div>
                     <div className="flex items-center justify-between pt-4 border-t border-[#F1F5F9]">
                        <span className="text-[10px] font-bold text-[#BBBBBB] uppercase tracking-widest">Journal contact inbox</span>
                        <Link href="/#contact" className="text-[11px] font-black text-[#1A1A1A] hover:text-[#4BA6B9] transition-all flex items-center group/btn uppercase tracking-widest">
                           Compose email <Globe size={14} className="ml-2 transition-transform group-hover/btn:rotate-12" />
                        </Link>
                     </div>
                  </div>
                ))
              ) : (
                <div className="col-span-full py-20 text-center text-[#BBBBBB] font-bold">
                   No journals found matching "{searchQuery}"
                </div>
              )}
           </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
}
