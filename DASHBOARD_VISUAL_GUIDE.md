# Student Dashboard - Visual Guide & Code Snippets

## 🎨 Dashboard Layout Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                         HEADER (DashboardHeader)                 │
│  Logo    Navigation Sidebar Toggle    User Profile Menu          │
└─────────────────────────────────────────────────────────────────┘

┌──────────────┬───────────────────────────────────────────────────┐
│              │                                                   │
│ SIDEBAR      │              MAIN CONTENT                        │
│ (Collapsed   │  ┌──────────────────────────────────────────┐   │
│  on mobile)  │  │ Welcome back, [Student Name]!            │   │
│              │  │ Continue your learning journey...        │   │
│ • Dashboard  │  └──────────────────────────────────────────┘   │
│ • My Courses │                                                   │
│ • Lessons    │  ┌──────────────────────────────────────────┐   │
│ • Resources  │  │ STATS GRID (4 Cards)                     │   │
│ • etc.       │  │ [Courses] [Lessons] [Progress] [Sessions]│   │
│              │  └──────────────────────────────────────────┘   │
│              │                                                   │
│              │  ┌──────────────────────┐  ┌────────────────┐  │
│              │  │   MY COURSES (2/3)   │  │ SIDEBAR (1/3)  │  │
│              │  │                      │  │                │  │
│              │  │ [Course Card Grid]   │  │ ┌────────────┐ │  │
│              │  │                      │  │ │   PROGRESS │ │  │
│              │  │ [Course 1] [Course 2]│  │ │            │ │  │
│              │  │ [Course 3] [Course 4]│  │ │ 45% ██████ │ │  │
│              │  │ [Course 5] [Course 6]│  │ │            │ │  │
│              │  │                      │  │ │ Courses: 3 │ │  │
│              │  │                      │  │ │ Modules: 18│ │  │
│              │  │ [View All →]         │  │ └────────────┘ │  │
│              │  │                      │  │                │  │
│              │  │                      │  │ ┌────────────┐ │  │
│              │  │                      │  │ │  SESSIONS  │ │  │
│              │  │                      │  │ │            │ │  │
│              │  │                      │  │ │ [Session1] │ │  │
│              │  │                      │  │ │ [Session2] │ │  │
│              │  │                      │  │ │ [Session3] │ │  │
│              │  │                      │  │ └────────────┘ │  │
│              │  └──────────────────────┘  └────────────────┘  │
│              │                                                   │
└──────────────┴───────────────────────────────────────────────────┘
```

## 📱 Responsive Layouts

### Mobile View (< 640px)
```
┌────────────────────────────────┐
│ [☰] Header                     │
├────────────────────────────────┤
│ Welcome back!                  │
│                                │
│ [Stat 1]                       │
│ [Stat 2]                       │
│ [Stat 3]                       │
│ [Stat 4]                       │
│                                │
│ [Course 1]                     │
│ [Course 2]                     │
│                                │
│ [Progress Card]                │
│ [Sessions Card]                │
└────────────────────────────────┘
```

### Tablet View (640px - 1024px)
```
┌────────────────────────────────┐
│ [☰] Header                     │
├────────────────────────────────┤
│ Welcome back!                  │
│                                │
│ [Stat 1]  [Stat 2]             │
│ [Stat 3]  [Stat 4]             │
│                                │
│ [Course 1]  [Course 2]         │
│ [Course 3]  [Course 4]         │
│                                │
│ [Progress]  [Sessions]         │
└────────────────────────────────┘
```

### Desktop View (1024px+)
```
┌─────────────┬──────────────────────────────┐
│             │ Header                       │
│ [Sidebar]   ├──────────────────────────────┤
│             │ Welcome back!                │
│ Dashboard   │                              │
│ My Courses  │ [Stat 1] [Stat 2] [Stat 3] [Stat 4]
│ Lessons     │                              │
│ Resources   │ [C1] [C2] [C3]   [Progress]  │
│ etc.        │ [C4] [C5] [C6]   [Sessions]  │
│             │                              │
└─────────────┴──────────────────────────────┘
```

## 🃏 Course Card Component

```
┌──────────────────────┐
│                      │  ← Hover: Scale 110%, Play icon appears
│  [Course Thumbnail]  │
│                      │
├──────────────────────┤
│ Course Title         │
│ (max 2 lines)        │
│                      │
│ Course description   │
│ (max 2 lines)        │
│                      │
│ Progress: 75%        │
│ ████████░░ 75%       │
│ 9 of 12 modules      │
│                      │
│ [Continue Learning]  │ ← Clickable: Navigates to /student/courses/{courseId}
└──────────────────────┘
```

## 📊 Key Code Snippets

### 1. Student Profile Fetch
```typescript
const fetchStudentProfile = async () => {
  try {
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      navigate("/login");
      return;
    }

    const { data, error: profileError } = await supabase
      .from("students")
      .select("name, overall_completion_percentage")
      .eq("user_id", user.id)
      .single();

    if (profileError) {
      console.warn("Could not fetch student profile:", profileError);
      setStudentName(user.email?.split("@")[0] || "Student");
    } else if (data) {
      setStudentName(data.name || user.email?.split("@")[0] || "Student");
      setOverallCompletion(data.overall_completion_percentage || 0);
    }
  } catch (err) {
    console.error("Error fetching student profile:", err);
  }
};
```

### 2. Courses Fetch with Modules
```typescript
const fetchCourses = async () => {
  try {
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return;

    // Get enrolled courses
    const { data, error: coursesError } = await supabase
      .from("courses")
      .select(`
        id,
        title,
        description,
        thumbnail,
        enrollments!inner(id, user_id)
      `)
      .eq("enrollments.user_id", user.id)
      .limit(6);

    if (coursesError) {
      console.error("Error fetching courses:", coursesError);
      setError("Failed to load courses");
      return;
    }

    if (data) {
      // Fetch modules for each course
      const coursesWithProgress = await Promise.all(
        data.map(async (course) => {
          const { data: modulesData } = await supabase
            .from("course_modules")
            .select("id, is_completed", { count: "exact" })
            .eq("course_id", course.id);

          const completedModules = modulesData?.filter(
            (m) => m.is_completed
          ).length || 0;
          const totalModules = modulesData?.length || 0;

          return {
            id: course.id,
            title: course.title,
            description: course.description || "",
            thumbnail:
              course.thumbnail ||
              `https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=250&fit=crop`,
            modules_completed: completedModules,
            modules_total: totalModules,
          };
        })
      );

      setCourses(coursesWithProgress);
    }
  } catch (err) {
    console.error("Error fetching courses:", err);
    setError("Failed to load courses");
  }
};
```

### 3. Live Sessions Fetch
```typescript
const fetchLiveSessions = async () => {
  try {
    const now = new Date().toISOString();

    const { data, error: sessionsError } = await supabase
      .from("live_sessions")
      .select("id, title, description, scheduled_at, instructor_name")
      .gte("scheduled_at", now)  // Only future sessions
      .order("scheduled_at", { ascending: true })
      .limit(5);

    if (sessionsError) {
      console.error("Error fetching live sessions:", sessionsError);
      return;
    }

    if (data) {
      setLiveSessions(data);
    }
  } catch (err) {
    console.error("Error fetching live sessions:", err);
  }
};
```

### 4. Course Click Handler
```typescript
const handleCourseClick = (courseId: string) => {
  navigate(`/student/courses/${courseId}`);
};
```

### 5. Completion Percentage Calculator
```typescript
const calculateCompletionPercentage = (completed: number, total: number) => {
  return total > 0 ? Math.round((completed / total) * 100) : 0;
};
```

## 🎨 Tailwind CSS Classes Reference

### Grid Layouts
```typescript
// Main content grid: 2/3 left, 1/3 right on desktop
<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
  <div className="lg:col-span-2">Left Content (2/3)</div>
  <div>Right Content (1/3)</div>
</div>

// Course cards: Responsive columns
<div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
  {/* Cards */}
</div>

// Stats: 1, 2, or 4 columns
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
  {/* Stats */}
</div>
```

### Progress Bar
```typescript
<div className="flex justify-between text-xs mb-2">
  <span className="text-muted-foreground">Progress</span>
  <span className="text-primary font-medium">75%</span>
</div>
<div className="w-full bg-muted rounded-full h-2">
  <div
    className="bg-primary h-2 rounded-full transition-all duration-300"
    style={{ width: `${completionPercentage}%` }}
  />
</div>
```

### Card with Gradient
```typescript
<Card className="p-6 bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
  {/* Content */}
</Card>
```

### Hover Effects
```typescript
<div className="transition-all duration-300 hover:glow-teal hover:scale-105">
  {/* Content */}
</div>
```

### Badge Styling
```typescript
{isSoon && (
  <span className="text-xs px-2 py-1 rounded bg-orange-500/20 text-orange-600">
    Soon
  </span>
)}

{isToday && (
  <span className="text-xs px-2 py-1 rounded bg-green-500/20 text-green-600">
    Today
  </span>
)}
```

## 📋 State Management Overview

```typescript
const [studentName, setStudentName] = useState("Student");
  // Used for: Welcome message, DashboardLayout prop

const [courses, setCourses] = useState<Course[]>([]);
  // Used for: Course grid, stats calculations

const [liveSessions, setLiveSessions] = useState<LiveSession[]>([]);
  // Used for: Sessions list display, count in stats

const [overallCompletion, setOverallCompletion] = useState(0);
  // Used for: Overall progress stat, progress bar

const [loading, setLoading] = useState(true);
  // Used for: Skeleton loaders during fetch

const [error, setError] = useState<string | null>(null);
  // Used for: Error alert display
```

## 🔄 Component Lifecycle

```
Component Mounts
    ↓
useEffect runs once
    ↓
setLoading(true)
    ↓
Parallel fetch:
  ├─ fetchStudentProfile()
  ├─ fetchCourses()
  └─ fetchLiveSessions()
    ↓
State updates:
  ├─ setStudentName()
  ├─ setCourses()
  ├─ setLiveSessions()
  ├─ setOverallCompletion()
  ├─ setError() (if any)
  └─ setLoading(false)
    ↓
Component Re-renders
    ↓
User sees:
  ├─ Welcome message with name
  ├─ Stats cards
  ├─ Course grid
  └─ Sessions sidebar
    ↓
User can interact:
  ├─ Click course → Navigate
  ├─ View sessions
  └─ Check progress
```

## 💾 Database Relationships

```
┌──────────────────┐
│ auth.users       │
│ id (UUID)        │
└────────┬─────────┘
         │ user_id
         │
    ┌────▼──────────┐
    │ students       │
    │ • user_id      │
    │ • name         │
    │ • overall_%    │
    └────┬──────────┘
         │
         │ user_id
         │
    ┌────▼──────────────┐
    │ enrollments        │
    │ • user_id          │
    │ • course_id        │
    └────┬──────────────┘
         │ course_id
         │
    ┌────▼──────────────┐
    │ courses            │
    │ • id               │
    │ • title            │
    │ • description      │
    │ • thumbnail        │
    └────┬──────────────┘
         │ course_id
         │
    ┌────▼──────────────┐
    │ course_modules     │
    │ • course_id        │
    │ • title            │
    │ • is_completed     │
    └────────────────────┘

    ┌────────────────────┐
    │ live_sessions      │
    │ • id               │
    │ • title            │
    │ • scheduled_at     │
    │ • instructor_name  │
    └────────────────────┘
```

## 🎯 Key Features at a Glance

| Feature | Implementation | Status |
|---------|---|---|
| Load student profile | Supabase auth + students table | ✅ |
| Display courses | Course cards with progress | ✅ |
| Calculate progress | modules_completed/modules_total | ✅ |
| Show live sessions | Future sessions from DB | ✅ |
| Responsive design | Tailwind breakpoints | ✅ |
| Navigation | Click course → /student/courses/:id | ✅ |
| Loading states | Skeleton loaders | ✅ |
| Error handling | Error alert display | ✅ |
| Auth protection | Redirect to login | ✅ |
| RLS security | Database level access control | ✅ |

---

This visual guide complements the complete implementation in [src/pages/student/StudentDashboard.tsx](src/pages/student/StudentDashboard.tsx)
