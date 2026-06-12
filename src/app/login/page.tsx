'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Lock, Server, ArrowRight, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { getApiUrl } from '@/lib/api';

export default function LoginPage() {
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch(`${getApiUrl()}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ password }),
      });

      if (!res.ok) {
        throw new Error('Invalid password');
      }

      const data = await res.json();
      localStorage.setItem('portal_auth_token', data.token);

      toast.success('Access granted');
      router.push('/');
      router.refresh();
    } catch (err) {
      toast.error('Access denied. Please check your password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-[#0a0f1c] bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900 via-[#0a0f1c] to-[#0a0f1c]">
      <div className="relative z-10 w-full max-w-md p-8 animate-in fade-in slide-in-from-bottom-8 duration-1000">
        <div className="backdrop-blur-2xl bg-slate-900/60 border border-white/10 rounded-3xl p-8 shadow-2xl">
          <div className="flex flex-col items-center mb-8">
            <div className="w-16 h-16 bg-emerald-500/10 rounded-2xl border border-emerald-500/20 flex items-center justify-center mb-6 shadow-[inset_0_0_20px_rgba(16,185,129,0.1)]">
              <Server className="w-8 h-8 text-emerald-400 drop-shadow-[0_0_8px_rgba(52,211,153,0.5)]" />
            </div>
            <h1 className="text-3xl font-bold text-white tracking-tight text-center mb-2">Portal<span className="font-light text-slate-400">OS</span></h1>
            <p className="text-slate-400 text-center text-sm">Secure instance management.</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-500 group-focus-within:text-emerald-400 transition-colors">
                  <Lock className="h-5 w-5" />
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter administrator password"
                  className="w-full bg-slate-950/50 border border-white/5 focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 rounded-xl py-3 pl-11 pr-4 text-slate-200 placeholder:text-slate-600 transition-all outline-none shadow-inner"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full relative group overflow-hidden bg-emerald-500 text-slate-950 font-semibold py-3 px-4 rounded-xl flex items-center justify-center gap-2 hover:bg-emerald-400 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out" />
              <span className="relative flex items-center gap-2">
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Authenticating...
                  </>
                ) : (
                  <>
                    Initialize Session
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
