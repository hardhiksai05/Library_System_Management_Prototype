'use client';

import React, { useState } from 'react';
import { useLibrary } from '@/context/LibraryContext';
import { RoleGuard } from '@/components/common/RoleGuard';
import { LayoutWrapper } from '@/components/common/LayoutWrapper';
import {
  ArrowUpRight,
  BookOpen,
  User,
  Calendar,
  CheckCircle2,
  AlertCircle,
  Clock,
  Search,
  Sparkles,
} from 'lucide-react';

export default function IssueBookPage() {
  const { books, users, issueBook, simulatedDate, calculatePenaltyRateForBook } = useLibrary();

  const [selectedBookId, setSelectedBookId] = useState<string>('');
  const [selectedStudentId, setSelectedStudentId] = useState<string>('User1');
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Filter students only
  const students = users.filter((u) => u.role === 'student');

  // Compute 14-day due date preview
  const get14DayPreview = () => {
    const parts = simulatedDate.split('-');
    const d = new Date(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2]));
    d.setDate(d.getDate() + 14);
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
  };

  const previewDueDate = get14DayPreview();
  const selectedBook = books.find((b) => b.id === selectedBookId);
  const selectedStudent = users.find((u) => u.id === selectedStudentId);

  const handleIssue = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedBookId) {
      setStatusMessage({ type: 'error', text: 'Please select a book to issue.' });
      return;
    }
    if (!selectedStudentId) {
      setStatusMessage({ type: 'error', text: 'Please select a student.' });
      return;
    }

    const res = issueBook(selectedBookId, selectedStudentId, 'Dr. Sunita Verma');
    if (res.success) {
      setStatusMessage({ type: 'success', text: res.message });
      setSelectedBookId('');
    } else {
      setStatusMessage({ type: 'error', text: res.message });
    }
  };

  return (
    <RoleGuard allowedRoles={['staff', 'admin']}>
      <LayoutWrapper>
        <div className="space-y-6 animate-in fade-in duration-300">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-2">
              <ArrowUpRight className="w-7 h-7 text-indigo-400" />
              Issue Book to Student
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Circulation desk issuance with automated 14-day loan duration and penalty configuration stamping.
            </p>
          </div>

          {statusMessage && (
            <div
              className={`p-4 rounded-2xl text-xs flex items-center gap-2.5 border ${
                statusMessage.type === 'success'
                  ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                  : 'bg-red-500/10 border-red-500/30 text-red-300'
              }`}
            >
              {statusMessage.type === 'success' ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
              ) : (
                <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
              )}
              <span>{statusMessage.text}</span>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Form Column */}
            <div className="lg:col-span-2 glass-panel p-6 sm:p-8 rounded-3xl border-white/[0.08]">
              <form onSubmit={handleIssue} className="space-y-5">
                {/* Select Student */}
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                    1. Select Student
                  </label>
                  <select
                    value={selectedStudentId}
                    onChange={(e) => setSelectedStudentId(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-900/80 border border-white/10 rounded-2xl text-white text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    {students.map((st) => (
                      <option key={st.id} value={st.id}>
                        {st.name} ({st.studentOrEmployeeId}) &bull; {st.department}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Select Book */}
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                    2. Select Book to Issue
                  </label>
                  <select
                    value={selectedBookId}
                    onChange={(e) => setSelectedBookId(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-900/80 border border-white/10 rounded-2xl text-white text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="">-- Choose a catalog title --</option>
                    {books.map((b) => (
                      <option key={b.id} value={b.id} disabled={b.availableCopies <= 0}>
                        {b.title} ({b.id}) &bull; {b.availableCopies > 0 ? `${b.availableCopies} available` : 'OUT OF STOCK'}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Automated 14-Day Preview Box */}
                <div className="p-4 rounded-2xl bg-indigo-950/40 border border-indigo-500/30 space-y-2">
                  <div className="flex items-center gap-2 text-indigo-300 text-xs font-bold">
                    <Clock className="w-4 h-4" />
                    Automated Circulation Terms
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-xs pt-1">
                    <div>
                      <span className="text-slate-400 block">Issue Date (Simulated):</span>
                      <strong className="text-white text-sm">{simulatedDate}</strong>
                    </div>
                    <div>
                      <span className="text-slate-400 block">Due Date (Strict 14 Days):</span>
                      <strong className="text-amber-300 text-sm">{previewDueDate}</strong>
                    </div>
                  </div>
                  {selectedBook && (
                    <div className="pt-2 border-t border-indigo-500/20 text-xs text-slate-300">
                      Applicable Late Penalty Rate: <strong className="text-amber-300">₹{calculatePenaltyRateForBook(selectedBook)}/day</strong>
                    </div>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={!selectedBookId}
                  className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 text-white font-bold text-xs sm:text-sm shadow-neon-blue transition disabled:opacity-40"
                >
                  Confirm Issue & Record Loan
                </button>
              </form>
            </div>

            {/* Preview Column */}
            <div className="space-y-4">
              <div className="glass-panel p-6 rounded-3xl border-white/[0.08]">
                <h3 className="font-bold text-sm text-white mb-3">Selected Loan Summary</h3>

                {selectedBook ? (
                  <div className="space-y-3">
                    <img
                      src={selectedBook.coverImage}
                      alt={selectedBook.title}
                      className="w-full aspect-[4/3] object-cover rounded-2xl shadow-md"
                    />
                    <div>
                      <h4 className="font-bold text-sm text-white">{selectedBook.title}</h4>
                      <p className="text-xs text-slate-400 mt-0.5">{selectedBook.author}</p>
                      <p className="text-[10px] text-slate-500 font-mono mt-0.5">ISBN: {selectedBook.isbn}</p>
                    </div>

                    <div className="p-3 rounded-xl bg-slate-900/60 border border-white/5 text-xs space-y-1">
                      <div className="flex justify-between">
                        <span className="text-slate-400">Location:</span>
                        <span className="text-white">{selectedBook.location.floor}, {selectedBook.location.rack}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Available:</span>
                        <span className="text-emerald-400 font-bold">{selectedBook.availableCopies} copies</span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="py-8 text-center text-slate-500 text-xs">
                    Select a book from the dropdown to preview circulation metadata.
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </LayoutWrapper>
    </RoleGuard>
  );
}
