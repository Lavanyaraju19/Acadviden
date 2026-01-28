# AcadVizen Digital Hub

## Overview

AcadVizen Digital Hub is a comprehensive learning management system (LMS) built with React, TypeScript, and Supabase. The platform serves two primary user types: students who consume educational content and track their learning progress, and administrators who manage courses, modules, assignments, and user accounts. The application features role-based authentication, a student dashboard with course progress tracking, live session management, career support tools, and a full-featured admin dashboard with CRUD operations across multiple data tables.

## User Preferences

Preferred communication style: Simple, everyday language.

## Recent Changes

- **January 28, 2026**: Connected frontend to Supabase backend
  - Fixed AuthContext to use `profiles` table with proper role-based access
  - Connected Courses page to fetch from Supabase with loading/error/empty states
  - Connected Tools page to fetch from Supabase with loading/error/empty states
  - Added admin-only CRUD operations (Add, Edit, Delete) for courses and tools
  - Login uses `supabase.auth.signInWithPassword()` 
  - Registration uses `supabase.auth.signUp()` with profile creation
  - Supabase credentials configured via environment variables

- **January 2026**: Added production-ready backend with complete Supabase database schema
- Added SQL migration files for all database tables
- Implemented backend services for registration, admin CRUD, payments, email, and Google Sheets integration
- Updated Supabase types with complete database schema (12 tables)
- Configured Vite to run on port 5000 with allowed hosts

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite with SWC for fast compilation
- **Styling**: Tailwind CSS with custom theme configuration
- **UI Components**: shadcn/ui built on Radix UI primitives
- **State Management**: React Context (AuthContext) and TanStack React Query for server state
- **Routing**: React Router DOM with protected routes and role-based access control

### Backend Architecture
- **Database**: Supabase (PostgreSQL) with Row Level Security
- **Authentication**: Supabase Auth with role-based access control
- **API Services**: TypeScript service modules for business logic
- **Migrations**: SQL migration files in `backend/migrations/`

### Authentication & Authorization
- **Provider**: Supabase Auth for user authentication
- **Role System**: Three roles - "student", "admin", "instructor"
- **Protected Routes**: ProtectedRoute component wraps sensitive pages and validates user role
- **Smart Redirects**: AuthRedirect component routes users to appropriate dashboards based on role
- **Session Management**: AuthContext provides global auth state across the application

### Data Layer
- **Database**: Supabase (PostgreSQL)
- **ORM/Client**: Supabase JavaScript client
- **Row Level Security**: Enabled on all tables for data isolation
- **Key Tables**: 
  - profiles (user data)
  - courses, modules, videos, pdfs, tools (content)
  - enrollments, progress, certificates (learning)
  - payments (transactions)
  - registrations (pending signups)
  - notifications, email_logs (communication)

### Backend Services
Located in `backend/services/`:
- **registrationService**: Student registration with validation
- **adminService**: CRUD operations for all entities
- **emailService**: Email notifications (welcome, payment, certificates)
- **paymentService**: Razorpay payment integration
- **googleSheetsService**: Sync registrations to Google Sheets
- **studentDashboardService**: Student dashboard data and progress

### File Storage
- **Storage Provider**: Supabase Storage
- **Buckets**: course-videos (500MB), course-pdfs (50MB), student-assignments (100MB), certificates (20MB)
- **Storage Module**: Custom wrapper at `src/integrations/supabase/storage.ts` with validation and progress tracking

### Application Structure
```
├── backend/
│   ├── migrations/        # SQL migration files for Supabase
│   │   └── 000_complete_schema.sql  # Run this in Supabase SQL Editor
│   ├── services/          # Backend service modules
│   └── README.md          # Backend documentation
├── src/
│   ├── components/        # Reusable UI components
│   │   ├── ui/            # shadcn/ui primitives
│   │   ├── dashboard/     # Dashboard-specific components
│   │   └── layout/        # Layout components (Navbar, Sidebar)
│   ├── contexts/          # React contexts (AuthContext)
│   ├── integrations/      # External service integrations
│   │   └── supabase/      # Supabase client, types, storage
│   ├── pages/             # Page components
│   │   ├── admin/         # Admin dashboard pages
│   │   └── student/       # Student dashboard pages
│   ├── lib/               # Utility functions
│   └── hooks/             # Custom React hooks
└── vite.config.ts         # Vite configuration (port 5000)
```

### Key Design Patterns
- **Component Composition**: Reusable components like AdminTable for consistent CRUD interfaces
- **Layout Wrappers**: AdminLayout and DashboardLayout provide consistent page structure
- **Protected Route Pattern**: HOC-style protection for authenticated routes
- **Context-based Auth**: Global authentication state accessible via useAuth hook
- **Service Layer Pattern**: Backend services encapsulate database operations

## Database Setup

1. Go to your Supabase project dashboard
2. Navigate to SQL Editor
3. Copy contents of `backend/migrations/000_complete_schema.sql`
4. Paste and run to create all tables

## Environment Variables

Required secrets (set in Replit Secrets):
- `VITE_SUPABASE_URL` - Supabase project URL
- `VITE_SUPABASE_PUBLISHABLE_KEY` - Supabase anon key

Optional:
- `RAZORPAY_KEY_ID`, `RAZORPAY_KEY_SECRET` - For payment integration
- `GOOGLE_SHEETS_ID` - For Google Sheets sync
- `EMAIL_API_KEY` - For email notifications

## External Dependencies

### Core Services
- **Supabase**: Backend-as-a-service providing PostgreSQL database, authentication, and file storage
  - URL configured via `VITE_SUPABASE_URL`
  - Anonymous key via `VITE_SUPABASE_PUBLISHABLE_KEY`

### UI Libraries
- **Radix UI**: Headless UI primitives for accessible components (dialogs, dropdowns, tabs, etc.)
- **Lucide React**: Icon library
- **class-variance-authority**: Component variant styling
- **date-fns**: Date formatting and manipulation
- **cmdk**: Command palette functionality
- **embla-carousel-react**: Carousel/slider functionality

### Development Tools
- **TypeScript**: Static type checking
- **ESLint**: Code linting with React-specific rules
- **Vitest**: Unit testing framework
- **lovable-tagger**: Development component tagging

### Build & Configuration
- **Vite**: Build tool with React SWC plugin (runs on port 5000)
- **PostCSS & Autoprefixer**: CSS processing
- **Tailwind CSS**: Utility-first CSS framework with custom theme
