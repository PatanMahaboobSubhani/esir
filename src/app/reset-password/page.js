'use client';

import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Link from 'next/link';
import { Lock, Eye, EyeOff, ArrowRight, CheckCircle, AlertCircle, ShieldCheck } from 'lucide-react';
import { useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';

function ResetForm() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(null); // 'success' | 'error'
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirm) {
      setStatus('error');
      setMessage('Passwords do not match.');
      return;
    }

    // --- PASSWORD STRENGTH VALIDATION (Sync with registration policy) ---
    if (password.length < 5) {
      setStatus('error');
      setMessage('Password must be at least 5 characters long.');
      return;
    }

    const passwordRegex = /^[A-Z](?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&]).{4,}$/;
    if (!passwordRegex.test(password)) {
      setStatus('error');
      setMessage('Password must start with an uppercase letter and include at least one number and one special character.');
      return;
    }

    setLoading(true);
    setStatus(null);

    try {
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, password }),
      });
      const data = await res.json();
      setStatus(data.success ? 'success' : 'error');
      setMessage(data.message);
    } catch {
      setStatus('error');
      setMessage('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!token) {
    return (
      <div className="bg-red-50 border border-red-100 p-6 rounded-xl text-center space-y-3">
        <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center mx-auto text-red-600">
          <AlertCircle size={20} />
        </div>
        <p className="text-red-700 font-semibold text-[14px]">Invalid or expired reset link.</p>
        <Link href="/forgot-password" className="inline-block text-[#4BA6B9] font-semibold text-[13px] hover:underline">
          Request a new link
        </Link>
      </div>
    );
  }

  return (
    <div className="w-full">
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
                <h3 className="text-emerald-900 font-bold text-[14px] mb-0.5">Password reset successful</h3>
                <p className="text-emerald-700 text-[13px] leading-relaxed">{message}</p>
              </div>
            </div>
            <Link
              href="/login"
              className="flex items-center justify-center gap-2 w-full h-11 bg-slate-900 hover:bg-slate-800 text-white rounded-lg font-semibold text-[14px] transition-all shadow-sm"
            >
              Sign in to your account <ArrowRight size={16} />
            </Link>
          </motion.div>
        ) : (
          <motion.form key="form" onSubmit={handleSubmit} className="space-y-5">
            {status === 'error' && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="p-3 bg-red-50 border border-red-100 rounded-lg text-red-600 text-[13px] font-medium flex items-center gap-2"
              >
                <AlertCircle size={16} className="shrink-0" />
                <p>{message}</p>
              </motion.div>
            )}

            <div className="space-y-1.5">
              <label className="text-[13px] font-semibold text-slate-700">New Password</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input
                  type={showPass ? 'text' : 'password'}
                  required
                  minLength={6}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="Minimum 6 characters"
                  className="w-full h-11 bg-white border border-slate-300 rounded-lg pl-10 pr-10 text-[14px] text-slate-900 placeholder-slate-400 outline-none transition-all focus:border-[#4BA6B9] focus:ring-[3px] focus:ring-[#4BA6B9]/10 hover:border-slate-400"
                />
                <button 
                  type="button" 
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-[#4BA6B9]"
                >
                  {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[13px] font-semibold text-slate-700">Confirm Password</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input
                  type={showConfirm ? 'text' : 'password'}
                  required
                  value={confirm}
                  onChange={e => setConfirm(e.target.value)}
                  placeholder="Re-enter your password"
                  className="w-full h-11 bg-white border border-slate-300 rounded-lg pl-10 pr-10 text-[14px] text-slate-900 placeholder-slate-400 outline-none transition-all focus:border-[#4BA6B9] focus:ring-[3px] focus:ring-[#4BA6B9]/10 hover:border-slate-400"
                />
                <button 
                  type="button" 
                  onClick={() => setShowConfirm(!showConfirm)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-[#4BA6B9]"
                >
                  {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {confirm && password !== confirm && (
                <p className="text-red-500 text-[12px] font-semibold ml-1">Passwords do not match</p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading || (confirm && password !== confirm)}
              className="w-full h-11 bg-[#0B1F3A] hover:opacity-90 text-white rounded-lg font-semibold text-[14px] transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-sm"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  Set New Password
                  <ArrowRight size={16} />
                </>
              )}
            </button>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function ResetPasswordPage() {
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
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight mb-2">Set New Password</h1>
            <p className="text-[14px] text-slate-500">Choose a strong password for your account</p>
          </div>

          <Suspense fallback={
            <div className="flex flex-col items-center justify-center p-12 space-y-4">
              <div className="w-8 h-8 border-3 border-slate-100 border-t-[#4BA6B9] rounded-full animate-spin"></div>
              <p className="text-slate-400 text-[13px] font-medium">Verifying reset link...</p>
            </div>
          }>
            <ResetForm />
          </Suspense>
        </motion.div>
      </main>

      <Footer />
    </div>
  );
}
