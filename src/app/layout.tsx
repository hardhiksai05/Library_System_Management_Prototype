import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { LibraryProvider } from '@/context/LibraryContext';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Smart University Library System | LPU Central Library Portal',
  description:
    'Comprehensive University Library Management System with Role-based Dashboards (Student, Staff, Admin), Interactive Schematic Maps, 1-Hour Room Booking, and Advanced Penalty Management.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className={inter.className}>
        <LibraryProvider>
          {children}
        </LibraryProvider>
      </body>
    </html>
  );
}
