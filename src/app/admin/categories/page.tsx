'use client';

import React, { useState } from 'react';
import { useLibrary } from '@/context/LibraryContext';
import { RoleGuard } from '@/components/common/RoleGuard';
import { LayoutWrapper } from '@/components/common/LayoutWrapper';
import {
  Layers,
  Plus,
  Edit2,
  Trash2,
  CheckCircle2,
  BookOpen,
} from 'lucide-react';

export default function AdminCategoriesPage() {
  const { penaltySettings, updateCategoryPenaltyRate, books } = useLibrary();

  const [categories, setCategories] = useState([
    { name: 'Computer Science', description: 'Data structures, algorithms, system architecture, operating systems', floor: '2nd Floor' },
    { name: 'Artificial Intelligence', description: 'Machine learning, robotics, NLP, neural networks, deep learning', floor: '3rd Floor' },
    { name: 'Mathematics', description: 'Calculus, discrete mathematics, linear algebra, statistics', floor: '4th Floor' },
    { name: 'Physics', description: 'Electrodynamics, quantum mechanics, classical physics, relativity', floor: '4th Floor' },
    { name: 'Engineering', description: 'Control systems, statics, mechanics, signal processing, thermodynamics', floor: '5th Floor' },
    { name: 'General Knowledge', description: 'Cosmology, history, behavioral psychology, universal sciences', floor: '5th Floor' },
  ]);

  const [newCatName, setNewCatName] = useState('');
  const [newCatDesc, setNewCatDesc] = useState('');
  const [newCatRate, setNewCatRate] = useState<number>(6);
  const [isAdding, setIsAdding] = useState(false);

  const handleAddCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCatName.trim()) return;

    setCategories([
      ...categories,
      { name: newCatName.trim(), description: newCatDesc.trim() || 'Academic library discipline', floor: '2nd Floor' },
    ]);
    updateCategoryPenaltyRate(newCatName.trim(), Number(newCatRate));

    setNewCatName('');
    setNewCatDesc('');
    setIsAdding(false);
  };

  return (
    <RoleGuard allowedRoles={['admin']}>
      <LayoutWrapper>
        <div className="space-y-6 animate-in fade-in duration-300">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-2">
                <Layers className="w-7 h-7 text-cyan-400" />
                Category & Classification Management
              </h1>
              <p className="text-xs sm:text-sm text-slate-400 mt-1">
                Configure academic subjects, associated floor sections, and category-level penalty rates.
              </p>
            </div>

            <button
              onClick={() => setIsAdding(!isAdding)}
              className="px-5 py-2.5 rounded-2xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs shadow-md flex items-center gap-2 transition"
            >
              <Plus className="w-4 h-4" /> Add Category
            </button>
          </div>

          {/* Add Category Form */}
          {isAdding && (
            <div className="glass-panel p-6 rounded-3xl border-cyan-500/30 animate-in fade-in">
              <h3 className="font-bold text-sm text-white mb-3">Add New Subject Classification</h3>
              <form onSubmit={handleAddCategory} className="space-y-4 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">Category Title</label>
                    <input
                      type="text"
                      required
                      value={newCatName}
                      onChange={(e) => setNewCatName(e.target.value)}
                      placeholder="e.g. Biomedical Engineering"
                      className="w-full px-3.5 py-2 bg-slate-900 border border-white/10 rounded-xl text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">Default Penalty Rate (₹/d)</label>
                    <input
                      type="number"
                      min="1"
                      value={newCatRate}
                      onChange={(e) => setNewCatRate(Number(e.target.value))}
                      className="w-full px-3.5 py-2 bg-slate-900 border border-white/10 rounded-xl text-white font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">Primary Floor</label>
                    <select className="w-full px-3.5 py-2 bg-slate-900 border border-white/10 rounded-xl text-white">
                      <option>2nd Floor</option>
                      <option>3rd Floor</option>
                      <option>4th Floor</option>
                      <option>5th Floor</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Description</label>
                  <input
                    type="text"
                    value={newCatDesc}
                    onChange={(e) => setNewCatDesc(e.target.value)}
                    placeholder="Brief description of catalog subject matter"
                    className="w-full px-3.5 py-2 bg-slate-900 border border-white/10 rounded-xl text-white"
                  />
                </div>

                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setIsAdding(false)}
                    className="px-4 py-2 rounded-xl bg-white/[0.08] text-slate-300"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold"
                  >
                    Create Category
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Categories Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {categories.map((cat) => {
              const bookCount = books.filter((b) => b.category === cat.name).length;
              const rate = penaltySettings.categoryRates[cat.name] || penaltySettings.defaultDailyRate;

              return (
                <div key={cat.name} className="glass-panel p-6 rounded-3xl border-white/[0.08] flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                        {cat.floor}
                      </span>
                      <span className="text-xs font-bold text-amber-300">
                        ₹{rate}/day late fee
                      </span>
                    </div>

                    <h3 className="text-base font-bold text-white mt-1">{cat.name}</h3>
                    <p className="text-xs text-slate-400 mt-1 leading-relaxed">{cat.description}</p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-white/[0.06] flex items-center justify-between text-xs text-slate-400">
                    <span className="flex items-center gap-1.5">
                      <BookOpen className="w-3.5 h-3.5 text-slate-500" />
                      {bookCount} Titles in Catalog
                    </span>
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
