export type UserRole = 'student' | 'staff' | 'admin';

export interface User {
  id: string; // e.g. User1, Staff1, Admin1
  studentOrEmployeeId: string;
  name: string;
  email: string;
  role: UserRole;
  department: string;
  avatarUrl?: string;
  phone?: string;
  activeBorrowedCount?: number;
  totalPenaltiesPending?: number;
  joinedYear?: string;
}

export type BookStatus = 'available' | 'issued' | 'reserved' | 'overdue';

export interface BookLocation {
  floor: string; // "2nd Floor", "3rd Floor", "4th Floor", "5th Floor"
  section: string; // "Section A", "Section B", etc.
  rack: string; // "Rack R-04", etc.
  shelf: string; // "Shelf S-2", etc.
  zoneName?: string;
}

export interface Book {
  id: string;
  title: string;
  author: string;
  isbn: string;
  category: string;
  edition: string;
  description: string;
  publisher: string;
  publicationYear: number;
  totalCopies: number;
  availableCopies: number;
  coverImage: string;
  location: BookLocation;
  customPenaltyRate?: number | null; // specific override in ₹/day
  tags?: string[];
}

export interface BorrowRecord {
  id: string;
  bookId: string;
  bookTitle: string;
  bookIsbn: string;
  bookCoverImage: string;
  userId: string;
  userName: string;
  userRole: UserRole;
  issueDate: string; // YYYY-MM-DD
  dueDate: string; // exactly 14 days later
  returnDate?: string;
  status: 'issued' | 'returned' | 'overdue';
  delayedDays: number;
  applicableDailyRate: number;
  totalPenalty: number;
  penaltyPaid: boolean;
  issuedByStaffName: string;
}

export interface RoomBooking {
  id: string;
  userId: string;
  userName: string;
  floor: string; // "2nd Floor" | "3rd Floor" | "4th Floor" | "5th Floor"
  roomId: string; // "Room 1" .. "Room 6"
  seatId: string; // "S1" .. "S8"
  date: string; // YYYY-MM-DD
  startTime: string; // e.g. "10:00 AM" or "10:00"
  endTime: string; // 1 hour after start
  startEpochMs: number;
  endEpochMs: number;
  status: 'confirmed' | 'active' | 'cancelled' | 'expired';
  createdAt: string;
}

export interface PenaltySettings {
  defaultDailyRate: number; // ₹5 / day
  categoryRates: Record<string, number>; // e.g. { "Artificial Intelligence": 10, "Computer Science": 8 }
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  type: 'due_date' | 'overdue' | 'reservation' | 'room_booking' | 'announcement' | 'system';
  timestamp: string;
  read: boolean;
  targetRole?: UserRole | 'all';
  targetUserId?: string;
  link?: string;
}

export interface LibraryAnnouncement {
  id: string;
  title: string;
  content: string;
  date: string;
  priority: 'low' | 'normal' | 'urgent';
  author: string;
  category: string;
}

export interface GeneralSeat {
  id: string;
  floor: string;
  zone: string;
  label: string;
  isOccupied: boolean;
  hasPowerPlug: boolean;
  hasMonitor: boolean;
}
