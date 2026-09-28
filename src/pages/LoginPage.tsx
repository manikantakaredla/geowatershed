import React, { useState } from 'react';
import { Waves, Lock, User, ArrowRight, ShieldCheck, Layers } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { UserRole } from '../types';

export const LoginPage: React.FC = () => {
  const { switchUserRole, navigate } = useApp();
  const [email, setEmail] = useState('priya.sharma@waterscope.gov.in');
  const [password, setPassword] = useState('••••••••••••');
  const [loading, setLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      navigate('/dashboard');
    }, 300);
  };

  const handleQuickRole = (role: UserRole) => {
    switchUserRole(role);
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center items-center p-4">
      {/* Login Card */}
      <div className="w-full max-w-md bg-white border border-slate-200 rounded-xl shadow-sm p-6 sm:p-8 z-10">
        {/* Brand Header */}
        <div className="text-center mb-6">
          <div className="inline-flex p-2.5 rounded-xl bg-blue-600 text-white shadow-xs mb-3">
            <Waves className="w-7 h-7" />
          </div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900">WATERSCOPE</h1>
          <p className="text-xs font-semibold text-blue-700 tracking-wide uppercase mt-0.5">
            Watershed Intelligence & Evidence Platform
          </p>
          <p className="text-xs text-slate-500 mt-1">
            Department of Land Resources & Remote Sensing Directorate
          </p>
        </div>

        {/* Demo Mode Notice */}
        <div className="mb-5 p-2.5 rounded-lg bg-blue-50 border border-blue-200 text-center">
          <div className="text-xs font-semibold text-blue-900">Prototype Evaluation Environment</div>
          <div className="text-[11px] text-blue-700 mt-0.5">
            Select a role below or enter credentials to explore the GIS workspace
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Official Email / User ID
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full bg-white text-slate-900 text-xs rounded-lg pl-9 pr-3 py-2.5 border border-slate-300 focus:border-blue-600 focus:ring-1 focus:ring-blue-600 focus:outline-none placeholder:text-slate-400"
                placeholder="officer.id@waterscope.gov.in"
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider">
                Password
              </label>
              <a href="#forgot" onClick={(e) => e.preventDefault()} className="text-xs text-blue-600 hover:text-blue-800 font-medium">
                Forgot password?
              </a>
            </div>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full bg-white text-slate-900 text-xs rounded-lg pl-9 pr-3 py-2.5 border border-slate-300 focus:border-blue-600 focus:ring-1 focus:ring-blue-600 focus:outline-none"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 px-4 bg-slate-900 hover:bg-slate-800 text-white font-semibold rounded-lg text-xs shadow-xs transition-colors flex items-center justify-center gap-2 cursor-pointer mt-2"
          >
            {loading ? 'Authenticating...' : 'Sign In to Workspace'}
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* 1-Click Fast Role Sign-in */}
        <div className="mt-6 pt-5 border-t border-slate-200">
          <p className="text-[11px] uppercase font-bold tracking-wider text-slate-600 text-center mb-2.5">
            Quick 1-Click Role Access (Evaluation Demo)
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
            {(['Officer', 'Field Officer', 'Admin', 'Researcher', 'Viewer'] as UserRole[]).map((r) => (
              <button
                key={r}
                type="button"
                onClick={() => handleQuickRole(r)}
                className="p-2.5 rounded-lg bg-slate-50 hover:bg-blue-50 border border-slate-200 hover:border-blue-400 text-slate-800 text-left transition-all cursor-pointer"
              >
                <div className="font-semibold text-xs text-slate-900">{r}</div>
                <div className="text-[11px] text-blue-700 font-medium mt-0.5">Switch role →</div>
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-6 text-center text-xs text-slate-500 font-medium">
        State Watershed Mission &bull; Geo-Spatial Evidence Verification Infrastructure
      </div>
    </div>
  );
};
