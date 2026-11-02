'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useLibrary } from '@/context/LibraryContext';
import {
  BookOpen,
  Lock,
  User,
  Eye,
  EyeOff,
  ArrowRight,
  ShieldCheck,
  GraduationCap,
  Briefcase,
  Sparkles,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const { login } = useLibrary();

  const [userId, setUserId] = useState('User1');
  const [password, setPassword] = useState('User@1234');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    setTimeout(() => {
      const res = login(userId, password);
      setIsLoading(false);

      if (res.success && res.role) {
        router.push(`/${res.role}`);
      } else {
        setError(res.error || 'Authentication failed. Please verify credentials.');
      }
    }, 400);
  };

  const setDemoCredentials = (role: 'student' | 'staff' | 'admin') => {
    setError(null);
    if (role === 'student') {
      setUserId('User1');
      setPassword('User@1234');
    } else if (role === 'staff') {
      setUserId('Staff1');
      setPassword('Staff@1234');
    } else if (role === 'admin') {
      setUserId('Admin1');
      setPassword('Admin@1234');
    }
  };

  return (
    <div className="min-h-screen bg-[#070A13] flex flex-col justify-center relative overflow-hidden py-12 px-4 sm:px-6 lg:px-8">
      {/* Background ambient lighting effects */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-600/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-600/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-600/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        {/* Branding header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-500 shadow-neon-purple/50 shadow-lg mb-4 ring-1 ring-white/20">
            <BookOpen className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-3xl font-extrabold text-white tracking-tight sm:text-4xl">
            LPU Central Library
          </h2>
          <p className="mt-2 text-sm text-slate-400">
            Smart University Library Management & Research Gateway
          </p>
        </div>

        {/* Login Card */}
        <div className="glass-panel p-8 rounded-3xl border-white/[0.08] shadow-2xl backdrop-blur-2xl">
          {error && (
            <div className="mb-6 p-3.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-300 text-xs flex items-center gap-2.5 animate-in fade-in">
              <AlertCircle className="w-4 h-4 flex-shrink-0 text-red-400" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* User ID Field */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                User ID / Registration No.
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <User className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  required
                  value={userId}
                  onChange={(e) => setUserId(e.target.value)}
                  placeholder="e.g. User1, Staff1, Admin1"
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-900/70 border border-white/10 rounded-xl text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your security password"
                  className="w-full pl-10 pr-11 py-2.5 bg-slate-900/70 border border-white/10 rounded-xl text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-200 transition"
                  title={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-500 hover:via-purple-500 hover:to-pink-500 text-white font-semibold text-sm shadow-neon-purple flex items-center justify-center gap-2 transition duration-200 disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Authenticating...</span>
                </>
              ) : (
                <>
                  <span>Sign In to Portal</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Quick Demo Credentials Autofill */}
          <div className="mt-8 pt-6 border-t border-white/[0.08]">
            <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider text-center mb-3">
              One-Click Predefined Credentials
            </p>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setDemoCredentials('student')}
                className={`p-2.5 rounded-xl border text-left transition flex flex-col items-center text-center ${
                  userId === 'User1'
                    ? 'border-emerald-500/50 bg-emerald-500/10 text-emerald-300'
                    : 'border-white/[0.06] bg-white/[0.02] hover:bg-white/[0.06] text-slate-300'
                }`}
              >
                <GraduationCap className="w-4 h-4 text-emerald-400 mb-1" />
                <span className="text-xs font-bold leading-tight">Student</span>
                <span className="text-[9px] text-slate-400 mt-0.5">User1</span>
              </button>

              <button
                type="button"
                onClick={() => setDemoCredentials('staff')}
                className={`p-2.5 rounded-xl border text-left transition flex flex-col items-center text-center ${
                  userId === 'Staff1'
                    ? 'border-blue-500/50 bg-blue-500/10 text-blue-300'
                    : 'border-white/[0.06] bg-white/[0.02] hover:bg-white/[0.06] text-slate-300'
                }`}
              >
                <Briefcase className="w-4 h-4 text-blue-400 mb-1" />
                <span className="text-xs font-bold leading-tight">Staff</span>
                <span className="text-[9px] text-slate-400 mt-0.5">Staff1</span>
              </button>

              <button
                type="button"
                onClick={() => setDemoCredentials('admin')}
                className={`p-2.5 rounded-xl border text-left transition flex flex-col items-center text-center ${
                  userId === 'Admin1'
                    ? 'border-purple-500/50 bg-purple-500/10 text-purple-300'
                    : 'border-white/[0.06] bg-white/[0.02] hover:bg-white/[0.06] text-slate-300'
                }`}
              >
                <ShieldCheck className="w-4 h-4 text-purple-400 mb-1" />
                <span className="text-xs font-bold leading-tight">Admin</span>
                <span className="text-[9px] text-slate-400 mt-0.5">Admin1</span>
              </button>
            </div>

            <div className="mt-4 p-3 rounded-xl bg-slate-900/60 border border-white/5 text-[11px] text-slate-400 space-y-1">
              <div className="flex justify-between">
                <span>Student:</span>
                <code className="text-emerald-300">User1 / User@1234</code>
              </div>
              <div className="flex justify-between">
                <span>Staff:</span>
                <code className="text-blue-300">Staff1 / Staff@1234</code>
              </div>
              <div className="flex justify-between">
                <span>Admin:</span>
                <code className="text-purple-300">Admin1 / Admin@1234</code>
              </div>
            </div>
          </div>
        </div>

        {/* Footnote */}
        <p className="mt-6 text-center text-xs text-slate-500">
          LPU University Central Library System &copy; 2026. Secure Role-Based Authentication.
        </p>
      </div>
    </div>
  );
}
