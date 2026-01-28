# Student Dashboard - Quick Start Guide

## ⚡ 5-Minute Setup

### Step 1: Database Setup (2 minutes)
```bash
1. Go to your Supabase project dashboard
2. Click "SQL Editor" → "New Query"
3. Copy all SQL from SUPABASE_SCHEMA_SETUP.md
4. Paste and execute the queries
5. Wait for tables to be created
```

### Step 2: Insert Sample Data (1 minute)
```bash
1. In SQL Editor, run the sample insert statements
2. Or use the Supabase Table Editor UI to add data manually
```

### Step 3: Verify Environment Variables (1 minute)
```bash
Check .env file has:
✅ VITE_SUPABASE_PROJECT_ID
✅ VITE_SUPABASE_PUBLISHABLE_KEY
✅ VITE_SUPABASE_URL
```

### Step 4: Run Application (1 minute)
```bash
npm run dev
# or
bun dev
```

### Step 5: Test Dashboard
```bash
1. Visit http://localhost:5173/login
2. Sign in with test account
3. Visit http://localhost:5173/student
4. You should see your dashboard!
```

## 🎯 What You'll See

```
✅ Welcome message with your name
✅ 4 stats showing courses, progress, sessions
✅ Grid of enrolled courses
✅ Course progress bars
✅ Sidebar with overall completion %
✅ List of upcoming live sessions
✅ Fully responsive on mobile, tablet, desktop
```

## 📊 Key Tables & Columns

### Minimal Schema (Just to get started)

```sql
-- Students
CREATE TABLE students (
  id UUID PRIMARY KEY,
  user_id UUID UNIQUE,
  name VARCHAR(255),
  overall_completion_percentage INTEGER
);

-- Courses
CREATE TABLE courses (
  id UUID PRIMARY KEY,
  title VARCHAR(255),
  description TEXT,
  thumbnail VARCHAR(500),
  is_published BOOLEAN
);

-- Enrollments
CREATE TABLE enrollments (
  user_id UUID,
  course_id UUID,
  UNIQUE(user_id, course_id)
);

-- Course Modules
CREATE TABLE course_modules (
  id UUID PRIMARY KEY,
  course_id UUID,
  is_completed BOOLEAN
);

-- Live Sessions
CREATE TABLE live_sessions (
  id UUID PRIMARY KEY,
  title VARCHAR(255),
  scheduled_at TIMESTAMP,
  instructor_name VARCHAR(255)
);
```

## 🔍 Debugging Checklist

If something doesn't work:

```
[ ] Check .env file has Supabase keys
[ ] Verify tables exist in Supabase SQL Editor
[ ] Check database has sample data
[ ] Verify user is authenticated
[ ] Check browser console for errors
[ ] Check Supabase logs for query errors
[ ] Verify RLS policies aren't blocking queries
[ ] Check course_modules table has data
[ ] Verify enrolled courses exist for user
[ ] Check live_sessions are scheduled in future
```

## 📱 Responsive Test

```bash
Desktop (1920px):
  ✅ 4 columns for courses
  ✅ Sidebar visible
  ✅ All content visible

Tablet (768px):
  ✅ 2 columns for courses
  ✅ Sidebar visible
  ✅ Content properly spaced

Mobile (375px):
  ✅ 1 column for courses
  ✅ Sidebar collapsed
  ✅ Touch-friendly spacing
```

## 🔒 Security Checklist

```
[ ] RLS policies enabled on all tables
[ ] User can only see own data
[ ] Auth middleware protecting routes
[ ] No sensitive data in component state
[ ] Supabase auth configured correctly
```

## 📚 File Locations

```
src/pages/student/StudentDashboard.tsx
  ↑
  Main dashboard component

src/integrations/supabase/client.ts
  ↑
  Supabase connection

SUPABASE_SCHEMA_SETUP.md
  ↑
  Database setup SQL

STUDENT_DASHBOARD_INTEGRATION.md
  ↑
  Detailed integration guide

STUDENT_DASHBOARD_IMPLEMENTATION.md
  ↑
  Complete implementation docs

DASHBOARD_VISUAL_GUIDE.md
  ↑
  Visual reference & code snippets
```

## 🚀 Common Customizations

### Change number of visible courses
```typescript
// Line 82 in StudentDashboard.tsx
.limit(6)  // Change to any number
```

### Change number of live sessions
```typescript
// Line 107 in StudentDashboard.tsx
.limit(5)  // Change to any number
```

### Change course grid columns
```typescript
// Line 288 in StudentDashboard.tsx
grid-cols-1 md:grid-cols-2 xl:grid-cols-3
// Options: grid-cols-1, 2, 3, 4, 5, 6
```

### Customize welcome message
```typescript
// Line 237 in StudentDashboard.tsx
Welcome back, <span className="text-gradient">{studentName}!</span>
```

## ❓ FAQ

**Q: No courses showing?**  
A: Check that courses table has data and enrollments exist

**Q: Student name shows "Student"?**  
A: Insert a record in students table for the user

**Q: No live sessions?**  
A: Create sessions with scheduled_at in the future

**Q: Dashboard shows error?**  
A: Check RLS policies aren't blocking access

**Q: Mobile layout broken?**  
A: Clear browser cache and restart dev server

**Q: Progress % not calculating?**  
A: Ensure course_modules table has is_completed column

## 🔗 Links

- [Supabase Docs](https://supabase.com/docs)
- [React Docs](https://react.dev)
- [Tailwind CSS](https://tailwindcss.com)
- [Your Dashboard](/student)
- [Course Management](/student/courses)

## ✨ Features You Have

```
✅ Real-time data from Supabase
✅ Student authentication
✅ Course enrollment tracking
✅ Progress percentage calculation
✅ Live session scheduling
✅ Responsive design (mobile, tablet, desktop)
✅ Loading states and skeletons
✅ Error handling
✅ Navigation to course details
✅ Student profile display
✅ Overall completion tracking
✅ Session filtering (future only)
```

## 📞 Need Help?

1. Check the documentation files:
   - STUDENT_DASHBOARD_README.md
   - SUPABASE_SCHEMA_SETUP.md
   - STUDENT_DASHBOARD_INTEGRATION.md
   - DASHBOARD_VISUAL_GUIDE.md

2. Check browser console for errors
3. Check Supabase dashboard for issues
4. Verify database schema matches setup guide
5. Ensure sample data is inserted

## 🎉 You're All Set!

Your Student Dashboard is ready to use. Visit `/student` to see it in action!

---

**Last Updated**: January 26, 2026  
**Status**: ✅ Ready to Use
