
'use client';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Link from 'next/link';
import { ShieldCheck, Scale, Database, Eye, FileText, Users, Lock, AlertCircle, RefreshCcw, XCircle, FileWarning, Globe, Search, Activity } from 'lucide-react';

const policyList = [
  { id: 'publication-ethics', name: 'Publication Ethics', icon: <Scale size={24} /> },
  { id: 'open-access', name: 'Open Access Policy', icon: <Globe size={24} /> },
  { id: 'peer-review', name: 'Peer Review Policy', icon: <ShieldCheck size={24} /> },
  { id: 'archiving', name: 'Archiving Policy', icon: <Database size={24} /> },
  { id: 'generative-ai', name: 'Generative AI Policy', icon: <Activity size={24} /> },
  { id: 'copyright', name: 'Copyright and Licensing', icon: <Lock size={24} /> },
  { id: 'plagiarism', name: 'Plagiarism Policy', icon: <Search size={24} /> },
  { id: 'misconduct', name: 'Misconduct Policy', icon: <AlertCircle size={24} /> },
  { id: 'retractions', name: 'Retractions Policy', icon: <RefreshCcw size={24} /> },
  { id: 'misbehavior', name: 'Publication Misbehavior', icon: <XCircle size={24} /> },
  { id: 'corrections', name: 'Corrections and Withdrawals', icon: <FileWarning size={24} /> }
];

export default function PoliciesListPage() {
  return (
    <div className="min-h-screen flex flex-col font-sans bg-white selection:bg-[#4BA6B9]/10">
      <Header />
      
      <main className="flex-grow pb-40">
        <section className="bg-[#0B1F3A] text-white pt-48 pb-24 px-6 relative overflow-hidden text-center md:text-left">
           <div className="absolute top-0 right-0 w-96 h-96 bg-[#4BA6B9]/10 rounded-full blur-[100px] -mr-48 -mt-48" />
           <div className="max-w-[1240px] mx-auto relative z-10 space-y-8">
              <div className="space-y-4">
                 <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-[#4BA6B9]">Scholarly Standards & Integrity</span>
                 <h1 className="text-4xl md:text-6xl font-sans font-bold leading-tight  uppercase underline decoration-4 decoration-[#4BA6B9]/10">Publishing Policies</h1>
                 <p className="text-sm font-bold text-white/60 max-w-2xl mt-8">EISR maintains the highest levels of global transparency and ethical conduct across all its scientific repositories.</p>
              </div>
           </div>
        </section>

        <section className="px-6 mt-20">
           <div className="max-w-[1240px] mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                 {policyList.map(policy => (
                    <Link key={policy.id} href={`/policies/${policy.id}`} className="block group">
                       <div className="bg-white p-10 rounded-3xl border border-[#E2E8F0] h-full shadow-sm hover:shadow-2xl hover:border-[#4BA6B9] transition-all relative overflow-hidden">
                          <div className="absolute top-0 right-0 w-24 h-24 bg-[#4BA6B9]/5 rounded-full -mr-12 -mt-12 group-hover:scale-150 transition-transform duration-700" />
                          <div className="w-12 h-12 bg-[#F4F6F9] rounded-xl flex items-center justify-center text-[#4BA6B9] mb-8 group-hover:bg-[#4BA6B9] group-hover:text-white transition-all shadow-sm">
                             {policy.icon}
                          </div>
                          <h3 className="text-xl font-sans font-bold text-[#1A1A1A] group-hover:text-[#4BA6B9] transition-colors uppercase leading-tight  mb-4">{policy.name}</h3>
                          <p className="text-xs font-bold text-[#555555] uppercase tracking-widest leading-loose">View Full Metadata Policy</p>
                       </div>
                    </Link>
                 ))}
              </div>

              {/* Ethics Commitment */}
              <div className="mt-32 p-12 bg-[#F8FAFC] rounded-3xl border border-[#E2E8F0] flex flex-col md:flex-row items-center gap-12 text-center md:text-left">
                 <div className="w-24 h-24 bg-white rounded-2xl flex items-center justify-center text-[#4BA6B9] shadow-xl border border-[#E2E8F0] shrink-0">
                    <ShieldCheck size={40} />
                 </div>
                 <div className="space-y-4 flex-grow">
                    <h4 className="text-[10px] font-bold uppercase tracking-[0.4em] text-[#4BA6B9]">COPE Alignment</h4>
                    <p className="text-base text-[#555555] font-medium leading-loose max-w-3xl">Eye-Innovations Scientific Research is a member of the Committee on Publication Ethics (COPE). We strictly adhere to its Core Practices and expect our editors, authors, and reviewers to uphold these standards in every scientific inquiry.</p>
                 </div>
                 <div className="shrink-0">
                    <button className="px-10 py-5 bg-[#1A1A1A] text-white text-[10px] font-bold uppercase tracking-[0.3em] rounded-xl hover:bg-[#4BA6B9] transition-all shadow-lg">Verify COPE ID</button>
                 </div>
              </div>
           </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
}
