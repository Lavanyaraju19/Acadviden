# Role-Based Auth Quick Reference

## Login Page (`/login`)

### What Changed
- Added student/admin role selection buttons
- Form now requires role before submission
- Automatic redirect to `/student` or `/admin` based on role

### User Journey
```
Visit /login
  ↓
Select role (Student or Admin)
  ↓
Enter credentials
  ↓
Sign In
  ↓
Redirect to dashboard
```

### Code Snippet
```tsx
const [userType, setUserType] = useState<"student" | "admin" | null>(null);

// In form
<button onClick={() => setUserType("student")}>
  <BookOpen /> Student
</button>

<button onClick={() => setUserType("admin")}>
  <Shield /> Admin
</button>

// On submit
navigate(userType === "admin" ? "/admin" : "/student");
```

---

## Signup Page (`/register`)

### What Changed
- Added student/admin role selection buttons
- Form now requires role before submission
- Role is passed to Supabase signup metadata
- Automatic redirect to `/student` or `/admin` after signup

### User Journey
```
Visit /register
  ↓
Select role (Student or Admin)
  ↓
Enter details (name, email, password)
  ↓
Create Account
  ↓
Redirect to dashboard
```

### Code Snippet
```tsx
const [userType, setUserType] = useState<"student" | "admin" | null>(null);

// On signup
const { error } = await supabase.auth.signUp({
  email,
  password,
  options: {
    data: {
      full_name: fullName,
      user_type: userType,
    },
  },
});

// After success
navigate(userType === "admin" ? "/admin" : "/student");
```

---

## Auth Callback (`/auth/callback`)

### What Changed
- Now uses `useAuth` hook to get user role
- Routes to `/admin` for admins
- Routes to `/student` for students
- Shows loading spinner while checking

### Code Flow
```tsx
const { userProfile, isLoading } = useAuth();

useEffect(() => {
  if (!isLoading && userProfile) {
    if (userProfile.role === "admin") {
      navigate("/admin");
    } else {
      navigate("/student");
    }
  }
}, [isLoading, userProfile]);
```

---

## Protected Routes

### Student Route
```tsx
<Route
  path="/student/dashboard"
  element={
    <ProtectedRoute>
      <StudentDashboard />
    </ProtectedRoute>
  }
/>
```

### Admin Route (with role check)
```tsx
<Route
  path="/admin/dashboard"
  element={
    <ProtectedRoute requiredRole="admin">
      <AdminDashboard />
    </ProtectedRoute>
  }
/>
```

---

## Redirect Logic

### After Login/Signup
```
Role Selected: "student"
  ↓
After authentication
  ↓
Redirect to /student → Student Dashboard

---

Role Selected: "admin"
  ↓
After authentication
  ↓
Redirect to /admin → Admin Dashboard
```

### Wrong Role Access
```
Student tries to access /admin
  ↓
ProtectedRoute checks role
  ↓
role !== "admin"
  ↓
Redirect to /student

---

Admin accesses /student
  ↓
ProtectedRoute checks role
  ↓
Admin can access (has management rights)
  ↓
Render page
```

---

## Role Detection

```
User logs in
  ↓
AuthContext.fetchUserProfile()
  ↓
Query students table
  ├─ Found: role = "student"
  └─ Not found:
      ↓
      Query admins table
      ├─ Found: role = "admin"
      └─ Not found: Create student profile
```

---

## Testing Checklist

- [ ] Student login redirects to `/student`
- [ ] Admin login redirects to `/admin`
- [ ] Student signup creates account and redirects to `/student`
- [ ] Admin signup creates account and redirects to `/admin`
- [ ] Can't submit login without selecting role
- [ ] Can't submit signup without selecting role
- [ ] Role buttons highlight when selected
- [ ] Student can't access admin routes (redirects to `/student`)
- [ ] Admin can access admin routes
- [ ] Logout clears session
- [ ] Protected routes require login

---

## Common Issues & Fixes

### Issue: User stays on login page
**Fix:** 
- Ensure you selected a role before clicking "Sign In"
- Check browser console for errors
- Verify Supabase credentials

### Issue: Redirects to wrong dashboard
**Fix:**
- Verify user's role in database (students/admins table)
- Check AuthContext is fetching profile correctly

### Issue: Role selection not working
**Fix:**
- Check if button click is registering (should highlight)
- Try refreshing the page
- Clear browser cache

---

## Database Tables

### Students Table
- id, user_id, name, email, role (default: 'student')

### Admins Table
- id, user_id, name, email, role (default: 'admin')

---

## Files Modified

1. **src/pages/Login.tsx**
   - Added role selection UI
   - Added role validation
   - Added conditional redirect

2. **src/pages/Register.tsx**
   - Added role selection UI
   - Added role to signup metadata
   - Added conditional redirect

3. **src/pages/AuthCallback.jsx**
   - Enhanced redirect logic with role checking
   - Improved loading UI

---

## Quick Links

- 🔐 Login: `http://localhost:5173/login`
- 📝 Signup: `http://localhost:5173/register`
- 👨‍🎓 Student Dashboard: `http://localhost:5173/student`
- 👨‍💼 Admin Dashboard: `http://localhost:5173/admin`
- 🔄 Auth Callback: `http://localhost:5173/auth/callback`

---

## Key Features

✅ **Role Selection** - Choose student or admin during login/signup
✅ **Smart Redirect** - Automatic dashboard routing based on role
✅ **Role Validation** - Protected routes check role permissions
✅ **User Profiles** - Roles stored in database
✅ **Error Handling** - Clear messages for missing role selection
✅ **Responsive UI** - Works on mobile, tablet, and desktop
✅ **Security** - RLS policies enforce role-based access
