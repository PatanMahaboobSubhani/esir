
'use client';
import { useParams, useSearchParams } from 'next/navigation';
import { useState, useEffect, Suspense } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Link from 'next/link';
import { journals } from '@/lib/data';
import { ShieldCheck, ChevronRight } from 'lucide-react';

const BANNERS = ['/baner0001.jpg', '/baner0002.jpg', '/baner0003.jpg', '/baner0004.jpg'];

/* ── Nice display name for each slug ── */
const POLICY_LABELS = {
  'publication-ethics':   'Publication Ethics',
  'open-access-policy':   'Open Access Policy',
  'open-access':          'Open Access Policy',
  'peer-review-policy':   'Peer Review Policy',
  'generative-ai-policy': 'Generative AI Policy',
  'plagiarism-policy':    'Plagiarism Policy',
  'archiving-policy':     'Archiving Policy',
  'privacy':              'Privacy Statement',
  'terms':                'Publication Terms',
};

function PolicyContent() {
  const { slug } = useParams();
  const searchParams = useSearchParams();
  const journalId = searchParams.get('journal');
  
  // Use specific journal if ID provided, otherwise default to first
  const journal = journals.find(j => j.id === journalId) || journals[0];

  const policyTitle =
    POLICY_LABELS[slug] ||
    slug
      .split('-')
      .map(w => w.charAt(0).toUpperCase() + w.slice(1))
      .join(' ');

  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setCurrent(p => (p + 1) % BANNERS.length), 5000);
    return () => clearInterval(t);
  }, []);

  const rawPolicyText = journal.policies?.[slug.replace(/-/g, '')] ||
    journal[slug] ||
    `The full ${policyTitle} content is defined to align with global COPE and metadata standards. This policy governs all journals under the EISR Scientific Research umbrella.`;

  // Replace placeholders
  const policyContent = rawPolicyText
    .replace(/{{JOURNAL_NAME}}/g, journal.title)
    .replace(/{{JOURNAL_ACRONYM}}/g, journal.acronym);

  return (
    <div className="min-h-screen flex flex-col font-sans bg-white selection:bg-[#4BA6B9]/10">
      <Header />

      {/* ── Sliding Banner Hero ── */}
      <section className="relative text-white pt-48 pb-16 px-6 bg-[#0B1F3A]">

        {/* Clipped background images */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {BANNERS.map((src, i) => (
            <div
              key={src}
              className="absolute inset-0 bg-cover bg-center transition-opacity duration-1000"
              style={{ backgroundImage: `url('${src}')`, opacity: i === current ? 1 : 0 }}
            />
          ))}
          {/* Dark overlay */}
          <div className="absolute inset-0 bg-[#0B1F3A]/70" />
          {/* Decorative glow */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#4BA6B9]/10 rounded-full blur-[100px] -mr-48 -mt-48" />
        </div>

        {/* Dot indicators */}
        <div className="absolute bottom-5 left-8 flex gap-1.5 z-20">
          {BANNERS.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className="border-none cursor-pointer p-0"
              style={{
                width: i === current ? '28px' : '8px',
                height: '8px',
                borderRadius: '4px',
                backgroundColor: i === current ? '#4BA6B9' : 'rgba(255,255,255,0.35)',
                transition: 'all 0.4s ease',
              }}
            />
          ))}
        </div>

        {/* Content */}
        <div className="max-w-[1240px] mx-auto relative z-10 space-y-4" style={{ maxWidth: '60%' }}>
          <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-[#4BA6B9]">
            Journal Global Policy Repository
          </span>
          <h1
            className="font-sans font-bold leading-snug uppercase"
            style={{
              fontSize: 'clamp(22px, 3vw, 46px)',
              color: '#ffffff',
              textShadow: '0 2px 16px rgba(0,0,0,0.85), 0 1px 4px rgba(0,0,0,0.9)',
              letterSpacing: '0.02em',
            }}
          >
            {policyTitle}
          </h1>
        </div>
      </section>

      {/* Breadcrumb Band */}
      <div className="w-full bg-[#FAFBFC] py-4 px-6 border-b border-[#F1F5F9] text-[10px] font-bold uppercase tracking-widest text-[#999999]">
        <div className="max-w-[1240px] mx-auto space-x-3 flex items-center">
          <Link href="/" className="hover:text-[#4BA6B9]">Main</Link>
          <ChevronRight size={10} />
          <Link href="/journals" className="hover:text-[#4BA6B9]">Journals</Link>
          <ChevronRight size={10} />
          <span className="text-[#1A1A1A]">Policies</span>
          <ChevronRight size={10} />
          <span className="text-[#1A1A1A] uppercase">{policyTitle}</span>
        </div>
      </div>

      <main className="flex-grow pb-40 px-6">
        <div className="max-w-[1240px] mx-auto mt-20 grid lg:grid-cols-12 gap-20">

          <div className="lg:col-span-8 space-y-16">
            <div className="space-y-8">
              <h2 className="text-2xl font-sans font-bold text-[#1A1A1A] border-b border-[#F1F5F9] pb-6">Policy Overview</h2>
              <p className="text-base text-[#555555] leading-loose font-medium text-justify">
                Eye-Innovations Scientific Research (EISR) maintains rigorous publishing policies to ensure the integrity,
                transparency, and reproducibility of scholarly research. The {policyTitle} is central to our commitment to academic excellence.
              </p>
            </div>

            <div className="space-y-10">
              <div className="bg-[#F8FAFC] border border-[#E2E8F0] p-10 rounded-2xl shadow-sm space-y-8">
                <h3 className="text-xl font-sans font-bold border-b border-[#F1F5F9] pb-4 uppercase">{policyTitle} Content</h3>
                <div className="text-sm font-medium text-[#555555] leading-loose whitespace-pre-line">
                  {policyContent}
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-4 space-y-10">
            <div className="bg-[#1A1A1A] p-8 rounded-2xl text-white space-y-8">
              <h3 className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#4BA6B9]">Other Policies</h3>
              <div className="space-y-4">
                {[
                  ['Publication Ethics',   'publication-ethics'],
                  ['Open Access Policy',   'open-access-policy'],
                  ['Peer Review Policy',   'peer-review-policy'],
                  ['Generative AI Policy', 'generative-ai-policy'],
                  ['Plagiarism Policy',    'plagiarism-policy'],
                  ['Archiving Policy',     'archiving-policy'],
                ].map(([label, href]) => (
                  <Link
                    key={href}
                    href={`/policies/${href}?journal=${journal.id}`}
                    className={`block text-[11px] font-bold uppercase tracking-widest pb-3 border-b border-white/5 last:border-0 transition-all ${
                      slug === href ? 'text-[#4BA6B9]' : 'text-white/60 hover:text-[#4BA6B9]'
                    }`}
                  >
                    {label}
                  </Link>
                ))}
              </div>
            </div>

            <div className="p-8 bg-white border border-[#E2E8F0] rounded-2xl shadow-sm text-center">
              <ShieldCheck size={40} className="text-[#4BA6B9] mx-auto mb-4" />
              <h4 className="text-[10px] font-bold uppercase tracking-widest text-[#1A1A1A]">Verified Policy</h4>
              <p className="text-[11px] text-[#999999] font-bold mt-2 uppercase">Compliant with International Standards</p>
            </div>
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}
export default function PolicyDetailPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-white"></div>}>
      <PolicyContent />
    </Suspense>
  );
}
