
'use client';
import { useParams } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Link from 'next/link';
import { journals } from '@/lib/data';
import { ChevronRight, Users, Info, BookOpen, ShieldCheck, Mail, Globe, MapPin, Activity, Fingerprint, Clock } from 'lucide-react';

import JournalHero from '@/components/JournalHero';

export default function JournalSectionPage() {
  const { slug, section } = useParams();
  const journal = journals.find(j => j.slug === slug) || journals[0];
  
  // Normalized section key
  const sectionKey = section.replace(/-/g, ' ');

  const renderSectionContent = () => {
    switch (section) {
      case 'aims-and-scope':
        return (
          <div className="space-y-12">
             <h2 className="text-3xl font-sans font-bold text-[#1A1A1A] border-b border-[#F1F5F9] pb-6 uppercase">Aims & Scope</h2>
             <p className="text-base text-[#555555] leading-loose font-medium text-justify">{journal.aims}</p>
             <div className="space-y-6 pt-6">
                <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#4BA6B9]">Scope Includes (but is not limited to):</h4>
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-6">
                   {journal.scope.map(s => (
                      <li key={s} className="flex items-center text-sm font-bold text-[#1A1A1A]">
                         <div className="w-2 h-2 bg-[#4BA6B9] rounded-full mr-4 shrink-0 shadow-sm shadow-[#4BA6B9]/40" />
                         {s}
                      </li>
                   ))}
                </ul>
             </div>
          </div>
        );
      case 'author-guidelines':
        return (
           <div className="space-y-12">
              <div className="space-y-8">
                <h2 className="text-3xl font-sans font-bold text-[#1A1A1A] border-b border-[#F1F5F9] pb-6 uppercase">Author Guidelines</h2>
                
                {/* Download Template Link */}
                <a 
                  href={journal.id === 'jeiml' ? '/JEIMT-Template.docx' : '/JEISA-Template.docx'} 
                  download
                  className="inline-flex items-center space-x-3 bg-[#1e78ff] hover:bg-[#4BA6B9] text-white px-5 py-3 rounded-lg transition-all shadow-md hover:shadow-lg group"
                >
                  <div className="p-1 px-2 border-r-2 border-white/20 mr-1">
                     <BookOpen size={18} fill="currentColor" stroke="none" />
                  </div>
                  <span className="text-[13px] font-bold uppercase tracking-wider">Download Journal Template</span>
                </a>
              </div>

              <div className="text-base text-[#555555] leading-loose font-medium whitespace-pre-line text-justify">
                {journal.guidelines}
              </div>
           </div>
        );
      case 'editorial-team':
        // Dynamically extract unique roles
        const allRoles = [...new Set(journal.editorialTeam.map(ed => ed.role))];

        return (
          <div className="space-y-12">
            <h2 className="text-2xl md:text-3xl font-sans font-medium text-[#1A1A1A] border-b border-[#F1F5F9] pb-4 md:pb-6">Editorial Team</h2>
            
            <div className="space-y-8">
               {allRoles.map(role => {
                 const members = journal.editorialTeam.filter(ed => ed.role === role);
                 if (members.length === 0) return null;
                 
                 const roleTitle = role === 'Editorial Board Member' && members.length > 1 ? 'Editorial Board Members' : role;
                 const isCenterGrid = members.length === 1;

                 return (
                   <div key={role} className="bg-[#EBF5FC] border border-[#DCEEFB] rounded-2xl p-6 md:p-8">
                      <div className="text-center font-medium text-[#4084B5] text-lg mb-6 tracking-wide">{roleTitle}</div>
                      <div className={`grid grid-cols-1 ${!isCenterGrid ? 'md:grid-cols-2 gap-6' : 'gap-6 place-items-center'}`}>
                         {members.map(ed => (
                             <div key={ed.id} className="bg-white rounded-[16px] p-6 shadow-sm mx-auto w-full max-w-[340px] flex flex-col items-center justify-center text-center hover:shadow-md transition-shadow duration-300">
                                {ed.photo ? (
                                   <img src={ed.photo} alt={ed.name} className="w-[88px] h-[88px] rounded-full object-cover mb-4 ring-4 ring-[#EAF6FF] bg-white p-0.5" />
                                ) : (
                                   <div className="w-[88px] h-[88px] rounded-full bg-[#FAFBFC] ring-4 ring-[#EAF6FF] flex items-center justify-center text-[#4BA6B9] mb-4">
                                      <Users size={32} />
                                   </div>
                                )}
                                <h4 className="text-[15px] font-bold text-[#1E293B] mb-1 leading-snug">{ed.name}</h4>
                                <p className="text-[11px] font-medium text-[#64748B] leading-relaxed max-w-[240px] px-2 mb-4">{ed.affiliation}</p>
                                
                                <div className="space-y-2 pt-3 border-t border-[#F1F5F9] w-full">
                                   {ed.orcid && (
                                      <a href={`https://orcid.org/${ed.orcid}`} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center space-x-2 text-[11px] font-bold text-[#4BA6B9] hover:underline transition-all">
                                         <Globe size={12} />
                                         <span>View ORCID</span>
                                      </a>
                                   )}
                                </div>
                             </div>
                         ))}
                      </div>
                   </div>
                 );
               })}
            </div>
          </div>
        );
      case 'about':
        return (
          <div className="space-y-12">
             <h2 className="text-3xl font-sans font-bold text-[#1A1A1A] border-b border-[#F1F5F9] pb-6 uppercase">About The Journal</h2>
             <div className="text-base text-[#555555] leading-loose font-medium text-justify whitespace-pre-line">
                {journal.about}
             </div>
          </div>
        );
      case 'indexing':
        return (
          <div className="space-y-12">
             <h2 className="text-3xl font-sans font-bold text-[#1A1A1A] border-b border-[#F1F5F9] pb-6 uppercase">Abstracting & Indexing</h2>
             <p className="text-base text-[#555555] leading-loose font-medium text-justify">{journal.indexing}</p>
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pt-8">
                <div className="bg-white border border-[#E2E8F0] p-8 rounded-2xl flex flex-col items-center justify-center space-y-4 hover:shadow-xl hover:border-[#4BA6B9] transition-all group h-40">
                   <img src="/google-scholar.jpg" alt="Google Scholar" className="h-16 object-contain opacity-80 group-hover:opacity-100 transition-all group-hover:scale-105 duration-500" />
                   <span className="text-[10px] font-bold text-[#999999] uppercase tracking-widest">Global Indexing</span>
                </div>
                <div className="bg-white border border-[#E2E8F0] p-8 rounded-2xl flex flex-col items-center justify-center space-y-4 hover:shadow-xl hover:border-[#4BA6B9] transition-all group h-40">
                   <img src="/crossref.png" alt="Crossref" className="h-12 object-contain opacity-80 group-hover:opacity-100 transition-all group-hover:scale-105 duration-500" />
                   <span className="text-[10px] font-bold text-[#999999] uppercase tracking-widest">Digital Identification</span>
                </div>
             </div>
          </div>
        );
      case 'apc':
        return (
          <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
             <h2 className="text-3xl font-sans font-bold text-[#1A1A1A] border-b border-[#F1F5F9] pb-6 uppercase tracking-tight">Article Publishing Charges</h2>
             
             <div className="relative p-12 bg-white border border-[#E2E8F0] shadow-[0_20px_50px_rgba(0,0,0,0.05)] rounded-[2.5rem] overflow-hidden group">
                <div className="absolute -top-24 -right-24 w-64 h-64 bg-[#4BA6B9]/5 rounded-full blur-3xl transition-all duration-1000 group-hover:bg-[#4BA6B9]/10" />
                <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-[#1e78ff]/5 rounded-full blur-3xl transition-all duration-1000 group-hover:bg-[#1e78ff]/10" />
                
                <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center gap-10">
                   <div className="w-20 h-20 bg-[#4BA6B9]/10 rounded-3xl flex items-center justify-center text-[#4BA6B9] shrink-0 shadow-inner">
                      <ShieldCheck size={40} strokeWidth={1.5} />
                   </div>
                   
                   <div className="space-y-4">
                      <div className="h-0.5 w-12 bg-[#4BA6B9]/20" />
                      <h3 className="text-4xl md:text-5xl font-sans font-black text-[#1A1A1A] tracking-tighter leading-none">{journal.apc}</h3>
                      <p className="text-base text-[#555555] font-medium leading-loose text-justify max-w-2xl border-t border-[#F1F5F9] pt-6 italic grayscale-[0.5]">
                        "There are no publication fees or article processing charges (APCs) for the 2024-2025 period. EISR Scientific Research supports open knowledge dissemination without financial barriers for authors."
                      </p>
                   </div>
                </div>
             </div>
          </div>
        );
      case 'partnerships':
        return (
          <div className="space-y-12">
             <h2 className="text-3xl font-sans font-bold text-[#1A1A1A] border-b border-[#F1F5F9] pb-6 uppercase">Journal Partnerships</h2>
             <p className="text-base text-[#555555] leading-loose font-medium text-justify">{journal.acronym} collaborates with leading academic institutions, research groups, and scientific societies globally. Our partnerships foster the exchange of scientific ideas and strengthen the international multidisciplinary research community.</p>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-8">
                {['Global Research Council', 'World Scientific Informatics Society', 'International Cybersecurity Forum', 'IEEE Multidisciplinary Council'].map(p => (
                   <div key={p} className="p-10 border border-[#E2E8F0] rounded-2xl bg-[#FAFBFC] hover:shadow-xl hover:border-[#4BA6B9] transition-all group">
                      <div className="w-12 h-12 rounded-xl bg-white border border-[#E2E8F0] flex items-center justify-center mb-6 text-[#999999] group-hover:bg-[#4BA6B9] group-hover:text-white transition-all shadow-sm">
                         <Globe size={24} />
                      </div>
                      <h4 className="text-sm font-bold text-[#1A1A1A] uppercase tracking-tighter">{p}</h4>
                      <p className="text-[10px] font-bold text-[#94A3B8] uppercase mt-2 tracking-widest">Work in Progress</p>
                   </div>
                ))}
             </div>
          </div>
        );
      default:
        // Assume policy if sub-route structure allows it, or just generic 404
        return (
           <div className="space-y-12 text-center py-20">
              <Info size={48} className="text-[#CBD5E1] mx-auto mb-6" />
              <h2 className="text-2xl font-sans font-bold uppercase tracking-tight">Section Not Found</h2>
              <p className="text-sm text-[#999999] uppercase font-bold tracking-widest">Requested informational repository is currently being updated.</p>
           </div>
        );
    }
  };

  return (
    <div className="min-h-screen flex flex-col font-sans bg-white selection:bg-[#4BA6B9]/10">
      <Header />
      
      <JournalHero journal={journal} activeTab={section} />

      {/* Breadcrumb Band */}
      <div className="w-full bg-[#FAFBFC] py-4 px-6 border-b border-[#F1F5F9] text-[10px] font-bold uppercase tracking-widest text-[#999999]">
         <div className="max-w-[1240px] mx-auto space-x-3 flex items-center">
            <Link href="/" className="hover:text-[#4BA6B9]">Main</Link>
            <ChevronRight size={10} />
            <Link href={`/journals/${journal.slug}`} className="hover:text-[#4BA6B9]">{journal.title}</Link>
            <ChevronRight size={10} />
            <span className="text-[#1A1A1A] truncate max-w-[200px] uppercase">{sectionKey}</span>
         </div>
      </div>

      <main className="flex-grow pb-24 px-6">
        <div className="max-w-[1240px] mx-auto mt-12 grid lg:grid-cols-12 gap-12 items-start">
           
           {/* Sidebar Info Card */}
           <div className="lg:col-span-3 space-y-10">
               <div className="bg-white border border-[#E2E8F0] shadow-sm rounded-2xl overflow-hidden group">
                 <div className="w-full aspect-[2/3] flex flex-col items-center justify-center relative overflow-hidden bg-[#F4F6F8]">
                    <img src={journal.cover} alt="" className="absolute inset-0 w-full h-full object-cover blur-2xl opacity-30 scale-110" />
                    <img src={journal.cover} alt={journal.title} className="relative z-10 w-full h-full object-cover" />
                 </div>
                 
                 <div className="p-6 space-y-6">
                    <Link href={`/dashboard/submit?journal=${journal.id}`} className="w-full bg-[#1A1A1A] text-white py-4 text-[11px] font-bold uppercase tracking-widest flex items-center justify-center space-x-3 hover:bg-[#4BA6B9] transition-all rounded-xl shadow-lg shadow-black/10 hover:shadow-[#4BA6B9]/20 hover:-translate-y-0.5 whitespace-nowrap">
                     <span>Submit Manuscript</span>
                     <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
                   </Link>
                 </div>
               </div>

               <div className="p-8 bg-[#F8FAFC] rounded-2xl border border-[#E2E8F0] flex items-center space-x-4">
                  <div className="w-10 h-10 rounded-full bg-[#4BA6B9]/10 flex items-center justify-center text-[#4BA6B9]">
                     <ShieldCheck size={20} />
                  </div>
                  <div>
                    <p className="text-[9px] font-bold uppercase tracking-widest text-[#555555]">Peer Reviewed</p>
                    <p className="text-[10px] font-bold text-[#1A1A1A] ">Verified Academic Quality</p>
                  </div>
               </div>
           </div>

           {/* Main Content Area */}
           <div className="lg:col-span-9 bg-white min-h-[600px]">
              {renderSectionContent()}
           </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
