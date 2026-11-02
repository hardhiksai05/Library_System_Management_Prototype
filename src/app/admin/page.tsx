'use client';

import React from 'react';
import Link from 'next/link';
import { useLibrary } from '@/context/LibraryContext';
import { RoleGuard } from '@/components/common/RoleGuard';
import { LayoutWrapper } from '@/components/common/LayoutWrapper';
import {
  Shield,
  Users,
  BookOpen,
  DoorOpen,
  Armchair,
  AlertOctagon,
  FileBarChart,
  Settings,
  Megaphone,
  Layers,
  Sparkles,
  TrendingUp,
  ArrowRight,
  ChevronRight,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';

export default function AdminDashboardPage() {
  const { currentUser, books, users, borrowings, roomBookings, penaltySettings } = useLibrary();

  const totalStudents = users.filter((u) => u.role === 'student').length;
  const totalStaff = users.filter((u) => u.role === 'staff').length;
  const totalBooksCount = books.reduce((sum, b) => sum + b.totalCopies, 0);
  const availableBooksCount = books.reduce((sum, b) => sum + b.availableCopies, 0);
  const issuedBooksCount = totalBooksCount - availableBooksCount;
  const overdueCount = borrowings.filter((b) => b.status === 'overdue').length;
  const activeRoomBookings = roomBookings.filter((b) => b.status === 'confirmed').length;

  // Chart data
  const categoryData = [
    { name: 'Comp Sci', value: books.filter((b) => b.category === 'Computer Science').length, color: '#6366F1' },
    { name: 'AI & Robotics', value: books.filter((b) => b.category === 'Artificial Intelligence').length, color: '#8B5CF6' },
    { name: 'Mathematics', value: books.filter((b) => b.category === 'Mathematics').length, color: '#3B82F6' },
    { name: 'Physics', value: books.filter((b) => b.category === 'Physics').length, color: '#06B6D4' },
    { name: 'Engineering', value: books.filter((b) => b.category === 'Engineering').length, color: '#F97316' },
    { name: 'General', value: books.filter((b) => b.category === 'General Knowledge').length, color: '#10B981' },
  ];

  const floorRoomOccupancy = [
    { floor: '2nd Floor', rooms: 6, booked: 2 },
    { floor: '3rd Floor', rooms: 6, booked: 3 },
    { floor: '4th Floor', rooms: 6, booked: 1 },
    { floor: '5th Floor', rooms: 6, booked: 2 },
  ];

  return (
    <RoleGuard allowedRoles={['admin']}>
      <LayoutWrapper>
        <div className="space-y-8 animate-in fade-in duration-300">
          {/* Hero Banner */}
          <div className="relative overflow-hidden rounded-3xl glass-panel p-6 sm:p-8 border-purple-500/30 bg-gradient-to-r from-purple-950/60 via-slate-900/80 to-indigo-950/50 shadow-2xl">
            <div className="relative z-10 max-w-3xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/20 border border-purple-500/30 text-purple-300 text-xs font-semibold mb-3">
                <Shield className="w-3.5 h-3.5 text-purple-400" />
                University Library Governance & System Administration
              </div>
              <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
                Welcome, {currentUser?.name || 'Chief Librarian Vikramaditya Singh'}
              </h1>
              <p className="mt-2 text-xs sm:text-sm text-slate-300">
                Admin ID: <span className="font-semibold text-white">{currentUser?.studentOrEmployeeId || 'ADM-SYS-001'}</span> &bull; Full Administrative System Privileges Active
              </p>

              <div className="mt-6 flex flex-wrap gap-3">
                <Link
                  href="/admin/penalties"
                  className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-semibold text-xs shadow-neon-purple flex items-center gap-2 transition"
                >
                  <AlertOctagon className="w-4 h-4" /> Penalty Rates Configuration
                </Link>
                <Link
                  href="/admin/books"
                  className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs shadow-neon-blue flex items-center gap-2 transition"
                >
                  <BookOpen className="w-4 h-4" /> Manage Books & Overrides
                </Link>
                <Link
                  href="/admin/users"
                  className="px-5 py-2.5 rounded-xl bg-white/[0.06] hover:bg-white/[0.1] text-white font-semibold text-xs border border-white/10 flex items-center gap-2 transition"
                >
                  <Users className="w-4 h-4 text-purple-400" /> User Roles & Access
                </Link>
              </div>
            </div>
          </div>

          {/* 8 Statistics Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-3 sm:gap-4">
            <div className="glass-panel p-4 rounded-2xl border-white/[0.08]">
              <span className="text-[11px] text-slate-400 block truncate">Total Titles</span>
              <p className="text-xl font-black text-white mt-0.5">{books.length}</p>
            </div>
            <div className="glass-panel p-4 rounded-2xl border-white/[0.08]">
              <span className="text-[11px] text-slate-400 block truncate">Total Copies</span>
              <p className="text-xl font-black text-indigo-400 mt-0.5">{totalBooksCount}</p>
            </div>
            <div className="glass-panel p-4 rounded-2xl border-white/[0.08]">
              <span className="text-[11px] text-slate-400 block truncate">Available</span>
              <p className="text-xl font-black text-emerald-400 mt-0.5">{availableBooksCount}</p>
            </div>
            <div className="glass-panel p-4 rounded-2xl border-white/[0.08]">
              <span className="text-[11px] text-slate-400 block truncate">Issued</span>
              <p className="text-xl font-black text-blue-400 mt-0.5">{issuedBooksCount}</p>
            </div>
            <div className="glass-panel p-4 rounded-2xl border-white/[0.08]">
              <span className="text-[11px] text-slate-400 block truncate">Overdue</span>
              <p className="text-xl font-black text-rose-400 mt-0.5">{overdueCount}</p>
            </div>
            <div className="glass-panel p-4 rounded-2xl border-white/[0.08]">
              <span className="text-[11px] text-slate-400 block truncate">Students</span>
              <p className="text-xl font-black text-white mt-0.5">{totalStudents}</p>
            </div>
            <div className="glass-panel p-4 rounded-2xl border-white/[0.08]">
              <span className="text-[11px] text-slate-400 block truncate">Staff Desk</span>
              <p className="text-xl font-black text-purple-400 mt-0.5">{totalStaff}</p>
            </div>
            <div className="glass-panel p-4 rounded-2xl border-white/[0.08]">
              <span className="text-[11px] text-slate-400 block truncate">Study Rooms</span>
              <p className="text-xl font-black text-emerald-400 mt-0.5">24</p>
            </div>
          </div>

          {/* Interactive Recharts Analytics Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Category distribution */}
            <div className="glass-panel p-6 rounded-3xl border-white/[0.08]">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-base font-bold text-white">Catalog Volume Distribution</h3>
                  <p className="text-xs text-slate-400">Title allocations across academic departments</p>
                </div>
              </div>

              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={categoryData}>
                    <XAxis dataKey="name" stroke="#64748b" fontSize={11} />
                    <YAxis stroke="#64748b" fontSize={11} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#0F172A',
                        borderColor: '#334155',
                        borderRadius: '12px',
                        fontSize: '12px',
                      }}
                    />
                    <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                      {categoryData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Room Occupancy across floors */}
            <div className="glass-panel p-6 rounded-3xl border-white/[0.08]">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-base font-bold text-white">Study Room Utilization</h3>
                  <p className="text-xs text-slate-400">Floor-wise active reservations (6 rooms / 48 seats per floor)</p>
                </div>
              </div>

              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={floorRoomOccupancy}>
                    <XAxis dataKey="floor" stroke="#64748b" fontSize={11} />
                    <YAxis stroke="#64748b" fontSize={11} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#0F172A',
                        borderColor: '#334155',
                        borderRadius: '12px',
                        fontSize: '12px',
                      }}
                    />
                    <Bar dataKey="booked" name="Active Bookings" fill="#8B5CF6" radius={[6, 6, 0, 0]} />
                    <Bar dataKey="rooms" name="Total Rooms (6)" fill="#1E293B" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Admin Management Modules Navigation */}
          <div>
            <h2 className="text-lg font-bold text-white mb-4">Administrative Control Modules</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <Link
                href="/admin/users"
                className="glass-panel glass-panel-hover p-5 rounded-3xl border-white/[0.08] group"
              >
                <div className="w-10 h-10 rounded-2xl bg-indigo-500/15 text-indigo-400 flex items-center justify-center mb-3 group-hover:scale-110 transition">
                  <Users className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-white text-sm group-hover:text-indigo-300 transition">
                  User Management
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  Add, edit, deactivate students and staff, and manage role permissions.
                </p>
              </Link>

              <Link
                href="/admin/books"
                className="glass-panel glass-panel-hover p-5 rounded-3xl border-white/[0.08] group"
              >
                <div className="w-10 h-10 rounded-2xl bg-purple-500/15 text-purple-400 flex items-center justify-center mb-3 group-hover:scale-110 transition">
                  <BookOpen className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-white text-sm group-hover:text-purple-300 transition">
                  Book Management
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  Add new books, update shelf locations, and configure individual penalty overrides.
                </p>
              </Link>

              <Link
                href="/admin/penalties"
                className="glass-panel glass-panel-hover p-5 rounded-3xl border-white/[0.08] group"
              >
                <div className="w-10 h-10 rounded-2xl bg-rose-500/15 text-rose-400 flex items-center justify-center mb-3 group-hover:scale-110 transition">
                  <AlertOctagon className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-white text-sm group-hover:text-rose-300 transition">
                  Penalty Configuration
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  Configure default rate, category rates, and audit 3-tier priority execution.
                </p>
              </Link>

              <Link
                href="/admin/reports"
                className="glass-panel glass-panel-hover p-5 rounded-3xl border-white/[0.08] group"
              >
                <div className="w-10 h-10 rounded-2xl bg-emerald-500/15 text-emerald-400 flex items-center justify-center mb-3 group-hover:scale-110 transition">
                  <FileBarChart className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-white text-sm group-hover:text-emerald-300 transition">
                  Reports & Analytics
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  Circulation turnover, overdue rates, study room utilization, and usage trends.
                </p>
              </Link>

              <Link
                href="/admin/categories"
                className="glass-panel glass-panel-hover p-5 rounded-3xl border-white/[0.08] group"
              >
                <div className="w-10 h-10 rounded-2xl bg-cyan-500/15 text-cyan-400 flex items-center justify-center mb-3 group-hover:scale-110 transition">
                  <Layers className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-white text-sm group-hover:text-cyan-300 transition">
                  Category Management
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  Define academic departments and category-level daily overdue penalty fees.
                </p>
              </Link>

              <Link
                href="/admin/floors"
                className="glass-panel glass-panel-hover p-5 rounded-3xl border-white/[0.08] group"
              >
                <div className="w-10 h-10 rounded-2xl bg-amber-500/15 text-amber-400 flex items-center justify-center mb-3 group-hover:scale-110 transition">
                  <Armchair className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-white text-sm group-hover:text-amber-300 transition">
                  Floors & Schematics
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  Audit 4 levels, Sections A-D, 12 racks, 5 shelf tiers, and open study hall zones.
                </p>
              </Link>

              <Link
                href="/admin/announcements"
                className="glass-panel glass-panel-hover p-5 rounded-3xl border-white/[0.08] group"
              >
                <div className="w-10 h-10 rounded-2xl bg-pink-500/15 text-pink-400 flex items-center justify-center mb-3 group-hover:scale-110 transition">
                  <Megaphone className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-white text-sm group-hover:text-pink-300 transition">
                  Announcements
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  Publish university-wide exam notifications, workshops, and policy updates.
                </p>
              </Link>

              <Link
                href="/admin/settings"
                className="glass-panel glass-panel-hover p-5 rounded-3xl border-white/[0.08] group"
              >
                <div className="w-10 h-10 rounded-2xl bg-slate-500/15 text-slate-300 flex items-center justify-center mb-3 group-hover:scale-110 transition">
                  <Settings className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-white text-sm group-hover:text-slate-200 transition">
                  Library Settings
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  Audit 14-day borrowing default, 1-hour room booking expiration, and system parameters.
                </p>
              </Link>
            </div>
          </div>
        </div>
      </LayoutWrapper>
    </RoleGuard>
  );
}
