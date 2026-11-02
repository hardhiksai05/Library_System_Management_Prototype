'use client';

import React from 'react';
import Link from 'next/link';
import { useLibrary } from '@/context/LibraryContext';
import { RoleGuard } from '@/components/common/RoleGuard';
import { LayoutWrapper } from '@/components/common/LayoutWrapper';
import {
  History,
  CheckCircle2,
  Clock,
  AlertTriangle,
  BookOpen,
  ArrowLeft,
  Calendar,
} from 'lucide-react';

export default function BorrowingHistoryPage() {
  const { currentUser, borrowings } = useLibrary();

  const userBorrowings = borrowings.filter((b) => b.userId === currentUser?.id);

  return (
    <RoleGuard allowedRoles={['student', 'staff', 'admin']}>
      <LayoutWrapper>
        <div className="space-y-6 animate-in fade-in duration-300">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <Link
                  href="/student/my-books"
                  className="p-1.5 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white transition"
                >
                  <ArrowLeft className="w-5 h-5" />
                </Link>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-2">
                  <History className="w-7 h-7 text-indigo-400" />
                  Complete Borrowing History
                </h1>
              </div>
              <p className="text-xs sm:text-sm text-slate-400 mt-1">
                Lifetime circulation logs, dates issued, dates returned, and penalty resolution status.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <span className="px-3 py-1.5 rounded-xl glass-panel text-xs text-slate-300 border-white/10">
                Total Logs: <strong className="text-white font-bold">{userBorrowings.length}</strong>
              </span>
            </div>
          </div>

          {/* History Table */}
          <div className="glass-panel rounded-3xl border-white/[0.08] overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-900/80 border-b border-white/[0.08] text-slate-400 uppercase text-[10px] tracking-wider font-semibold">
                  <tr>
                    <th className="px-6 py-4">Book Title & ISBN</th>
                    <th className="px-6 py-4">Issue Date</th>
                    <th className="px-6 py-4">Due Date (14d)</th>
                    <th className="px-6 py-4">Return Date</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4">Penalty</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/[0.05]">
                  {userBorrowings.map((rec) => (
                    <tr key={rec.id} className="hover:bg-white/[0.02] transition">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={rec.bookCoverImage}
                            alt={rec.bookTitle}
                            className="w-9 h-12 object-cover rounded-lg shadow-sm"
                          />
                          <div>
                            <p className="font-bold text-white text-xs">{rec.bookTitle}</p>
                            <p className="text-[10px] text-slate-400">{rec.bookIsbn} &bull; {rec.bookId}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-slate-300">{rec.issueDate}</td>
                      <td className="px-6 py-4 text-slate-300">{rec.dueDate}</td>
                      <td className="px-6 py-4 text-slate-300">
                        {rec.returnDate ? (
                          <span className="text-emerald-300 font-medium">{rec.returnDate}</span>
                        ) : (
                          <span className="text-slate-500 italic">Not returned yet</span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        {rec.status === 'returned' ? (
                          <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 font-bold text-[10px]">
                            Returned
                          </span>
                        ) : rec.status === 'overdue' ? (
                          <span className="px-2.5 py-1 rounded-full bg-rose-500/20 text-rose-300 font-bold text-[10px]">
                            Overdue ({rec.delayedDays}d)
                          </span>
                        ) : (
                          <span className="px-2.5 py-1 rounded-full bg-blue-500/20 text-blue-300 font-bold text-[10px]">
                            Issued (Active)
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        {rec.totalPenalty > 0 ? (
                          <span className={rec.penaltyPaid ? 'text-slate-400 line-through' : 'text-rose-400 font-bold'}>
                            ₹{rec.totalPenalty} {rec.penaltyPaid ? '(Paid)' : '(Unpaid)'}
                          </span>
                        ) : (
                          <span className="text-emerald-400 font-medium">₹0</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </LayoutWrapper>
    </RoleGuard>
  );
}
