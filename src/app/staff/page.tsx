'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useLibrary } from '@/context/LibraryContext';
import { RoleGuard } from '@/components/common/RoleGuard';
import { LayoutWrapper } from '@/components/common/LayoutWrapper';
import {
  Briefcase,
  Users,
  BookOpen,
  ArrowUpRight,
  ArrowDownLeft,
  AlertOctagon,
  Clock,
  DoorOpen,
  Armchair,
  TrendingUp,
  Search,
  CheckCircle2,
  ChevronRight,
  Sparkles,
} from 'lucide-react';

export default function StaffDashboardPage() {
  const { currentUser, books, users, borrowings, roomBookings } = useLibrary();

  const totalIssued = borrowings.filter((b) => b.status === 'issued').length;
  const overdueCount = borrowings.filter((b) => b.status === 'overdue').length;
  const returnedCount = borrowings.filter((b) => b.status === 'returned').length;
  const activeRoomBookings = roomBookings.filter((b) => b.status === 'confirmed').length;

  return (
    <RoleGuard allowedRoles={['staff', 'admin']}>
      <LayoutWrapper>
        <div className="space-y-8 animate-in fade-in duration-300">
          {/* Hero Section */}
          <div className="relative overflow-hidden rounded-3xl glass-panel p-6 sm:p-8 border-blue-500/20 bg-gradient-to-r from-blue-950/60 via-slate-900/80 to-indigo-950/50 shadow-2xl">
            <div className="relative z-10 max-w-3xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 border border-blue-500/30 text-blue-300 text-xs font-semibold mb-3">
                <Briefcase className="w-3.5 h-3.5 text-blue-400" />
                Circulation & Library Desk Portal
              </div>
              <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
                Welcome, {currentUser?.name || 'Dr. Sunita Verma'}
              </h1>
              <p className="mt-2 text-xs sm:text-sm text-slate-300">
                Staff ID: <span className="font-semibold text-white">{currentUser?.studentOrEmployeeId || 'STAFF-LIB-409'}</span> &bull; {currentUser?.department}
              </p>

              <div className="mt-6 flex flex-wrap gap-3">
                <Link
                  href="/staff/issue"
                  className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs shadow-neon-blue flex items-center gap-2 transition"
                >
                  <ArrowUpRight className="w-4 h-4" /> Issue Book (14-Day Limit)
                </Link>
                <Link
                  href="/staff/return"
                  className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs shadow-lg flex items-center gap-2 transition"
                >
                  <ArrowDownLeft className="w-4 h-4" /> Accept Book Return
                </Link>
                <Link
                  href="/staff/students"
                  className="px-5 py-2.5 rounded-xl bg-white/[0.06] hover:bg-white/[0.1] text-white font-semibold text-xs border border-white/10 flex items-center gap-2 transition"
                >
                  <Users className="w-4 h-4 text-blue-400" /> Student Records
                </Link>
              </div>
            </div>
          </div>

          {/* Key Statistics */}
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
            <div className="glass-panel p-5 rounded-2xl border-white/[0.08]">
              <div className="flex items-center justify-between text-slate-400 text-xs mb-2">
                <span>Active Loans</span>
                <BookOpen className="w-4 h-4 text-blue-400" />
              </div>
              <div className="text-3xl font-black text-white">{totalIssued}</div>
              <p className="text-[11px] text-slate-400 mt-1">Currently in circulation</p>
            </div>

            <div className="glass-panel p-5 rounded-2xl border-white/[0.08]">
              <div className="flex items-center justify-between text-slate-400 text-xs mb-2">
                <span>Returned Books</span>
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              </div>
              <div className="text-3xl font-black text-emerald-400">{returnedCount}</div>
              <p className="text-[11px] text-slate-400 mt-1">Processed in ledger</p>
            </div>

            <div className="glass-panel p-5 rounded-2xl border-white/[0.08]">
              <div className="flex items-center justify-between text-slate-400 text-xs mb-2">
                <span>Overdue Books</span>
                <AlertOctagon className="w-4 h-4 text-rose-400" />
              </div>
              <div className="text-3xl font-black text-rose-400">{overdueCount}</div>
              <p className="text-[11px] text-rose-300 mt-1">Requires penalty collection</p>
            </div>

            <div className="glass-panel p-5 rounded-2xl border-white/[0.08]">
              <div className="flex items-center justify-between text-slate-400 text-xs mb-2">
                <span>Room Reservations</span>
                <DoorOpen className="w-4 h-4 text-purple-400" />
              </div>
              <div className="text-3xl font-black text-purple-400">{activeRoomBookings}</div>
              <p className="text-[11px] text-slate-400 mt-1">Active 1-hour sessions</p>
            </div>

            <div className="glass-panel p-5 rounded-2xl border-white/[0.08] col-span-2 lg:col-span-1">
              <div className="flex items-center justify-between text-slate-400 text-xs mb-2">
                <span>Library Capacity</span>
                <TrendingUp className="w-4 h-4 text-amber-400" />
              </div>
              <div className="text-3xl font-black text-amber-400">55%</div>
              <p className="text-[11px] text-slate-400 mt-1">Live hall occupancy</p>
            </div>
          </div>

          {/* Quick Staff Functional Modules */}
          <div>
            <h2 className="text-lg font-bold text-white mb-4">Circulation Modules</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {/* Module A: Student Management */}
              <Link
                href="/staff/students"
                className="glass-panel glass-panel-hover p-6 rounded-3xl border-white/[0.08] group"
              >
                <div className="w-12 h-12 rounded-2xl bg-blue-500/15 text-blue-400 flex items-center justify-center mb-4 group-hover:scale-110 transition">
                  <Users className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-white text-base group-hover:text-blue-300 transition">
                  Student Management
                </h3>
                <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
                  Search student ID cards, view individual borrowing limits, active loan counts, and overdue ledger.
                </p>
                <div className="mt-4 flex items-center gap-1 text-xs font-semibold text-blue-400">
                  Open Student Records <ChevronRight className="w-3.5 h-3.5" />
                </div>
              </Link>

              {/* Module B: Issue Books */}
              <Link
                href="/staff/issue"
                className="glass-panel glass-panel-hover p-6 rounded-3xl border-white/[0.08] group"
              >
                <div className="w-12 h-12 rounded-2xl bg-indigo-500/15 text-indigo-400 flex items-center justify-center mb-4 group-hover:scale-110 transition">
                  <ArrowUpRight className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-white text-base group-hover:text-indigo-300 transition">
                  Issue Books (14 Days)
                </h3>
                <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
                  Record new loans, automatically stamp 14-day return due date, and decrement shelf copy count.
                </p>
                <div className="mt-4 flex items-center gap-1 text-xs font-semibold text-indigo-400">
                  Circulation Counter <ChevronRight className="w-3.5 h-3.5" />
                </div>
              </Link>

              {/* Module C: Return Books */}
              <Link
                href="/staff/return"
                className="glass-panel glass-panel-hover p-6 rounded-3xl border-white/[0.08] group"
              >
                <div className="w-12 h-12 rounded-2xl bg-emerald-500/15 text-emerald-400 flex items-center justify-center mb-4 group-hover:scale-110 transition">
                  <ArrowDownLeft className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-white text-base group-hover:text-emerald-300 transition">
                  Return Books & Check Fines
                </h3>
                <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
                  Scan return barcode, calculate delay days, assess book-specific penalty rate, and restock copy.
                </p>
                <div className="mt-4 flex items-center gap-1 text-xs font-semibold text-emerald-400">
                  Process Returns <ChevronRight className="w-3.5 h-3.5" />
                </div>
              </Link>

              {/* Module D: Overdue Management */}
              <Link
                href="/staff/overdue-management"
                className="glass-panel glass-panel-hover p-6 rounded-3xl border-white/[0.08] group"
              >
                <div className="w-12 h-12 rounded-2xl bg-rose-500/15 text-rose-400 flex items-center justify-center mb-4 group-hover:scale-110 transition">
                  <AlertOctagon className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-white text-base group-hover:text-rose-300 transition">
                  Overdue & Fine Management
                </h3>
                <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
                  Audit late returns, review calculated penalties, collect counter cash, and mark receipts as cleared.
                </p>
                <div className="mt-4 flex items-center gap-1 text-xs font-semibold text-rose-400">
                  Manage Overdues <ChevronRight className="w-3.5 h-3.5" />
                </div>
              </Link>

              {/* Module E: Monitoring */}
              <Link
                href="/staff/monitoring"
                className="glass-panel glass-panel-hover p-6 rounded-3xl border-white/[0.08] group"
              >
                <div className="w-12 h-12 rounded-2xl bg-purple-500/15 text-purple-400 flex items-center justify-center mb-4 group-hover:scale-110 transition">
                  <Armchair className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-white text-base group-hover:text-purple-300 transition">
                  Room & Seating Telemetry
                </h3>
                <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
                  Monitor live floor occupancies, inspect 24 collaborative rooms, and audit 1-hour automated releases.
                </p>
                <div className="mt-4 flex items-center gap-1 text-xs font-semibold text-purple-400">
                  View Room Status <ChevronRight className="w-3.5 h-3.5" />
                </div>
              </Link>

              {/* Module F: Book Inventory View */}
              <Link
                href="/staff/books"
                className="glass-panel glass-panel-hover p-6 rounded-3xl border-white/[0.08] group"
              >
                <div className="w-12 h-12 rounded-2xl bg-orange-500/15 text-orange-400 flex items-center justify-center mb-4 group-hover:scale-110 transition">
                  <BookOpen className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-white text-base group-hover:text-orange-300 transition">
                  Inventory & Reservations
                </h3>
                <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
                  Inspect catalog volumes, shelf racks, total copies vs available copies, and book-specific rates.
                </p>
                <div className="mt-4 flex items-center gap-1 text-xs font-semibold text-orange-400">
                  View Inventory <ChevronRight className="w-3.5 h-3.5" />
                </div>
              </Link>
            </div>
          </div>
        </div>
      </LayoutWrapper>
    </RoleGuard>
  );
}
