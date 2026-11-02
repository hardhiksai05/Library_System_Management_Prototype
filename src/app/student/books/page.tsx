'use client';

import React, { useState, useMemo, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useLibrary } from '@/context/LibraryContext';
import { RoleGuard } from '@/components/common/RoleGuard';
import { LayoutWrapper } from '@/components/common/LayoutWrapper';
import { Book } from '@/types';
import {
  Search,
  Filter,
  MapPin,
  BookOpen,
  Info,
  Calendar,
  Layers,
  Sparkles,
  CheckCircle,
  Clock,
  AlertTriangle,
  X,
  Bookmark,
  Share2,
  ChevronRight,
  ShieldAlert,
} from 'lucide-react';

function BookDiscoveryContent() {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get('q') || '';
  const initialViewId = searchParams.get('view') || null;

  const { books, calculatePenaltyRateForBook } = useLibrary();

  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedAvailability, setSelectedAvailability] = useState<string>('All');
  const [selectedFloor, setSelectedFloor] = useState<string>('All');
  const [activeBookModal, setActiveBookModal] = useState<Book | null>(
    initialViewId ? books.find((b) => b.id === initialViewId) || null : null
  );

  const categories = ['All', 'Computer Science', 'Artificial Intelligence', 'Mathematics', 'Physics', 'Engineering', 'General Knowledge'];
  const floors = ['All', '2nd Floor', '3rd Floor', '4th Floor', '5th Floor'];

  // Filtered books
  const filteredBooks = useMemo(() => {
    return books.filter((b) => {
      const q = searchQuery.toLowerCase().trim();
      const matchesQuery =
        !q ||
        b.title.toLowerCase().includes(q) ||
        b.author.toLowerCase().includes(q) ||
        b.isbn.toLowerCase().includes(q) ||
        b.category.toLowerCase().includes(q) ||
        b.tags?.some((t) => t.toLowerCase().includes(q));

      const matchesCategory = selectedCategory === 'All' || b.category === selectedCategory;
      const matchesFloor = selectedFloor === 'All' || b.location.floor === selectedFloor;

      let matchesAvail = true;
      if (selectedAvailability === 'Available') {
        matchesAvail = b.availableCopies > 0;
      } else if (selectedAvailability === 'Issued') {
        matchesAvail = b.availableCopies === 0;
      }

      return matchesQuery && matchesCategory && matchesFloor && matchesAvail;
    });
  }, [books, searchQuery, selectedCategory, selectedFloor, selectedAvailability]);

  const getStatusBadge = (b: Book) => {
    if (b.availableCopies > 0) {
      return (
        <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[11px] font-bold flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
          Available ({b.availableCopies}/{b.totalCopies})
        </span>
      );
    }
    return (
      <span className="px-2.5 py-1 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30 text-[11px] font-bold flex items-center gap-1">
        <span className="w-1.5 h-1.5 rounded-full bg-blue-400" />
        All Issued (0/{b.totalCopies})
      </span>
    );
  };

  return (
    <RoleGuard allowedRoles={['student', 'staff', 'admin']}>
      <LayoutWrapper>
        <div className="space-y-6 animate-in fade-in duration-300">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-2">
                <BookOpen className="w-7 h-7 text-indigo-400" />
                University Library Catalog
              </h1>
              <p className="text-xs sm:text-sm text-slate-400 mt-1">
                Explore curriculum texts, reference volumes, research papers, and location shelf finders.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="px-3 py-1.5 rounded-xl glass-panel text-xs text-slate-300 border-white/10">
                Total Catalog: <strong className="text-white font-bold">{books.length} Titles</strong>
              </span>
            </div>
          </div>

          {/* Search & Filter Bar */}
          <div className="glass-panel p-4 sm:p-5 rounded-3xl border-white/[0.08] space-y-4">
            <div className="flex flex-col sm:flex-row gap-3">
              {/* Search input */}
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by Title, Author, ISBN, or Tags..."
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-900/80 border border-white/10 rounded-2xl text-white text-xs sm:text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white text-xs"
                  >
                    Clear
                  </button>
                )}
              </div>

              {/* Availability Filter */}
              <select
                value={selectedAvailability}
                onChange={(e) => setSelectedAvailability(e.target.value)}
                className="px-3.5 py-2.5 bg-slate-900/80 border border-white/10 rounded-2xl text-xs sm:text-sm text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="All">All Availability</option>
                <option value="Available">Available Only (Green)</option>
                <option value="Issued">Issued Only (Blue)</option>
              </select>

              {/* Floor Filter */}
              <select
                value={selectedFloor}
                onChange={(e) => setSelectedFloor(e.target.value)}
                className="px-3.5 py-2.5 bg-slate-900/80 border border-white/10 rounded-2xl text-xs sm:text-sm text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                {floors.map((f) => (
                  <option key={f} value={f}>
                    {f === 'All' ? 'All Floors' : f}
                  </option>
                ))}
              </select>
            </div>

            {/* Category pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
              <span className="text-slate-500 font-semibold uppercase text-[10px] tracking-wider mr-1">
                Category:
              </span>
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1.5 rounded-xl font-medium whitespace-nowrap transition ${
                    selectedCategory === cat
                      ? 'bg-indigo-600 text-white shadow-neon-purple'
                      : 'bg-white/[0.04] text-slate-400 hover:text-white hover:bg-white/[0.08]'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Results Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {filteredBooks.map((book) => {
              const penaltyRate = calculatePenaltyRateForBook(book);
              return (
                <div
                  key={book.id}
                  onClick={() => setActiveBookModal(book)}
                  className="glass-panel glass-panel-hover p-4 rounded-3xl border-white/[0.08] flex flex-col justify-between cursor-pointer group"
                >
                  <div>
                    {/* Cover Image & Badges */}
                    <div className="aspect-[3/4] w-full rounded-2xl overflow-hidden relative mb-3 bg-slate-900 shadow-lg">
                      <img
                        src={book.coverImage}
                        alt={book.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                      />
                      <div className="absolute top-2 left-2">
                        <span className="px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider bg-black/70 text-indigo-300 backdrop-blur-md border border-white/10">
                          {book.category}
                        </span>
                      </div>
                      <div className="absolute top-2 right-2">
                        <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-black/70 text-amber-300 backdrop-blur-md border border-white/10">
                          ₹{penaltyRate}/day
                        </span>
                      </div>
                      <div className="absolute bottom-2 left-2 right-2">
                        <div className="px-2.5 py-1 rounded-xl bg-slate-950/80 backdrop-blur-md border border-white/10 text-[10px] text-slate-300 flex items-center justify-between">
                          <span className="flex items-center gap-1">
                            <MapPin className="w-3 h-3 text-indigo-400" />
                            {book.location.floor}
                          </span>
                          <span className="font-semibold text-slate-200">{book.location.rack}</span>
                        </div>
                      </div>
                    </div>

                    {/* Book Metadata */}
                    <h3 className="font-bold text-sm text-white line-clamp-1 group-hover:text-indigo-300 transition">
                      {book.title}
                    </h3>
                    <p className="text-xs text-slate-400 mt-0.5 line-clamp-1">{book.author}</p>
                    <p className="text-[10px] text-slate-500 mt-1 font-mono">ISBN: {book.isbn}</p>
                  </div>

                  {/* Footer status */}
                  <div className="mt-4 pt-3 border-t border-white/[0.06] flex items-center justify-between">
                    {getStatusBadge(book)}
                    <span className="text-xs text-indigo-400 font-semibold group-hover:translate-x-0.5 transition">
                      Details →
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {filteredBooks.length === 0 && (
            <div className="py-16 text-center glass-panel rounded-3xl border-white/[0.08]">
              <BookOpen className="w-12 h-12 text-slate-600 mx-auto mb-3" />
              <h3 className="text-base font-bold text-white">No books match your criteria</h3>
              <p className="text-xs text-slate-400 mt-1">Try clearing filters or search by a different author/subject.</p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('All');
                  setSelectedAvailability('All');
                  setSelectedFloor('All');
                }}
                className="mt-4 px-4 py-2 rounded-xl bg-indigo-600 text-white text-xs font-semibold"
              >
                Reset All Filters
              </button>
            </div>
          )}

          {/* BOOK DETAILS MODAL */}
          {activeBookModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-in fade-in">
              <div className="glass-panel w-full max-w-2xl rounded-3xl border-white/15 p-6 sm:p-8 max-h-[90vh] overflow-y-auto relative shadow-2xl">
                <button
                  onClick={() => setActiveBookModal(null)}
                  className="absolute top-5 right-5 p-2 rounded-full bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white transition"
                >
                  <X className="w-4 h-4" />
                </button>

                <div className="flex flex-col sm:flex-row gap-6">
                  {/* Cover */}
                  <div className="w-full sm:w-48 aspect-[3/4] flex-shrink-0 rounded-2xl overflow-hidden shadow-2xl relative bg-slate-900">
                    <img
                      src={activeBookModal.coverImage}
                      alt={activeBookModal.title}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Details info */}
                  <div className="flex-1 space-y-3">
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-[11px] font-semibold">
                      {activeBookModal.category}
                    </div>

                    <h2 className="text-xl sm:text-2xl font-extrabold text-white leading-tight">
                      {activeBookModal.title}
                    </h2>
                    <p className="text-xs sm:text-sm text-slate-300 font-medium">
                      By <span className="text-white font-semibold">{activeBookModal.author}</span>
                    </p>

                    <div className="grid grid-cols-2 gap-2 text-xs py-2 border-y border-white/[0.08]">
                      <div>
                        <span className="text-slate-500">Edition:</span>{' '}
                        <span className="text-slate-200 font-medium">{activeBookModal.edition}</span>
                      </div>
                      <div>
                        <span className="text-slate-500">Publisher:</span>{' '}
                        <span className="text-slate-200 font-medium">{activeBookModal.publisher} ({activeBookModal.publicationYear})</span>
                      </div>
                      <div>
                        <span className="text-slate-500">ISBN:</span>{' '}
                        <span className="text-slate-200 font-mono text-[11px]">{activeBookModal.isbn}</span>
                      </div>
                      <div>
                        <span className="text-slate-500">Book ID:</span>{' '}
                        <span className="text-indigo-300 font-mono text-[11px] font-bold">{activeBookModal.id}</span>
                      </div>
                    </div>

                    {/* Shelf Location Box */}
                    <div className="p-3.5 rounded-2xl bg-indigo-950/40 border border-indigo-500/30 space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-300 flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5" /> Physical Library Location
                        </span>
                        <span className="text-[11px] text-slate-400">{activeBookModal.location.zoneName}</span>
                      </div>
                      <div className="flex items-center gap-4 text-xs font-semibold text-white pt-1">
                        <span>Floor: <strong className="text-indigo-300">{activeBookModal.location.floor}</strong></span>
                        <span>Section: <strong className="text-indigo-300">{activeBookModal.location.section}</strong></span>
                        <span>Rack: <strong className="text-indigo-300">{activeBookModal.location.rack}</strong></span>
                        <span>Shelf: <strong className="text-indigo-300">{activeBookModal.location.shelf}</strong></span>
                      </div>
                    </div>

                    {/* Penalty Rate Box */}
                    <div className="p-3 rounded-xl bg-amber-950/30 border border-amber-500/20 text-xs text-amber-200 flex items-center justify-between">
                      <div>
                        <span className="font-bold">Applicable Penalty Rate:</span>{' '}
                        <span>₹{calculatePenaltyRateForBook(activeBookModal)} / day</span>
                        {activeBookModal.customPenaltyRate && (
                          <span className="ml-2 text-[10px] px-1.5 py-0.5 rounded bg-amber-500/20 font-semibold">
                            Book Override Active
                          </span>
                        )}
                      </div>
                      <span className="text-[11px] text-slate-400">14-day borrowing term</span>
                    </div>

                    <p className="text-xs text-slate-400 leading-relaxed pt-1">
                      {activeBookModal.description}
                    </p>

                    {/* Actions */}
                    <div className="pt-3 flex flex-wrap gap-3">
                      <Link
                        href={`/student/map?bookId=${activeBookModal.id}&floor=${encodeURIComponent(activeBookModal.location.floor)}&rack=${encodeURIComponent(activeBookModal.location.rack)}`}
                        className="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-semibold text-xs text-center shadow-neon-purple flex items-center justify-center gap-2 transition"
                      >
                        <MapPin className="w-4 h-4" />
                        View on Interactive Map
                      </Link>
                      <button
                        onClick={() => setActiveBookModal(null)}
                        className="py-3 px-5 rounded-xl bg-white/[0.06] hover:bg-white/[0.1] text-slate-300 font-semibold text-xs transition"
                      >
                        Close
                      </button>
                    </div>
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

export default function BookDiscoveryPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#070A13] flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin" />
      </div>
    }>
      <BookDiscoveryContent />
    </Suspense>
  );
}
