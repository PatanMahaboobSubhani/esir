'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Minus, ShieldCheck } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function PolicyAccordion({ items }) {
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <div className="space-y-6">
      {items.map((item, index) => (
        <div 
          key={index} 
          className={cn(
            "group bg-white rounded-xl border transition-all duration-500 overflow-hidden",
            openIndex === index 
              ? "border-[#0B1F3A] shadow-2xl shadow-[#0B1F3A]/5 scale-[1.01]" 
              : "border-[#F4F6F9] hover:border-[#1E4FA3]/30"
          )}
        >
          <button
            onClick={() => setOpenIndex(openIndex === index ? -1 : index)}
            className="w-full text-left px-8 py-8 flex items-center justify-between group-hover:bg-[#F4F6F9]/30 transition-colors"
          >
            <div className="flex items-center space-x-6">
               <div className={cn(
                 "w-10 h-10 rounded-lg flex items-center justify-center transition-all duration-500",
                 openIndex === index ? "bg-[#0B1F3A] text-white" : "bg-[#F4F6F9] text-[#6B7280]"
               )}>
                  <ShieldCheck size={18} strokeWidth={openIndex === index ? 3 : 2} />
               </div>
               <span className={cn(
                 "text-sm font-black uppercase tracking-[0.2em] transition-all",
                 openIndex === index ? "text-[#0B1F3A]" : "text-[#6B7280] group-hover:text-[#0B1F3A]"
               )}>
                 {item.title}
               </span>
            </div>
            <div className={cn(
              "w-8 h-8 rounded-full border border-[#F4F6F9] flex items-center justify-center transition-all duration-500",
              openIndex === index ? "rotate-180 bg-[#0B1F3A] text-white border-transparent" : "text-[#6B7280]"
            )}>
               {openIndex === index ? <Minus size={14} strokeWidth={3} /> : <Plus size={14} />}
            </div>
          </button>
          
          <AnimatePresence>
            {openIndex === index && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.5, ease: [0.04, 0.62, 0.23, 0.98] }}
              >
                <div className="px-8 pb-10 pt-2 ml-[64px] mr-8">
                   <div className="h-px w-20 bg-[#1E4FA3] mb-8" />
                   <div className="prose prose-slate max-w-none text-[#1A1A1A]/70 text-base leading-relaxed   ">
                      {item.content}
                   </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      ))}
    </div>
  );
}
