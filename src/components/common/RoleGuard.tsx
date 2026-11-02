'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useLibrary } from '@/context/LibraryContext';
import { UserRole } from '@/types';
import { ShieldAlert, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

interface RoleGuardProps {
  allowedRoles: UserRole[];
  children: React.ReactNode;
}

export const RoleGuard: React.FC<RoleGuardProps> = ({ allowedRoles, children }) => {
  const { currentUser } = useLibrary();
  const router = useRouter();
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    // Check after brief hydration tick
    const timer = setTimeout(() => {
      setChecked(true);
      if (!currentUser) {
        router.push('/login');
      }
    }, 150);
    return () => clearTimeout(timer);
  }, [currentUser, router]);

  if (!checked) {
    return (
      <div className="min-h-screen bg-[#070A13] flex flex-col items-center justify-center">
        <div className="w-12 h-12 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin mb-4" />
        <p className="text-slate-400 text-sm font-medium">Validating security privileges...</p>
      </div>
    );
  }

  if (!currentUser) {
    return null;
  }

  if (!allowedRoles.includes(currentUser.role)) {
    return (
      <div className="min-h-screen bg-[#070A13] flex items-center justify-center p-6">
        <div className="glass-panel max-w-md w-full p-8 rounded-2xl text-center border-red-500/30">
          <div className="w-16 h-16 bg-red-500/10 border border-red-500/20 text-red-400 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <ShieldAlert className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Access Restricted</h2>
          <p className="text-slate-400 text-sm mb-6">
            Your current role (<span className="text-amber-400 font-semibold uppercase">{currentUser.role}</span>) does not have authorization to view this management module.
          </p>
          <div className="flex gap-3 justify-center">
            <Link
              href={`/${currentUser.role}`}
              className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-sm flex items-center gap-2 transition"
            >
              <ArrowLeft className="w-4 h-4" /> Back to My Dashboard
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};
