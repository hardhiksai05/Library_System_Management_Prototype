'use client';

import React, { useState } from 'react';
import { useLibrary } from '@/context/LibraryContext';
import { RoleGuard } from '@/components/common/RoleGuard';
import { LayoutWrapper } from '@/components/common/LayoutWrapper';
import {
  ArrowDownLeft,
  BookOpen,
  Calendar,
  Clock,
  AlertTriangle,
  CheckCircle2,
  AlertCircle,
  Receipt,
  Search,
} from 'lucide-react';

export default function ReturnBookPage() {
  const { borrowings, returnBook, payPenalty, simulatedDate } = useLibrary();

  const [searchQuery, setSearchQuery] = useState('');
  const [returnResult, setReturnResult] = useState<{ message: string; penalty: number } | null>(null);

  // Active or overdue borrowings eligible for return
  const activeBorrowings = borrowings.filter((b) => b.status === 'issued' || b.status === 'overdue');

  const filtered = activeBorrowings.filter(
    (b) =>
      !searchQuery ||
      b.bookTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.userId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.bookIsbn.includes(searchQuery)
  );

  const handleReturn = (recordId: string) => {
    const res = returnBook(recordId);
    setReturnResult({ message: res.message, penalty: res.penalty });
  };

  return (
    <RoleGuard allowedRoles={['staff', 'admin']}>
      <LayoutWrapper>
        <div className="space-y-6 animate-in fade-in duration-300">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-2">
              <ArrowDownLeft className="w-7 h-7 text-emerald-400" />
              Accept Book Returns & Penalty Ledger
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Check in books, evaluate late days against due date, assess fines, and restock physical inventory.
            </p>
          </div>

          {returnResult && (
            <div className="p-4 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span>{returnResult.message}</span>
              </div>
              <button onClick={() => setReturnResult(null)} className="text-slate-400 hover:text-white">
                ✕
              </button>
            </div>
          )}

          {/* Search bar */}
          <div className="glass-panel p-4 rounded-2xl border-white/[0.08] flex items-center gap-3">
            <Search className="w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search active loans by Student Name, ID, or Book Title..."
              className="w-full bg-transparent text-white text-xs sm:text-sm placeholder-slate-400 focus:outline-none"
            />
          </div>

          {/* Active Loans Table */}
          <div className="glass-panel rounded-3xl border-white/[0.08] overflow-hidden">
            <div className="p-5 border-b border-white/[0.08] flex items-center justify-between">
              <h3 className="font-bold text-sm text-white">Active Issued Books in Circulation</h3>
              <span className="text-xs text-slate-400">Current Date: <strong className="text-white">{simulatedDate}</strong></span>
            </div>

            {filtered.length === 0 ? (
              <div className="py-12 text-center text-slate-400 text-xs">
                No active loans match the search query.
              </div>
            ) : (
              <div className="divide-y divide-white/[0.05]">
                {filtered.map((rec) => {
                  const isOverdue = rec.status === 'overdue';
                  return (
                    <div
                      key={rec.id}
                      className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-white/[0.02] transition"
                    >
                      <div className="flex items-start gap-4">
                        <img
                          src={rec.bookCoverImage}
                          alt={rec.bookTitle}
                          className="w-12 h-16 object-cover rounded-xl shadow-md flex-shrink-0"
                        />
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-xs font-bold text-white">{rec.userName}</span>
                            <span className="text-[10px] font-mono text-indigo-300 px-1.5 py-0.5 rounded bg-indigo-500/20">
                              {rec.userId}
                            </span>
                          </div>
                          <h4 className="font-bold text-sm text-slate-200">{rec.bookTitle}</h4>
                          <div className="flex flex-wrap items-center gap-3 mt-1 text-[11px] text-slate-400">
                            <span>Issue: {rec.issueDate}</span>
                            <span>&bull;</span>
                            <span className={isOverdue ? 'text-rose-400 font-bold' : 'text-amber-300'}>
                              Due: {rec.dueDate}
                            </span>
                            <span>&bull;</span>
                            <span>Rate: ₹{rec.applicableDailyRate}/day</span>
                          </div>
                        </div>
                      </div>

                      {/* Return Action */}
                      <div className="flex items-center gap-3">
                        {isOverdue && (
                          <div className="text-right">
                            <span className="text-rose-400 font-bold text-xs block">
                              Penalty: ₹{rec.totalPenalty}
                            </span>
                            <span className="text-[10px] text-slate-400">
                              ({rec.delayedDays} days delayed)
                            </span>
                          </div>
                        )}

                        <button
                          onClick={() => handleReturn(rec.id)}
                          className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs shadow-md transition"
                        >
                          Process Return
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </LayoutWrapper>
    </RoleGuard>
  );
}
