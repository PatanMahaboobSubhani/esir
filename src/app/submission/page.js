
'use client';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Link from 'next/link';
import { journals } from '@/lib/data';
import { Send, FileText, User, Mail, Globe, MapPin, BookOpen, Clock, Activity, Fingerprint, Info, Users, ShieldCheck, ChevronRight } from 'lucide-react';

export default function SubmissionPage() {
  const journal = journals[0];

  return (
    <div className="min-h-screen flex flex-col font-sans bg-white selection:bg-[#4BA6B9]/10">
      <Header />
      
      {/* Submission Hero Section */}
      <section className="bg-[#0B1F3A] text-white pt-32 pb-20 px-6 relative overflow-hidden text-center md:text-left">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#4BA6B9]/10 rounded-full blur-[100px] -mr-48 -mt-48" />
        <div className="max-w-[1240px] mx-auto relative z-10 space-y-8">
           <div className="space-y-4">
              <span className="text-[11px] font-bold text-[#4BA6B9]">Journal Submission Gateway</span>
              <h1 className="text-4xl md:text-6xl font-sans font-bold leading-tight underline decoration-4 decoration-[#4BA6B9]/20">Make a Submission</h1>
           </div>
        </div>
      </section>

      {/* Breadcrumb Band */}
      <div className="w-full bg-[#FAFBFC] py-4 px-6 border-b border-[#F1F5F9] text-[11px] font-bold text-[#999999]">
         <div className="max-w-[1240px] mx-auto space-x-3 flex items-center">
            <Link href="/" className="hover:text-[#4BA6B9]">Main</Link>
            <ChevronRight size={10} />
            <span className="text-[#1A1A1A]">Submit Manuscript</span>
         </div>
      </div>

      <main className="flex-grow pb-40 px-6">
        <div className="max-w-[1240px] mx-auto mt-20 grid lg:grid-cols-12 gap-20 items-start">
           
           <div className="lg:col-span-8 space-y-16">
              <div className="space-y-8">
                 <h2 className="text-3xl font-sans font-bold text-[#1A1A1A] border-b border-[#F1F5F9] pb-6">Submission Portal</h2>
                 <p className="text-base text-[#555555] font-medium leading-loose">
                    Thank you for choosing Eye-Innovations Scientific Research (EISR) for your scholarly research dissemination. Before submitting your manuscript, ensure you have reviewed the author guidelines and formatted your work according to our templates.
                 </p>
              </div>

              <div className="bg-white border-2 border-dashed border-[#E2E8F0] p-12 rounded-3xl text-center space-y-8 group hover:border-[#4BA6B9] transition-all">
                 <div className="w-20 h-20 bg-[#F4F6F9] rounded-2xl flex items-center justify-center mx-auto text-[#4BA6B9] group-hover:scale-110 transition-transform duration-500 shadow-sm">
                    <Send size={32} />
                 </div>
                 <div className="space-y-4">
                    <h3 className="text-2xl font-sans font-bold tracking-tight">Access Editorial Manager</h3>
                    <p className="text-sm font-medium text-[#555555] max-w-md mx-auto leading-relaxed">Login or register below to access the manuscript submission system. Supported formats: .DOCX, .PDF, .LATEX</p>
                 </div>
                 <div className="flex flex-col md:flex-row gap-6 justify-center pt-6">
                    <Link href="/login" className="px-10 py-5 bg-[#1A1A1A] text-white text-[12px] font-bold rounded-xl hover:bg-[#4BA6B9] transition-all shadow-xl shadow-black/10">Login to Submit</Link>
                    <Link href="/register" className="px-10 py-5 bg-white border-2 border-[#1A1A1A] text-[#1A1A1A] text-[12px] font-bold rounded-xl hover:bg-[#1A1A1A] hover:text-white transition-all">New Author Account</Link>
                 </div>
              </div>

              <div className="space-y-8">
                 <h2 className="text-3xl font-sans font-bold text-[#1A1A1A] border-b border-[#F1F5F9] pb-6">Submission Checklist</h2>
                 <ul className="space-y-6">
                    {[
                      'Manuscript is in OpenDocument text format or Microsoft Word.',
                      'All authors and their affiliations are accurately listed.',
                      'A structured abstract (200-250 words) is included.',
                      'Conflict of interest statement is explicitly stated.',
                      'Funding information is provided if applicable.'
                    ].map((item, idx) => (
                       <li key={idx} className="flex items-start space-x-4 group">
                          <div className="w-6 h-6 rounded-full border-2 border-[#E2E8F0] group-hover:bg-[#4BA6B9] group-hover:border-[#4BA6B9] transition-colors shrink-0 flex items-center justify-center text-white text-[11px] font-bold">{idx + 1}</div>
                          <span className="text-sm font-bold text-[#555555] leading-relaxed tracking-tight">{item}</span>
                       </li>
                    ))}
                 </ul>
              </div>
           </div>

           <div className="lg:col-span-4 space-y-10">
              <div className="bg-[#FAFBFC] p-8 rounded-2xl border border-[#E2E8F0] space-y-8">
                 <h3 className="text-[12px] font-bold text-[#4BA6B9]">Journal Selection</h3>
                 <div className="space-y-4">
                    {journals.map(j => (
                       <div key={j.id} className="p-5 bg-white border border-[#E2E8F0] rounded-xl shadow-sm hover:border-[#4BA6B9] cursor-pointer transition-all text-[11px] font-bold text-[#1A1A1A]">
                          {j.title}
                       </div>
                    ))}
                 </div>
              </div>

              <div className="p-8 bg-[#F0FBFC] border border-[#4BA6B9]/20 rounded-2xl text-center space-y-4">
                 <ShieldCheck size={40} className="text-[#4BA6B9] mx-auto" />
                 <h4 className="text-[12px] font-bold text-[#1A1A1A]">Secure Peer Review</h4>
                 <p className="text-[11px] text-[#999999] font-bold">All submissions undergo double-blind review managed by experts in the metadata repository.</p>
              </div>
           </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
