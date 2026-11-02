'use client';

import React, { useState } from 'react';
import { useLibrary } from '@/context/LibraryContext';
import { RoleGuard } from '@/components/common/RoleGuard';
import { LayoutWrapper } from '@/components/common/LayoutWrapper';
import {
  AlertOctagon,
  CheckCircle2,
  Settings,
  Shield,
  Layers,
  BookOpen,
  DollarSign,
  TrendingUp,
  Info,
  Search,
} from 'lucide-react';

export default function AdminPenaltyConfigPage() {
  const {
    penaltySettings,
    updateDefaultPenaltyRate,
    updateCategoryPenaltyRate,
    books,
    updateBookPenaltyRate,
    calculatePenaltyRateForBook,
    borrowings,
  } = useLibrary();

  const [defaultRateInput, setDefaultRateInput] = useState<number>(penaltySettings.defaultDailyRate);
  const [selectedBookId, setSelectedBookId] = useState<string>('');
  const [bookRateOverrideInput, setBookRateOverrideInput] = useState<string>('');
  const [saveNotice, setSaveNotice] = useState<string | null>(null);
  const [searchBookQuery, setSearchBookQuery] = useState('');

  const handleUpdateDefaultRate = (e: React.FormEvent) => {
    e.preventDefault();
    updateDefaultPenaltyRate(Number(defaultRateInput));
    setSaveNotice(`Default library penalty rate updated to ₹${defaultRateInput}/day.`);
  };

  const handleCategoryRateChange = (category: string, newRate: number) => {
    updateCategoryPenaltyRate(category, newRate);
    setSaveNotice(`Category penalty rate for "${category}" updated to ₹${newRate}/day.`);
  };

  const handleBookOverrideSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedBookId) return;

    const rate = bookRateOverrideInput === '' ? null : Number(bookRateOverrideInput);
    updateBookPenaltyRate(selectedBookId, rate);

    const b = books.find((x) => x.id === selectedBookId);
    setSaveNotice(
      rate !== null
        ? `Custom penalty rate of ₹${rate}/day saved for book "${b?.title}". This takes priority over category & default rates.`
        : `Removed custom override for "${b?.title}". Reverting to category/default rate.`
    );
    setSelectedBookId('');
    setBookRateOverrideInput('');
  };

  const filteredBooks = books.filter(
    (b) =>
      !searchBookQuery ||
      b.title.toLowerCase().includes(searchBookQuery.toLowerCase()) ||
      b.category.toLowerCase().includes(searchBookQuery.toLowerCase()) ||
      b.isbn.includes(searchBookQuery)
  );

  return (
    <RoleGuard allowedRoles={['admin']}>
      <LayoutWrapper>
        <div className="space-y-6 animate-in fade-in duration-300">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-2">
              <AlertOctagon className="w-7 h-7 text-rose-400" />
              Penalty Policy & Multi-Tier Rate Configuration
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Admin controls for 3-tier penalty evaluation: Individual Book Override &gt; Category Rate &gt; Default Rate.
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

          {/* Priority Rule Visual Guide */}
          <div className="p-5 rounded-3xl bg-indigo-950/40 border border-indigo-500/30 text-xs text-indigo-200">
            <h3 className="font-bold text-white text-sm mb-2 flex items-center gap-2">
              <Shield className="w-4 h-4 text-indigo-400" />
              Strict Penalty Priority Engine
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2">
              <div className="p-3 rounded-2xl bg-purple-950/40 border border-purple-500/30">
                <span className="text-[10px] uppercase font-bold text-purple-300 tracking-wider">Priority 1 (Highest)</span>
                <p className="font-bold text-white mt-1">Individual Book Override</p>
                <p className="text-[11px] text-slate-300 mt-0.5">
                  If configured on a specific book title, this exact rate always takes precedence.
                </p>
              </div>
              <div className="p-3 rounded-2xl bg-blue-950/40 border border-blue-500/30">
                <span className="text-[10px] uppercase font-bold text-blue-300 tracking-wider">Priority 2</span>
                <p className="font-bold text-white mt-1">Category Penalty Rate</p>
                <p className="text-[11px] text-slate-300 mt-0.5">
                  Applied if the book has no individual override (e.g. AI = ₹10/d, CompSci = ₹8/d).
                </p>
              </div>
              <div className="p-3 rounded-2xl bg-slate-900/60 border border-white/10">
                <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Priority 3 (Fallback)</span>
                <p className="font-bold text-white mt-1">Default Library Rate</p>
                <p className="text-[11px] text-slate-300 mt-0.5">
                  Applied if neither individual override nor category rate exists (Current: ₹{penaltySettings.defaultDailyRate}/d).
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left: Global Default & Category Rates */}
            <div className="space-y-6">
              {/* 1. Default Daily Rate Box */}
              <div className="glass-panel p-6 rounded-3xl border-white/[0.08]">
                <h3 className="text-sm font-bold text-white mb-2 flex items-center gap-2">
                  <Settings className="w-4 h-4 text-indigo-400" />
                  1. Library Default Daily Penalty Rate
                </h3>
                <p className="text-xs text-slate-400 mb-4">
                  Standard baseline rate applied when no individual or category rule matches.
                </p>

                <form onSubmit={handleUpdateDefaultRate} className="flex items-center gap-3">
                  <div className="relative flex-1">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-sm">
                      ₹
                    </span>
                    <input
                      type="number"
                      min="1"
                      max="100"
                      value={defaultRateInput}
                      onChange={(e) => setDefaultRateInput(Number(e.target.value))}
                      className="w-full pl-8 pr-4 py-2.5 bg-slate-900/80 border border-white/10 rounded-2xl text-white font-bold text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                  <button
                    type="submit"
                    className="px-5 py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-md transition"
                  >
                    Save Default
                  </button>
                </form>
              </div>

              {/* 2. Category Rates Configuration */}
              <div className="glass-panel p-6 rounded-3xl border-white/[0.08]">
                <h3 className="text-sm font-bold text-white mb-2 flex items-center gap-2">
                  <Layers className="w-4 h-4 text-purple-400" />
                  2. Category-Specific Penalty Rates
                </h3>
                <p className="text-xs text-slate-400 mb-4">
                  Configure penalty rates for entire subject fields.
                </p>

                <div className="space-y-3">
                  {Object.entries(penaltySettings.categoryRates).map(([cat, rate]) => (
                    <div
                      key={cat}
                      className="p-3.5 rounded-2xl bg-white/[0.02] border border-white/[0.06] flex items-center justify-between"
                    >
                      <span className="text-xs font-semibold text-slate-200">{cat}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-slate-400 text-xs">₹</span>
                        <input
                          type="number"
                          min="1"
                          max="100"
                          defaultValue={rate}
                          onBlur={(e) => handleCategoryRateChange(cat, Number(e.target.value))}
                          className="w-20 px-3 py-1.5 bg-slate-900/90 border border-white/10 rounded-xl text-white font-bold text-xs text-center focus:outline-none focus:ring-2 focus:ring-purple-500"
                        />
                        <span className="text-xs text-slate-400">/day</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right: Individual Book Override Manager */}
            <div className="glass-panel p-6 rounded-3xl border-white/[0.08]">
              <h3 className="text-sm font-bold text-white mb-2 flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-amber-400" />
                3. Individual Book-Specific Penalty Override
              </h3>
              <p className="text-xs text-slate-400 mb-4">
                Assign a custom penalty rate to ANY specific title (e.g. high-demand reference volumes).
              </p>

              {/* Search book */}
              <div className="relative mb-3">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchBookQuery}
                  onChange={(e) => setSearchBookQuery(e.target.value)}
                  placeholder="Filter books to change individual rate..."
                  className="w-full pl-9 pr-3 py-2 bg-slate-900/80 border border-white/10 rounded-xl text-white text-xs placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              {/* Form */}
              <form onSubmit={handleBookOverrideSave} className="space-y-4 mb-4 p-4 rounded-2xl bg-slate-900/60 border border-white/10">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                    Select Target Book
                  </label>
                  <select
                    value={selectedBookId}
                    onChange={(e) => {
                      setSelectedBookId(e.target.value);
                      const b = books.find((x) => x.id === e.target.value);
                      setBookRateOverrideInput(b?.customPenaltyRate !== undefined && b?.customPenaltyRate !== null ? String(b.customPenaltyRate) : '');
                    }}
                    className="w-full px-3 py-2 bg-slate-900 border border-white/10 rounded-xl text-white text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="">-- Choose a book title --</option>
                    {filteredBooks.map((b) => (
                      <option key={b.id} value={b.id}>
                        {b.title} ({b.id}) - Current: ₹{calculatePenaltyRateForBook(b)}/day
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                    Individual Daily Rate (Leave blank to remove override)
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-xs">
                      ₹
                    </span>
                    <input
                      type="number"
                      min="1"
                      max="100"
                      value={bookRateOverrideInput}
                      onChange={(e) => setBookRateOverrideInput(e.target.value)}
                      placeholder="e.g. 15 (₹/day)"
                      className="w-full pl-7 pr-3 py-2 bg-slate-900 border border-white/10 rounded-xl text-white text-xs font-bold focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={!selectedBookId}
                  className="w-full py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs shadow-md transition disabled:opacity-40"
                >
                  Save Book Penalty Rate
                </button>
              </form>

              {/* List of currently active book overrides */}
              <div>
                <h4 className="text-xs font-bold text-white mb-2">Active Custom Book Overrides</h4>
                <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                  {books
                    .filter((b) => b.customPenaltyRate !== null && b.customPenaltyRate !== undefined)
                    .map((b) => (
                      <div
                        key={b.id}
                        className="p-2.5 rounded-xl bg-purple-950/20 border border-purple-500/20 flex items-center justify-between text-xs"
                      >
                        <div className="truncate mr-2">
                          <p className="font-semibold text-white truncate">{b.title}</p>
                          <p className="text-[10px] text-slate-400">{b.category} &bull; {b.id}</p>
                        </div>
                        <span className="px-2.5 py-1 rounded-lg bg-amber-500/20 text-amber-300 border border-amber-500/30 font-bold text-xs whitespace-nowrap">
                          ₹{b.customPenaltyRate}/day
                        </span>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </LayoutWrapper>
    </RoleGuard>
  );
}
