'use client';

import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Link from 'next/link';
import { User, Lock, Eye, EyeOff, AlertCircle, ArrowRight } from 'lucide-react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';

export default function Login() {
  const router = useRouter();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Login failed');
      localStorage.setItem('eisr_token', data.token);
      
      const searchParams = new URLSearchParams(window.location.search);
      const journal = searchParams.get('journal');
      let redirect = searchParams.get('redirect');

      if (!redirect) {
        // Apply role-based default redirection
        const userRole = data.user.role;
        if (userRole === 'editor' || userRole === 'admin') {
          redirect = '/dashboard/submissions/unassigned';
        } else if (userRole === 'reviewer') {
          redirect = '/dashboard/reviewer/action-required';
        } else {
          redirect = '/dashboard';
        }
      }
      
      router.push(journal ? `${redirect}?journal=${journal}` : redirect);
    } catch (err) {
      setError(err.message);
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
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight mb-2">Welcome back</h1>
            <p className="text-[14px] text-slate-500">Sign in to your account to continue</p>
          </div>

          <AnimatePresence mode="wait">
            {error && (
              <motion.div 
                initial={{ opacity: 0, height: 0, marginBottom: 0 }}
                animate={{ opacity: 1, height: 'auto', marginBottom: 24 }}
                exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                className="overflow-hidden"
              >
                <div className="p-3 bg-red-50 border border-red-100 rounded-lg text-red-600 text-[13px] font-medium flex items-center gap-2">
                  <AlertCircle size={16} className="shrink-0" />
                  <p>{error}</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-1.5">
              <label className="text-[13px] font-semibold text-slate-700">Email or Username</label>
              <input 
                type="text"
                required
                placeholder="name@example.com"
                value={formData.email}
                onChange={e => setFormData({ ...formData, email: e.target.value })}
                className="w-full h-13 bg-white border border-slate-300 rounded-lg px-4 text-[15px] text-slate-900 placeholder-slate-400 outline-none transition-all focus:border-[#4BA6B9] focus:ring-[3px] focus:ring-[#4BA6B9]/10 hover:border-slate-400 shadow-sm"
              />
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between items-center">
                <label className="text-[13px] font-semibold text-slate-700">Password</label>
                <Link href="/forgot-password" className="text-[13px] font-medium text-[#4BA6B9] hover:text-[#3D8B9B] transition-colors">
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <input 
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={e => setFormData({ ...formData, password: e.target.value })}
                  className="w-full h-13 bg-white border border-slate-300 rounded-lg pl-4 pr-11 text-[15px] text-slate-900 placeholder-slate-400 outline-none transition-all focus:border-[#4BA6B9] focus:ring-[3px] focus:ring-[#4BA6B9]/10 hover:border-slate-400 shadow-sm"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-[#4BA6B9] transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div className="flex items-center gap-2 pt-1 pb-1">
              <input 
                type="checkbox" 
                id="keep-logged" 
                className="w-4 h-4 rounded-[4px] border-slate-300 text-[#4BA6B9] focus:ring-[#4BA6B9] focus:ring-offset-0 cursor-pointer transition-colors"
              />
              <label htmlFor="keep-logged" className="text-[13px] text-slate-600 font-medium cursor-pointer select-none">
                Keep me logged in
              </label>
            </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full h-13 bg-[#0B1F3A] hover:opacity-90 text-white rounded-lg font-bold text-base transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center shadow-lg shadow-slate-200"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  'Sign in'
                )}
              </button>
          </form>

          <div className="mt-8 pt-6 border-t border-slate-100 text-center">
            <p className="text-[13px] text-slate-500">
              Don't have an account?{' '}
              <Link href="/register" className="font-semibold text-slate-900 hover:text-[#4BA6B9] transition-colors">
                Register now
              </Link>
            </p>
          </div>
        </motion.div>
      </main>

      <Footer />
    </div>
  );
}
