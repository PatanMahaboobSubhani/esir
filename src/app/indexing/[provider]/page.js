
'use client';
import { useParams } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Link from 'next/link';
import { indexing } from '@/lib/data';
import { Globe, ShieldCheck, BookOpen, ChevronRight, Search, Activity, LayoutGrid, Clock } from 'lucide-react';

export default function IndexingProviderPage() {
  const { provider } = useParams();
  const info = indexing.find(i => i.id === provider) || indexing[0];

  return (
    <div className="min-h-screen flex flex-col font-sans bg-white selection:bg-[#4BA6B9]/10">
      <Header />
      
      {/* Indexing Hero Section */}
      <section className="bg-[#0B1F3A] text-white pt-48 pb-20 px-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#4BA6B9]/10 rounded-full blur-[100px] -mr-48 -mt-48" />
        <div className="max-w-[1240px] mx-auto relative z-10 space-y-8 text-center md:text-left">
           <div className="space-y-4">
              <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-[#4BA6B9]">Global Indexing & Metadata Repository</span>
              <h1 className="text-4xl md:text-6xl font-sans font-bold  leading-tight  uppercase underline decoration-4 decoration-[#4BA6B9]/20">{info.name} Indexing</h1>
           </div>
        </div>
      </section>

      {/* Breadcrumb Band */}
      <div className="w-full bg-[#FAFBFC] py-4 px-6 border-b border-[#F1F5F9] text-[10px] font-bold uppercase tracking-widest text-[#999999]">
         <div className="max-w-[1240px] mx-auto space-x-3 flex items-center">
            <Link href="/" className="hover:text-[#4BA6B9]">Main</Link>
            <ChevronRight size={10} />
            <span className="text-[#1A1A1A]">Abstracting and Indexing</span>
            <ChevronRight size={10} />
            <span className="text-[#1A1A1A] uppercase">{info.name}</span>
         </div>
      </div>

      <main className="flex-grow pb-40 px-6">
        <div className="max-w-[1240px] mx-auto mt-20 grid lg:grid-cols-12 gap-20 items-start">
           
           <div className="lg:col-span-8 space-y-16">
              <div className="space-y-8">
                 <h2 className="text-2xl font-sans font-bold text-[#1A1A1A] border-b border-[#F1F5F9] pb-6">About {info.name}</h2>
                 <p className="text-base text-[#555555] font-medium leading-loose text-justify">
                    {info.description} EISR journals are systematically evaluated for inclusion in {info.name} to ensure global reach and visibility for our authors.
                 </p>
              </div>

              <div className="bg-[#FAFBFC] p-10 rounded-3xl border border-[#E2E8F0] space-y-8">
                 <h3 className="text-xl font-sans font-bold uppercase tracking-tight">Indexing Status</h3>
                 <div className="space-y-6">
                    <div className="flex items-center justify-between p-6 bg-white rounded-xl border border-[#E2E8F0] shadow-sm">
                       <div className="space-y-1">
                          <p className="text-xs font-bold text-[#1A1A1A] uppercase">Journal of Eye-Innovation in Machine Learning</p>
                          <p className="text-[10px] font-bold text-[#4BA6B9] uppercase">Verified and Active</p>
                       </div>
                       <ShieldCheck className="text-[#4BA6B9]" />
                    </div>
                    <div className="flex items-center justify-between p-6 bg-white rounded-xl border border-[#E2E8F0] shadow-sm opacity-60">
                       <div className="space-y-1">
                          <p className="text-xs font-bold text-[#1A1A1A] uppercase">Journal of Eye Innovation in Security Analysis</p>
                          <p className="text-[10px] font-bold text-[#999999] uppercase">Under Evaluation</p>
                       </div>
                       <Clock className="text-[#999999]" />
                    </div>
                 </div>
              </div>
           </div>

           <div className="lg:col-span-4 space-y-10">
              <div className="p-10 bg-[#1A1A1A] rounded-2xl text-white space-y-8">
                 <h3 className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#4BA6B9]">Other Providers</h3>
                 <div className="space-y-4">
                    {indexing.map(idx => (
                       <Link key={idx.id} href={`/indexing/${idx.id}`} className="block text-[11px] font-bold uppercase tracking-widest text-white/60 hover:text-[#4BA6B9] transition-all pb-3 border-b border-white/5 last:border-0">{idx.name}</Link>
                    ))}
                 </div>
              </div>

              <div className="bg-[#4BA6B9] p-8 rounded-2xl text-white text-center space-y-4 shadow-xl shadow-[#4BA6B9]/20">
                 <Globe className="mx-auto" />
                 <h4 className="text-[10px] font-bold uppercase tracking-widest">Global Visibility</h4>
                 <p className="text-[9px] font-bold tracking-widest uppercase text-white/80">Our publications are mapped across over 15+ global academic repositories.</p>
              </div>
           </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
