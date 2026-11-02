'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import {
  User,
  Book,
  BorrowRecord,
  RoomBooking,
  PenaltySettings,
  NotificationItem,
  LibraryAnnouncement,
  UserRole,
} from '../types';
import {
  INITIAL_USERS,
  INITIAL_BOOKS,
  INITIAL_BORROWINGS,
  INITIAL_ROOM_BOOKINGS,
  INITIAL_PENALTY_SETTINGS,
  INITIAL_ANNOUNCEMENTS,
  INITIAL_NOTIFICATIONS,
} from '../data/mockData';

interface LibraryContextType {
  currentUser: User | null;
  users: User[];
  books: Book[];
  borrowings: BorrowRecord[];
  roomBookings: RoomBooking[];
  penaltySettings: PenaltySettings;
  notifications: NotificationItem[];
  announcements: LibraryAnnouncement[];
  simulatedDate: string; // YYYY-MM-DD
  setSimulatedDate: (date: string) => void;
  login: (id: string, pass: string) => { success: boolean; role?: UserRole; error?: string };
  logout: () => void;
  calculatePenaltyRateForBook: (book: Book) => number;
  issueBook: (bookId: string, studentId: string, staffName?: string) => { success: boolean; message: string };
  returnBook: (borrowRecordId: string) => { success: boolean; message: string; penalty: number };
  bookRoomSeat: (
    floor: string,
    roomId: string,
    seatId: string,
    date: string,
    startTime: string
  ) => { success: boolean; message: string; booking?: RoomBooking };
  cancelRoomBooking: (bookingId: string) => { success: boolean; message: string };
  isSeatBookedAtTime: (floor: string, roomId: string, seatId: string, date: string, startTime: string) => boolean;
  updateBookPenaltyRate: (bookId: string, rate: number | null) => void;
  updateCategoryPenaltyRate: (category: string, rate: number) => void;
  updateDefaultPenaltyRate: (rate: number) => void;
  addBook: (book: Omit<Book, 'id'>) => void;
  updateBook: (book: Book) => void;
  deleteBook: (bookId: string) => void;
  addUser: (user: User) => void;
  updateUser: (user: User) => void;
  deleteUser: (userId: string) => void;
  markNotificationAsRead: (id: string) => void;
  clearAllNotifications: () => void;
  addNotification: (item: Omit<NotificationItem, 'id' | 'timestamp' | 'read'>) => void;
  addAnnouncement: (announcement: Omit<LibraryAnnouncement, 'id'>) => void;
  payPenalty: (borrowRecordId: string) => void;
}

const LibraryContext = createContext<LibraryContextType | undefined>(undefined);

// Helper for formatting dates
function formatDate(d: Date): string {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

// 14-day rule helper
function addDays(dateStr: string, days: number): string {
  const parts = dateStr.split('-');
  const d = new Date(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2]));
  d.setDate(d.getDate() + days);
  return formatDate(d);
}

// Calculate days difference (d2 - d1)
function diffDays(d1Str: string, d2Str: string): number {
  const p1 = d1Str.split('-');
  const p2 = d2Str.split('-');
  const date1 = new Date(Number(p1[0]), Number(p1[1]) - 1, Number(p1[2]));
  const date2 = new Date(Number(p2[0]), Number(p2[1]) - 1, Number(p2[2]));
  const diffTime = date2.getTime() - date1.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

export const LibraryProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>(INITIAL_USERS);
  const [books, setBooks] = useState<Book[]>(INITIAL_BOOKS);
  const [borrowings, setBorrowings] = useState<BorrowRecord[]>(INITIAL_BORROWINGS);
  const [roomBookings, setRoomBookings] = useState<RoomBooking[]>(INITIAL_ROOM_BOOKINGS);
  const [penaltySettings, setPenaltySettings] = useState<PenaltySettings>(INITIAL_PENALTY_SETTINGS);
  const [notifications, setNotifications] = useState<NotificationItem[]>(INITIAL_NOTIFICATIONS);
  const [announcements, setAnnouncements] = useState<LibraryAnnouncement[]>(INITIAL_ANNOUNCEMENTS);
  const [simulatedDate, setSimulatedDate] = useState<string>('2026-11-01');
  const [isLoaded, setIsLoaded] = useState(false);

  // Load from LocalStorage
  useEffect(() => {
    try {
      const storedUser = localStorage.getItem('lib_current_user');
      if (storedUser) setCurrentUser(JSON.parse(storedUser));

      const storedBooks = localStorage.getItem('lib_books');
      if (storedBooks) setBooks(JSON.parse(storedBooks));

      const storedUsers = localStorage.getItem('lib_users');
      if (storedUsers) setUsers(JSON.parse(storedUsers));

      const storedBorrowings = localStorage.getItem('lib_borrowings');
      if (storedBorrowings) setBorrowings(JSON.parse(storedBorrowings));

      const storedRoomBookings = localStorage.getItem('lib_room_bookings');
      if (storedRoomBookings) setRoomBookings(JSON.parse(storedRoomBookings));

      const storedPenalty = localStorage.getItem('lib_penalty_settings');
      if (storedPenalty) setPenaltySettings(JSON.parse(storedPenalty));

      const storedNotifs = localStorage.getItem('lib_notifications');
      if (storedNotifs) setNotifications(JSON.parse(storedNotifs));

      const storedAnnouncements = localStorage.getItem('lib_announcements');
      if (storedAnnouncements) setAnnouncements(JSON.parse(storedAnnouncements));

      const storedDate = localStorage.getItem('lib_simulated_date');
      if (storedDate) setSimulatedDate(storedDate);
    } catch (e) {
      console.error('Failed to load local storage:', e);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  // Save changes to LocalStorage once loaded
  useEffect(() => {
    if (!isLoaded) return;
    try {
      localStorage.setItem('lib_current_user', JSON.stringify(currentUser));
      localStorage.setItem('lib_books', JSON.stringify(books));
      localStorage.setItem('lib_users', JSON.stringify(users));
      localStorage.setItem('lib_borrowings', JSON.stringify(borrowings));
      localStorage.setItem('lib_room_bookings', JSON.stringify(roomBookings));
      localStorage.setItem('lib_penalty_settings', JSON.stringify(penaltySettings));
      localStorage.setItem('lib_notifications', JSON.stringify(notifications));
      localStorage.setItem('lib_announcements', JSON.stringify(announcements));
      localStorage.setItem('lib_simulated_date', simulatedDate);
    } catch (e) {
      console.error('Failed to write local storage:', e);
    }
  }, [
    currentUser,
    books,
    users,
    borrowings,
    roomBookings,
    penaltySettings,
    notifications,
    announcements,
    simulatedDate,
    isLoaded,
  ]);

  // Automatic overdue updates & Room booking expiry release
  useEffect(() => {
    if (!isLoaded) return;

    // Check overdue borrowings against simulatedDate
    setBorrowings((prevBorrowings) =>
      prevBorrowings.map((rec) => {
        if (rec.status === 'issued') {
          const delay = diffDays(rec.dueDate, simulatedDate);
          if (delay > 0) {
            const applicableRate = rec.applicableDailyRate;
            return {
              ...rec,
              status: 'overdue',
              delayedDays: delay,
              totalPenalty: delay * applicableRate,
            };
          }
        }
        return rec;
      })
    );

    // Automatic 1-hour room booking expiry check
    // If booking end epoch is before now, mark it expired so seat is immediately released
    const nowEpoch = Date.now();
    setRoomBookings((prevBookings) =>
      prevBookings.map((b) => {
        if (b.status === 'confirmed' && b.endEpochMs < nowEpoch) {
          return { ...b, status: 'expired' };
        }
        return b;
      })
    );
  }, [simulatedDate, isLoaded]);

  // LOGIN FUNCTION with required test credentials
  const login = (userId: string, pass: string): { success: boolean; role?: UserRole; error?: string } => {
    const trimmedId = userId.trim();
    const trimmedPass = pass.trim();

    if (trimmedId === 'User1' && trimmedPass === 'User@1234') {
      const user = users.find((u) => u.id === 'User1') || INITIAL_USERS[0];
      setCurrentUser(user);
      return { success: true, role: 'student' };
    }
    if (trimmedId === 'Staff1' && trimmedPass === 'Staff@1234') {
      const user = users.find((u) => u.id === 'Staff1') || INITIAL_USERS[3];
      setCurrentUser(user);
      return { success: true, role: 'staff' };
    }
    if (trimmedId === 'Admin1' && trimmedPass === 'Admin@1234') {
      const user = users.find((u) => u.id === 'Admin1') || INITIAL_USERS[5];
      setCurrentUser(user);
      return { success: true, role: 'admin' };
    }

    // Also support any dynamically added user with default password
    const matchedUser = users.find((u) => u.id.toLowerCase() === trimmedId.toLowerCase() || u.email.toLowerCase() === trimmedId.toLowerCase());
    if (matchedUser && (trimmedPass === `${matchedUser.id}@1234` || trimmedPass === 'User@1234' || trimmedPass === 'Staff@1234' || trimmedPass === 'Admin@1234')) {
      setCurrentUser(matchedUser);
      return { success: true, role: matchedUser.role };
    }

    return {
      success: false,
      error: 'Invalid Credentials. Use User1 / User@1234, Staff1 / Staff@1234, or Admin1 / Admin@1234',
    };
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('lib_current_user');
  };

  // PENALTY CALCULATION PRIORITY:
  // 1. Individual book penalty rate (book.customPenaltyRate)
  // 2. Category penalty rate (penaltySettings.categoryRates[category])
  // 3. Default library penalty rate (penaltySettings.defaultDailyRate)
  const calculatePenaltyRateForBook = (book: Book): number => {
    if (book.customPenaltyRate !== undefined && book.customPenaltyRate !== null) {
      return Number(book.customPenaltyRate);
    }
    if (penaltySettings.categoryRates && penaltySettings.categoryRates[book.category] !== undefined) {
      return Number(penaltySettings.categoryRates[book.category]);
    }
    return Number(penaltySettings.defaultDailyRate) || 5;
  };

  // BOOK ISSUE MANAGEMENT (14-day borrowing period)
  const issueBook = (
    bookId: string,
    studentId: string,
    staffName: string = 'Staff Desk'
  ): { success: boolean; message: string } => {
    const book = books.find((b) => b.id === bookId);
    if (!book) return { success: false, message: 'Book not found' };
    if (book.availableCopies <= 0) return { success: false, message: 'No available copies left for this book' };

    const student = users.find((u) => u.id === studentId || u.studentOrEmployeeId === studentId);
    if (!student) return { success: false, message: 'Student ID not recognized' };

    const issueDateStr = simulatedDate;
    const dueDateStr = addDays(issueDateStr, 14); // Exactly 14-day borrowing duration
    const applicableRate = calculatePenaltyRateForBook(book);

    const newBorrowing: BorrowRecord = {
      id: `BR-${Date.now()}`,
      bookId: book.id,
      bookTitle: book.title,
      bookIsbn: book.isbn,
      bookCoverImage: book.coverImage,
      userId: student.id,
      userName: student.name,
      userRole: student.role,
      issueDate: issueDateStr,
      dueDate: dueDateStr,
      status: 'issued',
      delayedDays: 0,
      applicableDailyRate: applicableRate,
      totalPenalty: 0,
      penaltyPaid: false,
      issuedByStaffName: staffName,
    };

    // Update book inventory
    setBooks((prev) =>
      prev.map((b) => (b.id === bookId ? { ...b, availableCopies: Math.max(0, b.availableCopies - 1) } : b))
    );

    // Add record
    setBorrowings((prev) => [newBorrowing, ...prev]);

    // Notify student
    addNotification({
      title: `Book Issued: ${book.title}`,
      message: `Issued on ${issueDateStr}. Due date is ${dueDateStr} (14-day borrowing window). Rate: ₹${applicableRate}/day for delayed returns.`,
      type: 'due_date',
      targetRole: 'student',
      targetUserId: student.id,
      link: '/student/my-books',
    });

    return { success: true, message: `Book issued successfully! Due on ${dueDateStr}.` };
  };

  // BOOK RETURN MANAGEMENT
  const returnBook = (borrowRecordId: string): { success: boolean; message: string; penalty: number } => {
    const rec = borrowings.find((r) => r.id === borrowRecordId);
    if (!rec) return { success: false, message: 'Borrow record not found', penalty: 0 };
    if (rec.status === 'returned') return { success: false, message: 'Book has already been returned', penalty: 0 };

    const returnDateStr = simulatedDate;
    const delay = Math.max(0, diffDays(rec.dueDate, returnDateStr));
    const calculatedPenalty = delay * rec.applicableDailyRate;

    // Update borrowing record
    setBorrowings((prev) =>
      prev.map((r) =>
        r.id === borrowRecordId
          ? {
              ...r,
              returnDate: returnDateStr,
              status: 'returned',
              delayedDays: delay,
              totalPenalty: calculatedPenalty,
              penaltyPaid: calculatedPenalty === 0,
            }
          : r
      )
    );

    // Increase available copies
    setBooks((prev) =>
      prev.map((b) => (b.id === rec.bookId ? { ...b, availableCopies: b.availableCopies + 1 } : b))
    );

    // Notify user
    const penaltyMsg =
      calculatedPenalty > 0
        ? `Delayed by ${delay} days. Overdue penalty of ₹${calculatedPenalty} recorded.`
        : 'Returned on schedule. No overdue penalty.';

    addNotification({
      title: `Book Returned: ${rec.bookTitle}`,
      message: `Return recorded on ${returnDateStr}. ${penaltyMsg}`,
      type: calculatedPenalty > 0 ? 'overdue' : 'system',
      targetRole: 'student',
      targetUserId: rec.userId,
      link: '/student/my-penalties',
    });

    return {
      success: true,
      message: `Book returned successfully. ${penaltyMsg}`,
      penalty: calculatedPenalty,
    };
  };

  // ROOM AND SEAT BOOKING
  // 4 floors, 6 rooms each, 8 seats each = 24 rooms, 192 seats.
  // Exactly 1 hour duration. Prevents overlapping bookings.
  const isSeatBookedAtTime = (
    floor: string,
    roomId: string,
    seatId: string,
    date: string,
    startTime: string
  ): boolean => {
    const nowEpoch = Date.now();
    return roomBookings.some((b) => {
      if (b.floor === floor && b.roomId === roomId && b.seatId === seatId && b.date === date) {
        if (b.status === 'confirmed') {
          // If expired by time, it's freed
          if (b.endEpochMs <= nowEpoch) return false;
          // Check same start time
          if (b.startTime === startTime) return true;
        }
      }
      return false;
    });
  };

  // Helper to compute 1-hour end time
  const computeEndTime = (startTimeStr: string): string => {
    // Expected format like "10:00 AM" or "10:00"
    const is12Hour = startTimeStr.toUpperCase().includes('AM') || startTimeStr.toUpperCase().includes('PM');
    if (is12Hour) {
      const [timePart, modifier] = startTimeStr.trim().split(/\s+/);
      const [hoursStr, minsStr] = timePart.split(':');
      let hours = parseInt(hoursStr, 10);
      const mins = minsStr || '00';
      let mod = modifier.toUpperCase();

      hours += 1;
      if (hours === 12) {
        mod = mod === 'AM' ? 'PM' : 'AM';
      } else if (hours > 12) {
        hours = 1;
      }
      return `${hours}:${mins} ${mod}`;
    } else {
      const [hoursStr, minsStr] = startTimeStr.split(':');
      let hours = (parseInt(hoursStr, 10) + 1) % 24;
      return `${String(hours).padStart(2, '0')}:${minsStr || '00'}`;
    }
  };

  const bookRoomSeat = (
    floor: string,
    roomId: string,
    seatId: string,
    date: string,
    startTime: string
  ): { success: boolean; message: string; booking?: RoomBooking } => {
    if (!currentUser) return { success: false, message: 'Please login to reserve a room seat' };

    // Check conflict
    if (isSeatBookedAtTime(floor, roomId, seatId, date, startTime)) {
      return {
        success: false,
        message: `Seat ${seatId} in ${roomId} (${floor}) is already reserved for ${startTime}. Please select another time or seat.`,
      };
    }

    const endTime = computeEndTime(startTime);

    // Calculate simulated epoch
    // Parse time to get approximate epoch
    let hour = 10;
    if (startTime.includes('PM') && !startTime.startsWith('12')) {
      hour = parseInt(startTime) + 12;
    } else {
      hour = parseInt(startTime);
    }
    const bookingDateObj = new Date(`${date}T${String(hour).padStart(2, '0')}:00:00`);
    const startEpochMs = bookingDateObj.getTime();
    const endEpochMs = startEpochMs + 60 * 60 * 1000; // Exactly 1 hour

    const newBooking: RoomBooking = {
      id: `RB-${Date.now()}`,
      userId: currentUser.id,
      userName: currentUser.name,
      floor,
      roomId,
      seatId,
      date,
      startTime,
      endTime,
      startEpochMs,
      endEpochMs,
      status: 'confirmed',
      createdAt: new Date().toISOString(),
    };

    setRoomBookings((prev) => [newBooking, ...prev]);

    addNotification({
      title: 'Room Seat Booking Confirmed',
      message: `Reserved ${seatId} in ${roomId}, ${floor} on ${date} from ${startTime} to ${endTime} (1 hour).`,
      type: 'room_booking',
      targetRole: 'student',
      targetUserId: currentUser.id,
      link: '/student/room-booking',
    });

    return {
      success: true,
      message: `Reservation Confirmed for ${seatId} (${roomId}, ${floor}) from ${startTime} to ${endTime}!`,
      booking: newBooking,
    };
  };

  const cancelRoomBooking = (bookingId: string): { success: boolean; message: string } => {
    const b = roomBookings.find((x) => x.id === bookingId);
    if (!b) return { success: false, message: 'Booking record not found' };

    setRoomBookings((prev) =>
      prev.map((item) => (item.id === bookingId ? { ...item, status: 'cancelled' } : item))
    );

    addNotification({
      title: 'Room Reservation Cancelled',
      message: `Your booking for ${b.seatId} in ${b.roomId} (${b.floor}) has been cancelled.`,
      type: 'room_booking',
      targetRole: 'student',
      targetUserId: b.userId,
    });

    return { success: true, message: 'Reservation cancelled successfully.' };
  };

  // ADMIN PENALTY CONFIGURATIONS
  const updateBookPenaltyRate = (bookId: string, rate: number | null) => {
    setBooks((prev) => prev.map((b) => (b.id === bookId ? { ...b, customPenaltyRate: rate } : b)));
  };

  const updateCategoryPenaltyRate = (category: string, rate: number) => {
    setPenaltySettings((prev) => ({
      ...prev,
      categoryRates: {
        ...prev.categoryRates,
        [category]: rate,
      },
    }));
  };

  const updateDefaultPenaltyRate = (rate: number) => {
    setPenaltySettings((prev) => ({
      ...prev,
      defaultDailyRate: rate,
    }));
  };

  const payPenalty = (borrowRecordId: string) => {
    setBorrowings((prev) =>
      prev.map((r) => (r.id === borrowRecordId ? { ...r, penaltyPaid: true } : r))
    );
  };

  // CRUD FOR BOOKS
  const addBook = (bookData: Omit<Book, 'id'>) => {
    const newBook: Book = {
      ...bookData,
      id: `BK-${Math.floor(1000 + Math.random() * 9000)}`,
    };
    setBooks((prev) => [newBook, ...prev]);
  };

  const updateBook = (book: Book) => {
    setBooks((prev) => prev.map((b) => (b.id === book.id ? book : b)));
  };

  const deleteBook = (bookId: string) => {
    setBooks((prev) => prev.filter((b) => b.id !== bookId));
  };

  // CRUD FOR USERS
  const addUser = (userData: User) => {
    setUsers((prev) => [...prev, userData]);
  };

  const updateUser = (userData: User) => {
    setUsers((prev) => prev.map((u) => (u.id === userData.id ? userData : u)));
  };

  const deleteUser = (userId: string) => {
    setUsers((prev) => prev.filter((u) => u.id !== userId));
  };

  // NOTIFICATIONS
  const markNotificationAsRead = (id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
  };

  const clearAllNotifications = () => {
    setNotifications([]);
  };

  const addNotification = (item: Omit<NotificationItem, 'id' | 'timestamp' | 'read'>) => {
    const newNotif: NotificationItem = {
      ...item,
      id: `NOTIF-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      timestamp: 'Just now',
      read: false,
    };
    setNotifications((prev) => [newNotif, ...prev]);
  };

  const addAnnouncement = (item: Omit<LibraryAnnouncement, 'id'>) => {
    const newAnn: LibraryAnnouncement = {
      ...item,
      id: `ANN-${Date.now()}`,
    };
    setAnnouncements((prev) => [newAnn, ...prev]);
  };

  return (
    <LibraryContext.Provider
      value={{
        currentUser,
        users,
        books,
        borrowings,
        roomBookings,
        penaltySettings,
        notifications,
        announcements,
        simulatedDate,
        setSimulatedDate,
        login,
        logout,
        calculatePenaltyRateForBook,
        issueBook,
        returnBook,
        bookRoomSeat,
        cancelRoomBooking,
        isSeatBookedAtTime,
        updateBookPenaltyRate,
        updateCategoryPenaltyRate,
        updateDefaultPenaltyRate,
        addBook,
        updateBook,
        deleteBook,
        addUser,
        updateUser,
        deleteUser,
        markNotificationAsRead,
        clearAllNotifications,
        addNotification,
        addAnnouncement,
        payPenalty,
      }}
    >
      {children}
    </LibraryContext.Provider>
  );
};

export const useLibrary = () => {
  const context = useContext(LibraryContext);
  if (!context) {
    throw new Error('useLibrary must be used within a LibraryProvider');
  }
  return context;
};
