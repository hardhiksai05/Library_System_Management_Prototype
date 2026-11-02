'use client';

import React, { useState } from 'react';
import { useLibrary } from '@/context/LibraryContext';
import { RoleGuard } from '@/components/common/RoleGuard';
import { LayoutWrapper } from '@/components/common/LayoutWrapper';
import {
  MapPin,
  Layers,
  Sparkles,
  Info,
  CheckCircle,
} from 'lucide-react';

export default function AdminFloorManagementPage() {
  const { books } = useLibrary();

  const floorConfigs = [
    {
      id: '2nd Floor',
      title: 'Level 2: Computing & Systems Wing',
      sections: ['Section A (Algorithms & Systems)', 'Section B (Networks & Graphics)', 'Section C (Software Craft)'],
      racksCount: 12,
      studyRooms: 6,
      readingSeats: 120,
    },
    {
      id: '3rd Floor',
      title: 'Level 3: Artificial Intelligence & Research Suite',
      sections: ['Section A (Foundations)', 'Section B (Deep Learning & NLP)', 'Section C (Robotics & Vision)'],
      racksCount: 12,
      studyRooms: 6,
      readingSeats: 100,
    },
    {
      id: '4th Floor',
      title: 'Level 4: Mathematical Sciences & Physical Research',
      sections: ['Section C (Pure & Discrete Math)', 'Section D (Applied Quantum & Classical Physics)'],
      racksCount: 12,
      studyRooms: 6,
      readingSeats: 90,
    },
    {
      id: '5th Floor',
      title: 'Level 5: Engineering & Universal Science Archives',
      sections: ['Section A (Electrical & Electronics)', 'Section B (Mechanical & Thermal)', 'Section D (Humanities)'],
      racksCount: 12,
      studyRooms: 6,
      readingSeats: 80,
    },
  ];

  return (
    <RoleGuard allowedRoles={['admin']}>
      <LayoutWrapper>
        <div className="space-y-6 animate-in fade-in duration-300">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-2">
              <MapPin className="w-7 h-7 text-amber-400" />
              Library Floors, Sections & Shelving Coordinates
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Configure library levels, physical stack sections (A-D), rack units (R1-R12), and shelf tiers (S1-S5).
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {floorConfigs.map((fl) => {
              const bookCount = books.filter((b) => b.location.floor === fl.id).length;
              return (
                <div key={fl.id} className="glass-panel p-6 rounded-3xl border-white/[0.08] space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-white/[0.08]">
                    <div className="flex items-center gap-2">
                      <span className="w-8 h-8 rounded-xl bg-amber-500/15 text-amber-400 flex items-center justify-center font-bold text-xs">
                        {fl.id.split(' ')[0]}
                      </span>
                      <div>
                        <h3 className="font-bold text-sm text-white">{fl.title}</h3>
                        <p className="text-[11px] text-slate-400">{fl.id}</p>
                      </div>
                    </div>
                    <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-bold">
                      Operational
                    </span>
                  </div>

                  <div className="grid grid-cols-3 gap-2 text-center text-xs">
                    <div className="p-2.5 rounded-xl bg-slate-900/60 border border-white/5">
                      <span className="text-[10px] text-slate-400 block">Catalog Titles</span>
                      <strong className="text-white text-sm">{bookCount}</strong>
                    </div>
                    <div className="p-2.5 rounded-xl bg-slate-900/60 border border-white/5">
                      <span className="text-[10px] text-slate-400 block">Rooms (8 seats)</span>
                      <strong className="text-indigo-400 text-sm">{fl.studyRooms}</strong>
                    </div>
                    <div className="p-2.5 rounded-xl bg-slate-900/60 border border-white/5">
                      <span className="text-[10px] text-slate-400 block">Open Seats</span>
                      <strong className="text-emerald-400 text-sm">{fl.readingSeats}</strong>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-xs font-semibold text-slate-300 mb-2">Sections Configured:</h4>
                    <ul className="space-y-1">
                      {fl.sections.map((sec) => (
                        <li key={sec} className="text-xs text-slate-400 flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-indigo-400" />
                          {sec}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </LayoutWrapper>
    </RoleGuard>
  );
}
