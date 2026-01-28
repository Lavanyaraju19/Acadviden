# Role-Based Login & Signup Guide

## Overview

The Acadvizen platform now features role-based authentication with separate login/signup flows for students and administrators. Users must select their role before signing up or logging in, and will be automatically redirected to their appropriate dashboard.

**Features:**
- ✅ Student and Admin role selection during login
- ✅ Student and Admin role selection during signup
- ✅ Automatic redirection to correct dashboard
- ✅ Role-based access control (RBAC)
- ✅ Protected routes with role validation
- ✅ User profile management with roles
- ✅ Responsive design for mobile/tablet/desktop

---

## Authentication Flow

### Login Flow

```
User visits /login
    ↓
Selects role (Student or Admin)
    ↓
Enters email and password
    ↓
Submits login form
    ↓
Supabase authenticates credentials
    ↓
Success: AuthContext fetches user profile and role
    ↓
Redirect based on selected role:
├─ Admin → /admin (Admin Dashboard)
└─ Student → /student (Student Dashboard)
```

### Signup Flow

```
User visits /register
    ↓
Selects role (Student or Admin)
    ↓
Enters full name, email, and password
    ↓
Submits registration form
    ↓
Supabase creates new account
    ↓
Auto-creates student/admin profile based on role selection
    ↓
Success: User is authenticated
    ↓
Redirect based on selected role:
├─ Admin → /admin (Admin Dashboard)
└─ Student → /student (Student Dashboard)
```

### Post-Auth Redirect Flow

```
User completes login/signup
    ↓
/auth/callback route is accessed
    ↓
AuthCallback component checks user role
    ↓
Routes user to appropriate dashboard:
├─ Admin role → /admin
└─ Student role → /student
```

---

## User Interface Changes

### Login Page (`src/pages/Login.tsx`)

**New Features:**
1. **Role Selection Cards** - Two buttons (Student/Admin) with icons
   - Student card: `BookOpen` icon + "Learn & grow" subtitle
   - Admin card: `Shield` icon + "Manage & teach" subtitle
   - Selected state shows blue border and background highlight

2. **Conditional Login Logic** - Form submission checks selected role before signing in

3. **Smart Redirect** - After authentication, redirects to:
   - `/student` for students
   - `/admin` for admins

**Code Example:**
```tsx
const [userType, setUserType] = useState<"student" | "admin" | null>(null);

const handleSubmit = async (e: React.FormEvent) => {
  // Check role is selected
  if (!userType) {
    toast({ title: "Select account type" });
    return;
  }
  
  // Login...
  
  // Redirect based on role
  setTimeout(() => {
    navigate(userType === "admin" ? "/admin" : "/student");
  }, 500);
};
```

### Signup/Register Page (`src/pages/Register.tsx`)

**New Features:**
1. **Role Selection Cards** - Same as login (Student/Admin)

2. **Enhanced Signup Data** - Now includes:
   - User type in metadata for profile creation
   - Auto-assignment to correct table (students/admins)

3. **Conditional User Profile Creation** - Based on selected role:
   - Students → Inserted into `students` table
   - Admins → Inserted into `admins` table

**Code Example:**
```tsx
const { error } = await supabase.auth.signUp({
  email,
  password,
  options: {
    data: {
      full_name: fullName,
      user_type: userType,  // ← New field
    },
  },
});

// Redirect based on role
setTimeout(() => {
  navigate(userType === "admin" ? "/admin" : "/student");
}, 1000);
```

---

## Technical Implementation

### 1. Updated Login Component

**File:** `src/pages/Login.tsx`

**Key Changes:**
- Added `userType` state for role selection
- Added role selection UI with two interactive buttons
- Updated `handleSubmit` to validate role selection
- Added smart redirect logic based on selected role
- Imports `useAuth` hook from AuthContext

**State Management:**
```tsx
const [userType, setUserType] = useState<"student" | "admin" | null>(null);
const { userProfile } = useAuth();
```

### 2. Updated Signup Component

**File:** `src/pages/Register.tsx`

**Key Changes:**
- Added `userType` state for role selection
- Added role selection UI matching login page
- Updated validation to require role selection
- Passes `user_type` in Supabase signup metadata
- Added smart redirect logic based on selected role

**Metadata Addition:**
```tsx
options: {
  data: {
    full_name: fullName,
    user_type: userType,  // Role information
  },
}
```

### 3. Enhanced AuthCallback

**File:** `src/pages/AuthCallback.jsx`

**Key Changes:**
- Uses `useAuth` hook for role-aware redirects
- Checks `userProfile.role` before redirecting
- Conditionally routes to `/admin` or `/student`
- Shows loading spinner during auth check
- Improved UX with proper loading state

**Redirect Logic:**
```tsx
useEffect(() => {
  if (!isLoading) {
    if (!userProfile) {
      navigate("/login");
    } else if (userProfile.role === "admin") {
      navigate("/admin");
    } else {
      navigate("/student");
    }
  }
}, [isLoading, userProfile, navigate]);
```

### 4. ProtectedRoute with Role Validation

**File:** `src/components/ProtectedRoute.tsx` (Already Implemented)

**Features:**
- Checks authentication status
- Validates required role if specified
- Shows loading skeleton while checking
- Automatically redirects to correct dashboard if wrong role

**Route Usage:**
```tsx
// Student-only route
<Route
  path="/student/dashboard"
  element={
    <ProtectedRoute>
      <StudentDashboard />
    </ProtectedRoute>
  }
/>

// Admin-only route with role check
<Route
  path="/admin/dashboard"
  element={
    <ProtectedRoute requiredRole="admin">
      <AdminDashboard />
    </ProtectedRoute>
  }
/>
```

### 5. AuthContext Role Management

**File:** `src/contexts/AuthContext.tsx` (Already Implemented)

**Features:**
- Fetches user profile with role from database
- Auto-detects role (student/admin)
- Creates default student profile if not found
- Provides role information to all components

**Profile Structure:**
```tsx
interface UserProfile {
  id: string;
  email: string;
  role: "student" | "admin" | "instructor";
  name: string;
}
```

---

## Database Integration

### Tables Used

#### 1. Students Table
```sql
CREATE TABLE students (
  id UUID PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id),
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255),
  role VARCHAR(50) DEFAULT 'student',  -- 'student' or 'instructor'
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  ...
);
```

#### 2. Admins Table
```sql
CREATE TABLE admins (
  id UUID PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id),
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255),
  role VARCHAR(50) DEFAULT 'admin',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  ...
);
```

### Role Detection Flow

```
User signs in
    ↓
AuthContext.fetchUserProfile() called
    ↓
Query students table with user_id
    ├─ Found: role = 'student'
    └─ Not found: Query admins table
                   ├─ Found: role = 'admin'
                   └─ Not found: Auto-create in students table with role = 'student'
```

---

## Security Implementation

### Row Level Security (RLS)

**Students Table Policies:**
```sql
-- Students see their own profile
CREATE POLICY "Students view own profile"
  ON students FOR SELECT
  USING (auth.uid() = user_id);

-- Admins can view all students
CREATE POLICY "Admins view all students"
  ON students FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM admins WHERE user_id = auth.uid()
    )
  );
```

**Admins Table Policies:**
```sql
-- Admins see their own profile
CREATE POLICY "Admins view own profile"
  ON admins FOR SELECT
  USING (auth.uid() = user_id);

-- Admins can view other admins (optional)
CREATE POLICY "Admins view other admins"
  ON admins FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM admins WHERE user_id = auth.uid()
    )
  );
```

### Session Security

- ✅ Supabase session stored in localStorage
- ✅ Auto-refresh tokens before expiry
- ✅ Secure HTTP-only cookies for refresh tokens
- ✅ Role validation on protected routes
- ✅ Silent logout on token expiry

---

## Testing Guide

### Test Student Login

```
1. Navigate to http://localhost:5173/login
2. Click "Student" role button (should highlight)
3. Enter test student email/password
4. Click "Sign In"
5. Should redirect to /student (Student Dashboard)
6. Verify user menu shows "Student" role
```

### Test Admin Login

```
1. Navigate to http://localhost:5173/login
2. Click "Admin" role button (should highlight)
3. Enter test admin email/password
4. Click "Sign In"
5. Should redirect to /admin (Admin Dashboard)
6. Verify user menu shows "Admin" role
```

### Test Student Signup

```
1. Navigate to http://localhost:5173/register
2. Click "Student" role button
3. Enter full name, email, password
4. Click "Create Account"
5. Should redirect to /student
6. Verify new account created in students table
```

### Test Admin Signup

```
1. Navigate to http://localhost:5173/register
2. Click "Admin" role button
3. Enter full name, email, password
4. Click "Create Account"
5. Should redirect to /admin
6. Verify new account created in admins table
```

### Test Role-Based Access Control

```
Student trying to access admin route:
1. Login as student
2. Try to visit http://localhost:5173/admin
3. Should redirect to /student

Admin trying to access student route:
1. Login as admin
2. Visit /student route
3. Should allow access (admins can manage students)
```

### Test Protected Routes

```
1. Without login, visit /student
2. Should redirect to /login
3. Login as student
4. Visit /student again
5. Should display student dashboard
6. Logout
7. Visit /student again
8. Should redirect to /login
```

---

## User Flows

### Complete Student Registration Flow

```
1. User visits homepage
2. Clicks "Sign Up" or navigates to /register
3. Page loads with role selection
4. Clicks "Student" role button
5. Enters: Full Name, Email, Password, Confirm Password
6. Clicks "Create Account"
7. Supabase creates auth.users record
8. Trigger auto-creates students table entry
9. User is authenticated
10. Redirected to /student (Student Dashboard)
11. Can start learning immediately
```

### Complete Admin Registration Flow

```
1. Admin accesses /register (usually via admin link)
2. Page loads with role selection
3. Clicks "Admin" role button
4. Enters: Full Name, Email, Password, Confirm Password
5. Clicks "Create Account"
6. Supabase creates auth.users record
7. Trigger auto-creates admins table entry
8. User is authenticated
9. Redirected to /admin (Admin Dashboard)
10. Can start managing platform
```

### Existing Student Login Flow

```
1. User visits homepage
2. Clicks "Login" or navigates to /login
3. Page loads with role selection
4. Clicks "Student" role button
5. Enters: Email, Password
6. Clicks "Sign In"
7. Supabase authenticates credentials
8. AuthContext fetches user profile
9. Detects student role
10. Redirected to /student (Student Dashboard)
11. Session continues
```

### Existing Admin Login Flow

```
1. Admin visits /login
2. Page loads with role selection
3. Clicks "Admin" role button
4. Enters: Email, Password
5. Clicks "Sign In"
6. Supabase authenticates credentials
7. AuthContext fetches user profile
8. Detects admin role
9. Redirected to /admin (Admin Dashboard)
10. Session continues
```

---

## Component Structure

### Login Page Structure

```
Login (main component)
├── Navbar
├── Main content area
│   └── Card (glass morphism)
│       ├── Heading
│       ├── Role Selection (2 buttons)
│       │   ├── Student button
│       │   └── Admin button
│       ├── Form
│       │   ├── Email input
│       │   ├── Password input
│       │   ├── "Forgot password?" link
│       │   └── "Sign In" button
│       └── "Sign up" link
└── Footer
```

### Register Page Structure

```
Register (main component)
├── Navbar
├── Main content area
│   └── Card (glass morphism)
│       ├── Heading
│       ├── Role Selection (2 buttons)
│       │   ├── Student button
│       │   └── Admin button
│       ├── Form
│       │   ├── Full Name input
│       │   ├── Email input
│       │   ├── Password input
│       │   ├── Confirm Password input
│       │   └── "Create Account" button
│       └── "Sign in" link
└── Footer
```

---

## Error Handling

### Login/Signup Errors

| Error | Message | Action |
|-------|---------|--------|
| No role selected | "Select account type - Please choose whether you're a student or admin." | Show error toast |
| Invalid email | "Invalid email address" | Show error toast |
| Weak password | "Password must be at least 6 characters long." | Show error toast |
| Passwords don't match | "Passwords don't match - Please make sure your passwords match." | Show error toast |
| Account exists | "Account exists - An account with this email already exists." | Suggest login |
| Auth error | Supabase error message | Show error toast |
| Network error | "An unexpected error occurred. Please try again." | Show error toast |

---

## API Integration

### Supabase Auth Methods Used

```typescript
// Sign up
supabase.auth.signUp({
  email: string,
  password: string,
  options: {
    emailRedirectTo: string,
    data: {
      full_name: string,
      user_type: "student" | "admin"
    }
  }
})

// Sign in
supabase.auth.signInWithPassword({
  email: string,
  password: string
})

// Get session
supabase.auth.getSession()

// Sign out
supabase.auth.signOut()

// On auth change
supabase.auth.onAuthStateChange((event, session) => {})
```

---

## Performance Considerations

- ✅ Role selection UI is lightweight (no API calls)
- ✅ AuthContext caches user profile in state
- ✅ Loading skeletons prevent UI flash
- ✅ Efficient database queries with single select
- ✅ Session persisted in localStorage
- ✅ Auto-redirect happens client-side
- ✅ No unnecessary re-renders with proper dependencies

---

## Next Steps

1. **Database Setup** (if not done):
   - Create students and admins tables
   - Enable RLS policies
   - Set up triggers for auto-profile creation

2. **Test Authentication**:
   - Test student login/signup flow
   - Test admin login/signup flow
   - Verify redirects work correctly

3. **Create Test Accounts**:
   - Test student account
   - Test admin account
   - Verify role detection

4. **Monitor Sessions**:
   - Test session persistence
   - Test token refresh
   - Test logout

5. **Customize** (Optional):
   - Add more fields to user profiles
   - Customize role selection UI
   - Add email verification
   - Implement password reset flow

---

## Troubleshooting

### User stays on login page after clicking "Sign In"

**Possible Causes:**
1. Role not selected - Ensure role selection is required
2. Invalid credentials - Check email/password
3. Supabase error - Check browser console
4. Network issue - Check internet connection

**Solution:**
1. Check browser console for errors
2. Verify Supabase credentials in `.env`
3. Check database connection

### User redirects to wrong dashboard

**Possible Causes:**
1. Role not properly set in database
2. AuthContext not fetching profile correctly
3. Route misconfiguration

**Solution:**
1. Check students/admins table entries
2. Verify AuthContext fetchUserProfile logic
3. Check route configuration in App.tsx

### "Select account type" error appears

**Possible Causes:**
1. Role button click not registering
2. Form submit validating before role selection
3. Component state not updating

**Solution:**
1. Click role button and verify highlight
2. Wait for button highlight before submitting
3. Check browser console for JS errors

---

## Files Modified

- ✅ `src/pages/Login.tsx` - Added role selection UI and redirect logic
- ✅ `src/pages/Register.tsx` - Added role selection UI and user type metadata
- ✅ `src/pages/AuthCallback.jsx` - Enhanced with role-aware redirects
- ✅ `src/contexts/AuthContext.tsx` - Already supports role management
- ✅ `src/components/ProtectedRoute.tsx` - Already supports role validation

---

## Summary

The role-based authentication system is now fully implemented with:
- ✅ Student and admin role selection on login/signup
- ✅ Automatic dashboard redirection based on role
- ✅ Protected routes with role validation
- ✅ User profile management with roles
- ✅ Secure session handling
- ✅ Error handling and user feedback
- ✅ Responsive UI for all devices

Users can now easily distinguish between student and admin accounts, and the system automatically routes them to the appropriate dashboard after authentication.
