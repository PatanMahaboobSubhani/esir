'use client';
import Link from 'next/link';
import { ChevronDown } from 'lucide-react';
import { useState, useEffect } from 'react';
import { journalMenuItems, journalPolicyItems, journalAboutItems } from '@/lib/data';

const BANNERS = [
  '/banner1.jpg',
  '/banner2.jpg',
  '/banner3.jpg',
  '/banner4.jpg',
];

export default function JournalHero({ journal, activeTab = 'home' }) {
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent(prev => (prev + 1) % BANNERS.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const isActive = (tab) => activeTab === tab;

  return (
    <section className="relative text-white pt-32 pb-10 px-6 bg-[#050B14] z-40">

      {/* ── Background image layers — clipped separately so dropdowns can overflow ── */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {BANNERS.map((src, i) => (
          <div
            key={src}
            className="absolute inset-0 bg-cover bg-[center_top] transition-opacity duration-1000"
            style={{
              backgroundImage: `url('${src}')`,
              opacity: i === current ? 1 : 0,
            }}
          />
        ))}
        {/* Dark overlay for text contrast */}
        <div className="absolute inset-0 bg-black/40" />
      </div>

      {/* Dot indicators — bottom left */}
      <div className="absolute bottom-10 left-8 flex gap-1.5 z-20">
        {BANNERS.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className="border-none cursor-pointer p-0 transition-all duration-400"
            style={{
              width: i === current ? '28px' : '8px',
              height: '8px',
              borderRadius: '4px',
              backgroundColor: i === current ? '#4BA6B9' : 'rgba(255,255,255,0.4)',
              transition: 'all 0.4s ease',
            }}
          />
        ))}
      </div>

      {/* ── Content ── */}
      <div className="max-w-[1240px] mx-auto relative z-[100] space-y-8">
        <div className="space-y-4 max-w-full md:max-w-[55%]">
          <span className="text-[11px] font-bold text-[#4BA6B9] tracking-widest uppercase">
            Scientific Journal Gateway
          </span>
          <h1
            className="font-sans font-bold leading-snug"
            style={{
              fontSize: 'clamp(22px, 3vw, 42px)',
              color: '#ffffff',
              textShadow: '0 2px 16px rgba(0,0,0,0.85), 0 1px 4px rgba(0,0,0,0.9)',
              letterSpacing: '-0.01em',
            }}
          >
            {journal.title}
          </h1>
          <div className="flex items-center gap-4">
            <p className="text-sm font-bold" style={{ color: 'rgba(255,255,255,0.82)', textShadow: '0 1px 6px rgba(0,0,0,0.7)' }}>
              Publishing model:{' '}
              <Link href="/policies/open-access" className="underline underline-offset-4 hover:text-[#4BA6B9]">
                Open access
              </Link>
            </p>
            <div className="h-4 w-px bg-white/20" />
            <p className="text-sm font-bold" style={{ color: 'rgba(255,255,255,0.82)', textShadow: '0 1px 6px rgba(0,0,0,0.7)' }}>
              APC: <span className="text-[#4BA6B9]">{journal.apc || 'No Charge'}</span>
            </p>
          </div>
        </div>

        {/* Navigation Bar */}
        <div className="flex flex-wrap gap-x-6 md:gap-x-12 gap-y-4 border-b border-white/5 pb-0 text-[13px] font-bold uppercase tracking-wide">
          <Link
            href={`/journals/${journal.slug}`}
            className={`pb-4 border-b-2 transition-all ${isActive('home') ? 'border-[#4BA6B9] text-[#4BA6B9]' : 'border-transparent hover:border-white'}`}
          >
            Home
          </Link>
          <Link
            href={`/journals/${journal.slug}/archives`}
            className={`pb-4 border-b-2 transition-all ${isActive('archives') ? 'border-[#4BA6B9] text-[#4BA6B9]' : 'border-transparent hover:border-white'}`}
          >
            Archives
          </Link>
          <Link
            href={`/journals/${journal.slug}/current-issue`}
            className={`pb-4 border-b-2 transition-all ${isActive('current') ? 'border-[#4BA6B9] text-[#4BA6B9]' : 'border-transparent hover:border-white'}`}
          >
            Current Issues
          </Link>

          {/* Flipkart Style Dropdowns */}
          {[
            { id: 'menu', name: 'Journal Menu', items: journalMenuItems },
            { id: 'policies', name: 'Journal Policies', items: journalPolicyItems },
            { id: 'about', name: 'About', items: journalAboutItems }
          ].map((dropdown) => (
            <div
              key={dropdown.id}
              className="relative group"
              onMouseEnter={() => setActiveDropdown(dropdown.id)}
              onMouseLeave={() => setActiveDropdown(null)}
            >
              <button className={`flex items-center gap-2 pb-4 px-4 -mx-4 border-b-2 transition-all ${activeDropdown === dropdown.id ? 'border-[#4BA6B9] text-[#4BA6B9]' : 'border-transparent hover:border-white'}`}>
                {dropdown.name} <ChevronDown size={12} className={activeDropdown === dropdown.id ? 'rotate-180 transition-transform' : 'transition-transform'} />
              </button>
              <div className={`absolute top-[calc(100%-2px)] left-0 min-w-[240px] bg-white rounded-lg shadow-2xl border border-[#F1F1F1] overflow-hidden z-[200] transition-all duration-300 origin-top ${activeDropdown === dropdown.id ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-95 -translate-y-2 pointer-events-none'}`}>
                <div className="px-6 py-3 bg-[#F8FAFC] border-b border-[#F1F5F9]">
                  <span className="text-[11px] font-black text-[#555] uppercase tracking-[0.1em]">{dropdown.name}</span>
                </div>
                <div className="py-2 max-h-[70vh] overflow-y-auto custom-scrollbar">
                  {dropdown.items.map(item => {
                    const href = dropdown.id === 'about' 
                      ? (item.slug === 'contact' ? '/contact' : item.slug === 'about' ? `/journals/${journal.slug}/about` : `/policies/${item.slug}`)
                      : (dropdown.id === 'policies' ? `/policies/${item.slug}?journal=${journal.id}` : `/journals/${journal.slug}/${item.slug}`);
                    
                    return (
                      <Link
                        key={item.slug}
                        href={href}
                        className="flex items-center px-6 py-3 text-[13px] font-semibold text-[#374151] hover:bg-[#F1F8FF] hover:text-[#4BA6B9] transition-all border-l-4 border-transparent hover:border-[#4BA6B9] whitespace-nowrap"
                      >
                        {item.name}
                      </Link>
                    );
                  })}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
