'use client';

import React, { useState } from 'react';
import { useLibrary } from '@/context/LibraryContext';
import { RoleGuard } from '@/components/common/RoleGuard';
import { LayoutWrapper } from '@/components/common/LayoutWrapper';
import {
  AlertOctagon,
  Bell,
  CheckCircle2,
  DollarSign,
  Search,
  Send,
  AlertTriangle,
  Receipt,
} from 'lucide-react';

export default function OverdueManagementPage() {
  const { borrowings, payPenalty, addNotification, simulatedDate } = useLibrary();
  const [searchQuery, setSearchQuery] = useState('');
  const [actionNotice, setActionNotice] = useState<string | null>(null);

  const overdueRecords = borrowings.filter((b) => b.status === 'overdue' || (b.totalPenalty > 0 && !b.penaltyPaid));

  const filtered = overdueRecords.filter(
    (b) =>
      !searchQuery ||
      b.bookTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.userId.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCollectPenalty = (recordId: string, studentName: string, amount: number) => {
    payPenalty(recordId);
    setActionNotice(`Received ₹${amount} cash fine from ${studentName}. Ledger status updated to Paid.`);
  };

  const handleSendReminder = (rec: typeof overdueRecords[0]) => {
    addNotification({
      title: `URGENT OVERDUE REMINDER: ${rec.bookTitle}`,
      message: `Your book loan was due on ${rec.dueDate}. Overdue delay: ${rec.delayedDays} days. Outstanding fine: ₹${rec.totalPenalty}. Please return at circulation desk immediately.`,
      type: 'overdue',
      targetRole: 'student',
      targetUserId: rec.userId,
      link: '/student/my-penalties',
    });
    setActionNotice(`Overdue reminder dispatched to student ${rec.userName} (${rec.userId}).`);
  };

  return (
    <RoleGuard allowedRoles={['staff', 'admin']}>
      <LayoutWrapper>
        <div className="space-y-6 animate-in fade-in duration-300">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-2">
                <AlertOctagon className="w-7 h-7 text-rose-400" />
                Overdue Management & Cash Collection
              </h1>
              <p className="text-xs sm:text-sm text-slate-400 mt-1">
                Monitor overdue circulation items, record physical counter payments, and dispatch digital notifications.
              </p>
            </div>
          </div>

          {actionNotice && (
            <div className="p-4 rounded-2xl bg-indigo-500/15 border border-indigo-500/30 text-indigo-300 text-xs flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-indigo-400 flex-shrink-0" />
                <span>{actionNotice}</span>
              </div>
              <button onClick={() => setActionNotice(null)} className="text-slate-400 hover:text-white">
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
              placeholder="Search overdue records by Student, ID, or Book..."
              className="w-full bg-transparent text-white text-xs sm:text-sm placeholder-slate-400 focus:outline-none"
            />
          </div>

          {/* Overdue Table */}
          <div className="glass-panel rounded-3xl border-white/[0.08] overflow-hidden">
            <div className="p-5 border-b border-white/[0.08] flex items-center justify-between">
              <h3 className="font-bold text-sm text-white">Current Overdue Items ({filtered.length})</h3>
              <span className="text-xs text-rose-400 font-bold">Counter Cash Desk Operation</span>
            </div>

            {filtered.length === 0 ? (
              <div className="py-12 text-center text-slate-400 text-xs">
                No outstanding overdue records found.
              </div>
            ) : (
              <div className="divide-y divide-white/[0.05]">
                {filtered.map((rec) => (
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
                          <span>Due: <strong className="text-rose-400">{rec.dueDate}</strong></span>
                          <span>&bull;</span>
                          <span>Delay: <strong className="text-rose-300">{rec.delayedDays} days</strong></span>
                          <span>&bull;</span>
                          <span>Rate: ₹{rec.applicableDailyRate}/day</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 pt-3 md:pt-0 border-t md:border-t-0 border-white/[0.06]">
                      <div className="text-right">
                        <span className="text-sm font-black text-rose-400 block">
                          ₹{rec.totalPenalty}
                        </span>
                        <span className="text-[10px] text-slate-400">
                          {rec.penaltyPaid ? 'Paid' : 'Unpaid'}
                        </span>
                      </div>

                      <button
                        onClick={() => handleSendReminder(rec)}
                        title="Send overdue reminder notification"
                        className="p-2.5 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] text-amber-300 transition"
                      >
                        <Bell className="w-4 h-4" />
                      </button>

                      {!rec.penaltyPaid ? (
                        <button
                          onClick={() => handleCollectPenalty(rec.id, rec.userName, rec.totalPenalty)}
                          className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs shadow-md transition"
                        >
                          Record Paid
                        </button>
                      ) : (
                        <span className="px-3 py-1.5 rounded-xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-semibold">
                          Paid & Cleared
                        </span>
                      )}
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
