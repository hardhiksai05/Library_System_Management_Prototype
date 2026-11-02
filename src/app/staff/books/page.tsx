'use client';

import React, { useState } from 'react';
import { useLibrary } from '@/context/LibraryContext';
import { RoleGuard } from '@/components/common/RoleGuard';
import { LayoutWrapper } from '@/components/common/LayoutWrapper';
import {
  BookOpen,
  Search,
  MapPin,
  CheckCircle,
  Clock,
  Layers,
} from 'lucide-react';

export default function StaffBookInventoryPage() {
  const { books, calculatePenaltyRateForBook } = useLibrary();
  const [searchQuery, setSearchQuery] = useState('');

  const filtered = books.filter(
    (b) =>
      !searchQuery ||
      b.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.isbn.includes(searchQuery) ||
      b.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <RoleGuard allowedRoles={['staff', 'admin']}>
      <LayoutWrapper>
        <div className="space-y-6 animate-in fade-in duration-300">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-2">
                <BookOpen className="w-7 h-7 text-indigo-400" />
                Library Catalog & Stock Availability
              </h1>
              <p className="text-xs sm:text-sm text-slate-400 mt-1">
                Real-time shelf inventory, total vs issued copies, and individual penalty parameters.
              </p>
            </div>
          </div>

          <div className="glass-panel p-4 rounded-2xl border-white/[0.08] flex items-center gap-3">
            <Search className="w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search catalog by title, author, or ISBN..."
              className="w-full bg-transparent text-white text-xs sm:text-sm placeholder-slate-400 focus:outline-none"
            />
          </div>

          <div className="glass-panel rounded-3xl border-white/[0.08] overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-900/80 border-b border-white/[0.08] text-slate-400 uppercase text-[10px] tracking-wider font-semibold">
                  <tr>
                    <th className="px-6 py-4">Title & Details</th>
                    <th className="px-6 py-4">Category</th>
                    <th className="px-6 py-4">Location</th>
                    <th className="px-6 py-4">Total Copies</th>
                    <th className="px-6 py-4">Available</th>
                    <th className="px-6 py-4">Penalty Rate</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/[0.05]">
                  {filtered.map((b) => (
                    <tr key={b.id} className="hover:bg-white/[0.02] transition">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={b.coverImage}
                            alt={b.title}
                            className="w-9 h-12 object-cover rounded-lg shadow-sm"
                          />
                          <div>
                            <p className="font-bold text-white text-xs">{b.title}</p>
                            <p className="text-[10px] text-slate-400">{b.author} &bull; {b.isbn}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-slate-300">{b.category}</td>
                      <td className="px-6 py-4 text-slate-300">
                        {b.location.floor}, {b.location.rack}
                      </td>
                      <td className="px-6 py-4 text-slate-300 font-semibold">{b.totalCopies}</td>
                      <td className="px-6 py-4">
                        <span
                          className={`px-2 py-0.5 rounded-full font-bold text-[10px] ${
                            b.availableCopies > 0
                              ? 'bg-emerald-500/20 text-emerald-300'
                              : 'bg-rose-500/20 text-rose-300'
                          }`}
                        >
                          {b.availableCopies} available
                        </span>
                      </td>
                      <td className="px-6 py-4 text-amber-300 font-bold">
                        ₹{calculatePenaltyRateForBook(b)}/day
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </LayoutWrapper>
    </RoleGuard>
  );
}
