'use client';

import React, { useState } from 'react';
import { useLibrary } from '@/context/LibraryContext';
import { RoleGuard } from '@/components/common/RoleGuard';
import { LayoutWrapper } from '@/components/common/LayoutWrapper';
import {
  Settings,
  Clock,
  Shield,
  CheckCircle2,
  Database,
  Calendar,
  AlertTriangle,
  RotateCcw,
} from 'lucide-react';

export default function AdminSettingsPage() {
  const { simulatedDate, setSimulatedDate, penaltySettings } = useLibrary();
  const [saveNotice, setSaveNotice] = useState<string | null>(null);

  const handleResetData = () => {
    if (confirm('Are you sure you want to reset all prototype LocalStorage data back to factory defaults?')) {
      localStorage.clear();
      window.location.reload();
    }
  };

  return (
    <RoleGuard allowedRoles={['admin']}>
      <LayoutWrapper>
        <div className="space-y-6 animate-in fade-in duration-300">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-2">
              <Settings className="w-7 h-7 text-slate-300" />
              Global Library Governance & Operational Parameters
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Configure university circulation rules, prototype date simulator, and prototype persistence controls.
            </p>
          </div>

          {saveNotice && (
            <div className="p-4 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span>{saveNotice}</span>
              </div>
              <button onClick={() => setSaveNotice(null)} className="text-slate-400 hover:text-white">
                ✕
              </button>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Circulation Policies */}
            <div className="glass-panel p-6 rounded-3xl border-white/[0.08] space-y-4">
              <div className="flex items-center gap-2 pb-3 border-b border-white/[0.08]">
                <Clock className="w-5 h-5 text-indigo-400" />
                <h3 className="font-bold text-sm text-white">Core Circulation Rules</h3>
              </div>

              <div className="space-y-3 text-xs">
                <div className="p-3.5 rounded-2xl bg-white/[0.02] border border-white/[0.05] flex justify-between items-center">
                  <div>
                    <span className="font-bold text-white block">Standard Loan Duration</span>
                    <span className="text-[11px] text-slate-400">Fixed student borrowing term</span>
                  </div>
                  <span className="px-3 py-1 rounded-xl bg-indigo-500/20 text-indigo-300 font-bold border border-indigo-500/30">
                    14 Days
                  </span>
                </div>

                <div className="p-3.5 rounded-2xl bg-white/[0.02] border border-white/[0.05] flex justify-between items-center">
                  <div>
                    <span className="font-bold text-white block">Study Room Slot Duration</span>
                    <span className="text-[11px] text-slate-400">Automatic session expiry</span>
                  </div>
                  <span className="px-3 py-1 rounded-xl bg-purple-500/20 text-purple-300 font-bold border border-purple-500/30">
                    1 Hour (60 Min)
                  </span>
                </div>

                <div className="p-3.5 rounded-2xl bg-white/[0.02] border border-white/[0.05] flex justify-between items-center">
                  <div>
                    <span className="font-bold text-white block">Maximum Books per Student</span>
                    <span className="text-[11px] text-slate-400">Concurrent loan limit</span>
                  </div>
                  <span className="px-3 py-1 rounded-xl bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30">
                    4 Books
                  </span>
                </div>

                <div className="p-3.5 rounded-2xl bg-white/[0.02] border border-white/[0.05] flex justify-between items-center">
                  <div>
                    <span className="font-bold text-white block">Default Daily Penalty Fee</span>
                    <span className="text-[11px] text-slate-400">Global fallback overdue fine</span>
                  </div>
                  <span className="px-3 py-1 rounded-xl bg-amber-500/20 text-amber-300 font-bold border border-amber-500/30">
                    ₹{penaltySettings.defaultDailyRate}/day
                  </span>
                </div>
              </div>
            </div>

            {/* Prototype Storage & Simulation Environment */}
            <div className="glass-panel p-6 rounded-3xl border-white/[0.08] space-y-4">
              <div className="flex items-center gap-2 pb-3 border-b border-white/[0.08]">
                <Database className="w-5 h-5 text-emerald-400" />
                <h3 className="font-bold text-sm text-white">Prototype State & Reset</h3>
              </div>

              <div className="space-y-4 text-xs text-slate-400">
                <p className="leading-relaxed">
                  This application persists all user modifications, room reservations, loans, and penalty configurations directly inside your browser’s <code className="text-white">LocalStorage</code>.
                </p>

                <div className="p-4 rounded-2xl bg-slate-900/60 border border-white/10 space-y-2">
                  <span className="font-bold text-white block">Active Simulated Date:</span>
                  <input
                    type="date"
                    value={simulatedDate}
                    onChange={(e) => {
                      setSimulatedDate(e.target.value);
                      setSaveNotice(`Simulated system date set to ${e.target.value}. Overdue calculations will adapt immediately.`);
                    }}
                    className="w-full px-3 py-2 bg-slate-900 border border-white/10 rounded-xl text-white font-bold"
                  />
                  <p className="text-[10px] text-slate-500">
                    Advance the date forward by 15 days to test the 14-day overdue rule and see penalty calculations trigger automatically.
                  </p>
                </div>

                <div className="pt-2">
                  <button
                    onClick={handleResetData}
                    className="w-full py-3 px-4 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-rose-300 font-bold text-xs flex items-center justify-center gap-2 transition"
                  >
                    <RotateCcw className="w-4 h-4" /> Reset Prototype to Default Demo Data
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </LayoutWrapper>
    </RoleGuard>
  );
}
