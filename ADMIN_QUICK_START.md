# Quick Integration Guide - Admin Dashboard

This guide helps you integrate the Admin Dashboard into your existing application.

## Step 1: Update Your Routes (App.tsx or main routing file)

```tsx
import { BrowserRouter, Routes, Route } from "react-router-dom";
import AdminLogin from "@/pages/admin/AdminLogin";
import AdminDashboard from "@/pages/admin/AdminDashboard";
import AdminCoursesManagement from "@/pages/admin/AdminCoursesManagement";
import AdminModules from "@/pages/admin/AdminModules";
import AdminStudentsPage from "@/pages/admin/AdminStudents";
import AdminAssignments from "@/pages/admin/AdminAssignments";
import AdminJobsPage from "@/pages/admin/AdminJobs";
import AdminCertificatesPage from "@/pages/admin/AdminCertificates";

export function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/admin/login" element={<AdminLogin />} />

        {/* Protected Admin Routes */}
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/courses" element={<AdminCoursesManagement />} />
        <Route path="/admin/modules" element={<AdminModules />} />
        <Route path="/admin/students" element={<AdminStudentsPage />} />
        <Route path="/admin/assignments" element={<AdminAssignments />} />
        <Route path="/admin/jobs" element={<AdminJobsPage />} />
        <Route path="/admin/certificates" element={<AdminCertificatesPage />} />

        {/* Your other routes */}
      </Routes>
    </BrowserRouter>
  );
}
```

## Step 2: Create Environment Variables

Create `.env.local` in your project root:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

## Step 3: Set Up Supabase Tables

Execute these SQL queries in Supabase SQL Editor:

### Create admin_users table
```sql
CREATE TABLE admin_users (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  role VARCHAR(50) DEFAULT 'admin',
  created_at TIMESTAMP DEFAULT NOW()
);

ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;
```

### Create courses table
```sql
CREATE TABLE courses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title VARCHAR(255) NOT NULL,
  description TEXT,
  instructor VARCHAR(255),
  status VARCHAR(50) DEFAULT 'active',
  students INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

ALTER TABLE courses ENABLE ROW LEVEL SECURITY;

-- Allow authenticated users to read
CREATE POLICY "Allow all users to read courses"
ON courses FOR SELECT
USING (true);

-- Allow admins to insert/update/delete
CREATE POLICY "Allow admins to manage courses"
ON courses FOR ALL
USING (EXISTS (SELECT 1 FROM admin_users WHERE admin_users.user_id = auth.uid()));
```

### Create modules table
```sql
CREATE TABLE modules (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title VARCHAR(255) NOT NULL,
  course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  description TEXT,
  order INTEGER DEFAULT 1,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

ALTER TABLE modules ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow all users to read modules"
ON modules FOR SELECT
USING (true);

CREATE POLICY "Allow admins to manage modules"
ON modules FOR ALL
USING (EXISTS (SELECT 1 FROM admin_users WHERE admin_users.user_id = auth.uid()));
```

### Create assignments table
```sql
CREATE TABLE assignments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title VARCHAR(255) NOT NULL,
  module_id UUID REFERENCES modules(id) ON DELETE CASCADE,
  description TEXT,
  due_date TIMESTAMP,
  status VARCHAR(50) DEFAULT 'active',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

ALTER TABLE assignments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow all users to read assignments"
ON assignments FOR SELECT
USING (true);

CREATE POLICY "Allow admins to manage assignments"
ON assignments FOR ALL
USING (EXISTS (SELECT 1 FROM admin_users WHERE admin_users.user_id = auth.uid()));
```

### Create jobs table
```sql
CREATE TABLE jobs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title VARCHAR(255) NOT NULL,
  company VARCHAR(255) NOT NULL,
  description TEXT,
  location VARCHAR(255),
  status VARCHAR(50) DEFAULT 'active',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

ALTER TABLE jobs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow all users to read jobs"
ON jobs FOR SELECT
USING (true);

CREATE POLICY "Allow admins to manage jobs"
ON jobs FOR ALL
USING (EXISTS (SELECT 1 FROM admin_users WHERE admin_users.user_id = auth.uid()));
```

### Create certificates table
```sql
CREATE TABLE certificates (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  course_id UUID REFERENCES courses(id),
  certificate_number VARCHAR(100) UNIQUE NOT NULL,
  issued_date TIMESTAMP,
  status VARCHAR(50) DEFAULT 'active',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

ALTER TABLE certificates ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow admins to read certificates"
ON certificates FOR SELECT
USING (EXISTS (SELECT 1 FROM admin_users WHERE admin_users.user_id = auth.uid()));

CREATE POLICY "Allow admins to manage certificates"
ON certificates FOR ALL
USING (EXISTS (SELECT 1 FROM admin_users WHERE admin_users.user_id = auth.uid()));
```

## Step 4: Create Your First Admin User

1. Sign up a user in Supabase Auth
2. Copy their user_id
3. Insert into admin_users table:

```sql
INSERT INTO admin_users (id, user_id, role)
VALUES (
  gen_random_uuid(),
  'YOUR_USER_ID_HERE',
  'admin'
);
```

## Step 5: Test the Integration

1. Start your development server: `npm run dev` or `bun dev`
2. Navigate to: http://localhost:5173/admin/login
3. Login with the admin user credentials
4. You should see the admin dashboard

## Step 6: Optional - Create Protected Route Component

For additional security, create a protected route wrapper:

```tsx
// components/ProtectedRoute.tsx
import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export function ProtectedAdminRoute({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAdmin = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      const { data } = await supabase
        .from("admin_users")
        .select("*")
        .eq("user_id", user.id)
        .single();

      setIsAdmin(!!data);
      setLoading(false);
    };

    checkAdmin();
  }, [user]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user || !isAdmin) {
    return <Navigate to="/admin/login" replace />;
  }

  return children;
}
```

Then wrap your routes:
```tsx
<Route
  path="/admin/dashboard"
  element={
    <ProtectedAdminRoute>
      <AdminDashboard />
    </ProtectedAdminRoute>
  }
/>
```

## Troubleshooting

### "Supabase connection failed"
- Check `.env.local` file has correct URL and key
- Verify Supabase project is active
- Check browser network tab for 403 errors

### "Admin role not found"
- Verify admin_users record exists for your user
- Check user_id matches auth.users
- Run `SELECT * FROM admin_users;` to verify

### "Table does not exist"
- Run all SQL queries from Step 3
- Verify tables appear in Supabase dashboard
- Check table names match exactly

### "Can't login"
- Verify user exists in auth.users
- Check email/password are correct
- Review browser console for error messages

## What's Next?

- Add bulk student import from CSV
- Implement email notifications
- Create advanced analytics dashboard
- Add audit logging
- Set up automated backups

## Get Help

- Review ADMIN_SETUP.md for full documentation
- Check Supabase documentation: https://supabase.com/docs
- Review error messages in browser console

## Performance Tips

1. **Index frequently searched columns**
   ```sql
   CREATE INDEX idx_courses_title ON courses(title);
   CREATE INDEX idx_students_email ON profiles(email);
   ```

2. **Optimize RLS policies** for faster queries

3. **Use pagination** - already implemented in AdminTable

4. **Monitor query performance** in Supabase dashboard

Enjoy your new admin dashboard! 🚀
