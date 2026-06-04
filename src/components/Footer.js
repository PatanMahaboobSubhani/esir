'use client';
import Link from 'next/link';
import { Linkedin, Mail, MapPin, ChevronRight, ShieldCheck } from 'lucide-react';
import Logo from './Logo';
import { journals } from '@/lib/data';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full bg-[#050B14] text-white pt-4 pb-2 font-sans selection:bg-[#4BA6B9]/20 border-t border-white/5">
      <div className="max-w-[1240px] mx-auto px-6">
        
        {/* 3-Column Professional Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 pb-4 border-b border-white/5">
          
          {/* Column 1: Our Journals */}
          <div className="space-y-2">
            <h4 className="text-[14px] font-black text-white tracking-wide">Our Journals</h4>
            <div className="flex flex-col space-y-2">
              {journals.map(j => (
                <Link key={j.slug} href={`/journals/${j.slug}`} className="group flex items-start gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-white/20 mt-1.5 group-hover:bg-[#4BA6B9] transition-all" />
                  <span className="text-[13px] font-bold text-[#D1D5DB] group-hover:text-white transition-colors leading-tight">
                    {j.title}
                  </span>
                </Link>
              ))}
              <Link href="/journals" className="text-[11px] font-bold text-[#4BA6B9] pt-2 hover:underline">
                View All Repositories
              </Link>
            </div>
          </div>

          {/* Column 2: Support Hub */}
          <div className="space-y-2">
            <h4 className="text-[14px] font-black text-white tracking-wide">Support Hub</h4>
            <div className="flex flex-col space-y-2">
               {[
                 { name: 'Author Guidelines', path: '/journals/jeiml/author-guidelines' },
                 { name: 'Publication Ethics', path: '/policies/publication-ethics' },
                 { name: 'Peer Review Policy', path: '/policies/peer-review' },
                 { name: 'Generative AI Policy', path: '/policies/generative-ai' },
                 { name: 'Plagiarism Policy', path: '/policies/plagiarism' },
                 { name: 'Archiving Policy', path: '/policies/archiving-policy' },
                 { name: 'Privacy Statement', path: '/policies/privacy' },
                 { name: 'Publication Terms', path: '/policies/terms' }
               ].map(link => (
                 <Link key={link.name} href={link.path} className="text-[13px] font-bold text-[#D1D5DB] hover:text-white transition-colors flex items-center gap-2 group">
                   <ChevronRight size={14} className="opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all text-[#4BA6B9]" />
                   {link.name}
                 </Link>
               ))}
            </div>
          </div>

          {/* Column 3: Address & Contact */}
          <div className="space-y-2">
            <h4 className="text-[14px] font-black text-white tracking-wide">Address & Contact</h4>
            <div className="space-y-6">
              <div className="flex items-start space-x-4 text-[#D1D5DB]">
                <MapPin size={18} className="mt-0.5 shrink-0 text-[#4BA6B9]" />
                <div className="space-y-1">
                  <p className="text-[13px] font-bold text-white">Amman-Jordan</p>
                  <p className="text-[11px] leading-relaxed">Global Headquarters</p>
                </div>
              </div>
              <div className="space-y-4">
                <a href="mailto:info@EISRpress.com" className="flex items-center space-x-4 text-[#D1D5DB] group">
                  <Mail size={16} className="shrink-0 text-[#4BA6B9]" />
                  <span className="text-[13px] font-bold group-hover:text-white transition-colors">info@EISRpress.com</span>
                </a>

              </div>
            </div>
          </div>

        </div>

        {/* Branding & Attribution */}
        <div className="pt-4">
           <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
              <div className="space-y-6">
                 <div className="flex items-center gap-6">
                     <Link href="/" className="hover:scale-105 transition-transform duration-500">
                        <Logo variant="full" className="w-[160px] h-[45px] opacity-90" />
                     </Link>
                    <div className="h-10 w-px bg-white/10 hidden md:block" />
                    <div className="flex flex-col">
                       <p className="text-[13px] font-bold text-white/90">Eye-Innovations Scientific Research</p>
                       <p className="text-[11px] font-bold text-[#4BA6B9] tracking-widest mt-0.5">Eye-ISR.com</p>
                    </div>
                 </div>
                 <p className="text-[11px] font-bold text-[#556579]">{currentYear}© Eye-ISR.com Global Services. All rights reserved.</p>
              </div>

              <div className="flex items-center space-x-6">
                 <Link href="/policies/privacy" className="text-[12px] font-bold text-[#D1D5DB] hover:text-[#4BA6B9] transition-colors">Privacy Statement</Link>
                 <Link href="/policies/publication-ethics" className="text-[12px] font-bold text-[#D1D5DB] hover:text-[#4BA6B9] transition-colors">Publication Terms</Link>
                 <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-[#D1D5DB] hover:bg-[#1e78ff] hover:text-white transition-all">
                    <Linkedin size={18} />
                 </a>
              </div>
           </div>
        </div>

      </div>
    </footer>
  );
}
