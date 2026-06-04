import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { journals } from '@/lib/data';

export const metadata = {
  title: "Article Publishing Charges (APCs) | Eye-Innovations Scientific Research",
  description: "Transparent publication fee structures for all EISR scientific journals.",
};

export default function APCPage() {
  return (
    <div className="min-h-screen flex flex-col font-sans bg-white selection:bg-[#4BA6B9]/10">
      <Header />
      
      <main className="flex-grow pb-20 px-6 mt-8">
        <section className="bg-white pb-8 text-center">
           <div className="max-w-[1240px] mx-auto space-y-3">
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-[#4BA6B9]">Author Resources</span>
              <h1 className="text-3xl md:text-4xl font-sans font-black text-[#1A1A1A] tracking-tighter">Article Publishing Charges</h1>
              <p className="text-[13px] font-bold text-[#6B7280] max-w-xl mx-auto opacity-70 leading-relaxed">EISR is committed to fully open-access publishing models with transparent fee structures.</p>
           </div>
        </section>

        {/* Professional APC Table Section */}
        <section className="mt-10">
           <div className="max-w-[1000px] mx-auto bg-white rounded-2xl border border-[#E2E8F0] overflow-hidden shadow-sm">
              <table className="w-full text-left font-sans">
                 <thead>
                    <tr className="bg-[#FAFBFC] border-b border-[#E2E8F0]">
                       <th className="p-6 lg:p-8 text-[10px] font-black uppercase tracking-widest text-[#555555]">Scientific Journal Name</th>
                       <th className="p-6 lg:p-8 text-[10px] font-black uppercase tracking-widest text-[#555555] text-right">Fee Status (APC)</th>
                    </tr>
                 </thead>
                 <tbody className="divide-y divide-[#F1F5F9]">
                    {journals.map((item) => (
                       <tr key={item.id} className="group hover:bg-[#F8FAFC] transition-colors">
                          <td className="p-6 lg:p-8">
                             <div className="text-[14px] font-black text-[#1A1A1A] group-hover:text-[#4BA6B9] transition-all tracking-tight">{item.title}</div>
                          </td>
                          <td className="p-6 lg:p-8 text-right">
                             <div className={`text-[10px] font-black uppercase tracking-wider px-3 py-1.5 rounded-md inline-block ${item.apc.toLowerCase().includes('no') ? 'bg-green-50 text-green-700' : 'bg-blue-50 text-blue-700'}`}>
                                {item.apc}
                             </div>
                          </td>
                       </tr>
                    ))}
                 </tbody>
              </table>
           </div>

           <div className="max-w-[1000px] mx-auto mt-10 p-8 bg-[#F8FAFC] rounded-2xl border border-[#E2E8F0] space-y-4">
              <h4 className="text-[10px] font-black uppercase tracking-widest text-[#555555]">Waiver Policy</h4>
              <p className="text-sm font-medium text-[#555555] leading-relaxed">
                 EISR recognizes that researchers from some institutions may face financial challenges. We provide a comprehensive waiver program for authors from low-income economies and those with documented financial constraints. Please contact our editorial office after manuscript acceptance to apply for institutional support.
              </p>
           </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
}
