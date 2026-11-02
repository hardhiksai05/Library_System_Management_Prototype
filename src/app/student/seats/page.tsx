'use client';

import React, { useState } from 'react';
import { useLibrary } from '@/context/LibraryContext';
import { RoleGuard } from '@/components/common/RoleGuard';
import { LayoutWrapper } from '@/components/common/LayoutWrapper';
import {
  Armchair,
  Layers,
  Sparkles,
  Wifi,
  Zap,
  Monitor,
  Users,
  CheckCircle,
  Clock,
  TrendingUp,
} from 'lucide-react';

export default function GeneralSeatAvailabilityPage() {
  const [selectedFloor, setSelectedFloor] = useState<string>('2nd Floor');
  const [selectedZone, setSelectedZone] = useState<string>('All');

  const floorStats: Record<string, { total: number; occupied: number; name: string }> = {
    '2nd Floor': { total: 120, occupied: 82, name: 'Main Reading & Silent Study Hall' },
    '3rd Floor': { total: 100, occupied: 64, name: 'Digital Carrels & Collaborative Bay' },
    '4th Floor': { total: 90, occupied: 38, name: 'Graduate Research & Science Pavilion' },
    '5th Floor': { total: 80, occupied: 26, name: 'Tech Workstations & Archival Hall' },
  };

  const currentStats = floorStats[selectedFloor] || floorStats['2nd Floor'];
  const availableSeatsCount = currentStats.total - currentStats.occupied;
  const occupancyPercent = Math.round((currentStats.occupied / currentStats.total) * 100);

  // Generate 48 visual seat blocks for the selected floor
  const seatGrid = Array.from({ length: 48 }, (_, i) => {
    const seatNum = i + 1;
    // deterministically distribute based on floor and index
    const isOccupied = (i * 7 + (selectedFloor === '2nd Floor' ? 3 : 5)) % 10 < (occupancyPercent / 10);
    const hasPower = i % 2 === 0;
    const hasMonitor = i % 4 === 0;
    const zone = i < 16 ? 'Silent Study' : i < 32 ? 'Digital Carrels' : 'Discussion Pods';

    return {
      id: `G-${seatNum}`,
      label: `G${seatNum < 10 ? '0' + seatNum : seatNum}`,
      isOccupied,
      hasPower,
      hasMonitor,
      zone,
    };
  });

  const filteredSeats = seatGrid.filter((s) => selectedZone === 'All' || s.zone === selectedZone);

  return (
    <RoleGuard allowedRoles={['student', 'staff', 'admin']}>
      <LayoutWrapper>
        <div className="space-y-6 animate-in fade-in duration-300">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-2">
                <Armchair className="w-7 h-7 text-purple-400" />
                General Reading & Library Seating
              </h1>
              <p className="text-xs sm:text-sm text-slate-400 mt-1">
                Real-time open-hall seat occupancy monitoring across all 4 library levels (excluding dedicated study rooms).
              </p>
            </div>

            <div className="flex items-center gap-2">
              <span className="px-3 py-1.5 rounded-xl glass-panel text-xs text-purple-300 border-purple-500/30 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                Live Sensor Telemetry
              </span>
            </div>
          </div>

          {/* Floor selection tabs */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            {Object.entries(floorStats).map(([fl, data]) => {
              const occ = Math.round((data.occupied / data.total) * 100);
              const isSelected = selectedFloor === fl;
              return (
                <button
                  key={fl}
                  onClick={() => setSelectedFloor(fl)}
                  className={`p-4 rounded-2xl border text-left transition ${
                    isSelected
                      ? 'border-purple-500 bg-purple-950/40 shadow-neon-purple/40 shadow-lg'
                      : 'border-white/[0.08] bg-slate-900/60 hover:bg-slate-900 hover:border-white/20'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className={`text-sm font-bold ${isSelected ? 'text-purple-300' : 'text-white'}`}>
                      {fl}
                    </span>
                    <span className={`text-xs font-bold ${occ > 75 ? 'text-rose-400' : 'text-emerald-400'}`}>
                      {occ}% Occupied
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 truncate">{data.name}</p>
                  <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden mt-3">
                    <div
                      className={`h-full rounded-full ${occ > 75 ? 'bg-rose-500' : 'bg-purple-500'}`}
                      style={{ width: `${occ}%` }}
                    />
                  </div>
                </button>
              );
            })}
          </div>

          {/* Floor Metric Highlights */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="glass-panel p-4 rounded-2xl border-white/[0.08]">
              <span className="text-xs text-slate-400">Total Hall Capacity</span>
              <p className="text-2xl font-black text-white mt-1">{currentStats.total} Seats</p>
            </div>
            <div className="glass-panel p-4 rounded-2xl border-white/[0.08]">
              <span className="text-xs text-slate-400">Currently Occupied</span>
              <p className="text-2xl font-black text-amber-400 mt-1">{currentStats.occupied} Seats</p>
            </div>
            <div className="glass-panel p-4 rounded-2xl border-white/[0.08]">
              <span className="text-xs text-slate-400">Vacant & Ready</span>
              <p className="text-2xl font-black text-emerald-400 mt-1">{availableSeatsCount} Seats</p>
            </div>
            <div className="glass-panel p-4 rounded-2xl border-white/[0.08]">
              <span className="text-xs text-slate-400">Current Occupancy Rate</span>
              <p className="text-2xl font-black text-purple-400 mt-1">{occupancyPercent}%</p>
            </div>
          </div>

          {/* Visual Seat Grid */}
          <div className="glass-panel p-6 sm:p-8 rounded-3xl border-white/[0.08]">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-white/[0.08]">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Armchair className="w-5 h-5 text-purple-400" />
                  Live Layout: {selectedFloor} &bull; {currentStats.name}
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Walk in directly and occupy any available seat. First come, first served.
                </p>
              </div>

              {/* Zone Filter */}
              <div className="flex items-center gap-2">
                {['All', 'Silent Study', 'Digital Carrels', 'Discussion Pods'].map((zone) => (
                  <button
                    key={zone}
                    onClick={() => setSelectedZone(zone)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
                      selectedZone === zone
                        ? 'bg-purple-600 text-white'
                        : 'bg-white/[0.04] text-slate-400 hover:text-white'
                    }`}
                  >
                    {zone}
                  </button>
                ))}
              </div>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-12 gap-2.5 sm:gap-3">
              {filteredSeats.map((seat) => (
                <div
                  key={seat.id}
                  className={`p-3 rounded-2xl border text-center transition flex flex-col items-center justify-center relative group ${
                    seat.isOccupied
                      ? 'bg-rose-950/20 border-rose-500/20 text-rose-400 opacity-60'
                      : 'bg-emerald-950/30 border-emerald-500/30 text-emerald-300 hover:scale-105 hover:bg-emerald-900/40 shadow-sm'
                  }`}
                >
                  <Armchair className="w-5 h-5 mb-1" />
                  <span className="text-[11px] font-bold">{seat.label}</span>

                  <div className="flex items-center gap-1 mt-1 text-[9px] text-slate-400">
                    {seat.hasPower && <span title="Power outlet available"><Zap className="w-2.5 h-2.5 text-amber-400" /></span>}
                    {seat.hasMonitor && <span title="Monitor equipped"><Monitor className="w-2.5 h-2.5 text-cyan-400" /></span>}
                  </div>

                  <span className={`text-[9px] font-bold mt-1 px-1.5 py-0.2 rounded ${
                    seat.isOccupied ? 'bg-rose-500/20 text-rose-300' : 'bg-emerald-500/20 text-emerald-300'
                  }`}>
                    {seat.isOccupied ? 'Taken' : 'Open'}
                  </span>
                </div>
              ))}
            </div>

            {/* Hall Amenities Footnote */}
            <div className="mt-8 pt-4 border-t border-white/[0.08] flex flex-wrap items-center justify-between text-xs text-slate-400 gap-3">
              <div className="flex items-center gap-4">
                <span className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-md bg-emerald-500/40 border border-emerald-400" />
                  Open Seat
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-md bg-rose-500/40 border border-rose-400" />
                  Occupied Seat
                </span>
                <span className="flex items-center gap-1 text-amber-400">
                  <Zap className="w-3.5 h-3.5" /> AC Power Plug
                </span>
                <span className="flex items-center gap-1 text-cyan-400">
                  <Monitor className="w-3.5 h-3.5" /> Dual Monitors
                </span>
              </div>
              <p className="text-[11px] text-slate-500">
                General reading seats are open to all active university ID cardholders.
              </p>
            </div>
          </div>
        </div>
      </LayoutWrapper>
    </RoleGuard>
  );
}
