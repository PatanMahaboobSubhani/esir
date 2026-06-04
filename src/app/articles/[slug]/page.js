'use client';
import { useParams } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Link from 'next/link';
import { journals, journalMenuItems, journalPolicyItems, journalAboutItems } from '@/lib/data';
import { ChevronRight, FileText, ChevronDown, ChevronUp, Eye, User, GraduationCap } from 'lucide-react';
import { useState, useEffect } from 'react';

const BANNERS = ['/baner0001.jpg', '/baner0002.jpg', '/baner0003.jpg', '/baner0004.jpg'];

export default function ArticlePage() {
  const { slug } = useParams();
  const [current, setCurrent] = useState(0);
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Accordion states
  const [openMenu, setOpenMenu] = useState(true);
  const [openPolicies, setOpenPolicies] = useState(false);

  // Sliding banner
  useEffect(() => {
    const t = setInterval(() => setCurrent(p => (p + 1) % BANNERS.length), 5000);
    return () => clearInterval(t);
  }, []);

  // Fetch article from DB and increment view count
  useEffect(() => {
    if (!slug) return;
    const fetchAndView = async () => {
      try {
        const sessionKey = `viewed_article_${slug}`;
        const alreadyViewed = sessionStorage.getItem(sessionKey);

        if (!alreadyViewed) {
          sessionStorage.setItem(sessionKey, '1');
          await fetch(`/api/articles/${slug}/view`, { method: 'POST' });
        }

        const res = await fetch(`/api/articles/${slug}`);
        const data = await res.json();
        if (data.success) {
          setArticle(data.article);
        }
      } catch (e) {
        console.error('Failed to load article', e);
      } finally {
        setLoading(false);
      }
    };
    fetchAndView();
  }, [slug]);

  const journal = article
    ? journals.find(j => j.id.toLowerCase() === (article.journal_id || '').toLowerCase()) || journals[0]
    : null;

  const doi = article
    ? `https://doi.org/10.63180/${article.journal_id}.eisr.${new Date(article.published_date).getFullYear()}.1.${article.id}`
    : '';

  const publishedYear = article ? new Date(article.published_date).getFullYear() : '';
  const formattedDate = article
    ? new Date(article.published_date).toLocaleDateString('en-CA').replace(/-/g, '/') // format: YYYY/MM/DD
    : '';

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col font-sans bg-white">
        <Header />
        <main className="flex-grow flex items-center justify-center">
          <div style={{ width: 36, height: 36, border: '3px solid #e2e8f0', borderTopColor: '#2b6cb0', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </main>
        <Footer />
      </div>
    );
  }

  if (!article) {
    return (
      <div className="min-h-screen flex flex-col font-sans bg-white">
        <Header />
        <main className="flex-grow flex flex-col items-center justify-center gap-4">
          <p className="text-xl font-bold text-gray-600">Article not found.</p>
          <Link href="/articles" className="text-[#2b6cb0] hover:underline font-semibold">← Back to Articles</Link>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col font-sans bg-white">
      <Header />

      {/* ── Sliding Hero Banner ── */}
      <section className="relative text-white h-[350px] flex flex-col justify-center px-6 bg-[#0B1F3A] overflow-hidden">
        <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden bg-[#0B1F3A]">
          {BANNERS.map((src, i) => (
            <div
              key={src}
              className={`absolute inset-0 bg-cover bg-center transition-opacity duration-1000 ease-in-out ${i === current ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}
              style={{ backgroundImage: `url('${src}')` }}
            />
          ))}
          {/* Darker gradient overlay to make text pop */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#0B1F3A] via-[#0B1F3A]/80 to-transparent z-20" />
          <div className="absolute inset-0 bg-black/40 z-20" />
        </div>

        {/* Content overlay */}
        <div className="max-w-[1300px] w-full mx-auto relative z-10 flex flex-col space-y-3">
           <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-white drop-shadow-md max-w-3xl">
             {journal ? journal.title : article.journal_id}
           </h1>
           <p className="text-sm font-semibold text-white/90 drop-shadow">ISSN: 3079-5354 (Online)</p>
           <p className="text-sm font-semibold text-white/90 drop-shadow">
             Publishing model: <span className="underline text-white">Open Access</span>
           </p>
        </div>

        {/* Dot indicators */}
        <div className="absolute bottom-6 left-0 right-0 max-w-[1300px] w-full mx-auto px-6 flex gap-2 z-20">
          {BANNERS.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className="border-none cursor-pointer p-0"
              style={{
                width: i === current ? '32px' : '8px', height: '8px', borderRadius: '4px',
                backgroundColor: i === current ? '#4BA6B9' : 'rgba(255,255,255,0.4)',
                transition: 'all 0.4s ease',
              }}
            />
          ))}
        </div>
      </section>

      {/* Dark Blue Sub-Navbar */}
      <div className="w-full bg-[#051c3d] text-white text-[11px] font-semibold px-6 relative z-30">
        <div className="max-w-[1300px] mx-auto flex flex-wrap gap-x-6 gap-y-2 py-3">
           <Link href="#" className="hover:text-gray-300 transition-colors py-1">Home</Link>
           <Link href="#" className="hover:text-gray-300 transition-colors py-1">Archives</Link>
           <Link href="#" className="hover:text-gray-300 transition-colors py-1">Current Issues</Link>
           
           {/* Journal Menu Dropdown */}
           <div className="relative group py-1">
             <div className="flex items-center gap-1 cursor-pointer hover:text-gray-300 transition-colors">
               Journal Menu <ChevronDown size={12}/>
             </div>
             <div className="absolute top-full left-0 mt-0 w-56 bg-white text-gray-800 shadow-2xl border border-gray-100 rounded-b-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 overflow-hidden flex flex-col">
               {journalMenuItems.map(item => (
                 <Link key={item.slug} href={journal ? `/journals/${journal.slug}/${item.slug}` : '#'} className="px-5 py-3 hover:bg-[#f8fafd] hover:text-[#2b6cb0] border-b border-gray-50 transition-colors">
                   {item.name}
                 </Link>
               ))}
             </div>
           </div>

           {/* Journal Policies Dropdown */}
           <div className="relative group py-1">
             <div className="flex items-center gap-1 cursor-pointer hover:text-gray-300 transition-colors">
               Journal Policies <ChevronDown size={12}/>
             </div>
             <div className="absolute top-full left-0 mt-0 w-64 bg-white text-gray-800 shadow-2xl border border-gray-100 rounded-b-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 overflow-hidden flex flex-col">
               {journalPolicyItems.map(item => (
                 <Link key={item.slug} href={journal ? `/journals/${journal.slug}/${item.slug}` : '#'} className="px-5 py-3 hover:bg-[#f8fafd] hover:text-[#2b6cb0] border-b border-gray-50 transition-colors">
                   {item.name}
                 </Link>
               ))}
             </div>
           </div>

           {/* About Dropdown */}
           <div className="relative group py-1">
             <div className="flex items-center gap-1 cursor-pointer hover:text-gray-300 transition-colors">
               About <ChevronDown size={12}/>
             </div>
             <div className="absolute top-full left-0 mt-0 w-56 bg-white text-gray-800 shadow-2xl border border-gray-100 rounded-b-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 overflow-hidden flex flex-col">
               {journalAboutItems.map(item => (
                 <Link key={item.slug} href={journal ? `/journals/${journal.slug}/${item.slug}` : '#'} className="px-5 py-3 hover:bg-[#f8fafd] hover:text-[#2b6cb0] border-b border-gray-50 transition-colors">
                   {item.name}
                 </Link>
               ))}
             </div>
           </div>

        </div>
      </div>

      <main className="flex-grow pb-24 px-6 bg-[#f8fafd]">
        <div className="max-w-[1300px] mx-auto mt-8 grid lg:grid-cols-12 gap-8 items-start">
          
          {/* Main Article Content (Left 9 columns) */}
          <div className="lg:col-span-9 bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 p-8 md:p-12 space-y-10">
            
            {/* Header Section */}
            <div className="space-y-6">
              {/* Breadcrumb & Badges row */}
              <div className="flex flex-wrap items-center justify-between gap-4 border-b border-gray-100 pb-4">
                <div className="flex items-center text-[11px] font-semibold text-gray-500 space-x-2">
                  <Link href="/" className="hover:text-[#4BA6B9] transition-colors">Home</Link>
                  <ChevronRight size={10} className="text-gray-300" />
                  <Link href="#" className="hover:text-[#4BA6B9] transition-colors">Archives</Link>
                  <ChevronRight size={10} className="text-gray-300" />
                  <Link href="#" className="hover:text-[#4BA6B9] transition-colors">Volume {publishedYear}, Issue 1</Link>
                  <ChevronRight size={10} className="text-gray-300" />
                  <span className="text-[#4BA6B9]">Article</span>
                </div>

                <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-wider">
                  <span className="text-[#16a34a] flex items-center gap-1 bg-green-50 px-2 py-1 rounded-md">
                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd"/></svg>
                    Open Access
                  </span>
                  <span className="bg-[#4BA6B9]/10 text-[#4BA6B9] px-2 py-1 rounded-md">Research Article</span>
                  <span className="text-gray-500 flex items-center gap-1 bg-gray-50 px-2 py-1 rounded-md">
                    <Eye size={12} /> {article.views ?? 0} views
                  </span>
                </div>
              </div>

              {/* Title */}
              <h1 className="text-3xl md:text-4xl font-black text-[#1a202c] leading-tight tracking-tight">
                {article.prefix ? article.prefix + ' ' : ''}
                {article.title}
                {article.subtitle ? ': ' + article.subtitle : ''}
              </h1>

              {/* Authors & PDF layout */}
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end gap-6 pt-2">
                <div className="space-y-3">
                  <p className="text-[14px] text-gray-800 font-medium leading-relaxed max-w-2xl">
                    By <span className="text-[#4BA6B9] font-bold">{article.authors || 'Unknown'}</span>
                  </p>
                  <div className="flex items-center gap-4 text-[12px] text-gray-500 font-semibold">
                    <span>Published: {formattedDate}</span>
                    <span className="w-1 h-1 rounded-full bg-gray-300"></span>
                    <span>DOI: <a href={doi} className="text-[#4BA6B9] hover:underline">{doi}</a></span>
                  </div>
                </div>
                
                <a 
                  href={article.final_file_path ? `/api/download?file=${article.final_file_path}&inline=true` : (article.file_path ? `/api/download?file=${article.file_path}&inline=true` : `/api/download?file=/uploads/Assessment.pdf&inline=true`)} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  onClick={(e) => {
                    if (!article.final_file_path && !article.file_path) {
                      alert("Demo Mode: This article has no PDF uploaded in the database. Opening a sample PDF so you can test the viewer.");
                    }
                  }}
                  className="group flex items-center gap-3 bg-[#e53e3e] hover:bg-[#c53030] text-white px-5 py-2.5 rounded-xl transition-all shadow-md shadow-red-500/20 shrink-0"
                >
                  <FileText size={20} />
                  <span className="text-[12px] font-black uppercase tracking-wider">VIEW PDF</span>
                </a>
              </div>
            </div>

            {/* Abstract */}
            <div className="space-y-4 pt-6 border-t border-gray-100">
              <h3 className="text-lg font-black text-gray-900 flex items-center gap-2">
                <div className="w-1.5 h-5 bg-[#4BA6B9] rounded-full"></div>
                Abstract
              </h3>
              <p className="text-[14px] text-gray-600 leading-relaxed text-justify">
                {article.abstract || 'No abstract available for this article.'}
              </p>
            </div>

            {/* Keywords */}
            <div className="space-y-4 pt-4">
              <h4 className="text-[13px] font-black text-gray-900 uppercase tracking-wider">Keywords</h4>
              <div className="flex flex-wrap gap-2">
                {(article.keywords ? article.keywords.split(',') : ['Security', 'Risk Auditing', journal?.id || 'Journal']).map(tag => (
                  <span key={tag.trim()} className="text-[12px] font-bold text-[#4BA6B9] bg-[#4BA6B9]/10 hover:bg-[#4BA6B9] hover:text-white transition-colors px-3 py-1.5 rounded-full cursor-pointer">
                    {tag.trim()}
                  </span>
                ))}
              </div>
            </div>

            {/* How to Cite */}
            <div className="bg-gray-50 rounded-xl p-6 space-y-3 border border-gray-100 mt-8">
              <h4 className="text-[13px] font-black text-gray-900 uppercase tracking-wider">How to Cite the Article</h4>
              <p className="text-[13px] text-gray-600 leading-relaxed font-serif">
                {article.authors} ({publishedYear}). {article.title}. <span className="italic">{journal ? journal.title : article.journal_id}</span>, {publishedYear}(1). <a href={doi} className="text-[#4BA6B9] hover:underline break-all">{doi}</a>
              </p>
            </div>

            {/* License */}
            <div className="flex items-start gap-3 text-gray-500 bg-blue-50/50 p-4 rounded-xl border border-blue-100/50">
              <svg className="w-5 h-5 text-[#4BA6B9] shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
              <p className="text-[12px] leading-relaxed">
                <span className="font-bold text-gray-700">{article.title}</span> is licensed under <a href="#" className="font-bold text-[#4BA6B9] hover:underline">Creative Commons Attribution 4.0 International (CC BY 4.0)</a>. This allows unrestricted use, distribution, and reproduction in any medium, provided the original work is properly cited.
              </p>
            </div>

            {/* References */}
            <div className="space-y-4 pt-8 border-t border-gray-100">
              <h3 className="text-lg font-black text-gray-900 flex items-center gap-2">
                <div className="w-1.5 h-5 bg-[#4BA6B9] rounded-full"></div>
                References
              </h3>
              <div className="text-[13px] text-gray-600 font-serif space-y-3">
                {article.references ? (
                  article.references.split('\n').map((ref, idx) => (
                    <p key={idx}>{ref.trim()}</p>
                  ))
                ) : (
                  <p>No references provided for this article.</p>
                )}
              </div>
            </div>

          </div>

          {/* Right Sidebar (3 columns) */}
          <div className="lg:col-span-3 space-y-5">
            
            {/* Publisher / Editors Card */}
            <div className="bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 p-6 relative overflow-hidden flex flex-col items-center">
              <div className="absolute top-0 left-0 w-32 h-32 bg-[#f8fafd] rounded-br-full opacity-60 pointer-events-none"></div>
              
              <div className="text-center mb-5 relative z-10 w-full px-2">
                <p className="text-[9px] font-black text-gray-500 uppercase tracking-widest leading-tight">
                  {journal ? journal.title : 'JOURNAL OF EYE-INNOVATION'}
                </p>
              </div>

              <div className="w-full px-2 mb-8 space-y-2">
                <Link href="/dashboard/submissions" className="w-full bg-[#1A1A1A] hover:bg-black text-white text-center py-3 rounded-lg text-[9px] font-black uppercase tracking-[0.1em] transition-all shadow-md relative z-10 flex items-center justify-center gap-2">
                  SUBMIT MANUSCRIPT <ChevronRight size={12} strokeWidth={3} />
                </Link>
                <a 
                  href={journal?.id?.toLowerCase() === 'jeiml' ? '/JEIMT-Template.docx' : '/JEISA-Template.docx'} 
                  download 
                  className="w-full bg-white hover:bg-gray-50 border border-[#e2e8f0] text-[#1A1A1A] text-center py-2.5 rounded-lg text-[9px] font-black uppercase tracking-[0.1em] transition-all shadow-sm relative z-10 flex items-center justify-center gap-2"
                >
                  <FileText size={12} strokeWidth={2.5} /> DOWNLOAD TEMPLATE
                </a>
              </div>

              <div className="space-y-4 relative z-10 w-full px-2">
                {journal && journal.editorialTeam && journal.editorialTeam.length > 0 ? (
                  journal.editorialTeam.slice(0, 3).map((editor) => (
                    <div key={editor.id} className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full flex items-center justify-center bg-white border border-gray-200 shrink-0 overflow-hidden shadow-sm relative">
                         {editor.photo ? (
                           <img src={editor.photo} alt={editor.name} className="w-full h-full object-cover relative z-10" onError={(e) => e.target.style.display='none'} />
                         ) : null}
                         <User size={16} className="text-gray-400 absolute z-0" />
                      </div>
                      <div>
                        <p className="text-[11px] font-bold text-gray-900">{editor.name}</p>
                        <p className="text-[9px] font-medium text-gray-500">{editor.role}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full flex items-center justify-center bg-white border border-gray-200 shrink-0 shadow-sm">
                      <User size={14} className="text-gray-400" />
                    </div>
                    <div>
                      <p className="text-[11px] font-bold text-gray-900">Editorial Team</p>
                      <p className="text-[9px] font-medium text-gray-500">Information not available</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Accordion Menus Card */}
            <div className="bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 overflow-hidden flex flex-col">
              
              {/* Journal Menu */}
              <div 
                className="flex justify-between items-center p-4 cursor-pointer text-[#2b6cb0] hover:bg-[#f8fafd] transition-colors border-b border-[#e2e8f0]"
                onClick={() => setOpenMenu(!openMenu)}
              >
                <span className="text-[11px] font-bold tracking-tight">Journal Menu</span>
                {openMenu ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
              </div>
              
              {openMenu && (
                <div className="bg-white flex flex-col py-1">
                  {journalMenuItems.map(item => (
                    <Link key={item.slug} href={journal ? `/journals/${journal.slug}/${item.slug}` : '#'} className="px-5 py-2.5 text-[11px] font-bold text-gray-700 hover:text-[#2b6cb0] hover:bg-[#f8fafd] border-b border-gray-50 transition-colors flex items-center justify-between group">
                      {item.name}
                      <ChevronRight size={12} className="text-gray-300 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </Link>
                  ))}
                </div>
              )}

              {/* Journal Policies */}
              <div 
                className="flex justify-between items-center p-4 cursor-pointer text-[#2b6cb0] hover:bg-[#f8fafd] transition-colors border-t border-[#e2e8f0]"
                onClick={() => setOpenPolicies(!openPolicies)}
              >
                <span className="text-[11px] font-bold tracking-tight">Journal Policies</span>
                {openPolicies ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
              </div>
              
              {openPolicies && (
                <div className="bg-white flex flex-col py-1 border-t border-[#e2e8f0]">
                  {journalPolicyItems.map(item => (
                    <Link key={item.slug} href={journal ? `/journals/${journal.slug}/${item.slug}` : '#'} className="px-5 py-2.5 text-[11px] font-bold text-gray-700 hover:text-[#2b6cb0] hover:bg-[#f8fafd] border-b border-gray-50 transition-colors flex items-center justify-between group">
                      {item.name}
                      <ChevronRight size={12} className="text-gray-300 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* Indexing Partners */}
            <div className="bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 py-8 px-6 flex flex-col items-center">
              <div className="space-y-1.5 text-center w-full mb-8">
                <h3 className="text-[11px] font-black text-gray-800 uppercase tracking-widest">Indexing</h3>
                <div className="w-6 h-0.5 bg-[#4BA6B9] mx-auto"></div>
              </div>
              
              <div className="flex flex-col items-center gap-8 w-full">
                {/* Google Scholar Logo */}
                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center overflow-hidden shadow-sm border border-gray-100">
                  <img src="/google-scholar.jpg" alt="Google Scholar" className="w-full h-full object-cover" onError={(e) => e.target.style.display='none'} />
                </div>
                
                {/* Crossref Logo */}
                <div className="bg-white px-5 py-3 rounded-lg shadow-sm border border-gray-100 flex items-center justify-center">
                   <img src="/crossref.png" alt="Crossref" className="h-6 object-contain" onError={(e) => e.target.style.display='none'} />
                </div>
              </div>
            </div>

          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}
