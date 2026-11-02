'use client';

import React from 'react';
import Link from 'next/link';
import { useLibrary } from '@/context/LibraryContext';
import { RoleGuard } from '@/components/common/RoleGuard';
import { LayoutWrapper } from '@/components/common/LayoutWrapper';
import {
  Library,
  Clock,
  AlertTriangle,
  Calendar,
  CheckCircle2,
  BookOpen,
  ArrowRight,
  ShieldAlert,
  Info,
} from 'lucide-react';

export default function MyBooksPage() {
  const { currentUser, borrowings, simulatedDate } = useLibrary();

  // Active or overdue loans for this user
  const userBorrowings = borrowings.filter((b) => b.userId === currentUser?.id);
  const activeLoans = userBorrowings.filter((b) => b.status === 'issued' || b.status === 'overdue');

  return (
    <RoleGuard allowedRoles={['student', 'staff', 'admin']}>
      <LayoutWrapper>
        <div className="space-y-6 animate-in fade-in duration-300">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-2">
                <Library className="w-7 h-7 text-orange-400" />
                My Active Borrowed Books
              </h1>
              <p className="text-xs sm:text-sm text-slate-400 mt-1">
                Standard loan term: 14 days (2 weeks). Overdue charges apply automatically after due date.
              </p>
            </div>

            <Link
              href="/student/borrowing-history"
              className="px-4 py-2 rounded-xl glass-panel text-xs text-indigo-300 hover:text-white border-white/10 flex items-center gap-1.5 transition"
            >
              Past Return History <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* 14-Day Borrowing Rule Alert */}
          <div className="p-4 rounded-2xl bg-indigo-950/30 border border-indigo-500/20 text-xs text-indigo-200 flex items-start gap-3">
            <Info className="w-5 h-5 text-indigo-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-white text-xs">Automated 14-Day Circulation Rule Active</p>
              <p className="text-[11px] text-slate-300 mt-0.5 leading-relaxed">
                Every book issued at the university circulation counter has a hard due date exactly 14 calendar days from the issue date. Late returns incur daily penalties calculated using the applicable book or category penalty rate.
              </p>
            </div>
          </div>

          {/* Active Loans List */}
          {activeLoans.length === 0 ? (
            <div className="py-16 text-center glass-panel rounded-3xl border-white/[0.08]">
              <BookOpen className="w-12 h-12 text-slate-600 mx-auto mb-3" />
              <h3 className="text-base font-bold text-white">No Active Books on Loan</h3>
              <p className="text-xs text-slate-400 mt-1">
                You currently do not have any borrowed books in your account.
              </p>
              <Link
                href="/student/books"
                className="mt-4 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs shadow-neon-purple transition"
              >
                Browse University Catalog <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {activeLoans.map((rec) => {
                const isOverdue = rec.status === 'overdue';
                return (
                  <div
                    key={rec.id}
                    className={`glass-panel p-5 sm:p-6 rounded-3xl border transition flex flex-col md:flex-row md:items-center justify-between gap-6 ${
                      isOverdue
                        ? 'border-rose-500/40 bg-rose-950/20'
                        : 'border-white/[0.08] hover:border-white/20'
                    }`}
                  >
                    {/* Book Metadata */}
                    <div className="flex items-start gap-4">
                      <img
                        src={rec.bookCoverImage}
                        alt={rec.bookTitle}
                        className="w-16 h-24 sm:w-20 sm:h-28 object-cover rounded-2xl shadow-lg flex-shrink-0"
                      />
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-[10px] font-mono font-bold text-indigo-300 px-2 py-0.5 rounded bg-indigo-500/20 border border-indigo-500/30">
                            {rec.bookId}
                          </span>
                          <span className="text-[11px] text-slate-400">ISBN: {rec.bookIsbn}</span>
                        </div>

                        <h3 className="text-base sm:text-lg font-bold text-white line-clamp-1">{rec.bookTitle}</h3>
                        <p className="text-xs text-slate-400 mt-0.5">
                          Issued By: <span className="text-slate-300 font-medium">{rec.issuedByStaffName}</span>
                        </p>

                        <div className="flex flex-wrap items-center gap-4 mt-3 text-xs text-slate-300">
                          <span className="flex items-center gap-1.5">
                            <Calendar className="w-3.5 h-3.5 text-slate-400" />
                            Issued on: <strong className="text-white">{rec.issueDate}</strong>
                          </span>
                          <span className="flex items-center gap-1.5">
                            <Clock className={`w-3.5 h-3.5 ${isOverdue ? 'text-rose-400' : 'text-amber-400'}`} />
                            Due Date (14 Days):{' '}
                            <strong className={isOverdue ? 'text-rose-400 font-bold' : 'text-amber-300 font-bold'}>
                              {rec.dueDate}
                            </strong>
                          </span>
                          <span className="text-slate-400">
                            Daily Rate: <strong className="text-white">₹{rec.applicableDailyRate}/day</strong>
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Status & Penalty Action */}
                    <div className="flex md:flex-col items-center md:items-end justify-between gap-3 pt-3 md:pt-0 border-t md:border-t-0 border-white/[0.08]">
                      {isOverdue ? (
                        <div className="text-left md:text-right space-y-1">
                          <span className="px-3 py-1 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30 text-xs font-bold flex items-center gap-1.5">
                            <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
                            Overdue by {rec.delayedDays} Days
                          </span>
                          <p className="text-sm font-extrabold text-rose-400">
                            Accrued Penalty: ₹{rec.totalPenalty}
                          </p>
                          <Link
                            href="/student/my-penalties"
                            className="text-xs text-indigo-400 hover:underline block"
                          >
                            View Penalty Details →
                          </Link>
                        </div>
                      ) : (
                        <div className="text-left md:text-right space-y-1">
                          <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-bold flex items-center gap-1.5">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                            Within 14-Day Limit
                          </span>
                          <p className="text-xs text-slate-400">
                            No overdue charges
                          </p>
                        </div>
                      )}

                      <div className="text-[11px] text-slate-500">
                        Visit Staff Desk to Return
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </LayoutWrapper>
    </RoleGuard>
  );
}
