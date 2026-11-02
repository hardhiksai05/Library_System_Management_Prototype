'use client';

import React, { useState } from 'react';
import { useLibrary } from '@/context/LibraryContext';
import { RoleGuard } from '@/components/common/RoleGuard';
import { LayoutWrapper } from '@/components/common/LayoutWrapper';
import { User, UserRole } from '@/types';
import {
  Users,
  Plus,
  Search,
  Edit2,
  Trash2,
  Shield,
  GraduationCap,
  Briefcase,
  X,
  CheckCircle2,
} from 'lucide-react';

export default function AdminUserManagementPage() {
  const { users, addUser, updateUser, deleteUser, currentUser } = useLibrary();

  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('All');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);

  const [formData, setFormData] = useState<User>({
    id: '',
    studentOrEmployeeId: '',
    name: '',
    email: '',
    role: 'student',
    department: 'School of Computer Science & Engineering',
    phone: '+91 98765 00000',
    avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
  });

  const handleOpenAddModal = () => {
    setEditingUser(null);
    setFormData({
      id: `User${Math.floor(10 + Math.random() * 90)}`,
      studentOrEmployeeId: `LPU2025CS${Math.floor(1000 + Math.random() * 9000)}`,
      name: '',
      email: '',
      role: 'student',
      department: 'School of Computer Science & Engineering',
      phone: '+91 98765 12345',
      avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
    });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (user: User) => {
    setEditingUser(user);
    setFormData(user);
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingUser) {
      updateUser(formData);
    } else {
      addUser(formData);
    }
    setIsModalOpen(false);
  };

  const handleDelete = (userId: string, name: string) => {
    if (userId === currentUser?.id) {
      alert('You cannot delete your own active administrator account.');
      return;
    }
    if (confirm(`Are you sure you want to delete user account "${name}" (${userId})?`)) {
      deleteUser(userId);
    }
  };

  const filtered = users.filter((u) => {
    const matchesRole = roleFilter === 'All' || u.role === roleFilter;
    const matchesQuery =
      !searchQuery ||
      u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.studentOrEmployeeId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesRole && matchesQuery;
  });

  return (
    <RoleGuard allowedRoles={['admin']}>
      <LayoutWrapper>
        <div className="space-y-6 animate-in fade-in duration-300">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-2">
                <Users className="w-7 h-7 text-indigo-400" />
                User Account & Security Management
              </h1>
              <p className="text-xs sm:text-sm text-slate-400 mt-1">
                Administer student cards, faculty circulation desk personnel, and governance roles.
              </p>
            </div>

            <button
              onClick={handleOpenAddModal}
              className="px-5 py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-neon-blue flex items-center gap-2 transition"
            >
              <Plus className="w-4 h-4" /> Add New User
            </button>
          </div>

          {/* Filters & Search */}
          <div className="glass-panel p-4 rounded-2xl border-white/[0.08] flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by name, ID, or university email..."
                className="w-full pl-10 pr-4 py-2 bg-slate-900/80 border border-white/10 rounded-xl text-white text-xs sm:text-sm placeholder-slate-400 focus:outline-none"
              />
            </div>

            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="px-3.5 py-2 bg-slate-900/80 border border-white/10 rounded-xl text-xs sm:text-sm text-white"
            >
              <option value="All">All Roles</option>
              <option value="student">Students</option>
              <option value="staff">Staff Personnel</option>
              <option value="admin">Administrators</option>
            </select>
          </div>

          {/* Users Table */}
          <div className="glass-panel rounded-3xl border-white/[0.08] overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-900/80 border-b border-white/[0.08] text-slate-400 uppercase text-[10px] tracking-wider font-semibold">
                  <tr>
                    <th className="px-6 py-4">User</th>
                    <th className="px-6 py-4">Registration / ID</th>
                    <th className="px-6 py-4">Role</th>
                    <th className="px-6 py-4">Department</th>
                    <th className="px-6 py-4">Contact</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/[0.05]">
                  {filtered.map((u) => (
                    <tr key={u.id} className="hover:bg-white/[0.02] transition">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={u.avatarUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=100&q=80'}
                            alt={u.name}
                            className="w-9 h-9 rounded-xl object-cover ring-1 ring-white/10"
                          />
                          <div>
                            <p className="font-bold text-white text-xs">{u.name}</p>
                            <p className="text-[10px] text-slate-400">{u.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 font-mono text-indigo-300 font-semibold">{u.studentOrEmployeeId}</td>
                      <td className="px-6 py-4">
                        <span
                          className={`px-2.5 py-1 rounded-full font-bold uppercase text-[10px] ${
                            u.role === 'admin'
                              ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                              : u.role === 'staff'
                              ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                              : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                          }`}
                        >
                          {u.role}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-slate-300 max-w-xs truncate">{u.department}</td>
                      <td className="px-6 py-4 text-slate-400">{u.phone}</td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleOpenEditModal(u)}
                            className="p-2 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] text-indigo-300 transition"
                            title="Edit User"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDelete(u.id, u.name)}
                            className="p-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 transition"
                            title="Delete User"
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
              <div className="glass-panel w-full max-w-lg rounded-3xl border-white/15 p-6 sm:p-8 relative shadow-2xl">
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="absolute top-5 right-5 p-2 rounded-full bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>

                <h2 className="text-xl font-bold text-white mb-4">
                  {editingUser ? `Edit User: ${editingUser.name}` : 'Register New University User'}
                </h2>

                <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">Full Name</label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-3.5 py-2 bg-slate-900 border border-white/10 rounded-xl text-white"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-slate-300 font-semibold mb-1">Account Role</label>
                      <select
                        value={formData.role}
                        onChange={(e) => setFormData({ ...formData, role: e.target.value as UserRole })}
                        className="w-full px-3.5 py-2 bg-slate-900 border border-white/10 rounded-xl text-white"
                      >
                        <option value="student">Student</option>
                        <option value="staff">Staff Personnel</option>
                        <option value="admin">Administrator</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-slate-300 font-semibold mb-1">Registration / Employee ID</label>
                      <input
                        type="text"
                        required
                        value={formData.studentOrEmployeeId}
                        onChange={(e) => setFormData({ ...formData, studentOrEmployeeId: e.target.value })}
                        className="w-full px-3.5 py-2 bg-slate-900 border border-white/10 rounded-xl text-white font-mono"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">University Email</label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-3.5 py-2 bg-slate-900 border border-white/10 rounded-xl text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">Department / Division</label>
                    <input
                      type="text"
                      value={formData.department}
                      onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                      className="w-full px-3.5 py-2 bg-slate-900 border border-white/10 rounded-xl text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">Contact Phone</label>
                    <input
                      type="text"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
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
                      className="px-6 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold"
                    >
                      Save Account
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
