'use client';

import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Link from 'next/link';
import { Mail, ArrowRight, ArrowLeft, CheckCircle, AlertCircle } from 'lucide-react';
import { useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';

function ForgotPasswordForm() {
  const searchParams = useSearchParams();
  const journal = searchParams.get('journal');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(null); // 'success' | 'error'
  const [message, setMessage] = useState('');
  const [devLink, setDevLink] = useState('');

  const loginLink = journal ? `/login?journal=${journal}` : '/login';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus(null);
    setDevLink('');

    try {
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();

      if (data.success) {
        setStatus('success');
        setMessage(data.message);
        if (data.devLink) setDevLink(data.devLink);
      } else {
        setStatus('error');
        setMessage(data.message || 'Something went wrong.');
      }
    } catch {
      setStatus('error');
      setMessage('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 font-sans">
      <Header />

      <main className="flex-grow flex items-center justify-center p-6 py-12">
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-slate-200 p-8 sm:p-10"
        >
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight mb-2">Forgot Password?</h1>
            <p className="text-[14px] text-slate-500">Enter your email and we'll send you a reset link</p>
          </div>

          <AnimatePresence mode="wait">
            {status === 'success' ? (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="space-y-6"
              >
                <div className="bg-emerald-50 border border-emerald-100 p-5 rounded-xl flex items-start gap-3">
                  <CheckCircle size={20} className="text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <h3 className="text-emerald-900 font-bold text-[14px] mb-0.5">Check your inbox</h3>
                    <p className="text-emerald-700 text-[13px] leading-relaxed">{message}</p>
                  </div>
                </div>

                {devLink && (
                  <div className="bg-amber-50 border border-amber-100 p-4 rounded-xl space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] bg-amber-200/50 text-amber-800 px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">Testing Link</span>
                    </div>
                    <a href={devLink} className="block text-[#4BA6B9] text-[12px] font-medium underline break-all hover:text-[#3D8B9B]">
                      {devLink}
                    </a>
                  </div>
                )}

                <Link
                  href={loginLink}
                  className="flex items-center justify-center gap-2 w-full h-11 bg-slate-900 hover:bg-slate-800 text-white rounded-lg font-semibold text-[14px] transition-all"
                >
                  <ArrowLeft size={16} /> Back to Sign in
                </Link>
              </motion.div>
            ) : (
              <motion.div key="form">
                {status === 'error' && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="mb-6 p-3 bg-red-50 border border-red-100 rounded-lg text-red-600 text-[13px] font-medium flex items-center gap-2"
                  >
                    <AlertCircle size={16} className="shrink-0" />
                    <p>{message}</p>
                  </motion.div>
                )}

                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="space-y-1.5">
                    <label className="text-[13px] font-semibold text-slate-700">Email Address</label>
                    <div className="relative">
                      <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        placeholder="name@example.com"
                        className="w-full h-11 bg-white border border-slate-300 rounded-lg pl-10 pr-3.5 text-[14px] text-slate-900 placeholder-slate-400 outline-none transition-all focus:border-[#4BA6B9] focus:ring-[3px] focus:ring-[#4BA6B9]/10 hover:border-slate-400"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full h-11 bg-[#0B1F3A] hover:opacity-90 text-white rounded-lg font-semibold text-[14px] transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-sm"
                  >
                    {loading ? (
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <>
                        Send Reset Link
                        <ArrowRight size={16} />
                      </>
                    )}
                  </button>

                  <div className="text-center pt-6 border-t border-slate-100">
                    <Link
                      href={loginLink}
                      className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-slate-600 hover:text-slate-900 transition-colors"
                    >
                      <ArrowLeft size={14} /> Back to Sign in
                    </Link>
                  </div>
                </form>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </main>

      <Footer />
    </div>
  );
}

export default function ForgotPasswordPage() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 font-sans">
      <Header />
      <Suspense fallback={null}>
        <ForgotPasswordForm />
      </Suspense>
      <Footer />
    </div>
  );
}
