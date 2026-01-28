# Student Dashboard Integration Guide

## Quick Start

### 1. Database Setup
Follow the instructions in `SUPABASE_SCHEMA_SETUP.md` to:
- Create all required tables in your Supabase project
- Set up Row Level Security (RLS) policies
- Insert sample data for testing

### 2. Environment Configuration
Your `.env` file should already have:
```
VITE_SUPABASE_URL=https://uzapgcifvklkrtvglzuc.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=sb_publishable_T6b8g8yHnvvU9KMszW_6ig_0VA3-6sr
```

### 3. Test the Dashboard
1. Navigate to `http://localhost:5173/login`
2. Sign in with your test account
3. Navigate to `http://localhost:5173/student`
4. You should see your dashboard with courses and live sessions

## File Structure

```
src/
├── pages/
│   └── student/
│       └── StudentDashboard.tsx          ← Main component
├── integrations/
│   └── supabase/
│       ├── client.ts                      ← Supabase client initialization
│       └── types.ts                       ← Type definitions
├── components/
│   ├── dashboard/
│   │   ├── DashboardLayout.tsx            ← Layout wrapper
│   │   ├── DashboardSidebar.tsx           ← Navigation sidebar
│   │   ├── DashboardHeader.tsx            ← Header with user info
│   │   ├── StatsCard.tsx                  ← Stats display component
│   │   └── CourseCard.tsx                 ← Course card component
│   └── ui/
│       ├── button.tsx
│       ├── card.tsx
│       ├── skeleton.tsx
│       └── ... other UI components
└── lib/
    └── utils.ts                           ← Utility functions
```

## Component Props & Types

### Course Type
```typescript
interface Course {
  id: string;
  title: string;
  description: string;
  thumbnail?: string;
  modules_completed: number;
  modules_total: number;
}
```

### LiveSession Type
```typescript
interface LiveSession {
  id: string;
  title: string;
  description?: string;
  scheduled_at: string;  // ISO 8601 datetime
  instructor_name: string;
}
```

### StudentProfile Type
```typescript
interface StudentProfile {
  name: string;
  overall_completion_percentage?: number;
}
```

## API Queries Explained

### 1. Fetch Student Profile
```typescript
const { data } = await supabase
  .from("students")
  .select("name, overall_completion_percentage")
  .eq("user_id", user.id)
  .single();
```
- Gets student name and overall progress
- Returns a single row
- Requires authenticated user

### 2. Fetch Enrolled Courses
```typescript
const { data } = await supabase
  .from("courses")
  .select(`
    id, title, description, thumbnail,
    enrollments!inner(id, user_id)
  `)
  .eq("enrollments.user_id", user.id)
  .limit(6);
```
- Fetches courses where user has an enrollment
- Uses inner join to filter by enrollment
- Limited to 6 courses
- Loads course modules in a separate query

### 3. Fetch Course Modules
```typescript
const { data: modulesData } = await supabase
  .from("course_modules")
  .select("id, is_completed", { count: "exact" })
  .eq("course_id", course.id);
```
- Gets all modules for a specific course
- Counts completed vs total modules
- Used to calculate completion percentage

### 4. Fetch Live Sessions
```typescript
const { data } = await supabase
  .from("live_sessions")
  .select("id, title, description, scheduled_at, instructor_name")
  .gte("scheduled_at", now)
  .order("scheduled_at", { ascending: true })
  .limit(5);
```
- Only fetches future sessions (after now)
- Orders by schedule time (ascending)
- Limited to 5 sessions
- Returns instructor name for display

## State Management

The component uses React hooks:

```typescript
const [studentName, setStudentName] = useState("Student");
const [courses, setCourses] = useState<Course[]>([]);
const [liveSessions, setLiveSessions] = useState<LiveSession[]>([]);
const [overallCompletion, setOverallCompletion] = useState(0);
const [loading, setLoading] = useState(true);
const [error, setError] = useState<string | null>(null);
```

## Data Flow Diagram

```
App.tsx
  ↓
StudentDashboard.tsx
  ├─→ useEffect (on mount)
  │   ├─→ fetchStudentProfile()
  │   │   └─→ supabase.auth.getUser()
  │   │   └─→ supabase.from("students").select()
  │   │   └─→ setStudentName, setOverallCompletion
  │   ├─→ fetchCourses()
  │   │   └─→ supabase.from("courses").select()
  │   │   └─→ For each course: fetch course_modules
  │   │   └─→ Calculate modules_completed/modules_total
  │   │   └─→ setCourses
  │   └─→ fetchLiveSessions()
  │       └─→ supabase.from("live_sessions").select()
  │       └─→ Filter future sessions
  │       └─→ setLiveSessions
  ├─→ DashboardLayout (wrapper)
  │   ├─→ DashboardSidebar (navigation)
  │   ├─→ DashboardHeader (user info)
  │   └─→ Main content area
  │       ├─→ Stats cards (with course data)
  │       ├─→ Course grid (map courses to CourseCard)
  │       │   └─→ Each card is clickable (navigate to /student/courses/{courseId})
  │       └─→ Sidebar
  │           ├─→ Student progress card
  │           └─→ Live sessions list

User clicks course card
  ↓
handleCourseClick(courseId)
  ↓
navigate(`/student/courses/${courseId}`)
  ↓
StudentCourses or module detail page
```

## Responsive Breakpoints

```
Mobile (< 640px)
├─ Single column layout
├─ Full-width course cards
├─ Sidebar under hamburger menu
└─ Stats cards stack vertically

Tablet (640px - 1024px)
├─ 2 column layout for courses
├─ Stats cards: 2 per row
├─ Sidebar still collapsible
└─ Adjusted padding

Desktop (1024px - 1536px)
├─ 3 columns for courses
├─ 2/3 + 1/3 grid for main content
├─ Sidebar always visible
└─ Full spacing

Large Desktop (> 1536px)
├─ 4 columns for courses
├─ Full featured layout
├─ Generous padding
└─ All content visible
```

## Error Handling

The component handles several error scenarios:

1. **Auth Error**: User not authenticated
   ```typescript
   if (!user) {
     navigate("/login");
     return;
   }
   ```

2. **Database Errors**: Query failures
   ```typescript
   if (coursesError) {
     setError("Failed to load courses");
     return;
   }
   ```

3. **Profile Not Found**: Fallback to email
   ```typescript
   setStudentName(user.email?.split("@")[0] || "Student");
   ```

4. **Empty States**: Show appropriate messages
   ```typescript
   {courses.length > 0 ? (
     <div>/* render courses */</div>
   ) : (
     <Card>/* empty state */</Card>
   )}
   ```

## Performance Optimizations

1. **Parallel Queries**: All fetch calls run in parallel
   ```typescript
   await Promise.all([
     fetchStudentProfile(),
     fetchCourses(),
     fetchLiveSessions()
   ]);
   ```

2. **Limits**: Only fetch necessary data
   - Courses: Limited to 6
   - Sessions: Limited to 5
   - Modules: Fetched per course as needed

3. **Caching**: Supabase auth client caches user session

4. **Lazy Rendering**: Skeleton loaders while data loads

## Security Considerations

1. **RLS Policies**: Database-level access control
2. **Auth Check**: Always verify user before displaying data
3. **Client-side**: Data is filtered by user_id in queries
4. **Sensitive Data**: No passwords or tokens in state

## Debugging Tips

### Check if courses load:
```typescript
// Add console.log in fetchCourses
console.log("Fetched courses:", courses);
```

### Check Supabase connection:
```typescript
// In browser console
import { supabase } from "@/integrations/supabase/client";
const { data } = await supabase.from("courses").select();
console.log(data);
```

### Check authentication:
```typescript
// In browser console
const { data } = await supabase.auth.getUser();
console.log(data.user);
```

### Check RLS policies:
1. Go to Supabase dashboard
2. Click "Editor" → Tables
3. Check "Row Security" tab
4. Verify policies are enabled

## Common Issues & Solutions

| Issue | Cause | Solution |
|-------|-------|----------|
| Dashboard shows no courses | Courses not in database or user not enrolled | Check enrollments table |
| Student name shows as "Student" | Profile not found in students table | Insert student record |
| Live sessions not showing | No future sessions scheduled | Insert test sessions with future dates |
| "Failed to load courses" error | Query error or RLS policy blocking | Check browser console and RLS policies |
| Completion percentage wrong | Module data not synced | Ensure course_modules table has data |
| Redirect to login on load | User not authenticated | Login first before accessing /student |

## Next Steps

1. **Customize styling**: Modify Tailwind classes in StudentDashboard.tsx
2. **Add more features**: 
   - Course search/filter
   - Achievement badges
   - Study streak counter
3. **Real-time updates**: Add Supabase realtime subscriptions
4. **Analytics**: Track which courses are most popular
5. **Notifications**: Alert students about upcoming sessions

## Support

For issues:
1. Check browser console for errors
2. Check Supabase logs in dashboard
3. Verify RLS policies are correctly set
4. Ensure sample data exists in tables
5. Check that user is properly authenticated
