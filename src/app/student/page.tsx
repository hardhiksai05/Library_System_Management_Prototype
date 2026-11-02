'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useLibrary } from '@/context/LibraryContext';
import { RoleGuard } from '@/components/common/RoleGuard';
import { LayoutWrapper } from '@/components/common/LayoutWrapper';
import {
  BookOpen,
  Calendar,
  Clock,
  DoorOpen,
  AlertOctagon,
  Search,
  ArrowRight,
  TrendingUp,
  MapPin,
  Sparkles,
  Armchair,
  CheckCircle2,
  AlertTriangle,
  Library,
  ChevronRight,
  Megaphone,
} from 'lucide-react';

export default function StudentDashboardPage() {
  const router = useRouter();
  const { currentUser, borrowings, roomBookings, books, announcements, notifications, simulatedDate } = useLibrary();
  const [searchQuery, setSearchQuery] = useState('');

  // Compute student stats
  const userBorrowings = borrowings.filter((b) => b.userId === currentUser?.id);
  const activeBooks = userBorrowings.filter((b) => b.status === 'issued');
  const overdueBooks = userBorrowings.filter((b) => b.status === 'overdue');
  const totalPendingPenalties = userBorrowings
    .filter((b) => !b.penaltyPaid && b.totalPenalty > 0)
    .reduce((sum, b) => sum + b.totalPenalty, 0);

  const userRoomBookings = roomBookings.filter((r) => r.userId === currentUser?.id);
  const activeRoomBookings = userRoomBookings.filter((r) => r.status === 'confirmed');

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/student/books?q=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      router.push('/student/books');
    }
  };

  return (
    <RoleGuard allowedRoles={['student', 'staff', 'admin']}>
      <LayoutWrapper>
        <div className="space-y-8 animate-in fade-in duration-300">
          {/* HERO SECTION */}
          <div className="relative overflow-hidden rounded-3xl glass-panel p-6 sm:p-8 border-indigo-500/20 bg-gradient-to-r from-indigo-950/60 via-slate-900/80 to-purple-950/50 shadow-2xl">
            <div className="absolute top-0 right-0 -mr-16 -mt-16 w-80 h-80 rounded-full bg-indigo-500/10 blur-3xl pointer-events-none" />
            <div className="relative z-10 max-w-3xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-500/30 text-indigo-300 text-xs font-semibold mb-3">
                <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                LPU Central Academic Repository
              </div>
              <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
                Welcome Back, {currentUser?.name || 'Aarav Sharma'}!
              </h1>
              <p className="mt-2 text-sm sm:text-base text-slate-300">
                Student ID: <span className="font-semibold text-white">{currentUser?.studentOrEmployeeId || 'LPU2024CS0192'}</span> &bull; {currentUser?.department || 'School of Computer Science & Engineering'}
              </p>

              {/* Fast Book Search Bar */}
              <form onSubmit={handleSearchSubmit} className="mt-6 flex items-center gap-2 max-w-xl">
                <div className="relative flex-1">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search 150,000+ books by title, author, category, or ISBN..."
                    className="w-full pl-10 pr-4 py-3 bg-slate-900/90 border border-white/15 rounded-2xl text-white text-xs sm:text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-inner"
                  />
                </div>
                <button
                  type="submit"
                  className="px-5 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs sm:text-sm shadow-neon-purple transition flex items-center gap-1.5 whitespace-nowrap"
                >
                  Find Books
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            </div>
          </div>

          {/* DASHBOARD STATISTICS CARDS */}
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-3.5 sm:gap-4">
            {/* Total Borrowed */}
            <div className="glass-panel p-4 sm:p-5 rounded-2xl border-white/[0.08] relative overflow-hidden">
              <div className="flex items-center justify-between text-slate-400 text-xs font-medium mb-2">
                <span>Borrowed Books</span>
                <BookOpen className="w-4 h-4 text-indigo-400" />
              </div>
              <div className="text-2xl sm:text-3xl font-extrabold text-white">
                {activeBooks.length}
              </div>
              <p className="text-[11px] text-slate-400 mt-1">14-day standard term</p>
            </div>

            {/* Books Due Soon */}
            <div className="glass-panel p-4 sm:p-5 rounded-2xl border-white/[0.08] relative overflow-hidden">
              <div className="flex items-center justify-between text-slate-400 text-xs font-medium mb-2">
                <span>Due Soon</span>
                <Clock className="w-4 h-4 text-amber-400" />
              </div>
              <div className="text-2xl sm:text-3xl font-extrabold text-amber-300">
                {activeBooks.length > 0 ? '1' : '0'}
              </div>
              <p className="text-[11px] text-slate-400 mt-1">Return before deadline</p>
            </div>

            {/* Overdue Books */}
            <div className="glass-panel p-4 sm:p-5 rounded-2xl border-white/[0.08] relative overflow-hidden">
              <div className="flex items-center justify-between text-slate-400 text-xs font-medium mb-2">
                <span>Overdue Books</span>
                <AlertTriangle className="w-4 h-4 text-rose-400" />
              </div>
              <div className="text-2xl sm:text-3xl font-extrabold text-rose-400">
                {overdueBooks.length}
              </div>
              <p className="text-[11px] text-rose-300/80 mt-1">Daily penalty accumulating</p>
            </div>

            {/* Active Room Bookings */}
            <div className="glass-panel p-4 sm:p-5 rounded-2xl border-white/[0.08] relative overflow-hidden">
              <div className="flex items-center justify-between text-slate-400 text-xs font-medium mb-2">
                <span>Room Bookings</span>
                <DoorOpen className="w-4 h-4 text-emerald-400" />
              </div>
              <div className="text-2xl sm:text-3xl font-extrabold text-emerald-400">
                {activeRoomBookings.length}
              </div>
              <p className="text-[11px] text-slate-400 mt-1">1-Hour Dedicated Slots</p>
            </div>

            {/* Pending Overdue Penalties */}
            <div className="glass-panel p-4 sm:p-5 rounded-2xl border-white/[0.08] relative overflow-hidden col-span-2 lg:col-span-1">
              <div className="flex items-center justify-between text-slate-400 text-xs font-medium mb-2">
                <span>Pending Penalty</span>
                <AlertOctagon className="w-4 h-4 text-orange-400" />
              </div>
              <div className="text-2xl sm:text-3xl font-extrabold text-orange-400">
                ₹{totalPendingPenalties}
              </div>
              <p className="text-[11px] text-slate-400 mt-1">Pay at circulation counter</p>
            </div>
          </div>

          {/* QUICK ACCESS ACTION CARDS */}
          <div>
            <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-indigo-400" />
              Quick Access Hub
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Card 1: Find Books */}
              <Link
                href="/student/books"
                className="glass-panel glass-panel-hover p-5 rounded-2xl border-white/[0.08] flex flex-col justify-between group"
              >
                <div>
                  <div className="w-12 h-12 rounded-2xl bg-indigo-500/15 text-indigo-400 flex items-center justify-center mb-4 group-hover:scale-110 transition">
                    <Search className="w-6 h-6" />
                  </div>
                  <h3 className="font-bold text-white text-base group-hover:text-indigo-300 transition">
                    1. Find Books
                  </h3>
                  <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                    Search catalog, check real-time available copies, racks, and penalty rates.
                  </p>
                </div>
                <div className="mt-4 flex items-center gap-1.5 text-xs font-semibold text-indigo-400 group-hover:translate-x-1 transition">
                  Browse Catalog <ChevronRight className="w-3.5 h-3.5" />
                </div>
              </Link>

              {/* Card 2: Check Seat Availability */}
              <Link
                href="/student/seats"
                className="glass-panel glass-panel-hover p-5 rounded-2xl border-white/[0.08] flex flex-col justify-between group"
              >
                <div>
                  <div className="w-12 h-12 rounded-2xl bg-purple-500/15 text-purple-400 flex items-center justify-center mb-4 group-hover:scale-110 transition">
                    <Armchair className="w-6 h-6" />
                  </div>
                  <h3 className="font-bold text-white text-base group-hover:text-purple-300 transition">
                    2. Check Seat Availability
                  </h3>
                  <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                    Explore live floor-wise reading halls and study carrel occupancy levels.
                  </p>
                </div>
                <div className="mt-4 flex items-center gap-1.5 text-xs font-semibold text-purple-400 group-hover:translate-x-1 transition">
                  View Seating Grid <ChevronRight className="w-3.5 h-3.5" />
                </div>
              </Link>

              {/* Card 3: Book a Study Room */}
              <Link
                href="/student/room-booking"
                className="glass-panel glass-panel-hover p-5 rounded-2xl border-white/[0.08] flex flex-col justify-between group"
              >
                <div>
                  <div className="w-12 h-12 rounded-2xl bg-emerald-500/15 text-emerald-400 flex items-center justify-center mb-4 group-hover:scale-110 transition">
                    <DoorOpen className="w-6 h-6" />
                  </div>
                  <h3 className="font-bold text-white text-base group-hover:text-emerald-300 transition">
                    3. Book a Study Room
                  </h3>
                  <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                    24 rooms across 4 floors (192 seats). Reserve your 1-hour study slot instantly.
                  </p>
                </div>
                <div className="mt-4 flex items-center gap-1.5 text-xs font-semibold text-emerald-400 group-hover:translate-x-1 transition">
                  Reserve a Seat <ChevronRight className="w-3.5 h-3.5" />
                </div>
              </Link>

              {/* Card 4: My Books */}
              <Link
                href="/student/my-books"
                className="glass-panel glass-panel-hover p-5 rounded-2xl border-white/[0.08] flex flex-col justify-between group"
              >
                <div>
                  <div className="w-12 h-12 rounded-2xl bg-orange-500/15 text-orange-400 flex items-center justify-center mb-4 group-hover:scale-110 transition">
                    <Library className="w-6 h-6" />
                  </div>
                  <h3 className="font-bold text-white text-base group-hover:text-orange-300 transition">
                    4. My Books
                  </h3>
                  <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                    Track your current loans, 14-day return deadlines, and overdue fees.
                  </p>
                </div>
                <div className="mt-4 flex items-center gap-1.5 text-xs font-semibold text-orange-400 group-hover:translate-x-1 transition">
                  Manage Loans <ChevronRight className="w-3.5 h-3.5" />
                </div>
              </Link>
            </div>
          </div>

          {/* TWO COLUMN CONTENT: LOANS & ROOMS ON LEFT, NOTIFICATIONS & OCCUPANCY ON RIGHT */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left 2 Cols: Loans and Active Bookings */}
            <div className="lg:col-span-2 space-y-6">
              {/* Upcoming Book Returns */}
              <div className="glass-panel p-6 rounded-3xl border-white/[0.08]">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-base font-bold text-white">Current Borrowed Books</h3>
                    <p className="text-xs text-slate-400">Standard borrowing allowance: 14 days</p>
                  </div>
                  <Link
                    href="/student/my-books"
                    className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1 font-semibold"
                  >
                    View all ({userBorrowings.length}) <ChevronRight className="w-3.5 h-3.5" />
                  </Link>
                </div>

                {userBorrowings.filter((b) => b.status !== 'returned').length === 0 ? (
                  <div className="py-8 text-center text-slate-400 text-xs">
                    You have no active borrowed books. Visit the <Link href="/student/books" className="text-indigo-400 underline">Book Catalog</Link> to discover titles.
                  </div>
                ) : (
                  <div className="space-y-3">
                    {userBorrowings
                      .filter((b) => b.status !== 'returned')
                      .slice(0, 3)
                      .map((rec) => (
                        <div
                          key={rec.id}
                          className="flex items-center justify-between p-3.5 rounded-2xl bg-white/[0.03] border border-white/[0.06] hover:border-white/10 transition"
                        >
                          <div className="flex items-center gap-3.5">
                            <img
                              src={rec.bookCoverImage}
                              alt={rec.bookTitle}
                              className="w-12 h-16 object-cover rounded-xl shadow-md"
                            />
                            <div>
                              <h4 className="font-semibold text-sm text-white line-clamp-1">{rec.bookTitle}</h4>
                              <p className="text-xs text-slate-400 mt-0.5">ISBN: {rec.bookIsbn}</p>
                              <div className="flex items-center gap-3 mt-1.5 text-[11px] text-slate-400">
                                <span>Issued: <strong className="text-slate-300">{rec.issueDate}</strong></span>
                                <span>&bull;</span>
                                <span>Due: <strong className={rec.status === 'overdue' ? 'text-rose-400 font-bold' : 'text-amber-300'}>{rec.dueDate}</strong></span>
                              </div>
                            </div>
                          </div>

                          <div className="text-right">
                            {rec.status === 'overdue' ? (
                              <div className="space-y-1">
                                <span className="inline-block px-2.5 py-1 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30 text-[11px] font-bold">
                                  Overdue ({rec.delayedDays}d)
                                </span>
                                <p className="text-xs font-semibold text-rose-400">
                                  Fee: ₹{rec.totalPenalty}
                                </p>
                              </div>
                            ) : (
                              <span className="inline-block px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[11px] font-bold">
                                Issued (Active)
                              </span>
                            )}
                          </div>
                        </div>
                      ))}
                  </div>
                )}
              </div>

              {/* Active Room Reservations */}
              <div className="glass-panel p-6 rounded-3xl border-white/[0.08]">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-base font-bold text-white">Active Room Reservations</h3>
                    <p className="text-xs text-slate-400">1-Hour automated session duration</p>
                  </div>
                  <Link
                    href="/student/room-booking"
                    className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1 font-semibold"
                  >
                    Manage Rooms <ChevronRight className="w-3.5 h-3.5" />
                  </Link>
                </div>

                {activeRoomBookings.length === 0 ? (
                  <div className="py-6 text-center text-slate-400 text-xs">
                    No active study room bookings. Need a distraction-free space?{' '}
                    <Link href="/student/room-booking" className="text-indigo-400 underline font-semibold">
                      Book a Room Seat
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {activeRoomBookings.map((b) => (
                      <div
                        key={b.id}
                        className="flex items-center justify-between p-3.5 rounded-2xl bg-indigo-950/20 border border-indigo-500/20"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-indigo-600/20 text-indigo-400 flex items-center justify-center font-bold text-sm">
                            {b.seatId}
                          </div>
                          <div>
                            <h4 className="font-semibold text-sm text-white">{b.roomId} &bull; {b.floor}</h4>
                            <p className="text-xs text-indigo-300 mt-0.5">
                              {b.date} &bull; {b.startTime} &ndash; {b.endTime} (1 Hour)
                            </p>
                          </div>
                        </div>
                        <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-semibold">
                          Confirmed
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Recently Added Books */}
              <div className="glass-panel p-6 rounded-3xl border-white/[0.08]">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-base font-bold text-white">New Arrivals in Central Library</h3>
                    <p className="text-xs text-slate-400">Latest additions to curriculum and research suites</p>
                  </div>
                  <Link
                    href="/student/books"
                    className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1 font-semibold"
                  >
                    View All Books <ChevronRight className="w-3.5 h-3.5" />
                  </Link>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {books.slice(0, 4).map((book) => (
                    <Link
                      key={book.id}
                      href={`/student/books?view=${book.id}`}
                      className="group p-2.5 rounded-2xl bg-white/[0.02] border border-white/[0.05] hover:border-indigo-500/30 hover:bg-white/[0.05] transition"
                    >
                      <div className="aspect-[3/4] w-full rounded-xl overflow-hidden mb-2 relative">
                        <img
                          src={book.coverImage}
                          alt={book.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                        />
                        <span className="absolute bottom-1 right-1 px-1.5 py-0.5 rounded text-[9px] font-bold bg-black/70 text-slate-200 backdrop-blur-xs">
                          {book.location.floor.split(' ')[0]}
                        </span>
                      </div>
                      <h4 className="font-semibold text-xs text-white line-clamp-1 group-hover:text-indigo-300 transition">
                        {book.title}
                      </h4>
                      <p className="text-[10px] text-slate-400 truncate mt-0.5">{book.author}</p>
                    </Link>
                  ))}
                </div>
              </div>
            </div>

            {/* Right 1 Col: Occupancy & Announcements */}
            <div className="space-y-6">
              {/* Live Library Occupancy Gauge */}
              <div className="glass-panel p-6 rounded-3xl border-white/[0.08]">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-emerald-400" />
                    Live Floor Occupancy
                  </h3>
                  <span className="text-[10px] font-semibold text-emerald-400 px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20">
                    Live
                  </span>
                </div>

                <div className="space-y-3.5 mt-4">
                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-slate-300 font-medium">Floor 2 (Core Computing)</span>
                      <span className="text-indigo-400 font-bold">78%</span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                      <div className="h-full bg-indigo-500 rounded-full" style={{ width: '78%' }} />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-slate-300 font-medium">Floor 3 (AI & Research)</span>
                      <span className="text-purple-400 font-bold">62%</span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                      <div className="h-full bg-purple-500 rounded-full" style={{ width: '62%' }} />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-slate-300 font-medium">Floor 4 (Mathematics & Physics)</span>
                      <span className="text-blue-400 font-bold">45%</span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                      <div className="h-full bg-blue-500 rounded-full" style={{ width: '45%' }} />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-slate-300 font-medium">Floor 5 (Engineering & General)</span>
                      <span className="text-emerald-400 font-bold">34%</span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                      <div className="h-full bg-emerald-500 rounded-full" style={{ width: '34%' }} />
                    </div>
                  </div>
                </div>

                <div className="mt-5 pt-4 border-t border-white/[0.08]">
                  <Link
                    href="/student/map"
                    className="w-full py-2.5 px-3 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-indigo-300 hover:text-white font-semibold text-xs flex items-center justify-center gap-2 transition"
                  >
                    <MapPin className="w-3.5 h-3.5" />
                    Open Interactive Floor Map
                  </Link>
                </div>
              </div>

              {/* Announcements Section */}
              <div className="glass-panel p-6 rounded-3xl border-white/[0.08]">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <Megaphone className="w-4 h-4 text-amber-400" />
                    Official Announcements
                  </h3>
                </div>

                <div className="space-y-3">
                  {announcements.slice(0, 3).map((item) => (
                    <div
                      key={item.id}
                      className="p-3 rounded-2xl bg-white/[0.02] border border-white/[0.05] space-y-1"
                    >
                      <div className="flex items-center justify-between">
                        <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                          item.priority === 'urgent'
                            ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                            : 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30'
                        }`}>
                          {item.category}
                        </span>
                        <span className="text-[10px] text-slate-500">{item.date}</span>
                      </div>
                      <h4 className="text-xs font-bold text-slate-200">{item.title}</h4>
                      <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed">
                        {item.content}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </LayoutWrapper>
    </RoleGuard>
  );
}
