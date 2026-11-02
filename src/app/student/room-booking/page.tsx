'use client';

import React, { useState } from 'react';
import { useLibrary } from '@/context/LibraryContext';
import { RoleGuard } from '@/components/common/RoleGuard';
import { LayoutWrapper } from '@/components/common/LayoutWrapper';
import {
  DoorOpen,
  Armchair,
  Calendar,
  Clock,
  CheckCircle2,
  AlertCircle,
  X,
  Sparkles,
  Info,
  Layers,
  Trash2,
  FileCheck,
} from 'lucide-react';

export default function RoomBookingPage() {
  const {
    currentUser,
    roomBookings,
    bookRoomSeat,
    cancelRoomBooking,
    isSeatBookedAtTime,
    simulatedDate,
  } = useLibrary();

  const floors = ['2nd Floor', '3rd Floor', '4th Floor', '5th Floor'];
  const rooms = ['Room 1', 'Room 2', 'Room 3', 'Room 4', 'Room 5', 'Room 6'];
  const seats = ['S1', 'S2', 'S3', 'S4', 'S5', 'S6', 'S7', 'S8'];

  const timeSlots = [
    '09:00 AM',
    '10:00 AM',
    '11:00 AM',
    '12:00 PM',
    '01:00 PM',
    '02:00 PM',
    '03:00 PM',
    '04:00 PM',
    '05:00 PM',
    '06:00 PM',
    '07:00 PM',
  ];

  const [selectedFloor, setSelectedFloor] = useState<string>('2nd Floor');
  const [selectedRoom, setSelectedRoom] = useState<string>('Room 1');
  const [selectedDate, setSelectedDate] = useState<string>(simulatedDate);
  const [selectedStartTime, setSelectedStartTime] = useState<string>('10:00 AM');
  const [selectedSeat, setSelectedSeat] = useState<string | null>(null);

  const [bookingMessage, setBookingMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [confirmationReceipt, setConfirmationReceipt] = useState<any | null>(null);

  // Compute end time (exactly 1 hour after start)
  const getEndTime = (start: string) => {
    const [time, modifier] = start.split(' ');
    let [hours] = time.split(':').map(Number);
    let mod = modifier;

    hours += 1;
    if (hours === 12) {
      mod = mod === 'AM' ? 'PM' : 'AM';
    } else if (hours > 12) {
      hours = 1;
    }
    return `${hours}:00 ${mod}`;
  };

  const currentEndTime = getEndTime(selectedStartTime);

  // Filter student's active bookings
  const myBookings = roomBookings.filter((b) => b.userId === currentUser?.id);

  const handleSeatClick = (seatId: string) => {
    const isBooked = isSeatBookedAtTime(selectedFloor, selectedRoom, seatId, selectedDate, selectedStartTime);
    if (isBooked) {
      setBookingMessage({
        type: 'error',
        text: `Seat ${seatId} is already booked for ${selectedStartTime} – ${currentEndTime}. Please select an available green seat.`,
      });
      return;
    }
    setSelectedSeat(seatId);
    setBookingMessage(null);
  };

  const handleConfirmBooking = () => {
    if (!selectedSeat) {
      setBookingMessage({ type: 'error', text: 'Please select an available seat from the grid first.' });
      return;
    }

    const res = bookRoomSeat(selectedFloor, selectedRoom, selectedSeat, selectedDate, selectedStartTime);

    if (res.success && res.booking) {
      setConfirmationReceipt(res.booking);
      setBookingMessage({ type: 'success', text: res.message });
      setSelectedSeat(null);
    } else {
      setBookingMessage({ type: 'error', text: res.message });
    }
  };

  return (
    <RoleGuard allowedRoles={['student', 'staff', 'admin']}>
      <LayoutWrapper>
        <div className="space-y-6 animate-in fade-in duration-300">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-2">
                <DoorOpen className="w-7 h-7 text-emerald-400" />
                Collaborative Study Room & Seat Booking
              </h1>
              <p className="text-xs sm:text-sm text-slate-400 mt-1">
                4 Floors &bull; 24 Discussion Rooms &bull; 192 Individual Ergonomic Seats (Strictly 1-Hour Time Slots).
              </p>
            </div>

            <div className="flex items-center gap-2">
              <span className="px-3 py-1.5 rounded-xl glass-panel text-xs text-emerald-300 border-emerald-500/30 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5" />
                Auto-Release on Expiry
              </span>
            </div>
          </div>

          {/* Feedback messages */}
          {bookingMessage && (
            <div
              className={`p-4 rounded-2xl text-xs flex items-center justify-between border ${
                bookingMessage.type === 'success'
                  ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                  : 'bg-red-500/10 border-red-500/30 text-red-300'
              }`}
            >
              <div className="flex items-center gap-2">
                {bookingMessage.type === 'success' ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-red-400" />
                )}
                <span>{bookingMessage.text}</span>
              </div>
              <button onClick={() => setBookingMessage(null)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Configuration Selector: Floor, Room, Date, Time Slot */}
          <div className="glass-panel p-5 sm:p-6 rounded-3xl border-white/[0.08] grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Step 1: Select Floor */}
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                1. Select Floor
              </label>
              <select
                value={selectedFloor}
                onChange={(e) => {
                  setSelectedFloor(e.target.value);
                  setSelectedSeat(null);
                }}
                className="w-full px-3.5 py-2.5 bg-slate-900/80 border border-white/10 rounded-2xl text-white text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                {floors.map((f) => (
                  <option key={f} value={f}>
                    {f}
                  </option>
                ))}
              </select>
            </div>

            {/* Step 2: Select Room */}
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                2. Select Study Room
              </label>
              <select
                value={selectedRoom}
                onChange={(e) => {
                  setSelectedRoom(e.target.value);
                  setSelectedSeat(null);
                }}
                className="w-full px-3.5 py-2.5 bg-slate-900/80 border border-white/10 rounded-2xl text-white text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                {rooms.map((r) => (
                  <option key={r} value={r}>
                    {r} (8 Seats)
                  </option>
                ))}
              </select>
            </div>

            {/* Step 3: Date */}
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                3. Reservation Date
              </label>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => {
                  setSelectedDate(e.target.value);
                  setSelectedSeat(null);
                }}
                className="w-full px-3.5 py-2.5 bg-slate-900/80 border border-white/10 rounded-2xl text-white text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            {/* Step 4: Time Slot (1 Hour Rule) */}
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                4. Start Time (1-Hr Duration)
              </label>
              <select
                value={selectedStartTime}
                onChange={(e) => {
                  setSelectedStartTime(e.target.value);
                  setSelectedSeat(null);
                }}
                className="w-full px-3.5 py-2.5 bg-slate-900/80 border border-white/10 rounded-2xl text-white text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                {timeSlots.map((t) => (
                  <option key={t} value={t}>
                    {t} &ndash; {getEndTime(t)}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* SEAT SELECTION CANVAS & SUMMARY */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* 8-Seat Visual Grid */}
            <div className="lg:col-span-2 glass-panel p-6 sm:p-8 rounded-3xl border-white/[0.08]">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6 pb-4 border-b border-white/[0.08]">
                <div>
                  <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    <Armchair className="w-5 h-5 text-indigo-400" />
                    Seat Availability Layout: {selectedRoom} ({selectedFloor})
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Time Window: <strong className="text-indigo-300">{selectedStartTime} – {currentEndTime}</strong> on{' '}
                    <strong className="text-slate-200">{selectedDate}</strong>
                  </p>
                </div>

                {/* Legend */}
                <div className="flex items-center gap-3 text-[11px] text-slate-300">
                  <span className="flex items-center gap-1.5">
                    <span className="w-3 h-3 rounded-md bg-emerald-500" />
                    Green: Available
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="w-3 h-3 rounded-md bg-rose-500" />
                    Red: Booked
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="w-3 h-3 rounded-md bg-blue-500" />
                    Blue: Selected
                  </span>
                </div>
              </div>

              {/* Conference Room Visual Table & 8 Seats */}
              <div className="bg-[#090D18] p-8 rounded-2xl border border-white/10 flex flex-col items-center justify-center relative overflow-hidden shadow-inner">
                {/* Top Row: Seats S1, S2, S3, S4 */}
                <div className="grid grid-cols-4 gap-6 sm:gap-10 mb-6">
                  {['S1', 'S2', 'S3', 'S4'].map((seatId) => {
                    const isBooked = isSeatBookedAtTime(selectedFloor, selectedRoom, seatId, selectedDate, selectedStartTime);
                    const isSelected = selectedSeat === seatId;

                    return (
                      <button
                        key={seatId}
                        onClick={() => handleSeatClick(seatId)}
                        disabled={isBooked}
                        className={`w-14 h-14 sm:w-16 sm:h-16 rounded-2xl flex flex-col items-center justify-center font-bold text-sm transition-all shadow-md group ${
                          isBooked
                            ? 'bg-rose-950/40 text-rose-400 border border-rose-500/30 cursor-not-allowed opacity-80'
                            : isSelected
                            ? 'bg-blue-600 text-white border-2 border-white shadow-neon-blue scale-110'
                            : 'bg-emerald-950/40 text-emerald-300 border border-emerald-500/30 hover:bg-emerald-600 hover:text-white hover:scale-105'
                        }`}
                      >
                        <Armchair className="w-4 h-4 mb-0.5" />
                        <span>{seatId}</span>
                      </button>
                    );
                  })}
                </div>

                {/* Center Collaborative Table */}
                <div className="w-full max-w-md h-16 rounded-2xl bg-gradient-to-r from-slate-800 via-indigo-950 to-slate-800 border border-white/10 flex items-center justify-center shadow-xl mb-6">
                  <span className="text-xs font-semibold tracking-wider text-slate-400 uppercase flex items-center gap-2">
                    <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                    Interactive Conference Smart Display
                  </span>
                </div>

                {/* Bottom Row: Seats S5, S6, S7, S8 */}
                <div className="grid grid-cols-4 gap-6 sm:gap-10">
                  {['S5', 'S6', 'S7', 'S8'].map((seatId) => {
                    const isBooked = isSeatBookedAtTime(selectedFloor, selectedRoom, seatId, selectedDate, selectedStartTime);
                    const isSelected = selectedSeat === seatId;

                    return (
                      <button
                        key={seatId}
                        onClick={() => handleSeatClick(seatId)}
                        disabled={isBooked}
                        className={`w-14 h-14 sm:w-16 sm:h-16 rounded-2xl flex flex-col items-center justify-center font-bold text-sm transition-all shadow-md group ${
                          isBooked
                            ? 'bg-rose-950/40 text-rose-400 border border-rose-500/30 cursor-not-allowed opacity-80'
                            : isSelected
                            ? 'bg-blue-600 text-white border-2 border-white shadow-neon-blue scale-110'
                            : 'bg-emerald-950/40 text-emerald-300 border border-emerald-500/30 hover:bg-emerald-600 hover:text-white hover:scale-105'
                        }`}
                      >
                        <Armchair className="w-4 h-4 mb-0.5" />
                        <span>{seatId}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Selected seat confirm banner */}
              <div className="mt-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-slate-900/60 border border-white/[0.08]">
                <div>
                  <p className="text-xs text-slate-400">Current Selection:</p>
                  <p className="text-sm font-bold text-white">
                    {selectedSeat ? (
                      <span className="text-blue-400">Seat {selectedSeat} in {selectedRoom} ({selectedFloor})</span>
                    ) : (
                      <span className="text-slate-500 font-normal">None selected (Click a green seat above)</span>
                    )}
                  </p>
                </div>

                <button
                  onClick={handleConfirmBooking}
                  disabled={!selectedSeat}
                  className="px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs sm:text-sm shadow-lg disabled:opacity-40 transition"
                >
                  Confirm 1-Hour Reservation
                </button>
              </div>
            </div>

            {/* Right Column: User's Reservations & Expiry Overview */}
            <div className="space-y-6">
              {/* My Active Reservations */}
              <div className="glass-panel p-6 rounded-3xl border-white/[0.08]">
                <h3 className="text-sm font-bold text-white mb-3 flex items-center justify-between">
                  <span>My Room Reservations</span>
                  <span className="text-xs text-indigo-400 font-semibold">{myBookings.length} total</span>
                </h3>

                {myBookings.length === 0 ? (
                  <p className="text-xs text-slate-400 py-4 text-center">
                    You have no active or historical room reservations.
                  </p>
                ) : (
                  <div className="space-y-3 max-h-96 overflow-y-auto pr-1">
                    {myBookings.map((b) => (
                      <div
                        key={b.id}
                        className={`p-3.5 rounded-2xl border text-xs space-y-1.5 transition ${
                          b.status === 'confirmed'
                            ? 'bg-indigo-950/30 border-indigo-500/30'
                            : b.status === 'expired'
                            ? 'bg-slate-900/40 border-white/[0.05] opacity-60'
                            : 'bg-red-950/20 border-red-500/20 opacity-60'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-white">
                            {b.roomId} &bull; Seat {b.seatId}
                          </span>
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                              b.status === 'confirmed'
                                ? 'bg-emerald-500/20 text-emerald-300'
                                : b.status === 'expired'
                                ? 'bg-slate-700/50 text-slate-400'
                                : 'bg-red-500/20 text-red-300'
                            }`}
                          >
                            {b.status}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-300">{b.floor}</p>
                        <p className="text-[11px] text-indigo-300">
                          {b.date} &bull; {b.startTime} &ndash; {b.endTime}
                        </p>

                        {b.status === 'confirmed' && (
                          <div className="pt-2 flex justify-end">
                            <button
                              onClick={() => cancelRoomBooking(b.id)}
                              className="px-2.5 py-1 rounded-lg bg-red-500/15 hover:bg-red-500/25 text-red-300 text-[10px] font-semibold transition flex items-center gap-1"
                            >
                              <Trash2 className="w-3 h-3" /> Cancel Booking
                            </button>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Room Policies Box */}
              <div className="glass-panel p-5 rounded-3xl border-white/[0.08] space-y-2 text-xs text-slate-400">
                <h4 className="font-bold text-white flex items-center gap-1.5 text-xs">
                  <Info className="w-3.5 h-3.5 text-indigo-400" />
                  Room Booking Rules
                </h4>
                <ul className="list-disc pl-4 space-y-1 text-[11px]">
                  <li>Every reservation lasts exactly <strong>one hour</strong>.</li>
                  <li>Overlapping bookings on the same seat are strictly prohibited.</li>
                  <li>After 60 minutes, the seat automatically expires and is released back to the general pool.</li>
                </ul>
              </div>
            </div>
          </div>

          {/* OFFICIAL CONFIRMATION RECEIPT MODAL */}
          {confirmationReceipt && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
              <div className="glass-panel max-w-md w-full p-6 sm:p-8 rounded-3xl border-emerald-500/30 text-center relative shadow-2xl">
                <div className="w-16 h-16 rounded-2xl bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 flex items-center justify-center mx-auto mb-4">
                  <FileCheck className="w-8 h-8" />
                </div>

                <h3 className="text-xl font-extrabold text-white">Study Room Booking Confirmed!</h3>
                <p className="text-xs text-slate-400 mt-1 mb-6">
                  LPU Central Library Official Digital Reservation Slip
                </p>

                {/* Slip Details */}
                <div className="p-4 rounded-2xl bg-slate-900/80 border border-white/10 text-left text-xs space-y-2 mb-6">
                  <div className="flex justify-between border-b border-white/5 pb-1.5">
                    <span className="text-slate-400">Student Name:</span>
                    <strong className="text-white">{currentUser?.name || confirmationReceipt.userName}</strong>
                  </div>
                  <div className="flex justify-between border-b border-white/5 pb-1.5">
                    <span className="text-slate-400">Student ID:</span>
                    <strong className="text-indigo-300">{currentUser?.studentOrEmployeeId || 'LPU2024CS0192'}</strong>
                  </div>
                  <div className="flex justify-between border-b border-white/5 pb-1.5">
                    <span className="text-slate-400">Floor:</span>
                    <strong className="text-white">{confirmationReceipt.floor}</strong>
                  </div>
                  <div className="flex justify-between border-b border-white/5 pb-1.5">
                    <span className="text-slate-400">Room:</span>
                    <strong className="text-white">{confirmationReceipt.roomId}</strong>
                  </div>
                  <div className="flex justify-between border-b border-white/5 pb-1.5">
                    <span className="text-slate-400">Seat Number:</span>
                    <strong className="text-emerald-400 font-bold">{confirmationReceipt.seatId}</strong>
                  </div>
                  <div className="flex justify-between border-b border-white/5 pb-1.5">
                    <span className="text-slate-400">Date:</span>
                    <strong className="text-white">{confirmationReceipt.date}</strong>
                  </div>
                  <div className="flex justify-between border-b border-white/5 pb-1.5">
                    <span className="text-slate-400">Time Slot:</span>
                    <strong className="text-amber-300 font-bold">
                      {confirmationReceipt.startTime} &ndash; {confirmationReceipt.endTime}
                    </strong>
                  </div>
                  <div className="flex justify-between pt-0.5">
                    <span className="text-slate-400">Status:</span>
                    <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-bold text-[10px]">
                      CONFIRMED (1-Hour)
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => setConfirmationReceipt(null)}
                  className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs transition"
                >
                  Done
                </button>
              </div>
            </div>
          )}
        </div>
      </LayoutWrapper>
    </RoleGuard>
  );
}
