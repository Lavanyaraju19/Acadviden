# Authentication Architecture Overview

## System Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                        User Browser                          │
│  ┌──────────────────────────────────────────────────────┐  │
│  │                    React App                         │  │
│  │                                                       │  │
│  │  ┌────────────────────────────────────────────────┐ │  │
│  │  │           App.tsx (Root)                       │ │  │
│  │  │  ┌──────────────────────────────────────────┐ │ │  │
│  │  │  │      AuthProvider (Context Wrapper)      │ │ │  │
│  │  │  │                                          │ │ │  │
│  │  │  │  ┌──────────────────────────────────┐  │ │ │  │
│  │  │  │  │  BrowserRouter (Routes)          │  │ │ │  │
│  │  │  │  │                                  │  │ │ │  │
│  │  │  │  │ Public Routes:                   │  │ │ │  │
│  │  │  │  │  • / (Index)                     │  │ │ │  │
│  │  │  │  │  • /courses (Courses)            │  │ │ │  │
│  │  │  │  │  • /login (Login Page)           │  │ │ │  │
│  │  │  │  │  • /register (Register Page)     │  │ │ │  │
│  │  │  │  │  • /dashboard (Smart Redirect)   │  │ │ │  │
│  │  │  │  │                                  │  │ │ │  │
│  │  │  │  │ Protected Student Routes:        │  │ │ │  │
│  │  │  │  │  • /student (ProtectedRoute)     │  │ │ │  │
│  │  │  │  │  • /student/courses              │  │ │ │  │
│  │  │  │  │  • ... (all student routes)      │  │ │ │  │
│  │  │  │  │                                  │  │ │ │  │
│  │  │  │  │ Protected Admin Routes:          │  │ │ │  │
│  │  │  │  │  • /admin (ProtectedRoute +      │  │ │ │  │
│  │  │  │  │    requiredRole="admin")         │  │ │ │  │
│  │  │  │  │  • ... (all admin routes)        │  │ │ │  │
│  │  │  │  │                                  │  │ │ │  │
│  │  │  │  └──────────────────────────────────┘  │ │ │  │
│  │  │  │                                          │ │ │  │
│  │  │  │  ┌──────────────────────────────────┐  │ │ │  │
│  │  │  │  │   Components Using useAuth:      │  │ │ │  │
│  │  │  │  │   • Navbar (Shows user menu)     │  │ │ │  │
│  │  │  │  │   • Login (Redirects to dash)    │  │ │ │  │
│  │  │  │  │   • Register (Creates student)   │  │ │ │  │
│  │  │  │  │   • All protected components     │  │ │ │  │
│  │  │  │  └──────────────────────────────────┘  │ │ │  │
│  │  │  │                                          │ │ │  │
│  │  │  └──────────────────────────────────────────┘ │ │  │
│  │  └────────────────────────────────────────────────┘ │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
         │                                        │
         │                                        │
         ├─ Uses Hooks ──────────────────────────┤
         │  • useAuth()                           │
         │  • useNavigate()                       │
         │  • useState()                          │
         │  • useEffect()                         │
         │                                        │
         ▼                                        ▼
┌─────────────────────────┐        ┌──────────────────────────┐
│    AuthContext.tsx      │        │   ProtectedRoute.tsx     │
│                         │        │                          │
│ • session state         │        │ • Checks authentication  │
│ • user state            │        │ • Validates role         │
│ • userProfile state     │        │ • Shows loading state    │
│ • isLoading state       │        │ • Redirects if needed    │
│ • signOut function      │        │ • Wraps components       │
│ • useAuth hook          │        │                          │
│ • fetchUserProfile()    │        │ ProtectedRoute Props:    │
│ • Auth subscriptions    │        │ • children (required)    │
│                         │        │ • requiredRole (optional)│
│ Provides to all         │        │                          │
│ consuming components    │        │ Used on:                 │
└─────────────────────────┘        │ • Student routes         │
         │                         │ • Admin routes           │
         │                         │ • Custom routes          │
         │                         └──────────────────────────┘
         │
         ▼
┌──────────────────────────────────────────────┐
│          Supabase Auth & Database             │
│                                              │
│ ┌──────────────────────────────────────────┐│
│ │  Supabase Auth Service                   ││
│ │  • auth.users table (managed)            ││
│ │  • Sessions (tokens)                     ││
│ │  • Email authentication                  ││
│ │  • Password hashing (bcrypt)             ││
│ │  • Session persistence                   ││
│ └──────────────────────────────────────────┘│
│                                              │
│ ┌──────────────────────────────────────────┐│
│ │  Custom Tables (RLS Protected)           ││
│ │                                          ││
│ │  students                  admins         ││
│ │  ├─ id (UUID)             ├─ id         ││
│ │  ├─ user_id (FK)          ├─ user_id    ││
│ │  ├─ name                  ├─ name       ││
│ │  ├─ email                 ├─ email      ││
│ │  ├─ role ('student')      ├─ role       ││
│ │  ├─ avatar_url            ├─ avatar_url ││
│ │  └─ RLS Policies          └─ RLS...     ││
│ │     ├─ View own           ├─ View own   ││
│ │     ├─ Update own         ├─ Admin only ││
│ │     └─ Admin can view     │             ││
│ │                                          ││
│ └──────────────────────────────────────────┘│
└──────────────────────────────────────────────┘
```

## Component Interaction Flow

### 1. Application Startup

```
App renders
    ↓
AuthProvider initializes
    ↓
supabase.auth.getSession()
    ↓
    └─ Has session? ──Yes──→ setSession()
    │                          ↓
    │                    fetchUserProfile()
    │                          ↓
    │                    Query students table
    │                          ↓
    │                    setUserProfile()
    │                          ↓
    │                    setIsLoading(false)
    │
    └─ No session? ────Yes──→ setSession(null)
                                  ↓
                            setUserProfile(null)
                                  ↓
                            setIsLoading(false)
    ↓
OnAuthStateChange listener attached
    ↓
App renders children with auth state
```

### 2. Login Flow

```
User visits /login
    ↓
Enters email and password
    ↓
Clicks "Sign In"
    ↓
supabase.auth.signInWithPassword()
    ↓
Supabase Auth Service
    └─ Validates credentials ──Yes──→ Returns session
                                           ↓
                                    AuthContext receives event
                                           ↓
                                    setSession(session)
                                           ↓
                                    fetchUserProfile()
                                           ↓
                                    setUserProfile(profile)
                                           ↓
                                    navigate("/dashboard")
                                           ↓
                                    AuthRedirect component
                                           ↓
                                    Check role
                                           ↓
                    ┌───────────────┴───────────────┐
                    ▼                               ▼
            If admin:                        If student:
            navigate("/admin")               navigate("/student")
```

### 3. Protected Route Access

```
User clicks protected route link
    ↓
Router navigates to /student/some-page
    ↓
ProtectedRoute component renders
    ↓
    ├─ isLoading? ────Yes──→ Show Skeleton loader
    │                             ↓
    │                    Wait for auth check
    │
    ├─ No user? ────Yes──→ Navigate to /login
    │
    ├─ User exists? ────Yes──→ Check role requirement
    │                            ↓
    │                      Role required?
    │                            │
    │                    ┌───────┴────────┐
    │                    ▼                ▼
    │              No: Render     Yes: Check match
    │              component            ↓
    │                           ┌───────┴────────┐
    │                           ▼                ▼
    │                       Match:          Mismatch:
    │                      Render      Navigate to correct
    │                    component        dashboard
    │
    └─ No user? ────No──→ Unexpected error
                             ↓
                        Redirect to login
```

### 4. Logout Flow

```
User clicks "Sign Out" in navbar
    ↓
handleSignOut() called
    ↓
supabase.auth.signOut()
    ↓
Supabase clears session
    ↓
AuthContext receives onAuthStateChange event
    ↓
setSession(null)
    ↓
setUser(null)
    ↓
setUserProfile(null)
    ↓
localStorage cleared
    ↓
navigate("/login")
    ↓
User sees login page
```

## Data Flow

### Authentication State

```
AuthContext provides:
┌─────────────────────────────────────────┐
│ session: Session | null                 │
│ └─ Supabase session object              │
│                                         │
│ user: User | null                       │
│ └─ Supabase user object                 │
│    ├─ id (UUID)                         │
│    ├─ email                             │
│    └─ metadata                          │
│                                         │
│ userProfile: UserProfile | null         │
│ ├─ id (from students/admins table)     │
│ ├─ email                                │
│ ├─ role: "student" | "admin"           │
│ └─ name                                 │
│                                         │
│ isLoading: boolean                      │
│ └─ Auth check in progress               │
│                                         │
│ signOut: () => Promise<void>            │
│ └─ Sign out function                    │
└─────────────────────────────────────────┘
```

### User Profile Resolution

```
New user signs up
    ↓
Supabase creates auth.users record
    ↓
Trigger fires: handle_new_user()
    ↓
Auto-inserts into students table
    ├─ user_id (from auth.users)
    ├─ name (from email or metadata)
    ├─ email
    └─ role = 'student'
    ↓
User logs in
    ↓
AuthContext.fetchUserProfile()
    ↓
Query students table
    ├─ Success: setUserProfile(student)
    └─ Not found: Query admins table
                   ├─ Success: setUserProfile(admin)
                   └─ Not found: Auto-create student profile
```

## Security Layers

### 1. Supabase Auth
```
password123 (user input)
    ↓
hash(password123) [bcrypt]
    ↓
Stored in Supabase
    ↓
On login: Compare hashes
    ↓
Returns: Access Token + Refresh Token
```

### 2. Session Management
```
Access Token (short-lived, 1 hour)
    ├─ Sent with API requests
    ├─ Verified by Supabase
    └─ Auto-refreshed before expiry

Refresh Token (long-lived, 7 days)
    ├─ Stored securely
    ├─ Used to get new access token
    └─ Can be revoked
```

### 3. Row Level Security (RLS)
```
students table:
├─ User can view own row: user_id = auth.uid()
├─ User can update own row
└─ Admins can view all rows

admins table:
├─ Admin can view other admins
└─ Update own profile only
```

### 4. Route Protection
```
Public Route
    └─ No checks, direct access

Protected Student Route
    ├─ Check: User authenticated?
    ├─ Check: userProfile exists?
    └─ If fails: Redirect to /login

Protected Admin Route
    ├─ Check: User authenticated?
    ├─ Check: userProfile exists?
    ├─ Check: role === "admin"?
    └─ If fails: Redirect to /student
```

## Files and Structure

```
src/
├── contexts/
│   └── AuthContext.tsx (Auth state & hooks)
│
├── components/
│   ├── ProtectedRoute.tsx (Route protection)
│   ├── AuthRedirect.tsx (Smart redirect)
│   └── layout/
│       └── Navbar.tsx (User menu)
│
├── pages/
│   ├── Login.tsx (Updated: redirects to /dashboard)
│   ├── Register.tsx (Updated: redirects to /dashboard)
│   ├── ForgotPassword.tsx (Unchanged)
│   ├── student/
│   │   ├── StudentDashboard.tsx (Protected)
│   │   └── ... (all protected)
│   └── admin/
│       ├── AdminDashboard.tsx (Protected + role check)
│       └── ... (all protected + role check)
│
├── integrations/
│   └── supabase/
│       └── client.ts (Supabase setup)
│
└── App.tsx (Updated: AuthProvider + protected routes)
```

## Summary

✅ **Clean Architecture**: Separation of concerns
✅ **Reusable**: ProtectedRoute can wrap any component
✅ **Scalable**: Easy to add new protected routes
✅ **Secure**: Multi-layer security (auth + RLS + routing)
✅ **User-Friendly**: Smart redirects, loading states
✅ **Maintainable**: Clear component responsibilities

---

**Architecture Version**: 1.0  
**Last Updated**: January 26, 2026
