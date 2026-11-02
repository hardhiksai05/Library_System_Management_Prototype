'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { useLibrary } from '@/context/LibraryContext';
import { RoleGuard } from '@/components/common/RoleGuard';
import { LayoutWrapper } from '@/components/common/LayoutWrapper';
import {
  MapPin,
  Layers,
  Search,
  BookOpen,
  Info,
  Compass,
  Sparkles,
  Navigation,
  CheckCircle,
  HelpCircle,
  DoorOpen,
  Coffee,
  Wifi,
} from 'lucide-react';

function InteractiveLibraryMapContent() {
  const searchParams = useSearchParams();
  const bookIdParam = searchParams.get('bookId');
  const floorParam = searchParams.get('floor');

  const { books } = useLibrary();

  const [selectedFloor, setSelectedFloor] = useState<string>(floorParam || '2nd Floor');
  const [selectedBookId, setSelectedBookId] = useState<string>(bookIdParam || '');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeRackHover, setActiveRackHover] = useState<string | null>(null);

  // Selected book
  const selectedBook = books.find((b) => b.id === selectedBookId);

  // Sync floor if book was provided
  useEffect(() => {
    if (selectedBook) {
      setSelectedFloor(selectedBook.location.floor);
    }
  }, [selectedBook]);

  const floors = [
    { id: '2nd Floor', label: '2nd Floor', name: 'Core Computing & Data Engineering' },
    { id: '3rd Floor', label: '3rd Floor', name: 'Artificial Intelligence & Neural Research' },
    { id: '4th Floor', label: '4th Floor', name: 'Mathematical Sciences & Physical Research' },
    { id: '5th Floor', label: '5th Floor', name: 'Engineering, Mechatronics & General Archives' },
  ];

  // Racks layout for floor
  // Section A, B, C, D
  const racks = [
    { id: 'Rack R-01', section: 'Section A', label: 'R-01', row: 1, col: 1 },
    { id: 'Rack R-02', section: 'Section A', label: 'R-02', row: 1, col: 2 },
    { id: 'Rack R-03', section: 'Section A', label: 'R-03', row: 1, col: 3 },
    { id: 'Rack R-04', section: 'Section A', label: 'R-04', row: 1, col: 4 },
    { id: 'Rack R-05', section: 'Section B', label: 'R-05', row: 2, col: 1 },
    { id: 'Rack R-06', section: 'Section B', label: 'R-06', row: 2, col: 2 },
    { id: 'Rack R-07', section: 'Section B', label: 'R-07', row: 2, col: 3 },
    { id: 'Rack R-08', section: 'Section B', label: 'R-08', row: 2, col: 4 },
    { id: 'Rack R-09', section: 'Section C', label: 'R-09', row: 3, col: 1 },
    { id: 'Rack R-10', section: 'Section C', label: 'R-10', row: 3, col: 2 },
    { id: 'Rack R-11', section: 'Section D', label: 'R-11', row: 3, col: 3 },
    { id: 'Rack R-12', section: 'Section D', label: 'R-12', row: 3, col: 4 },
  ];

  const handleBookSelect = (book: typeof books[0]) => {
    setSelectedBookId(book.id);
    setSelectedFloor(book.location.floor);
  };

  const isRackTargeted = (rackId: string) => {
    if (!selectedBook) return false;
    return selectedBook.location.floor === selectedFloor && selectedBook.location.rack === rackId;
  };

  return (
    <RoleGuard allowedRoles={['student', 'staff', 'admin']}>
      <LayoutWrapper>
        <div className="space-y-6 animate-in fade-in duration-300">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-2">
                  <Compass className="w-7 h-7 text-indigo-400" />
                  Interactive Library Schematic Map
                </h1>
                <span className="px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-[10px] font-bold uppercase tracking-wider">
                  Prototype
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-400 mt-1">
                Pinpoint any volume across 4 floors, 4 sections, 12 racks, and 5 shelf tiers.
              </p>
            </div>

            {/* Prototype notice pill */}
            <div className="px-3 py-1.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs flex items-center gap-2">
              <Info className="w-4 h-4 flex-shrink-0" />
              <span>Prototype schematic layout for demonstration</span>
            </div>
          </div>

          {/* Floor Selection Tabs */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            {floors.map((f) => (
              <button
                key={f.id}
                onClick={() => setSelectedFloor(f.id)}
                className={`p-4 rounded-2xl border text-left transition relative overflow-hidden ${
                  selectedFloor === f.id
                    ? 'border-indigo-500 bg-indigo-950/40 shadow-neon-purple/30 shadow-lg'
                    : 'border-white/[0.08] bg-slate-900/60 hover:bg-slate-900 hover:border-white/20'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className={`text-sm font-bold ${selectedFloor === f.id ? 'text-indigo-300' : 'text-white'}`}>
                    {f.label}
                  </span>
                  {selectedFloor === f.id && (
                    <span className="w-2 h-2 rounded-full bg-indigo-400 shadow-neon-purple animate-ping" />
                  )}
                </div>
                <p className="text-xs text-slate-400 truncate">{f.name}</p>
              </button>
            ))}
          </div>

          {/* Main Map Canvas and Book Finder Drawer */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Interactive Visual Floor Map (2 cols) */}
            <div className="lg:col-span-2 glass-panel p-6 rounded-3xl border-white/[0.08] relative">
              <div className="flex items-center justify-between mb-4 pb-3 border-b border-white/[0.08]">
                <div className="flex items-center gap-2">
                  <Layers className="w-4 h-4 text-indigo-400" />
                  <span className="font-bold text-sm text-white">Floor Schematic: {selectedFloor}</span>
                </div>

                <div className="flex items-center gap-4 text-[11px] text-slate-400">
                  <span className="flex items-center gap-1.5">
                    <span className="w-3 h-3 rounded-md bg-indigo-600/50 border border-indigo-400" />
                    Book Racks
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="w-3 h-3 rounded-md bg-amber-500/50 border border-amber-400 animate-pulse" />
                    Targeted Rack
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="w-3 h-3 rounded-md bg-emerald-500/30 border border-emerald-400" />
                    Study Rooms
                  </span>
                </div>
              </div>

              {/* SCHEMATIC FLOOR CANVAS */}
              <div className="relative w-full aspect-[16/10] bg-[#0A0E1A] rounded-2xl border border-white/10 p-5 overflow-hidden shadow-inner flex flex-col justify-between">
                {/* Background grid lines for schematic look */}
                <div
                  className="absolute inset-0 opacity-15 pointer-events-none"
                  style={{
                    backgroundImage: 'radial-gradient(circle, #6366F1 1px, transparent 1px)',
                    backgroundSize: '24px 24px',
                  }}
                />

                {/* Top Section: Study Rooms & Facilities */}
                <div className="relative z-10 flex items-center justify-between gap-3">
                  {/* Left: Study Rooms 1-3 */}
                  <div className="flex items-center gap-2">
                    {['Room 1', 'Room 2', 'Room 3'].map((rm) => (
                      <div
                        key={rm}
                        className="px-3 py-2 rounded-xl bg-emerald-950/40 border border-emerald-500/30 text-emerald-300 text-[10px] font-semibold flex items-center gap-1.5"
                      >
                        <DoorOpen className="w-3 h-3" />
                        <span>{rm} (8 Seats)</span>
                      </div>
                    ))}
                  </div>

                  {/* Amenities */}
                  <div className="flex items-center gap-2 text-[10px] text-slate-400">
                    <span className="px-2.5 py-1 rounded-lg bg-slate-800/80 border border-white/10 flex items-center gap-1">
                      <Wifi className="w-3 h-3 text-cyan-400" /> Wi-Fi 6
                    </span>
                    <span className="px-2.5 py-1 rounded-lg bg-slate-800/80 border border-white/10 flex items-center gap-1">
                      <Coffee className="w-3 h-3 text-amber-400" /> Coffee Pod
                    </span>
                  </div>
                </div>

                {/* Center Section: 4 SECTIONS (A, B, C, D) WITH RACKS */}
                <div className="relative z-10 my-4 grid grid-cols-4 gap-3 h-48">
                  {['Section A', 'Section B', 'Section C', 'Section D'].map((sec) => {
                    const secRacks = racks.filter((r) => r.section === sec);
                    const isSecTargeted = selectedBook && selectedBook.location.section === sec && selectedBook.location.floor === selectedFloor;

                    return (
                      <div
                        key={sec}
                        className={`rounded-2xl p-3 border transition flex flex-col justify-between ${
                          isSecTargeted
                            ? 'bg-indigo-950/50 border-indigo-500 shadow-neon-purple/40 ring-1 ring-indigo-400'
                            : 'bg-slate-900/40 border-white/[0.06] hover:border-white/20'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                            {sec}
                          </span>
                          {isSecTargeted && (
                            <span className="text-[9px] font-bold text-amber-300 bg-amber-500/20 px-1.5 py-0.5 rounded">
                              MATCH
                            </span>
                          )}
                        </div>

                        {/* Racks in this section */}
                        <div className="grid grid-cols-2 gap-2 my-1">
                          {secRacks.map((rk) => {
                            const isTargeted = isRackTargeted(rk.id);
                            return (
                              <div
                                key={rk.id}
                                onMouseEnter={() => setActiveRackHover(rk.id)}
                                onMouseLeave={() => setActiveRackHover(null)}
                                className={`p-2 rounded-xl text-center text-xs font-bold transition duration-200 cursor-pointer relative ${
                                  isTargeted
                                    ? 'bg-amber-500 text-slate-950 shadow-neon-orange animate-bounce ring-2 ring-white font-extrabold'
                                    : 'bg-indigo-900/30 text-indigo-300 border border-indigo-500/20 hover:bg-indigo-600 hover:text-white'
                                }`}
                              >
                                {isTargeted && (
                                  <div className="absolute -top-7 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded bg-amber-400 text-slate-950 text-[10px] font-black shadow-lg whitespace-nowrap z-30">
                                    📍 HERE! {selectedBook?.location.shelf}
                                  </div>
                                )}
                                <span>{rk.label}</span>
                              </div>
                            );
                          })}
                        </div>

                        <span className="text-[9px] text-slate-500 text-center">Standard Shelves</span>
                      </div>
                    );
                  })}
                </div>

                {/* Bottom Section: Circulation Desk, Study Pods 4-6 & Emergency Exit */}
                <div className="relative z-10 flex items-center justify-between gap-3">
                  {/* Study Rooms 4-6 */}
                  <div className="flex items-center gap-2">
                    {['Room 4', 'Room 5', 'Room 6'].map((rm) => (
                      <div
                        key={rm}
                        className="px-3 py-2 rounded-xl bg-emerald-950/40 border border-emerald-500/30 text-emerald-300 text-[10px] font-semibold flex items-center gap-1.5"
                      >
                        <DoorOpen className="w-3 h-3" />
                        <span>{rm} (8 Seats)</span>
                      </div>
                    ))}
                  </div>

                  {/* Circulation Desk */}
                  <div className="px-4 py-2 rounded-xl bg-purple-900/30 border border-purple-500/30 text-purple-300 text-[11px] font-bold flex items-center gap-2">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Floor Help Desk & Librarian Pod</span>
                  </div>
                </div>
              </div>

              {/* Target Location Banner */}
              {selectedBook && selectedBook.location.floor === selectedFloor && (
                <div className="mt-4 p-4 rounded-2xl bg-amber-950/30 border border-amber-500/40 flex items-center justify-between text-xs animate-in fade-in">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-300 flex items-center justify-center font-bold">
                      <MapPin className="w-5 h-5 text-amber-400 animate-pulse" />
                    </div>
                    <div>
                      <p className="font-bold text-white text-sm">{selectedBook.title}</p>
                      <p className="text-amber-300 text-xs mt-0.5">
                        Located at: <strong className="text-white">{selectedBook.location.section}</strong> &bull;{' '}
                        <strong className="text-white">{selectedBook.location.rack}</strong> &bull;{' '}
                        <strong className="text-white">{selectedBook.location.shelf}</strong> ({selectedBook.location.zoneName})
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setSelectedBookId('')}
                    className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold"
                  >
                    Clear Pin
                  </button>
                </div>
              )}
            </div>

            {/* Right Column: Search Book to Locate on Map */}
            <div className="space-y-4">
              <div className="glass-panel p-5 rounded-3xl border-white/[0.08]">
                <h3 className="font-bold text-sm text-white mb-2 flex items-center gap-2">
                  <Search className="w-4 h-4 text-indigo-400" />
                  Search & Pin Book Location
                </h3>
                <p className="text-xs text-slate-400 mb-3">
                  Select any book to highlight its exact floor, section, rack, and shelf.
                </p>

                <div className="relative mb-3">
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search by book name..."
                    className="w-full pl-9 pr-3 py-2 bg-slate-900/80 border border-white/10 rounded-xl text-white text-xs placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div className="max-h-96 overflow-y-auto space-y-2 pr-1">
                  {books
                    .filter(
                      (b) =>
                        !searchQuery ||
                        b.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        b.category.toLowerCase().includes(searchQuery.toLowerCase())
                    )
                    .map((b) => {
                      const isSelected = b.id === selectedBookId;
                      return (
                        <div
                          key={b.id}
                          onClick={() => handleBookSelect(b)}
                          className={`p-2.5 rounded-2xl border text-xs cursor-pointer transition flex items-center gap-3 ${
                            isSelected
                              ? 'border-indigo-500 bg-indigo-950/40 text-white font-semibold'
                              : 'border-white/[0.05] bg-white/[0.02] hover:bg-white/[0.06] text-slate-300'
                          }`}
                        >
                          <img
                            src={b.coverImage}
                            alt={b.title}
                            className="w-8 h-11 object-cover rounded-md flex-shrink-0"
                          />
                          <div className="flex-1 min-w-0">
                            <h4 className="font-medium text-xs truncate text-white">{b.title}</h4>
                            <p className="text-[10px] text-slate-400 truncate">{b.author}</p>
                            <p className="text-[10px] text-indigo-300 mt-0.5">
                              {b.location.floor} &bull; {b.location.rack}
                            </p>
                          </div>
                          {isSelected && <CheckCircle className="w-4 h-4 text-indigo-400 flex-shrink-0" />}
                        </div>
                      );
                    })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </LayoutWrapper>
    </RoleGuard>
  );
}

export default function InteractiveLibraryMapPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#070A13] flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin" />
      </div>
    }>
      <InteractiveLibraryMapContent />
    </Suspense>
  );
}
