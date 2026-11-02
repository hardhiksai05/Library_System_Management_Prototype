'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useLibrary } from '@/context/LibraryContext';

export default function HomePage() {
  const router = useRouter();
  const { currentUser } = useLibrary();

  useEffect(() => {
    if (currentUser) {
      router.replace(`/${currentUser.role}`);
    } else {
      router.replace('/login');
    }
  }, [currentUser, router]);

  return (
    <div className="min-h-screen bg-[#070A13] flex flex-col items-center justify-center">
      <div className="w-12 h-12 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin mb-4" />
      <p className="text-slate-400 text-sm">Launching University Library Management Portal...</p>
    </div>
  );
}
