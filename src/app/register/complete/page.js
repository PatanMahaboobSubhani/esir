'use client';

import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Link from 'next/link';
import { BadgeCheck, ArrowRight, FileText, Plus, User, ArrowLeft, Globe } from 'lucide-react';
import { motion } from 'framer-motion';

export default function RegistrationComplete() {
  const searchParams = typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : null;
  const journalSlug = searchParams?.get('journal');
  const journalName = journalSlug ? (journalSlug === 'jeiml' ? 'Eye-Innovation in ML' : 'Cyber Security') : 'Scholarly Portal';

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 font-sans">
      <Header />

      <main className="flex-grow flex items-center justify-center p-6 py-12">
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-2xl bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden"
        >
          {/* Success Banner */}
          <div className="bg-slate-900 p-8 sm:p-12 text-center relative">
            <div className="absolute inset-0 bg-gradient-to-br from-[#4BA6B9]/10 to-transparent" />
            <motion.div 
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="w-16 h-16 bg-[#4BA6B9] rounded-2xl flex items-center justify-center mx-auto mb-6 relative z-10 shadow-lg shadow-[#4BA6B9]/20"
            >
              <BadgeCheck className="text-white" size={32} />
            </motion.div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2 relative z-10 tracking-tight">Registration Complete</h1>
            <p className="text-slate-400 font-medium relative z-10 italic">Welcome to the {journalName} research community</p>
          </div>

          {/* Action List */}
          <div className="p-8 sm:p-12">
            <p className="text-slate-600 font-semibold text-center mb-8">
              Your account has been successfully created. How would you like to proceed?
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { href: '/dashboard/submissions', label: 'View Submissions', icon: FileText, color: '#4BA6B9' },
                { href: '/dashboard/submit', label: 'Start New Submission', icon: Plus, color: '#6366F1' },
                { href: '/dashboard/profile', label: 'Update My Profile', icon: User, color: '#F59E0B' },
                { href: '/', label: 'Back to Home', icon: Globe, color: '#64748B' },
              ].map((item, idx) => (
                <Link 
                  key={idx}
                  href={`${item.href}${journalSlug ? '?journal='+journalSlug : ''}`}
                  className="group flex flex-col p-5 rounded-xl border border-slate-200 hover:border-[#4BA6B9] hover:bg-slate-50 transition-all duration-200"
                >
                  <div className="w-10 h-10 rounded-lg flex items-center justify-center mb-4 transition-transform group-hover:scale-110" style={{ backgroundColor: `${item.color}15`, color: item.color }}>
                    <item.icon size={20} />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900 text-[15px]">{item.label}</span>
                    <ArrowRight className="text-slate-400 group-hover:text-[#4BA6B9] group-hover:translate-x-1 transition-all" size={16} />
                  </div>
                </Link>
              ))}
            </div>

            <div className="mt-10 text-center pt-8 border-t border-slate-100">
               <Link href="/dashboard" className="inline-flex items-center gap-2 text-[14px] font-bold text-slate-900 hover:text-[#4BA6B9] transition-colors">
                 <ArrowLeft size={16} /> Enter my dashboard
               </Link>
            </div>
          </div>
        </motion.div>
      </main>

      <Footer />
    </div>
  );
}
