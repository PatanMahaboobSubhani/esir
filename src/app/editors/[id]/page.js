
'use client';
import { useParams } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Link from 'next/link';
import { editors, journals } from '@/lib/data';
import { User, Mail, Globe, MapPin, BookOpen, GraduationCap, Award, ChevronRight } from 'lucide-react';

export default function EditorProfilePage() {
  const { id } = useParams();
  const editor = editors.find(e => e.id === id) || editors[0];
  const editorialJournals = journals.filter(j => j.editorialTeam.some(et => et.id === editor.id));

  return (
    <div className="min-h-screen flex flex-col font-sans bg-white selection:bg-[#4BA6B9]/10">
      <Header />
      
      {/* Profile Header */}
      <section className="bg-[#0B1F3A] text-white pt-48 pb-24 px-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#4BA6B9]/10 rounded-full blur-[100px] -mr-48 -mt-48" />
        <div className="max-w-[1240px] mx-auto relative z-10">
           <div className="flex flex-col md:flex-row items-center md:items-start gap-12">
              <div className="w-48 h-48 rounded-2xl bg-[#4BA6B9]/20 border-2 border-[#4BA6B9]/30 flex items-center justify-center overflow-hidden shrink-0 shadow-2xl">
                 {editor.photo ? (
                    <img src={editor.photo} alt={editor.name} className="w-full h-full object-cover" />
                 ) : (
                    <User size={80} className="text-[#4BA6B9]" />
                 )}
              </div>
              <div className="space-y-6 text-center md:text-left">
                 <div className="space-y-2">
                    <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-[#4BA6B9]">{editor.role}</span>
                    <h1 className="text-4xl md:text-6xl font-sans font-bold leading-tight ">{editor.name}</h1>
                 </div>
                 <div className="flex flex-wrap justify-center md:justify-start gap-6 text-sm font-bold text-white/70">
                    <div className="flex items-center gap-2">
                       <GraduationCap size={18} className="text-[#4BA6B9]" />
                       <span>{editor.affiliation}</span>
                    </div>
                    {editor.email && (
                       <div className="flex items-center gap-2">
                          <Mail size={18} className="text-[#4BA6B9]" />
                          <span>{editor.email}</span>
                       </div>
                    )}
                 </div>
              </div>
           </div>
        </div>
      </section>

      {/* Breadcrumb Band */}
      <div className="w-full bg-[#FAFBFC] py-4 px-6 border-b border-[#F1F5F9] text-[10px] font-bold uppercase tracking-widest text-[#999999]">
         <div className="max-w-[1240px] mx-auto space-x-3 flex items-center">
            <Link href="/" className="hover:text-[#4BA6B9]">Main</Link>
            <ChevronRight size={10} />
            <span className="text-[#1A1A1A]">Editor Profile</span>
            <ChevronRight size={10} />
            <span className="text-[#1A1A1A]">{editor.name}</span>
         </div>
      </div>

      <main className="flex-grow pb-40 px-6">
        <div className="max-w-[1240px] mx-auto mt-20 grid lg:grid-cols-12 gap-20">
           
           <div className="lg:col-span-8 space-y-16">
              <div className="space-y-8">
                 <h2 className="text-2xl font-sans font-bold text-[#1A1A1A] border-b border-[#F1F5F9] pb-6">Biography</h2>
                 <p className="text-base text-[#555555] leading-loose font-medium">
                    {editor.bio}
                 </p>
              </div>

              <div className="space-y-8">
                 <h2 className="text-2xl font-sans font-bold text-[#1A1A1A] border-b border-[#F1F5F9] pb-6">Research Interests</h2>
                 <div className="flex flex-wrap gap-3">
                    {editor.areas.map(area => (
                       <span key={area} className="px-6 py-2 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl text-xs font-bold text-[#1A1A1A]">
                          {area}
                       </span>
                    ))}
                 </div>
              </div>
           </div>

           <div className="lg:col-span-4 space-y-10">
              <div className="bg-[#FAFBFC] border border-[#E2E8F0] rounded-2xl p-8 space-y-8">
                 <h3 className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#4BA6B9]">Journal Roles</h3>
                 <div className="space-y-6">
                    {editorialJournals.length > 0 ? editorialJournals.map(j => (
                       <Link key={j.id} href={`/journals/${j.slug}`} className="block group">
                          <div className="bg-white p-5 rounded-xl border border-[#E2E8F0] shadow-sm group-hover:shadow-md transition-all">
                             <p className="text-[9px] font-bold uppercase tracking-widest text-white px-2 py-0.5 bg-[#4BA6B9] inline-block rounded mb-3">{editor.role}</p>
                             <h4 className="text-sm font-bold text-[#1A1A1A] group-hover:text-[#4BA6B9] transition-colors">{j.title}</h4>
                          </div>
                       </Link>
                    )) : (
                       <div className="bg-white p-5 rounded-xl border border-[#E2E8F0] shadow-sm">
                          <p className="text-xs font-bold text-[#555555]">Editor in Chief at EISR Scientific Research</p>
                       </div>
                    )}
                 </div>
              </div>

              <div className="p-8 bg-[#1A1A1A] rounded-2xl text-white space-y-6">
                 <h3 className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#4BA6B9]">Contact Editor</h3>
                 <p className="text-xs text-white/60 font-medium">For editorial inquiries regarding submissions or peer review processes.</p>
                 <button className="w-full bg-[#4BA6B9] text-white py-4 text-[10px] font-bold uppercase tracking-[0.3em] flex items-center justify-center space-x-3 hover:bg-white hover:text-[#1A1A1A] transition-all rounded-xl">
                    <Mail size={14} />
                    <span>Send Inquiry</span>
                 </button>
              </div>
           </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
