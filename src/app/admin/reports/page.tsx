'use client';

import React from 'react';
import { useLibrary } from '@/context/LibraryContext';
import { RoleGuard } from '@/components/common/RoleGuard';
import { LayoutWrapper } from '@/components/common/LayoutWrapper';
import {
  FileBarChart,
  TrendingUp,
  BookOpen,
  DoorOpen,
  AlertOctagon,
  Download,
  Calendar,
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
  LineChart,
  Line,
  CartesianGrid,
  Legend,
} from 'recharts';

export default function AdminReportsPage() {
  const { books, borrowings, roomBookings } = useLibrary();

  // Circulation activity trend (last 6 months simulated)
  const circulationTrends = [
    { month: 'Jun', issued: 120, returned: 110, overdue: 8 },
    { month: 'Jul', issued: 145, returned: 130, overdue: 12 },
    { month: 'Aug', issued: 210, returned: 185, overdue: 15 },
    { month: 'Sep', issued: 280, returned: 260, overdue: 22 },
    { month: 'Oct', issued: 340, returned: 310, overdue: 28 },
    { month: 'Nov', issued: 180, returned: 160, overdue: 14 },
  ];

  // Category Borrowing distribution
  const categoryBorrowings = [
    { name: 'Computer Science', count: 48, fill: '#6366F1' },
    { name: 'Artificial Intelligence', count: 35, fill: '#8B5CF6' },
    { name: 'Mathematics', count: 24, fill: '#3B82F6' },
    { name: 'Physics', count: 18, fill: '#06B6D4' },
    { name: 'Engineering', count: 22, fill: '#F97316' },
    { name: 'General Knowledge', count: 15, fill: '#10B981' },
  ];

  // Hourly Room Utilization
  const hourlyRoomUsage = [
    { hour: '09 AM', occupancy: 45 },
    { hour: '10 AM', occupancy: 85 },
    { hour: '11 AM', occupancy: 92 },
    { hour: '12 PM', occupancy: 70 },
    { hour: '01 PM', occupancy: 60 },
    { hour: '02 PM', occupancy: 88 },
    { hour: '03 PM', occupancy: 95 },
    { hour: '04 PM', occupancy: 90 },
    { hour: '05 PM', occupancy: 75 },
    { hour: '06 PM', occupancy: 50 },
  ];

  return (
    <RoleGuard allowedRoles={['admin']}>
      <LayoutWrapper>
        <div className="space-y-6 animate-in fade-in duration-300">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-2">
                <FileBarChart className="w-7 h-7 text-emerald-400" />
                Library Reports & Circulation Analytics
              </h1>
              <p className="text-xs sm:text-sm text-slate-400 mt-1">
                Visual data trends for book circulation, overdue fine accumulation, and room utilization.
              </p>
            </div>

            <button
              onClick={() => alert('Exporting Official Academic Library Analytics Summary (PDF / CSV)...')}
              className="px-4 py-2 rounded-xl glass-panel text-xs text-white border-white/10 hover:bg-white/[0.08] flex items-center gap-2 transition"
            >
              <Download className="w-4 h-4 text-emerald-400" /> Export Report (CSV)
            </button>
          </div>

          {/* Metric cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="glass-panel p-5 rounded-2xl border-white/[0.08]">
              <span className="text-xs text-slate-400">Total Circulation Volume</span>
              <p className="text-2xl font-black text-white mt-1">1,275 Loans</p>
              <p className="text-[11px] text-emerald-400 mt-0.5">+14% vs previous semester</p>
            </div>
            <div className="glass-panel p-5 rounded-2xl border-white/[0.08]">
              <span className="text-xs text-slate-400">Average On-Time Return Rate</span>
              <p className="text-2xl font-black text-indigo-400 mt-1">94.2%</p>
              <p className="text-[11px] text-slate-400 mt-0.5">Under 14-day rule</p>
            </div>
            <div className="glass-panel p-5 rounded-2xl border-white/[0.08]">
              <span className="text-xs text-slate-400">Study Room Utilization</span>
              <p className="text-2xl font-black text-purple-400 mt-1">78.5%</p>
              <p className="text-[11px] text-purple-300 mt-0.5">Peak demand 10 AM – 4 PM</p>
            </div>
          </div>

          {/* Charts Row 1: Line Chart Circulation Trends */}
          <div className="glass-panel p-6 rounded-3xl border-white/[0.08]">
            <h3 className="font-bold text-sm text-white mb-1">
              Monthly Book Circulation & Overdue Trajectory
            </h3>
            <p className="text-xs text-slate-400 mb-6">
              Correlation between issued books, timely returns, and overdue delays
            </p>

            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={circulationTrends}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" />
                  <XAxis dataKey="month" stroke="#64748b" fontSize={11} />
                  <YAxis stroke="#64748b" fontSize={11} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#0F172A',
                      borderColor: '#334155',
                      borderRadius: '12px',
                      fontSize: '12px',
                    }}
                  />
                  <Legend />
                  <Line type="monotone" dataKey="issued" name="Issued Books" stroke="#6366F1" strokeWidth={2.5} />
                  <Line type="monotone" dataKey="returned" name="Returned Books" stroke="#10B981" strokeWidth={2.5} />
                  <Line type="monotone" dataKey="overdue" name="Overdue Books" stroke="#F43F5E" strokeWidth={2.5} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Charts Row 2: 2 Column - Category Distribution & Room Hourly Occupancy */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="glass-panel p-6 rounded-3xl border-white/[0.08]">
              <h3 className="font-bold text-sm text-white mb-1">
                Category Borrowing Demand
              </h3>
              <p className="text-xs text-slate-400 mb-4">
                Total borrowings grouped by academic discipline
              </p>

              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={categoryBorrowings} layout="vertical">
                    <XAxis type="number" stroke="#64748b" fontSize={11} />
                    <YAxis dataKey="name" type="category" stroke="#64748b" fontSize={10} width={100} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#0F172A',
                        borderColor: '#334155',
                        borderRadius: '12px',
                        fontSize: '12px',
                      }}
                    />
                    <Bar dataKey="count" name="Total Loans" radius={[0, 6, 6, 0]}>
                      {categoryBorrowings.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="glass-panel p-6 rounded-3xl border-white/[0.08]">
              <h3 className="font-bold text-sm text-white mb-1">
                Hourly Study Room Utilization Curve
              </h3>
              <p className="text-xs text-slate-400 mb-4">
                Average percentage occupancy across all 24 rooms throughout the day
              </p>

              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={hourlyRoomUsage}>
                    <XAxis dataKey="hour" stroke="#64748b" fontSize={11} />
                    <YAxis stroke="#64748b" fontSize={11} unit="%" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#0F172A',
                        borderColor: '#334155',
                        borderRadius: '12px',
                        fontSize: '12px',
                      }}
                    />
                    <Bar dataKey="occupancy" name="Occupancy %" fill="#8B5CF6" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>
      </LayoutWrapper>
    </RoleGuard>
  );
}
