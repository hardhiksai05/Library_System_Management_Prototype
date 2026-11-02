'use client';

import React from 'react';
import { useLibrary } from '@/context/LibraryContext';
import { RoleGuard } from '@/components/common/RoleGuard';
import { LayoutWrapper } from '@/components/common/LayoutWrapper';
import {
  DoorOpen,
  Armchair,
  Clock,
  Sparkles,
  Info,
  ShieldCheck,
} from 'lucide-react';

export default function AdminRoomManagementPage() {
  const { roomBookings } = useLibrary();

  const floors = ['2nd Floor', '3rd Floor', '4th Floor', '5th Floor'];
  const rooms = ['Room 1', 'Room 2', 'Room 3', 'Room 4', 'Room 5', 'Room 6'];

  return (
    <RoleGuard allowedRoles={['admin']}>
      <LayoutWrapper>
        <div className="space-y-6 animate-in fade-in duration-300">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-2">
              <DoorOpen className="w-7 h-7 text-emerald-400" />
              Collaborative Study Room & Seating Configuration
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Architectural setup: 4 Floors &times; 6 Rooms = 24 Rooms &bull; 24 Rooms &times; 8 Seats = 192 Seats Total.
            </p>
          </div>

          {/* Mathematical verification card */}
          <div className="p-6 rounded-3xl glass-panel border-emerald-500/30 bg-emerald-950/20 text-xs">
            <h3 className="font-bold text-white text-sm mb-2 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              Verified Architectural Specification
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-2">
              <div className="p-3 rounded-2xl bg-slate-900/80 border border-white/10">
                <span className="text-[10px] text-slate-400 uppercase font-semibold">Active Floors</span>
                <p className="text-2xl font-black text-white mt-1">4 Floors</p>
                <p className="text-[10px] text-slate-400">Floors 2, 3, 4, 5</p>
              </div>
              <div className="p-3 rounded-2xl bg-slate-900/80 border border-white/10">
                <span className="text-[10px] text-slate-400 uppercase font-semibold">Rooms per Floor</span>
                <p className="text-2xl font-black text-indigo-400 mt-1">6 Rooms</p>
                <p className="text-[10px] text-slate-400">Rooms 1 to 6</p>
              </div>
              <div className="p-3 rounded-2xl bg-slate-900/80 border border-white/10">
                <span className="text-[10px] text-slate-400 uppercase font-semibold">Seats per Room</span>
                <p className="text-2xl font-black text-purple-400 mt-1">8 Seats</p>
                <p className="text-[10px] text-slate-400">Labeled S1 to S8</p>
              </div>
              <div className="p-3 rounded-2xl bg-slate-900/80 border border-white/10">
                <span className="text-[10px] text-slate-400 uppercase font-semibold">Total Capacity</span>
                <p className="text-2xl font-black text-emerald-400 mt-1">192 Seats</p>
                <p className="text-[10px] text-emerald-300">24 &times; 8 = 192</p>
              </div>
            </div>
          </div>

          {/* 4 Floor Breakdown */}
          <div className="space-y-6">
            {floors.map((fl) => (
              <div key={fl} className="glass-panel p-6 rounded-3xl border-white/[0.08]">
                <div className="flex items-center justify-between mb-4 pb-2 border-b border-white/[0.08]">
                  <h3 className="font-bold text-sm text-white flex items-center gap-2">
                    <DoorOpen className="w-4 h-4 text-indigo-400" />
                    {fl} Discussion Suite (6 Rooms &bull; 48 Seats)
                  </h3>
                  <span className="text-xs text-indigo-300 font-semibold">Auto-Release 60 Min</span>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
                  {rooms.map((rm) => (
                    <div
                      key={rm}
                      className="p-3.5 rounded-2xl bg-white/[0.02] border border-white/[0.05] text-center"
                    >
                      <span className="font-bold text-xs text-white block">{rm}</span>
                      <span className="text-[10px] text-emerald-400 block mt-0.5">8 Seats (S1-S8)</span>
                      <span className="text-[9px] text-slate-400 block mt-1">Equipped with 4K Screen</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </LayoutWrapper>
    </RoleGuard>
  );
}
