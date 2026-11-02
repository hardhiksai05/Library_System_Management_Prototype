'use client';

import React, { useState } from 'react';
import { useLibrary } from '@/context/LibraryContext';
import { RoleGuard } from '@/components/common/RoleGuard';
import { LayoutWrapper } from '@/components/common/LayoutWrapper';
import { Book } from '@/types';
import {
  BookOpen,
  Plus,
  Search,
  Edit2,
  Trash2,
  CheckCircle2,
  X,
  MapPin,
  Sparkles,
} from 'lucide-react';

export default function AdminBookManagementPage() {
  const { books, addBook, updateBook, deleteBook, calculatePenaltyRateForBook } = useLibrary();

  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBook, setEditingBook] = useState<Book | null>(null);

  const [formData, setFormData] = useState({
    title: '',
    author: '',
    isbn: '',
    category: 'Computer Science',
    edition: '1st Edition',
    description: '',
    publisher: 'University Academic Press',
    publicationYear: 2024,
    totalCopies: 10,
    availableCopies: 10,
    coverImage: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80',
    floor: '2nd Floor',
    section: 'Section A',
    rack: 'Rack R-01',
    shelf: 'Shelf S-1',
    zoneName: 'Central Stacks',
    customPenaltyRate: '',
  });

  const handleOpenAddModal = () => {
    setEditingBook(null);
    setFormData({
      title: '',
      author: '',
      isbn: `978-0${Math.floor(100000000 + Math.random() * 900000000)}`,
      category: 'Computer Science',
      edition: '1st Edition',
      description: 'Standard textbook in the university library repository.',
      publisher: 'University Academic Press',
      publicationYear: 2024,
      totalCopies: 10,
      availableCopies: 10,
      coverImage: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80',
      floor: '2nd Floor',
      section: 'Section A',
      rack: 'Rack R-01',
      shelf: 'Shelf S-1',
      zoneName: 'Central Stacks',
      customPenaltyRate: '',
    });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (book: Book) => {
    setEditingBook(book);
    setFormData({
      title: book.title,
      author: book.author,
      isbn: book.isbn,
      category: book.category,
      edition: book.edition,
      description: book.description,
      publisher: book.publisher,
      publicationYear: book.publicationYear,
      totalCopies: book.totalCopies,
      availableCopies: book.availableCopies,
      coverImage: book.coverImage,
      floor: book.location.floor,
      section: book.location.section,
      rack: book.location.rack,
      shelf: book.location.shelf,
      zoneName: book.location.zoneName || 'Central Stacks',
      customPenaltyRate: book.customPenaltyRate !== null && book.customPenaltyRate !== undefined ? String(book.customPenaltyRate) : '',
    });
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const bookPayload = {
      title: formData.title,
      author: formData.author,
      isbn: formData.isbn,
      category: formData.category,
      edition: formData.edition,
      description: formData.description,
      publisher: formData.publisher,
      publicationYear: Number(formData.publicationYear),
      totalCopies: Number(formData.totalCopies),
      availableCopies: Number(formData.availableCopies),
      coverImage: formData.coverImage,
      location: {
        floor: formData.floor,
        section: formData.section,
        rack: formData.rack,
        shelf: formData.shelf,
        zoneName: formData.zoneName,
      },
      customPenaltyRate: formData.customPenaltyRate ? Number(formData.customPenaltyRate) : null,
    };

    if (editingBook) {
      updateBook({ ...bookPayload, id: editingBook.id });
    } else {
      addBook(bookPayload);
    }

    setIsModalOpen(false);
  };

  const handleDelete = (id: string, title: string) => {
    if (confirm(`Are you sure you want to delete "${title}"?`)) {
      deleteBook(id);
    }
  };

  const filtered = books.filter(
    (b) =>
      !searchQuery ||
      b.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.isbn.includes(searchQuery)
  );

  return (
    <RoleGuard allowedRoles={['admin']}>
      <LayoutWrapper>
        <div className="space-y-6 animate-in fade-in duration-300">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-2">
                <BookOpen className="w-7 h-7 text-purple-400" />
                Book Inventory & Catalog Management
              </h1>
              <p className="text-xs sm:text-sm text-slate-400 mt-1">
                Add, modify, and delete curriculum volumes, configure physical shelf coordinates, and manage copy counts.
              </p>
            </div>

            <button
              onClick={handleOpenAddModal}
              className="px-5 py-2.5 rounded-2xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs shadow-neon-purple flex items-center gap-2 transition"
            >
              <Plus className="w-4 h-4" /> Add New Book
            </button>
          </div>

          {/* Search bar */}
          <div className="glass-panel p-4 rounded-2xl border-white/[0.08] flex items-center gap-3">
            <Search className="w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search books by title, author, category, or ISBN..."
              className="w-full bg-transparent text-white text-xs sm:text-sm placeholder-slate-400 focus:outline-none"
            />
          </div>

          {/* Table */}
          <div className="glass-panel rounded-3xl border-white/[0.08] overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-900/80 border-b border-white/[0.08] text-slate-400 uppercase text-[10px] tracking-wider font-semibold">
                  <tr>
                    <th className="px-6 py-4">Title & Details</th>
                    <th className="px-6 py-4">Category</th>
                    <th className="px-6 py-4">Floor & Rack</th>
                    <th className="px-6 py-4">Total / Available</th>
                    <th className="px-6 py-4">Penalty Rate</th>
                    <th className="px-6 py-4 text-right">Actions</th>
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
                            className="w-10 h-14 object-cover rounded-xl shadow-sm flex-shrink-0"
                          />
                          <div>
                            <p className="font-bold text-white text-xs">{b.title}</p>
                            <p className="text-[10px] text-slate-400">{b.author} &bull; {b.edition}</p>
                            <p className="text-[10px] text-slate-500 font-mono">ISBN: {b.isbn} ({b.id})</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-slate-300 font-medium">{b.category}</td>
                      <td className="px-6 py-4 text-slate-300">
                        {b.location.floor} &bull; {b.location.rack}
                      </td>
                      <td className="px-6 py-4">
                        <span className="font-bold text-white">{b.availableCopies}</span>
                        <span className="text-slate-400"> / {b.totalCopies} copies</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-amber-300 font-bold">
                          ₹{calculatePenaltyRateForBook(b)}/d
                        </span>
                        {b.customPenaltyRate && (
                          <span className="block text-[9px] text-purple-300">Custom override</span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleOpenEditModal(b)}
                            className="p-2 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] text-indigo-300 transition"
                            title="Edit Book Details"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDelete(b.id, b.title)}
                            className="p-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 transition"
                            title="Delete Book"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Add / Edit Modal */}
          {isModalOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
              <div className="glass-panel w-full max-w-2xl rounded-3xl border-white/15 p-6 sm:p-8 max-h-[90vh] overflow-y-auto relative shadow-2xl">
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="absolute top-5 right-5 p-2 rounded-full bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>

                <h2 className="text-xl font-bold text-white mb-4">
                  {editingBook ? `Edit Book: ${editingBook.title}` : 'Add New Book to Inventory'}
                </h2>

                <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-slate-300 font-semibold mb-1">Book Title</label>
                      <input
                        type="text"
                        required
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        className="w-full px-3.5 py-2 bg-slate-900 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-300 font-semibold mb-1">Author</label>
                      <input
                        type="text"
                        required
                        value={formData.author}
                        onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                        className="w-full px-3.5 py-2 bg-slate-900 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-slate-300 font-semibold mb-1">ISBN</label>
                      <input
                        type="text"
                        required
                        value={formData.isbn}
                        onChange={(e) => setFormData({ ...formData, isbn: e.target.value })}
                        className="w-full px-3.5 py-2 bg-slate-900 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-300 font-semibold mb-1">Category</label>
                      <select
                        value={formData.category}
                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                        className="w-full px-3.5 py-2 bg-slate-900 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                      >
                        <option value="Computer Science">Computer Science</option>
                        <option value="Artificial Intelligence">Artificial Intelligence</option>
                        <option value="Mathematics">Mathematics</option>
                        <option value="Physics">Physics</option>
                        <option value="Engineering">Engineering</option>
                        <option value="General Knowledge">General Knowledge</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-slate-300 font-semibold mb-1">Edition</label>
                      <input
                        type="text"
                        value={formData.edition}
                        onChange={(e) => setFormData({ ...formData, edition: e.target.value })}
                        className="w-full px-3.5 py-2 bg-slate-900 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                      />
                    </div>
                  </div>

                  {/* Physical Coordinates */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-3.5 rounded-2xl bg-indigo-950/30 border border-indigo-500/20">
                    <div>
                      <label className="block text-indigo-300 font-semibold mb-1">Floor</label>
                      <select
                        value={formData.floor}
                        onChange={(e) => setFormData({ ...formData, floor: e.target.value })}
                        className="w-full px-2.5 py-1.5 bg-slate-900 border border-white/10 rounded-lg text-white"
                      >
                        <option value="2nd Floor">2nd Floor</option>
                        <option value="3rd Floor">3rd Floor</option>
                        <option value="4th Floor">4th Floor</option>
                        <option value="5th Floor">5th Floor</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-indigo-300 font-semibold mb-1">Section</label>
                      <input
                        type="text"
                        value={formData.section}
                        onChange={(e) => setFormData({ ...formData, section: e.target.value })}
                        className="w-full px-2.5 py-1.5 bg-slate-900 border border-white/10 rounded-lg text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-indigo-300 font-semibold mb-1">Rack</label>
                      <input
                        type="text"
                        value={formData.rack}
                        onChange={(e) => setFormData({ ...formData, rack: e.target.value })}
                        className="w-full px-2.5 py-1.5 bg-slate-900 border border-white/10 rounded-lg text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-indigo-300 font-semibold mb-1">Shelf</label>
                      <input
                        type="text"
                        value={formData.shelf}
                        onChange={(e) => setFormData({ ...formData, shelf: e.target.value })}
                        className="w-full px-2.5 py-1.5 bg-slate-900 border border-white/10 rounded-lg text-white"
                      />
                    </div>
                  </div>

                  {/* Copies & Penalty */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-slate-300 font-semibold mb-1">Total Copies</label>
                      <input
                        type="number"
                        min="1"
                        value={formData.totalCopies}
                        onChange={(e) => setFormData({ ...formData, totalCopies: Number(e.target.value) })}
                        className="w-full px-3.5 py-2 bg-slate-900 border border-white/10 rounded-xl text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-300 font-semibold mb-1">Available Copies</label>
                      <input
                        type="number"
                        min="0"
                        value={formData.availableCopies}
                        onChange={(e) => setFormData({ ...formData, availableCopies: Number(e.target.value) })}
                        className="w-full px-3.5 py-2 bg-slate-900 border border-white/10 rounded-xl text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-300 font-semibold mb-1">
                        Custom Penalty Rate (₹/d)
                      </label>
                      <input
                        type="number"
                        placeholder="Optional override"
                        value={formData.customPenaltyRate}
                        onChange={(e) => setFormData({ ...formData, customPenaltyRate: e.target.value })}
                        className="w-full px-3.5 py-2 bg-slate-900 border border-white/10 rounded-xl text-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">Description</label>
                    <textarea
                      rows={3}
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      className="w-full px-3.5 py-2 bg-slate-900 border border-white/10 rounded-xl text-white"
                    />
                  </div>

                  <div className="pt-4 flex justify-end gap-3">
                    <button
                      type="button"
                      onClick={() => setIsModalOpen(false)}
                      className="px-4 py-2 rounded-xl bg-white/[0.08] hover:bg-white/[0.12] text-slate-300"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-6 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold"
                    >
                      Save Book Record
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      </LayoutWrapper>
    </RoleGuard>
  );
}
