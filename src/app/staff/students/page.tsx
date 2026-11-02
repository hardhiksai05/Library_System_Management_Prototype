'use client';

import React, { useState } from 'react';
import { useLibrary } from '@/context/LibraryContext';
import { RoleGuard } from '@/components/common/RoleGuard';
import { LayoutWrapper } from '@/components/common/LayoutWrapper';
import {
  Users,
  Search,
  BookOpen,
  AlertOctagon,
  Mail,
  Phone,
  GraduationCap,
  ChevronRight,
  UserCheck,
} from 'lucide-react';

export default function StudentManagementPage() {
  const { users, borrowings } = useLibrary();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStudent, setSelectedStudent] = useState<any | null>(null);

  const students = users.filter((u) => u.role === 'student');

  const filteredStudents = students.filter(
    (s) =>
      !searchQuery ||
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.studentOrEmployeeId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.department.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getStudentStats = (studentId: string) => {
    const records = borrowings.filter((b) => b.userId === studentId);
    const active = records.filter((b) => b.status === 'issued').length;
    const overdue = records.filter((b) => b.status === 'overdue').length;
    const unpaidPenalty = records
      .filter((b) => !b.penaltyPaid && b.totalPenalty > 0)
      .reduce((sum, b) => sum + b.totalPenalty, 0);

    return { records, active, overdue, unpaidPenalty };
  };

  return (
    <RoleGuard allowedRoles={['staff', 'admin']}>
      <LayoutWrapper>
        <div className="space-y-6 animate-in fade-in duration-300">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-2">
                <Users className="w-7 h-7 text-blue-400" />
                Student Records & Circulation Ledger
              </h1>
              <p className="text-xs sm:text-sm text-slate-400 mt-1">
                Lookup registered university students, track active book loans, and audit overdue statuses.
              </p>
            </div>
            <span className="px-3 py-1.5 rounded-xl glass-panel text-xs text-slate-300 border-white/10">
              Registered Students: <strong className="text-white">{students.length}</strong>
            </span>
          </div>

          {/* Search bar */}
          <div className="glass-panel p-4 rounded-2xl border-white/[0.08] flex items-center gap-3">
            <Search className="w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by student name, ID, registration number, or department..."
              className="w-full bg-transparent text-white text-xs sm:text-sm placeholder-slate-400 focus:outline-none"
            />
          </div>

          {/* Student Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredStudents.map((st) => {
              const { active, overdue, unpaidPenalty } = getStudentStats(st.id);
              return (
                <div
                  key={st.id}
                  onClick={() => setSelectedStudent(st)}
                  className="glass-panel glass-panel-hover p-5 rounded-3xl border-white/[0.08] flex flex-col justify-between cursor-pointer group"
                >
                  <div>
                    <div className="flex items-center gap-3.5 mb-3">
                      <img
                        src={st.avatarUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80'}
                        alt={st.name}
                        className="w-12 h-12 rounded-2xl object-cover ring-1 ring-white/20"
                      />
                      <div>
                        <h3 className="font-bold text-sm text-white group-hover:text-blue-300 transition">
                          {st.name}
                        </h3>
                        <p className="text-xs text-indigo-300 font-mono">{st.studentOrEmployeeId}</p>
                        <p className="text-[11px] text-slate-400 truncate mt-0.5">{st.department}</p>
                      </div>
                    </div>

                    {/* Stats pills */}
                    <div className="grid grid-cols-3 gap-2 my-3 p-2.5 rounded-xl bg-slate-900/60 border border-white/5 text-center text-xs">
                      <div>
                        <span className="text-[10px] text-slate-400 block">Active</span>
                        <strong className="text-blue-400 font-bold">{active}</strong>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 block">Overdue</span>
                        <strong className={overdue > 0 ? 'text-rose-400 font-bold' : 'text-slate-400'}>
                          {overdue}
                        </strong>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 block">Penalty</span>
                        <strong className={unpaidPenalty > 0 ? 'text-rose-400 font-bold' : 'text-emerald-400'}>
                          ₹{unpaidPenalty}
                        </strong>
                      </div>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-white/[0.06] flex items-center justify-between text-xs text-slate-400">
                    <span className="truncate">{st.email}</span>
                    <ChevronRight className="w-4 h-4 text-slate-500 group-hover:translate-x-1 transition" />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Student Detailed Modal */}
          {selectedStudent && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-in fade-in">
              <div className="glass-panel w-full max-w-xl rounded-3xl border-white/15 p-6 sm:p-8 relative shadow-2xl">
                <button
                  onClick={() => setSelectedStudent(null)}
                  className="absolute top-5 right-5 p-2 rounded-full bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white"
                >
                  ✕
                </button>

                <div className="flex items-center gap-4 mb-6">
                  <img
                    src={selectedStudent.avatarUrl}
                    alt={selectedStudent.name}
                    className="w-16 h-16 rounded-2xl object-cover ring-2 ring-indigo-500/50"
                  />
                  <div>
                    <h2 className="text-xl font-bold text-white">{selectedStudent.name}</h2>
                    <p className="text-xs text-indigo-300 font-mono">{selectedStudent.studentOrEmployeeId}</p>
                    <p className="text-xs text-slate-400 mt-0.5">{selectedStudent.department}</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="font-bold text-sm text-white">Borrowing Records</h3>
                  <div className="max-h-60 overflow-y-auto space-y-2 pr-1 text-xs">
                    {borrowings
                      .filter((b) => b.userId === selectedStudent.id)
                      .map((b) => (
                        <div
                          key={b.id}
                          className="p-3 rounded-xl bg-slate-900/60 border border-white/10 flex items-center justify-between"
                        >
                          <div>
                            <p className="font-bold text-white">{b.bookTitle}</p>
                            <p className="text-[10px] text-slate-400">
                              Issued: {b.issueDate} &bull; Due: {b.dueDate}
                            </p>
                          </div>
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                              b.status === 'overdue'
                                ? 'bg-rose-500/20 text-rose-300'
                                : b.status === 'issued'
                                ? 'bg-blue-500/20 text-blue-300'
                                : 'bg-emerald-500/20 text-emerald-300'
                            }`}
                          >
                            {b.status} {b.totalPenalty > 0 ? `(₹${b.totalPenalty})` : ''}
                          </span>
                        </div>
                      ))}
                  </div>

                  <div className="pt-4 border-t border-white/[0.08] flex justify-end">
                    <button
                      onClick={() => setSelectedStudent(null)}
                      className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs"
                    >
                      Close Record
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </LayoutWrapper>
    </RoleGuard>
  );
}
