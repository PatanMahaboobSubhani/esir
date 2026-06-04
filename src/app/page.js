'use client';
import { useState, useEffect } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Link from 'next/link';
import { 
  FileText, Calendar, User, Search, Globe, ChevronRight, 
  BookOpen, Target, Microscope, ArrowRight, Linkedin, ShieldCheck 
} from 'lucide-react';
import { journals, articles, leaders } from '@/lib/data';
import { submitContactForm } from './actions/contact';

function ScopeCluster({ title, topics }) {
  return (
    <div className="space-y-4">
      <h3 className="text-[13px] font-black text-[#1A1A1A] tracking-tight">{title}</h3>
      <ul className="space-y-2.5">
        {topics.map(topic => (
          <li key={topic} className="flex items-start space-x-3 group/item text-left">
            <div className="w-1.5 h-1.5 rounded-full bg-[#1e78ff] mt-1.5 shrink-0 group-hover/item:scale-125 transition-transform" />
            <span className="text-[12px] font-medium text-[#555555] leading-relaxed group-hover/item:text-[#1A1A1A] transition-colors">{topic}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function Home() {
  const [currentBanner, setCurrentBanner] = useState(0);
  const banners = ['/banner1.jpg', '/banner2.jpg', '/banner3.jpg', '/banner4.jpg'];
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState({ articles: null, views: null, journals: null });
  const [latestArticles, setLatestArticles] = useState([]);

  useEffect(() => {
    fetch('/api/stats')
      .then(r => r.json())
      .then(data => {
        if (data.success) {
          setStats({ articles: data.articles, views: data.views, journals: data.journals });
        }
      })
      .catch(() => {});
      
    fetch('/api/articles/latest')
      .then(r => r.json())
      .then(data => {
        if (data.success) {
          setLatestArticles(data.articles);
        }
      })
      .catch(() => {});
  }, []);

  const handleOnSubmit = async (e) => {
     e.preventDefault();
     setLoading(true);
     
     const formData = new FormData(e.target);
     const result = await submitContactForm(formData);
     
     if (result.success) {
        setSubmitted(true);
        setTimeout(() => setSubmitted(false), 5000);
     } else {
        alert(result.error || 'Failed to send message. Please try again.');
     }
     
     setLoading(false);
  };

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentBanner((prev) => (prev + 1) % banners.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [banners.length]);

  return (
    <div className="min-h-screen flex flex-col font-sans bg-white">
      <Header />
      
      <main className="flex-grow">
        {/* Sliding Hero Section */}
        <section 
          id="home"
          className="relative h-[420px] bg-[#050B14] bg-cover bg-center flex items-center px-6 antialiased z-40 transition-all duration-1000 ease-in-out"
          style={{ 
            backgroundImage: `url('${banners[currentBanner]}')`,
            backgroundRepeat: "no-repeat",
            imageRendering: "auto"
          }}
        >
          <div className="absolute inset-0 bg-black/10"></div>
          
          <div className="max-w-[1240px] mx-auto w-full flex justify-end relative z-10">
          </div>

          {/* Banner Indicators */}
          <div className="absolute bottom-20 left-1/2 -translate-x-1/2 flex space-x-2 z-50">
            {banners.map((_, i) => (
              <button 
                key={i} 
                onClick={() => setCurrentBanner(i)}
                className={`w-2.5 h-2.5 rounded-full transition-all ${i === currentBanner ? 'bg-[#4BA6B9] w-8' : 'bg-white/50 hover:bg-white'}`}
              />
            ))}
          </div>

          <div className="absolute -bottom-16 left-1/2 -translate-x-1/2 w-full max-w-[900px] px-4 md:px-6 z-50">
             <div className="bg-white rounded-xl shadow-lg py-4 px-6 lg:py-6 lg:px-16 grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-4 lg:gap-8 border border-[#F1F1F1]">
                <div className="flex items-start space-x-4">
                   <div className="w-[1.5px] h-12 bg-[#4BA6B9] shrink-0"></div>
                   <div className="flex flex-col">
                      <span className="text-lg font-bold text-[#1A1A1A]">
                        {stats.articles === null ? '...' : stats.articles}
                      </span>
                      <span className="text-sm font-medium text-[#555555]">Articles</span>
                   </div>
                </div>
                
                <div className="flex items-start space-x-4">
                   <div className="w-[1.5px] h-12 bg-[#4BA6B9] shrink-0"></div>
                   <div className="flex flex-col">
                      <span className="text-lg font-bold text-[#1A1A1A]">
                        {stats.views === null ? '...' : stats.views.toLocaleString()}
                      </span>
                      <span className="text-sm font-medium text-[#555555]">Article views</span>
                   </div>
                </div>

                <div className="flex items-start space-x-4">
                   <div className="w-[1.5px] h-12 bg-[#4BA6B9] shrink-0"></div>
                   <div className="flex flex-col">
                      <span className="text-lg font-bold text-[#1A1A1A]">
                        {stats.journals === null ? '...' : stats.journals}
                      </span>
                      <span className="text-sm font-medium text-[#555555]">Journals</span>
                   </div>
                </div>
             </div>
          </div>
        </section>

        {/* Foundations Section */}
        <section id="about" className="pt-24 pb-10 px-6 bg-white relative z-0">
           <div className="max-w-[1240px] mx-auto space-y-10">
              
              <div className="max-w-4xl mx-auto">
                 <p className="text-lg md:text-xl text-[#333333] leading-relaxed text-justify font-medium">
                    Eye-Innovations Scientific Research (EISR) stands as a premier global multidisciplinary scientific publishing and innovation ecosystem. Dedicated to advancing the frontiers of future-driven research, EISR serves as a foundational pillar for scholars, industry leaders, and policymakers. By facilitating the translation of academic inquiry into tangible societal progress, the organization forms a vital nexus connecting scientific discovery with technological advancement on a global scale.
                 </p>
              </div>

               <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="bg-white rounded-2xl shadow-sm border border-[#F1F1F1] p-8 flex flex-col h-full hover:shadow-md transition-shadow">
                     <div className="flex flex-col items-center mb-4">
                        <BookOpen className="text-[#1D4ED8] w-10 h-10 mb-3" strokeWidth={1.5} />
                        <h2 className="text-lg font-bold text-[#1A1A1A]">About</h2>
                    </div>
                    <div className="w-full h-px bg-[#F1F1F1] mb-6"></div>
                    <p className="text-sm text-[#555555] leading-relaxed text-center font-medium">
                       Eye-Innovations Scientific Research (EISR) is a global multidisciplinary research publishing ecosystem dedicated to advancing scientific knowledge and innovation through rigorous peer-review and open accessibility.
                    </p>
                 </div>

                  <div className="bg-white rounded-2xl shadow-sm border border-[#F1F1F1] p-8 flex flex-col h-full hover:shadow-md transition-shadow">
                     <div className="flex flex-col items-center mb-4">
                        <Target className="text-[#1D4ED8] w-10 h-10 mb-3" strokeWidth={1.5} />
                        <h2 className="text-lg font-bold text-[#1A1A1A]">Our Mission</h2>
                    </div>
                    <div className="w-full h-px bg-[#F1F1F1] mb-6"></div>
                    <p className="text-sm text-[#555555] leading-relaxed text-center font-medium">
                       To publish high-quality peer-reviewed research that promotes technological innovation, addresses global challenges, and fosters a collaborative nexus between academic inquiry and industrial application worldwide.
                    </p>
                 </div>
              </div>

              {/* Redesigned Scope & Focus Areas Section */}
               <div className="bg-white rounded-3xl shadow-sm border border-[#F1F1F1] p-8 lg:p-10 flex flex-col h-full relative overflow-hidden group">
                  <div className="absolute top-0 right-0 w-64 h-64 bg-[#1D4ED8]/5 rounded-full -mr-32 -mt-32 blur-3xl" />
                  
                  <div className="flex flex-col items-center mb-8 relative">
                    <div className="w-14 h-14 bg-[#1e78ff]/10 rounded-2xl flex items-center justify-center text-[#1D4ED8] mb-4 shadow-sm border border-[#1D4ED8]/5">
                        <Microscope size={28} strokeWidth={1.5} />
                    </div>
                    <h2 className="text-xl font-black text-[#1A1A1A] tracking-tight">Scope & Focus Areas</h2>
                    <p className="text-[11px] font-black text-[#4BA6B9] uppercase tracking-[0.2em] mt-2 opacity-80">Full Scientific Portfolio</p>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-16 gap-y-12 relative">
                    <ScopeCluster title="Cluster A: Tech & Innovation" topics={['AI & Machine Learning', 'Data Science & Analytics', 'IoT, Robotics & Cybersecurity', 'Industry 4.0 & Digital Transformation']} />
                    <ScopeCluster title="Cluster B: Science & Engineering" topics={['Physics, Chemistry, Mathematics', 'Electrical, Civil & Mechanical Engineering', 'Materials & Nanotechnology']} />
                    <ScopeCluster title="Cluster C: Health & Life Sciences" topics={['Biomedical & Clinical Research', 'Public Health & Epidemiology']} />
                    <ScopeCluster title="Cluster D: Agriculture & Environment" topics={['Smart Agriculture', 'Food Security', 'Climate & Sustainability']} />
                    <ScopeCluster title="Cluster E: Business & Social Sciences" topics={['Innovation & Entrepreneurship', 'Digital Education & Learning', 'Policy & Governance']} />
                    <ScopeCluster title="Cluster F: Special Series" topics={['Science for Sustainable Development Goals (SDGs)', 'Ethics & Governance in Emerging Tech', 'Future Workforce & Digital Skills']} />
                  </div>

                  {/* Indexing Targets Footer */}
                   <div className="mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-8 px-2 md:px-4">
                    <div className="flex flex-col items-center md:items-start space-y-1">
                       <span className="text-[11px] font-black text-[#1A1A1A] opacity-40 uppercase tracking-widest">Indexing Targets</span>
                       <p className="text-[12px] font-bold text-[#555555]">Global Standard Compliance</p>
                    </div>
                    <div className="flex flex-wrap justify-center gap-10">
                       {['Scopus', 'Google Scholar', 'Web of Science', 'DOAJ'].map(item => (
                         <div key={item} className="flex items-center space-x-2.5 group/target cursor-default">
                            <div className="w-8 h-8 rounded-lg bg-[#EAF6FF] flex items-center justify-center text-[#4BA6B9] group-hover/target:bg-[#4BA6B9] group-hover/target:text-white transition-all">
                               <ShieldCheck size={16} />
                            </div>
                            <span className="text-[13px] font-bold text-[#1A1A1A]">{item}</span>
                         </div>
                       ))}
                    </div>
                  </div>
              </div>

           </div>
        </section>

        {/* Journals Grid */}
        <section id="journals" className="bg-white py-10 lg:py-16">
           <div className="max-w-[1240px] mx-auto px-6">
               <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {journals.map((j) => (
                     <Link href={`/journals/${j.slug}`} key={j.id} className="group">
                       <div className="bg-white rounded-2xl md:rounded-l-none shadow shadow-[#F1F1F1] border border-[#F1F1F1] overflow-hidden flex flex-col md:flex-row h-auto md:h-[280px] transition-all duration-500 cursor-pointer hover:shadow-2xl hover:-translate-y-1">
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
                                   <div className="flex items-center gap-2 text-[12px] font-black text-[#1A1A1A] group-hover:gap-3 transition-all shrink-0 ml-2">
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

        {/* Latest Articles Section */}
        <section id="latest-articles" className="bg-[#F8FAFC] py-10 lg:py-16">
          <div className="max-w-[1240px] mx-auto px-6">
            <div className="flex justify-between items-end mb-8">
              <div>
                <h2 className="text-3xl font-bold text-[#1A1A1A] tracking-tight">Latest Published Articles</h2>
                <div className="w-16 h-0.5 bg-[#4BA6B9]/20 mt-3"></div>
              </div>
              <Link href="/articles" className="hidden md:flex items-center space-x-2 text-[#4BA6B9] font-bold hover:text-[#1D4ED8] transition-colors">
                <span>View All Articles</span>
                <ChevronRight size={16} />
              </Link>
            </div>
            
            <div className="space-y-4">
              {latestArticles.length === 0 ? (
                <div className="bg-white rounded-2xl p-8 text-center text-gray-500 font-medium shadow-sm border border-[#F1F1F1]">
                  Loading latest articles...
                </div>
              ) : (
                latestArticles.map((art) => {
                  const journal = journals.find(j => j.id.toLowerCase() === art.journal_id.toLowerCase());
                  const date = new Date(art.published_date);
                  const formattedDate = date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
                  
                  return (
                    <div key={art.id} className="bg-white rounded-2xl p-6 lg:p-8 border border-[#F1F1F1] shadow-sm hover:shadow-md transition-shadow group">
                      <div className="flex flex-col lg:flex-row justify-between lg:items-start gap-4">
                        <div className="space-y-3 flex-grow">
                          <Link href={`/articles/${art.id}`} className="block">
                            <h3 className="text-lg font-bold text-[#1D4ED8] hover:underline leading-snug">
                              {art.title}
                            </h3>
                          </Link>
                          <p className="text-sm font-semibold text-[#555555]">
                            {art.authors || 'Unknown Authors'}
                          </p>
                          <div className="flex flex-wrap items-center gap-3 text-[12px]">
                            <span className="font-bold text-[#4BA6B9]">{journal ? journal.title : art.journal_id}</span>
                            <span className="w-1 h-1 rounded-full bg-gray-300"></span>
                            <span className="text-gray-500 font-medium">Published: {formattedDate}</span>
                          </div>
                        </div>
                        <Link href={`/articles/${art.id}`} className="shrink-0 w-10 h-10 rounded-full bg-[#F4F6F9] text-[#1D4ED8] flex items-center justify-center group-hover:bg-[#4BA6B9] group-hover:text-white transition-colors">
                          <ArrowRight size={16} />
                        </Link>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            <div className="mt-8 flex justify-center md:hidden">
              <Link href="/articles" className="flex items-center justify-center space-x-2 text-white bg-[#1A1A1A] hover:bg-[#4BA6B9] w-full py-4 rounded-xl font-bold transition-colors shadow-lg">
                <span>View All Articles</span>
                <ChevronRight size={16} />
              </Link>
            </div>
          </div>
        </section>

        {/* Leadership Team Section */}
        <section id="leadership" className="bg-white py-10 lg:py-16">
           <div className="max-w-[1240px] mx-auto px-6 space-y-10 text-center">
              <div className="space-y-3">
                 <h2 className="text-3xl font-bold text-[#1A1A1A] tracking-tight">Leadership Team</h2>
                 <div className="w-16 h-0.5 bg-[#4BA6B9]/20 mx-auto"></div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-[1100px] mx-auto pt-4">
                 {leaders.map((leader, idx) => (
                    <div key={idx} className="bg-white rounded-3xl p-6 border border-[#F1F1F1] shadow-sm hover:shadow-xl transition-all duration-500 group relative flex items-center overflow-hidden text-left">
                       <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-[#6366f1] via-[#a855f7] to-[#2dd4bf] opacity-80" />
                       <div className="w-20 h-20 rounded-2xl overflow-hidden shrink-0 border border-[#F1F1F1]">
                          {leader.image ? (
                             <img src={leader.image} alt={leader.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                          ) : (
                             <div className="w-full h-full bg-[#F8F9FA] flex flex-col items-center justify-center text-[#CCCCCC]"><User size={24} strokeWidth={1} /></div>
                          )}
                       </div>
                       <div className="flex-grow pl-6 space-y-1">
                          <h3 className="text-[16px] font-bold text-[#1A1A1A] tracking-tight group-hover:text-[#4BA6B9] transition-colors leading-tight">{leader.name}</h3>
                          <p className="text-[11px] text-[#555555] font-semibold tracking-tight">{leader.title}</p>
                       </div>
                       <div className="shrink-0 pl-4">
                          <a href="#" className="w-8 h-8 rounded-lg bg-[#F8F9FA] flex items-center justify-center text-[#1A1A1A] hover:bg-[#0077B5] hover:text-white transition-all shadow-sm">
                             <Linkedin size={14} fill="currentColor" stroke="none" />
                          </a>
                       </div>
                    </div>
                 ))}
              </div>
           </div>
        </section>

        {/* APC Table Section */}
        <section id="apc" className="bg-white py-10 lg:py-16">
           <div className="max-w-[1240px] mx-auto px-6 space-y-12">
              <h2 className="text-3xl font-bold text-[#1A1A1A] tracking-tight text-center">Article Publishing Charges (APCs)</h2>
              <div className="max-w-[800px] mx-auto bg-[#F8F9FB] rounded-2xl border border-[#EEEEEE] overflow-x-auto">
                 <table className="w-full text-left text-sm">
                    <thead>
                       <tr className="bg-[#F1F5F9] border-b border-gray-200">
                          <th className="py-4 px-8 font-bold text-[#1A1A1A]">Journal</th>
                          <th className="py-4 px-8 font-bold text-[#1A1A1A]">Charge</th>
                       </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                       {journals.map((j) => (
                          <tr key={j.slug} className="hover:bg-white transition-colors">
                             <td className="py-4 px-8 font-medium text-[#1A1A1A]">{j.title}</td>
                             <td className="py-4 px-8 font-bold text-[#4BA6B9]">{j.apc}</td>
                          </tr>
                       ))}
                    </tbody>
                 </table>
              </div>
           </div>
        </section>

        {/* Contact Form Section */}
        <section id="contact" className="bg-[#F8F9FB] py-10 lg:py-16">
           <div className="max-w-[1240px] mx-auto px-6">
              <div className="grid lg:grid-cols-2 gap-10 lg:gap-20">
                 <div className="space-y-8">
                    <h2 className="text-3xl font-bold text-[#1A1A1A] tracking-tight">Get in Touch</h2>
                     <p className="text-[#1A1A1A] leading-relaxed font-bold">Have questions about submissions or peer-review? Our editorial team is ready to assist you.</p>
                    <div className="flex flex-col space-y-6 group py-4">
                       <div className="flex items-center space-x-6">
                          <div className="w-12 h-12 bg-white rounded-xl shadow-md flex items-center justify-center text-[#4BA6B9]"><Search size={20} /></div>
                          <div>
                              <p className="text-[11px] font-black text-[#1A1A1A]">Inquiries</p>
                             <p className="font-bold text-[#1A1A1A]">info@EISRpress.com</p>
                          </div>
                       </div>
                       <div className="flex items-center space-x-6">
                          <div className="w-12 h-12 bg-white rounded-xl shadow-md flex items-center justify-center text-[#4BA6B9]"><Globe size={20} /></div>
                          <div>
                              <p className="text-[11px] font-black text-[#1A1A1A]">Address</p>
                             <p className="font-bold text-[#1A1A1A]">Amman, Jordan</p>
                          </div>
                       </div>
                    </div>
                 </div>
                  {submitted ? (
                     <div className="bg-white p-16 rounded-3xl shadow-xl border border-[#EEEEEE] flex flex-col items-center justify-center space-y-6 animate-in fade-in zoom-in duration-500">
                        <div className="w-20 h-20 bg-[#4BA6B9]/10 rounded-full flex items-center justify-center text-[#4BA6B9]">
                           <ShieldCheck size={40} />
                        </div>
                        <div className="text-center space-y-2">
                           <h3 className="text-xl font-bold text-[#1A1A1A]">Message Sent!</h3>
                           <p className="text-sm font-medium text-[#555555]">Thank you for reaching out. Our team will get back to you shortly.</p>
                        </div>
                     </div>
                  ) : (
                    <form onSubmit={handleOnSubmit} className="bg-white p-10 rounded-3xl shadow-xl border border-gray-100 space-y-6">
                        <input required name="name" type="text" placeholder="Full Name" className="w-full bg-[#F8F9FB] border-none rounded-lg p-5 text-sm font-bold focus:ring-2 focus:ring-[#4BA6B9]/20 transition-all outline-none" />
                        <input required name="email" type="email" placeholder="Email Address" className="w-full bg-[#F8F9FB] border-none rounded-lg p-5 text-sm font-bold focus:ring-2 focus:ring-[#4BA6B9]/20 transition-all outline-none" />
                        <textarea required name="message" placeholder="Your Message" rows={4} className="w-full bg-[#F8F9FB] border-none rounded-lg p-5 text-sm font-bold focus:ring-2 focus:ring-[#4BA6B9]/20 transition-all outline-none" />
                        <button 
                           type="submit" 
                           disabled={loading}
                           className="w-full bg-[#1A1A1A] text-white py-5 rounded-xl font-bold hover:bg-[#4BA6B9] transition-all shadow-lg active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                           {loading ? 'Sending...' : 'Send Message'}
                        </button>
                    </form>
                  )}
              </div>
           </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
}
