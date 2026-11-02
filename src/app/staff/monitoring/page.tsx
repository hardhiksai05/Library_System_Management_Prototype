'use client';

import React, { useState } from 'react';
import { useLibrary } from '@/context/LibraryContext';
import { RoleGuard } from '@/components/common/RoleGuard';
import { LayoutWrapper } from '@/components/common/LayoutWrapper';
import {
  Armchair,
  DoorOpen,
  Layers,
  Clock,
  CheckCircle2,
  AlertCircle,
  Users,
} from 'lucide-react';

export default function SeatAndRoomMonitoringPage() {
  const { roomBookings, isSeatBookedAtTime, simulatedDate } = useLibrary();
  const [selectedFloor, setSelectedFloor] = useState<string>('2nd Floor');

  const floors = ['2nd Floor', '3rd Floor', '4th Floor', '5th Floor'];
  const rooms = ['Room 1', 'Room 2', 'Room 3', 'Room 4', 'Room 5', 'Room 6'];
  const seats = ['S1', 'S2', 'S3', 'S4', 'S5', 'S6', 'S7', 'S8'];

  const floorBookings = roomBookings.filter(
    (b) => b.floor === selectedFloor && b.status === 'confirmed'
  );

  return (
    <RoleGuard allowedRoles={['staff', 'admin']}>
      <LayoutWrapper>
        <div className="space-y-6 animate-in fade-in duration-300">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-2">
              <Armchair className="w-7 h-7 text-purple-400" />
              Room & Seating Telemetry Monitor
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Live status across all 24 discussion rooms (192 seats) and open reading zones.
            </p>
          </div>

          {/* Floor switcher */}
          <div className="flex gap-2 border-b border-white/[0.08] pb-3 overflow-x-auto">
            {floors.map((fl) => (
              <button
                key={fl}
                onClick={() => setSelectedFloor(fl)}
                className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition ${
                  selectedFloor === fl
                    ? 'bg-purple-600 text-white shadow-neon-purple'
                    : 'bg-white/[0.04] text-slate-400 hover:text-white'
                }`}
              >
                {fl}
              </button>
            ))}
          </div>

          {/* 6 Rooms on this floor */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {rooms.map((rm) => {
              const activeInRoom = floorBookings.filter((b) => b.roomId === rm);
              return (
                <div key={rm} className="glass-panel p-5 rounded-3xl border-white/[0.08]">
                  <div className="flex items-center justify-between mb-3 pb-2 border-b border-white/[0.08]">
                    <div className="flex items-center gap-2">
                      <DoorOpen className="w-4 h-4 text-emerald-400" />
                      <h3 className="font-bold text-sm text-white">{rm}</h3>
                    </div>
                    <span className="text-[11px] font-bold text-indigo-300">
                      {activeInRoom.length}/8 Seats Occupied
                    </span>
                  </div>

                  {/* 8 Seats grid */}
                  <div className="grid grid-cols-4 gap-2 mb-3">
                    {seats.map((seatId) => {
                      const booking = activeInRoom.find((b) => b.seatId === seatId);
                      const isOccupied = !!booking;

                      return (
                        <div
                          key={seatId}
                          title={isOccupied ? `Reserved by ${booking.userName} (${booking.startTime} - ${booking.endTime})` : 'Available'}
                          className={`p-2 rounded-xl text-center text-xs font-bold border transition ${
                            isOccupied
                              ? 'bg-rose-950/40 text-rose-300 border-rose-500/40'
                              : 'bg-emerald-950/30 text-emerald-300 border-emerald-500/30'
                          }`}
                        >
                          <span className="block text-[10px]">{seatId}</span>
                          <span className="text-[8px] font-semibold block uppercase">
                            {isOccupied ? 'Booked' : 'Open'}
                          </span>
                        </div>
                      );
                    })}
                  </div>

                  {activeInRoom.length > 0 && (
                    <div className="pt-2 border-t border-white/[0.06] text-[11px] text-slate-400 space-y-1">
                      {activeInRoom.slice(0, 2).map((b) => (
                        <p key={b.id} className="truncate">
                          Seat {b.seatId}: <strong className="text-white">{b.userName}</strong> ({b.startTime})
                        </p>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </LayoutWrapper>
    </RoleGuard>
  );
}
