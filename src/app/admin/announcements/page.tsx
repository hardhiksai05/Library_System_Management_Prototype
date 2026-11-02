'use client';

import React, { useState } from 'react';
import { useLibrary } from '@/context/LibraryContext';
import { RoleGuard } from '@/components/common/RoleGuard';
import { LayoutWrapper } from '@/components/common/LayoutWrapper';
import {
  Megaphone,
  Plus,
  Trash2,
  Calendar,
  AlertTriangle,
  Sparkles,
} from 'lucide-react';

export default function AdminAnnouncementsPage() {
  const { announcements, addAnnouncement, currentUser } = useLibrary();

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [priority, setPriority] = useState<'low' | 'normal' | 'urgent'>('normal');
  const [category, setCategory] = useState('Library Notice');
  const [isAdding, setIsAdding] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;

    addAnnouncement({
      title: title.trim(),
      content: content.trim(),
      priority,
      category,
      date: '2026-11-01',
      author: currentUser?.name || 'Chief Librarian',
    });

    setTitle('');
    setContent('');
    setIsAdding(false);
  };

  return (
    <RoleGuard allowedRoles={['admin']}>
      <LayoutWrapper>
        <div className="space-y-6 animate-in fade-in duration-300">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-2">
                <Megaphone className="w-7 h-7 text-pink-400" />
                Library Notice & Announcement Broadcast
              </h1>
              <p className="text-xs sm:text-sm text-slate-400 mt-1">
                Post official library hours, exam schedules, workshop invitations, and circulation policy updates.
              </p>
            </div>

            <button
              onClick={() => setIsAdding(!isAdding)}
              className="px-5 py-2.5 rounded-2xl bg-pink-600 hover:bg-pink-500 text-white font-bold text-xs shadow-md flex items-center gap-2 transition"
            >
              <Plus className="w-4 h-4" /> Create Notice
            </button>
          </div>

          {isAdding && (
            <div className="glass-panel p-6 rounded-3xl border-pink-500/30 animate-in fade-in">
              <h3 className="font-bold text-sm text-white mb-3">Compose University Announcement</h3>
              <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Notice Title</label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. End-Semester 24/7 Library Night Shifts"
                    className="w-full px-3.5 py-2 bg-slate-900 border border-white/10 rounded-xl text-white"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">Priority</label>
                    <select
                      value={priority}
                      onChange={(e) => setPriority(e.target.value as any)}
                      className="w-full px-3.5 py-2 bg-slate-900 border border-white/10 rounded-xl text-white"
                    >
                      <option value="normal">Normal Priority</option>
                      <option value="urgent">Urgent / Critical Notice</option>
                      <option value="low">Informational / Low</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">Category</label>
                    <input
                      type="text"
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      placeholder="e.g. Hours & Access, Workshop"
                      className="w-full px-3.5 py-2 bg-slate-900 border border-white/10 rounded-xl text-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Notice Content</label>
                  <textarea
                    rows={3}
                    required
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="Full announcement text to display on student and staff dashboards..."
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
                    className="px-5 py-2 rounded-xl bg-pink-600 hover:bg-pink-500 text-white font-bold"
                  >
                    Broadcast Announcement
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* List of active announcements */}
          <div className="space-y-4">
            {announcements.map((ann) => (
              <div
                key={ann.id}
                className="glass-panel p-6 rounded-3xl border-white/[0.08] flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div className="space-y-1.5 flex-1">
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                        ann.priority === 'urgent'
                          ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                          : 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30'
                      }`}
                    >
                      {ann.priority}
                    </span>
                    <span className="text-[11px] text-slate-400 font-medium">{ann.category}</span>
                    <span className="text-slate-600">&bull;</span>
                    <span className="text-[11px] text-slate-500">{ann.date}</span>
                  </div>
                  <h3 className="font-bold text-base text-white">{ann.title}</h3>
                  <p className="text-xs text-slate-300 leading-relaxed">{ann.content}</p>
                  <p className="text-[10px] text-slate-500 pt-1">Posted by: {ann.author}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </LayoutWrapper>
    </RoleGuard>
  );
}
