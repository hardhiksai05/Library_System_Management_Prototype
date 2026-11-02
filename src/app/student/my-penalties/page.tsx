'use client';

import React from 'react';
import Link from 'next/link';
import { useLibrary } from '@/context/LibraryContext';
import { RoleGuard } from '@/components/common/RoleGuard';
import { LayoutWrapper } from '@/components/common/LayoutWrapper';
import {
  AlertOctagon,
  AlertTriangle,
  Info,
  CheckCircle2,
  Calendar,
  Clock,
  BookOpen,
  DollarSign,
  ShieldCheck,
} from 'lucide-react';

export default function MyPenaltiesPage() {
  const { currentUser, borrowings, simulatedDate } = useLibrary();

  // Filter records with penalties
  const userBorrowings = borrowings.filter((b) => b.userId === currentUser?.id);
  const penaltyRecords = userBorrowings.filter((b) => b.totalPenalty > 0 || b.status === 'overdue');

  const totalOutstanding = penaltyRecords
    .filter((b) => !b.penaltyPaid)
    .reduce((sum, b) => sum + b.totalPenalty, 0);

  const totalCleared = penaltyRecords
    .filter((b) => b.penaltyPaid)
    .reduce((sum, b) => sum + b.totalPenalty, 0);

  return (
    <RoleGuard allowedRoles={['student', 'staff', 'admin']}>
      <LayoutWrapper>
        <div className="space-y-6 animate-in fade-in duration-300">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-2">
                <AlertOctagon className="w-7 h-7 text-rose-400" />
                Overdue Penalties & Account Dues
              </h1>
              <p className="text-xs sm:text-sm text-slate-400 mt-1">
                Transparent calculation based on individual book rates, category brackets, and delayed return days.
              </p>
            </div>

            <div className="px-3 py-1.5 rounded-xl glass-panel text-xs text-rose-300 border-rose-500/30 font-bold">
              Outstanding Dues: ₹{totalOutstanding}
            </div>
          </div>

          {/* Important Gateway Clarification Notice */}
          <div className="p-4 rounded-2xl bg-amber-950/30 border border-amber-500/30 text-xs text-amber-200 flex items-start gap-3">
            <Info className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-white text-xs">University Circulation Counter Payment Policy</p>
              <p className="text-[11px] text-slate-300 mt-0.5 leading-relaxed">
                As per University Library Regulations, online payments are disabled. All calculated overdue fines must be tendered at the ground-floor library circulation cash desk. Staff will verify physical return of the book and mark the penalty paid in your ledger.
              </p>
            </div>
          </div>

          {/* Metric Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="glass-panel p-5 rounded-2xl border-white/[0.08]">
              <span className="text-xs text-slate-400 font-medium">Pending Overdue Penalties</span>
              <p className="text-3xl font-black text-rose-400 mt-1">₹{totalOutstanding}</p>
              <p className="text-[11px] text-rose-300/80 mt-1">Must be cleared to renew loans</p>
            </div>
            <div className="glass-panel p-5 rounded-2xl border-white/[0.08]">
              <span className="text-xs text-slate-400 font-medium">Cleared / Paid Penalties</span>
              <p className="text-3xl font-black text-emerald-400 mt-1">₹{totalCleared}</p>
              <p className="text-[11px] text-slate-400 mt-1">Receipted by circulation staff</p>
            </div>
            <div className="glass-panel p-5 rounded-2xl border-white/[0.08]">
              <span className="text-xs text-slate-400 font-medium">Calculation Model</span>
              <p className="text-lg font-bold text-white mt-1">Days &times; Applicable Rate</p>
              <p className="text-[11px] text-indigo-300 mt-1">Book rate &gt; Category &gt; Default</p>
            </div>
          </div>

          {/* Penalty Breakdown List */}
          <div className="glass-panel p-6 sm:p-8 rounded-3xl border-white/[0.08]">
            <h2 className="text-base font-bold text-white mb-4">Detailed Penalty Ledger</h2>

            {penaltyRecords.length === 0 ? (
              <div className="py-12 text-center text-slate-400 text-xs">
                <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto mb-2" />
                Your account is completely clear! No overdue records or pending penalties.
              </div>
            ) : (
              <div className="space-y-4">
                {penaltyRecords.map((rec) => (
                  <div
                    key={rec.id}
                    className="p-5 rounded-2xl bg-white/[0.02] border border-white/[0.06] flex flex-col md:flex-row md:items-center justify-between gap-4"
                  >
                    <div className="flex items-start gap-4">
                      <img
                        src={rec.bookCoverImage}
                        alt={rec.bookTitle}
                        className="w-12 h-16 object-cover rounded-xl shadow-md flex-shrink-0"
                      />
                      <div>
                        <h3 className="font-bold text-sm text-white">{rec.bookTitle}</h3>
                        <p className="text-xs text-slate-400 mt-0.5">ISBN: {rec.bookIsbn} &bull; ID: {rec.bookId}</p>

                        <div className="flex flex-wrap items-center gap-3 mt-2 text-xs text-slate-300">
                          <span>Due: <strong className="text-rose-400">{rec.dueDate}</strong></span>
                          <span>&bull;</span>
                          <span>Delayed: <strong className="text-rose-300">{rec.delayedDays} Days</strong></span>
                          <span>&bull;</span>
                          <span>Daily Rate: <strong className="text-amber-300">₹{rec.applicableDailyRate}/day</strong></span>
                        </div>
                      </div>
                    </div>

                    {/* Breakdown Math Box */}
                    <div className="flex items-center justify-between md:justify-end gap-6 pt-3 md:pt-0 border-t md:border-t-0 border-white/[0.06]">
                      <div className="p-3 rounded-xl bg-slate-900/80 border border-white/10 text-right">
                        <span className="text-[10px] text-slate-400 block">Calculation:</span>
                        <code className="text-xs text-indigo-300">
                          {rec.delayedDays} days &times; ₹{rec.applicableDailyRate}
                        </code>
                        <div className="text-base font-black text-rose-400 mt-0.5">
                          = ₹{rec.totalPenalty}
                        </div>
                      </div>

                      <div>
                        {rec.penaltyPaid ? (
                          <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-bold">
                            Paid & Cleared
                          </span>
                        ) : (
                          <span className="px-3 py-1 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30 text-xs font-bold">
                            Payment Pending
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </LayoutWrapper>
    </RoleGuard>
  );
}
