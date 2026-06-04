import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Linkedin, User } from 'lucide-react';
import { leaders } from '@/lib/data';

export const metadata = {
  title: "Leadership Team | Eye-Innovations Scientific Research",
  description: "Meet the team leading EISR and supporting scientific research worldwide.",
};

export default function Leadership() {
  return (
    <div className="min-h-screen flex flex-col font-sans bg-white ">
      <Header />
      
      <main className="flex-grow pb-20">
        {/* Header Hero */}
        <section className="bg-white py-8 text-center">
           <div className="max-w-[1240px] mx-auto px-6">
              <h1 className="text-3xl font-black text-[#1A1A1A] tracking-tighter">Leadership Team</h1>
              <div className="w-16 h-0.5 bg-[#4BA6B9]/20 mx-auto mt-4"></div>
           </div>
        </section>

        {/* Content Section */}
        <section className="mt-2">
           <div className="max-w-[1100px] mx-auto px-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                 {leaders.map((leader, idx) => (
                    <div key={idx} className="bg-white rounded-2xl p-4 border border-[#F1F1F1] shadow-sm hover:shadow-lg transition-all duration-500 group relative flex items-center overflow-hidden">
                       {/* Top Gradient Accent */}
                       <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-[#6366f1] via-[#a855f7] to-[#2dd4bf] opacity-80" />
                       
                       {/* Left: Rounded Image Container */}
                       <div className="w-20 h-20 rounded-2xl overflow-hidden shrink-0 border border-[#F1F1F1]">
                          {leader.image ? (
                             <img 
                               src={leader.image} 
                               alt={leader.name} 
                               className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                             />
                          ) : (
                             <div className="w-full h-full bg-[#F8F9FA] flex flex-col items-center justify-center text-[#CCCCCC]">
                                <User size={24} strokeWidth={1} />
                             </div>
                          )}
                       </div>

                       {/* Center: Details */}
                       <div className="flex-grow pl-6 space-y-0.5">
                          <h3 className="text-[16px] font-black text-[#1A1A1A] tracking-tight group-hover:text-[#4BA6B9] transition-colors leading-tight">
                             {leader.name}
                          </h3>
                          <p className="text-[11px] text-[#555555] font-bold tracking-tight uppercase opacity-80">
                             {leader.title}
                          </p>
                       </div>

                       {/* Right: LinkedIn Button */}
                       <div className="shrink-0 pl-4">
                          <a href="#" className="w-9 h-9 rounded-lg bg-[#F8F9FA] flex items-center justify-center text-[#1A1A1A] hover:bg-[#0077B5] hover:text-white transition-all shadow-sm">
                             <Linkedin size={16} fill="currentColor" stroke="none" />
                          </a>
                       </div>
                    </div>
                 ))}
              </div>
           </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
}
