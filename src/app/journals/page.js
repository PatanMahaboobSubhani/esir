import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Link from 'next/link';
import { journals } from '@/lib/data';
import { ArrowRight } from 'lucide-react';

export const metadata = {
  title: "Journals Portfolio | Eye-Innovations Scientific Research",
  description: "Explore our multidisciplinary portfolio of peer-reviewed scientific journals.",
};

export default function JournalsPage() {
  return (
    <div className="min-h-screen flex flex-col font-sans bg-white">
      <Header />
      <main className="flex-grow pb-20 bg-white">
        {/* Header Section: Further Tightened */}
        <section className="bg-white pt-6 pb-8 text-center">
           <div className="max-w-[1240px] mx-auto px-6">
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-[#4BA6B9] mb-1 block">
                Scientific Repositories
              </span>
              <h1 className="text-3xl md:text-4xl font-sans font-black text-[#1A1A1A] tracking-tighter">
                Journals Portfolio
              </h1>
           </div>
        </section>

        {/* Journals Grid: Tighter spacing */}
        <section className="px-6 mt-6">
           <div className="max-w-[1240px] mx-auto">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-10">
                 {journals.map((j) => (
                    <Link href={`/journals/${j.slug}`} key={j.id} className="group">
                       <div className="bg-white rounded-2xl md:rounded-l-none shadow-sm border border-[#E2E8F0] overflow-hidden flex flex-col md:flex-row h-auto md:h-[280px] transition-all duration-500 cursor-pointer hover:shadow-2xl hover:-translate-y-1">
                          {/* Left Side: Cover/Brand */}
                          <div className="w-full md:w-[220px] shrink-0 border-b md:border-b-0 md:border-r border-[#E2E8F0] bg-[#F4F6F8] relative flex items-center justify-center p-0">
                             {j.cover ? (
                                <img src={j.cover} alt={j.title} className="w-full h-full object-cover" />
                             ) : (
                               <div className="relative w-full h-full flex flex-col items-center justify-center bg-[#0B1F3A] p-6 text-center">
                                 <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_white_1px,transparent_1px)] bg-[length:16px_16px]" />
                                 <div className="z-10 leading-tight">
                                    <span className="text-white/40 text-[10px] font-black block mb-2 uppercase tracking-widest">EISR PRESS</span>
                                    <span className="text-white text-lg font-black uppercase block tracking-tighter">{j.id}</span>
                                    <span className="text-[#4BA6B9] text-[10px] font-bold block mt-1">Portfolio</span>
                                 </div>
                               </div>
                             )}
                          </div>

                          {/* Right Side: Info */}
                          <div className="flex-grow p-6 lg:p-8 flex flex-col justify-between">
                             <div className="space-y-4">
                                <div className="flex items-center gap-3">
                                   <span className="px-2 py-0.5 rounded bg-[#F1F6FA] text-[10px] font-black text-[#4BA6B9] uppercase tracking-wider">
                                     {j.id.toUpperCase()}
                                   </span>
                                   <div className="h-px flex-grow bg-[#F1F5F9]" />
                                </div>
                                <h3 className="text-xl font-sans font-black text-[#1A1A1A] group-hover:text-[#4BA6B9] leading-tight tracking-tight transition-colors">
                                  {j.title}
                                </h3>
                             </div>

                             <div className="space-y-4 mt-6">
                                <p className="text-[13px] font-bold text-[#555555] group-hover:translate-x-1 transition-transform border-l-2 border-[#4BA6B9] pl-3 leading-snug">
                                   Editor-in-Chief:<br/>
                                   <span className="text-[#1A1A1A]">{j.chief}</span>
                                </p>
                                
                                <div className="flex items-center justify-between pt-2 border-t border-[#F1F5F9]">
                                   <div className="flex gap-2 flex-wrap">
                                     {j.indexingPartners?.slice(0, 2).map((partner, idx) => (
                                        <span key={idx} className="px-2 py-1 bg-[#F1F6FA] text-[9px] font-bold text-[#4BA6B9] rounded uppercase tracking-wide">
                                          {partner}
                                        </span>
                                     ))}
                                     {(!j.indexingPartners || j.indexingPartners.length === 0) && (
                                        <span className="px-2 py-1 bg-[#F1F6FA] text-[9px] font-bold text-[#4BA6B9] rounded uppercase tracking-wide">
                                          Global Distribution
                                        </span>
                                     )}
                                   </div>
                                   <div className="flex items-center gap-2 text-[12px] font-black text-[#1A1A1A] group-hover:gap-3 transition-all">
                                      Explore <ArrowRight size={14} className="text-[#4BA6B9]" />
                                   </div>
                                </div>
                             </div>
                          </div>
                       </div>
                    </Link>
                 ))}
              </div>
           </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
}
