# SMART UNIVERSITY LIBRARY MANAGEMENT SYSTEM (LPU Central Library Prototype)

A modern, full-stack interactive University Library Management System prototype inspired by LPU's central academic library architecture. Built with **Next.js 14**, **React 18**, **TypeScript**, **Tailwind CSS**, **Lucide React**, **Framer Motion**, and **Recharts**.

---

## 🚀 Predefined Demonstration Credentials

| Role | User ID | Password | Landing Dashboard | Description |
| :--- | :--- | :--- | :--- | :--- |
| **Student** | `User1` | `User@1234` | `/student` | Student portal with catalog search, interactive map, room reservations, and penalty ledger |
| **Staff** | `Staff1` | `Staff@1234` | `/staff` | Circulation desk for 14-day book loans, return processing, student records, and fine collection |
| **Admin** | `Admin1` | `Admin@1234` | `/admin` | Governance center for 3-tier penalty rates, user accounts, book stock, and analytics |

> **Pro Tip:** The common login page (`/login`) includes **1-Click Predefined Credential Autofill** buttons for instant testing. Additionally, a **Demo Role Switcher** is pinned to the footer of every dashboard sidebar for frictionless switching during demonstrations.

---

## 🌟 Key Features & Functional Modules

### 1. Role-Based Dashboards & Route Security (`RoleGuard`)
- Common authentication page (`/login`) with input validation, password visibility toggle, and automatic role redirection.
- Strict route protection: students cannot access staff or admin routes; staff cannot access admin governance modules.
- Full session persistence across page refreshes via `LocalStorage`.

### 2. Book Discovery & Catalog Search (`/student/books`)
- Search by Title, Author, ISBN, Category, or Keywords.
- Advanced category filters (Computer Science, Artificial Intelligence, Mathematics, Physics, Engineering, General Knowledge).
- Floor filters (Floors 2 to 5) and live copy availability status badges:
  - 🟢 **Green**: Available
  - 🔵 **Blue**: Issued
  - 🟠 **Orange**: Reserved
  - 🔴 **Red**: Overdue
- Comprehensive Book Details Modal displaying physical shelf coordinates, edition, publisher, synopsis, and applicable penalty rate.
- Direct navigation link to the Interactive Floor Map.

### 3. Interactive Schematic Library Map (`/student/map`)
- Visual floor switcher (2nd, 3rd, 4th, 5th Floor).
- Schematic layout highlighting:
  - **Sections**: Section A, Section B, Section C, Section D.
  - **Racks**: R-01 to R-12.
  - **Shelves**: S-1 to S-5.
  - Collaborative study rooms, quiet reading zones, and circulation desks.
- Searching or viewing any book illuminates an interactive locator pin with real-time walking directions.
- Labeled clearly as an architectural prototype layout.

### 4. Interactive Study Room & Seat Booking System (`/student/room-booking`)
- **Capacity**: 4 Floors &times; 6 Rooms = **24 Rooms** &bull; 24 Rooms &times; 8 Seats = **192 Dedicated Seats** (labeled `S1` to `S8`).
- **Strict 1-Hour Duration**: Selecting start time (e.g. `10:00 AM`) automatically locks end time to `11:00 AM`.
- **Conflict Prevention**: Real-time checking prevents overlapping reservations on the same seat.
- **Automated Expiry & Release**: Once the 1-hour session concludes, the seat is automatically freed back to the available pool.
- **Official Digital Slip**: Generates a confirmation slip showing student name, floor, room number, seat ID, date, time slot, and status.
- Self-service reservation cancellation and historical logs.

### 5. General Reading Seat Availability (`/student/seats`)
- Separate from the 192 dedicated room seats.
- Live floor selection with occupancy rates, vacant counts, and power/monitor telemetry for open-hall desks.

### 6. Book Issue & Return Management (`/staff/issue`, `/staff/return`)
- **14-Day Automated Limit**: Books borrowed are given a hard due date exactly 14 calendar days from the issuance date.
- **Inventory Synchronization**: Available copy counts decrement on issue and increment on return.
- **Return & Delay Calculation**: Returning a book automatically calculates delayed days against the 14-day due date:
  $$\text{Delayed Days} \times \text{Applicable Daily Penalty Rate} = \text{Total Penalty}$$

### 7. Multi-Tier Penalty Management System (`/admin/penalties`, `/student/my-penalties`)
- **3-Tier Priority Engine**:
  1. **Individual Book Override**: Pinned rate on a specific title takes highest priority.
  2. **Category Rate**: Applied if no individual book override exists.
  3. **Default Library Rate**: Global fallback (default: ₹5/day).
- **Cash Desk Policy**: Transparent notice that all calculated fines are tendered physically at the circulation desk; staff marks payments as cleared.

### 8. Analytics & Reporting (`/admin/reports`)
- Interactive Recharts bar and line charts for monthly circulation trajectories, category borrowing demand, and hourly room utilization.

### 9. Time Simulator Controls (Header)
- Header includes a simulated date tool (`+1 Day`, `+7 Days`, `+15 Days Overdue Test`).
- Advancing by 15 days instantly triggers the 14-day circulation rule, converting active loans to overdue status and computing fines in real-time.

---

## 🛠️ Technology Stack

- **Framework**: Next.js 14 (App Router)
- **Library**: React 18 & TypeScript
- **Styling**: Tailwind CSS (Dark theme default: Deep Navy `#070A13`, Neon accents, Glassmorphism)
- **Icons**: Lucide React
- **Visual Charts**: Recharts
- **State & Storage**: React Context + LocalStorage Persistence

---

## 🏃 Running the Application Locally

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start development server:
   ```bash
   npm run dev
   ```

3. Or build and launch production server:
   ```bash
   npm run build
   npm run start
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your web browser.
