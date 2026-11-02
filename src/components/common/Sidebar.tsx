'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useLibrary } from '@/context/LibraryContext';
import {
  LayoutDashboard,
  BookOpen,
  MapPin,
  Armchair,
  DoorOpen,
  Library,
  History,
  AlertOctagon,
  Users,
  ArrowUpRight,
  ArrowDownLeft,
  CalendarCheck,
  FileBarChart,
  Settings,
  Megaphone,
  Layers,
  Sparkles,
  Shield,
  HelpCircle,
  Clock,
  Compass,
} from 'lucide-react';

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const pathname = usePathname();
  const router = useRouter();
  const { currentUser, login } = useLibrary();

  const role = currentUser?.role || 'student';

  const studentLinks = [
    { label: 'Overview', href: '/student', icon: LayoutDashboard },
    { label: 'Find Books', href: '/student/books', icon: BookOpen },
    { label: 'Interactive Map', href: '/student/map', icon: MapPin },
    { label: 'Seat Availability', href: '/student/seats', icon: Armchair },
    { label: 'Room Booking', href: '/student/room-booking', icon: DoorOpen },
    { label: 'My Books', href: '/student/my-books', icon: Library },
    { label: 'Borrowing History', href: '/student/borrowing-history', icon: History },
    { label: 'My Penalties', href: '/student/my-penalties', icon: AlertOctagon },
  ];

  const staffLinks = [
    { label: 'Staff Dashboard', href: '/staff', icon: LayoutDashboard },
    { label: 'Student Records', href: '/staff/students', icon: Users },
    { label: 'Issue Books', href: '/staff/issue', icon: ArrowUpRight },
    { label: 'Return Books', href: '/staff/return', icon: ArrowDownLeft },
    { label: 'Book Inventory', href: '/staff/books', icon: BookOpen },
    { label: 'Overdue Management', href: '/staff/overdue-management', icon: AlertOctagon },
    { label: 'Seat & Room Monitor', href: '/staff/monitoring', icon: Compass },
  ];

  const adminLinks = [
    { label: 'Admin Dashboard', href: '/admin', icon: LayoutDashboard },
    { label: 'User Management', href: '/admin/users', icon: Users },
    { label: 'Book Management', href: '/admin/books', icon: BookOpen },
    { label: 'Category Management', href: '/admin/categories', icon: Layers },
    { label: 'Floor Layouts', href: '/admin/floors', icon: MapPin },
    { label: 'Room & Seat Config', href: '/admin/rooms', icon: DoorOpen },
    { label: 'Penalty Configurations', href: '/admin/penalties', icon: AlertOctagon },
    { label: 'Reports & Analytics', href: '/admin/reports', icon: FileBarChart },
    { label: 'Announcements', href: '/admin/announcements', icon: Megaphone },
    { label: 'Library Settings', href: '/admin/settings', icon: Settings },
  ];

  const links = role === 'admin' ? adminLinks : role === 'staff' ? staffLinks : studentLinks;

  const handleRoleQuickSwitch = (targetRole: 'student' | 'staff' | 'admin') => {
    if (targetRole === 'student') login('User1', 'User@1234');
    if (targetRole === 'staff') login('Staff1', 'Staff@1234');
    if (targetRole === 'admin') login('Admin1', 'Admin@1234');
    router.push(`/${targetRole}`);
    if (onClose) onClose();
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden transition-opacity"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed md:sticky top-16 left-0 z-40 h-[calc(100vh-4rem)] w-64 flex-shrink-0 bg-[#0B0F19]/95 md:bg-[#070A13]/60 backdrop-blur-xl border-r border-white/[0.08] flex flex-col justify-between transition-transform duration-300 ${
          isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        {/* Navigation list */}
        <div className="flex-1 overflow-y-auto px-4 py-6 space-y-6">
          {/* Module Label */}
          <div>
            <div className="px-3 mb-2 flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                {role} portal
              </span>
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            </div>

            <nav className="space-y-1">
              {links.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={onClose}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-medium transition-all group ${
                      isActive
                        ? 'bg-gradient-to-r from-indigo-600/90 to-purple-600/90 text-white shadow-neon-purple/30 shadow-md font-semibold'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-white/[0.04]'
                    }`}
                  >
                    <Icon
                      className={`w-4 h-4 transition-transform group-hover:scale-110 ${
                        isActive ? 'text-white' : 'text-slate-400 group-hover:text-indigo-400'
                      }`}
                    />
                    <span className="truncate">{item.label}</span>
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Quick Info Box */}
          <div className="mx-1 p-3.5 rounded-2xl glass-panel border-indigo-500/20 bg-indigo-950/20">
            <div className="flex items-center gap-2 text-indigo-400 text-xs font-semibold mb-1">
              <Clock className="w-3.5 h-3.5" />
              <span>14-Day Borrowing</span>
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Standard book loan period is 14 days. Room bookings are strictly 1 hour with auto-release.
            </p>
          </div>
        </div>

        {/* Demo Fast Switcher in footer */}
        <div className="p-3 border-t border-white/[0.08] bg-[#070A13]/90">
          <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider px-2 mb-2">
            Demo Role Switcher
          </p>
          <div className="grid grid-cols-3 gap-1.5">
            <button
              onClick={() => handleRoleQuickSwitch('student')}
              className={`px-2 py-1.5 rounded-lg text-[11px] font-semibold transition ${
                role === 'student'
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                  : 'bg-white/[0.04] text-slate-400 hover:text-white hover:bg-white/[0.08]'
              }`}
            >
              Student
            </button>
            <button
              onClick={() => handleRoleQuickSwitch('staff')}
              className={`px-2 py-1.5 rounded-lg text-[11px] font-semibold transition ${
                role === 'staff'
                  ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                  : 'bg-white/[0.04] text-slate-400 hover:text-white hover:bg-white/[0.08]'
              }`}
            >
              Staff
            </button>
            <button
              onClick={() => handleRoleQuickSwitch('admin')}
              className={`px-2 py-1.5 rounded-lg text-[11px] font-semibold transition ${
                role === 'admin'
                  ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                  : 'bg-white/[0.04] text-slate-400 hover:text-white hover:bg-white/[0.08]'
              }`}
            >
              Admin
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};
