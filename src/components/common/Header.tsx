'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useLibrary } from '@/context/LibraryContext';
import {
  Bell,
  Search,
  Calendar,
  LogOut,
  User as UserIcon,
  Shield,
  GraduationCap,
  Briefcase,
  ChevronDown,
  CheckCheck,
  Clock,
  Sparkles,
  AlertTriangle,
  BookOpen,
} from 'lucide-react';

interface HeaderProps {
  onToggleSidebar?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onToggleSidebar }) => {
  const { currentUser, logout, notifications, markNotificationAsRead, clearAllNotifications, simulatedDate, setSimulatedDate } = useLibrary();
  const router = useRouter();
  const [showNotifs, setShowNotifs] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);

  // Filter unread notifications for the current user/role
  const userNotifs = notifications.filter((n) => {
    if (!currentUser) return false;
    if (n.targetRole === 'all') return true;
    if (n.targetRole && n.targetRole === currentUser.role) return true;
    if (n.targetUserId && n.targetUserId === currentUser.id) return true;
    return false;
  });

  const unreadCount = userNotifs.filter((n) => !n.read).length;

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  const getRoleIcon = () => {
    if (!currentUser) return null;
    switch (currentUser.role) {
      case 'admin':
        return <Shield className="w-3.5 h-3.5 text-purple-400" />;
      case 'staff':
        return <Briefcase className="w-3.5 h-3.5 text-blue-400" />;
      default:
        return <GraduationCap className="w-3.5 h-3.5 text-emerald-400" />;
    }
  };

  const advanceDateByDays = (days: number) => {
    const parts = simulatedDate.split('-');
    const d = new Date(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2]));
    d.setDate(d.getDate() + days);
    const newY = d.getFullYear();
    const newM = String(d.getMonth() + 1).padStart(2, '0');
    const newD = String(d.getDate()).padStart(2, '0');
    setSimulatedDate(`${newY}-${newM}-${newD}`);
  };

  return (
    <header className="sticky top-0 z-40 w-full h-16 border-b border-white/[0.08] bg-[#070A13]/85 backdrop-blur-md px-4 sm:px-6 flex items-center justify-between">
      {/* Left branding */}
      <div className="flex items-center gap-3">
        {onToggleSidebar && (
          <button
            onClick={onToggleSidebar}
            className="md:hidden p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/[0.05] transition"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        )}
        <Link href={`/${currentUser?.role || 'student'}`} className="flex items-center gap-3 group">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-500 flex items-center justify-center shadow-neon-purple/50 group-hover:scale-105 transition">
            <BookOpen className="w-5 h-5 text-white" />
          </div>
          <div className="hidden sm:block">
            <div className="flex items-center gap-2">
              <span className="font-bold text-base tracking-tight text-white group-hover:text-indigo-300 transition">
                SMART LIB
              </span>
              <span className="text-[10px] font-semibold tracking-wider uppercase px-1.5 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                LPU
              </span>
            </div>
            <p className="text-[11px] text-slate-400 tracking-wide font-medium">University Library System</p>
          </div>
        </Link>
      </div>

      {/* Center Simulated Date Controller */}
      <div className="hidden lg:flex items-center gap-2 bg-slate-900/80 border border-white/[0.08] rounded-xl px-3 py-1.5 text-xs text-slate-300">
        <Calendar className="w-3.5 h-3.5 text-indigo-400" />
        <span className="text-slate-400">Date:</span>
        <span className="font-semibold text-white tracking-wide">{simulatedDate}</span>
        <div className="flex items-center gap-1 ml-2 border-l border-white/10 pl-2">
          <button
            onClick={() => advanceDateByDays(1)}
            title="Advance 1 day forward to test due dates"
            className="px-1.5 py-0.5 rounded bg-white/[0.06] hover:bg-indigo-600 hover:text-white text-[10px] font-medium transition"
          >
            +1 Day
          </button>
          <button
            onClick={() => advanceDateByDays(7)}
            title="Advance 7 days forward"
            className="px-1.5 py-0.5 rounded bg-white/[0.06] hover:bg-indigo-600 hover:text-white text-[10px] font-medium transition"
          >
            +7 Days
          </button>
          <button
            onClick={() => advanceDateByDays(15)}
            title="Advance 15 days forward to trigger 14-day overdues"
            className="px-1.5 py-0.5 rounded bg-red-500/20 hover:bg-red-600 text-red-300 hover:text-white text-[10px] font-medium transition"
          >
            +15 Days (Overdue Test)
          </button>
        </div>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-3">
        {/* Quick Date Control for Mobile */}
        <button
          onClick={() => setShowDatePicker(!showDatePicker)}
          className="lg:hidden p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/[0.05] relative"
          title="Date Simulation"
        >
          <Calendar className="w-5 h-5 text-indigo-400" />
        </button>

        {showDatePicker && (
          <div className="absolute top-16 right-16 glass-panel p-3 rounded-xl border-white/10 shadow-xl z-50 text-xs">
            <p className="text-slate-400 mb-2">Simulated: <span className="text-white font-bold">{simulatedDate}</span></p>
            <div className="flex flex-col gap-1.5">
              <button
                onClick={() => { advanceDateByDays(1); setShowDatePicker(false); }}
                className="px-2 py-1 bg-white/10 hover:bg-indigo-600 rounded text-left text-slate-200"
              >
                +1 Day Forward
              </button>
              <button
                onClick={() => { advanceDateByDays(15); setShowDatePicker(false); }}
                className="px-2 py-1 bg-red-500/20 hover:bg-red-600 rounded text-left text-red-200"
              >
                +15 Days (Trigger Overdue)
              </button>
            </div>
          </div>
        )}

        {/* Notifications Button */}
        <div className="relative">
          <button
            onClick={() => setShowNotifs(!showNotifs)}
            className="p-2 rounded-xl text-slate-300 hover:text-white hover:bg-white/[0.06] transition relative"
            aria-label="Notifications"
          >
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-rose-500 text-[10px] font-bold text-white flex items-center justify-center ring-2 ring-[#070A13] animate-pulse">
                {unreadCount}
              </span>
            )}
          </button>

          {/* Notification Flyout */}
          {showNotifs && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 glass-panel rounded-2xl border-white/10 shadow-2xl p-4 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
              <div className="flex items-center justify-between pb-3 border-b border-white/[0.08]">
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-sm text-white">Notifications</h3>
                  {unreadCount > 0 && (
                    <span className="px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30 text-xs">
                      {unreadCount} new
                    </span>
                  )}
                </div>
                {userNotifs.length > 0 && (
                  <button
                    onClick={clearAllNotifications}
                    className="text-xs text-slate-400 hover:text-indigo-400 transition"
                  >
                    Clear all
                  </button>
                )}
              </div>

              <div className="max-h-80 overflow-y-auto divide-y divide-white/[0.05] py-2">
                {userNotifs.length === 0 ? (
                  <div className="py-8 text-center text-slate-400 text-xs">
                    <Sparkles className="w-6 h-6 mx-auto mb-2 text-slate-600" />
                    No active notifications
                  </div>
                ) : (
                  userNotifs.map((item) => (
                    <div
                      key={item.id}
                      onClick={() => markNotificationAsRead(item.id)}
                      className={`p-2.5 rounded-xl transition cursor-pointer flex gap-3 ${
                        !item.read ? 'bg-indigo-950/30 border border-indigo-500/20' : 'hover:bg-white/[0.03]'
                      }`}
                    >
                      <div className="mt-0.5">
                        {item.type === 'overdue' ? (
                          <AlertTriangle className="w-4 h-4 text-rose-400 flex-shrink-0" />
                        ) : item.type === 'due_date' ? (
                          <Clock className="w-4 h-4 text-amber-400 flex-shrink-0" />
                        ) : (
                          <Sparkles className="w-4 h-4 text-indigo-400 flex-shrink-0" />
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between gap-1">
                          <p className={`text-xs font-medium ${!item.read ? 'text-white' : 'text-slate-300'}`}>
                            {item.title}
                          </p>
                          <span className="text-[10px] text-slate-500 whitespace-nowrap">{item.timestamp}</span>
                        </div>
                        <p className="text-[11px] text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                          {item.message}
                        </p>
                        {item.link && (
                          <Link
                            href={item.link}
                            onClick={() => setShowNotifs(false)}
                            className="inline-block mt-1 text-[11px] text-indigo-400 hover:underline"
                          >
                            View details →
                          </Link>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* User Profile Pill */}
        {currentUser ? (
          <div className="relative">
            <button
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              className="flex items-center gap-2.5 p-1 sm:px-3 sm:py-1.5 rounded-xl border border-white/[0.08] bg-white/[0.03] hover:bg-white/[0.08] transition"
            >
              <img
                src={currentUser.avatarUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=100&q=80'}
                alt={currentUser.name}
                className="w-7 h-7 rounded-lg object-cover ring-1 ring-white/20"
              />
              <div className="hidden sm:block text-left">
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-semibold text-white leading-none max-w-[110px] truncate">
                    {currentUser.name.split(' ')[0]}
                  </span>
                  <span className="flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider bg-white/[0.06] text-slate-300">
                    {getRoleIcon()}
                    {currentUser.role}
                  </span>
                </div>
                <p className="text-[10px] text-slate-400 mt-0.5">{currentUser.studentOrEmployeeId}</p>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden sm:block" />
            </button>

            {/* Profile Menu Dropdown */}
            {showProfileMenu && (
              <div className="absolute right-0 mt-2 w-64 glass-panel rounded-2xl border-white/10 shadow-2xl p-3 z-50">
                <div className="px-2 py-2 border-b border-white/[0.08] mb-2">
                  <p className="text-xs font-bold text-white">{currentUser.name}</p>
                  <p className="text-[11px] text-slate-400 truncate">{currentUser.email}</p>
                  <div className="mt-1.5 inline-flex items-center gap-1 px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-[10px] font-medium">
                    {currentUser.department}
                  </div>
                </div>

                <div className="space-y-1">
                  <Link
                    href={`/${currentUser.role}`}
                    onClick={() => setShowProfileMenu(false)}
                    className="flex items-center gap-2.5 px-3 py-2 text-xs rounded-xl text-slate-300 hover:text-white hover:bg-white/[0.06] transition"
                  >
                    <UserIcon className="w-4 h-4 text-slate-400" />
                    Dashboard
                  </Link>

                  <button
                    onClick={() => {
                      setShowProfileMenu(false);
                      handleLogout();
                    }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 text-xs rounded-xl text-rose-400 hover:text-white hover:bg-rose-500/20 transition"
                  >
                    <LogOut className="w-4 h-4" />
                    Sign Out
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <Link
            href="/login"
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white text-xs font-semibold shadow-neon-purple transition"
          >
            Portal Login
          </Link>
        )}
      </div>
    </header>
  );
};
