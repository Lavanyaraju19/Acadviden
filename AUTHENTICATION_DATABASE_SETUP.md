# Authentication Database Setup

## Required Tables

### 1. Students Table
Store student user profiles and roles.

```sql
CREATE TABLE IF NOT EXISTS students (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255),
  avatar_url TEXT,
  role VARCHAR(50) DEFAULT 'student', -- 'student', 'instructor'
  overall_completion_percentage INTEGER DEFAULT 0,
  total_courses INTEGER DEFAULT 0,
  total_lessons_completed INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_students_user_id ON students(user_id);
CREATE INDEX idx_students_role ON students(role);

-- Row Level Security
ALTER TABLE students ENABLE ROW LEVEL SECURITY;

-- Students can view their own profile
CREATE POLICY "Students view own profile"
  ON students FOR SELECT
  USING (auth.uid() = user_id);

-- Students can update their own profile
CREATE POLICY "Students update own profile"
  ON students FOR UPDATE
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

### 2. Admins Table
Store admin user profiles.

```sql
CREATE TABLE IF NOT EXISTS admins (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255),
  avatar_url TEXT,
  role VARCHAR(50) DEFAULT 'admin',
  permissions JSONB DEFAULT '{}',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_admins_user_id ON admins(user_id);

-- Row Level Security
ALTER TABLE admins ENABLE ROW LEVEL SECURITY;

-- Admins can view other admins
CREATE POLICY "Admins view admins"
  ON admins FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM admins WHERE user_id = auth.uid()
    )
  );

-- Admins can update their own profile
CREATE POLICY "Admins update own profile"
  ON admins FOR UPDATE
  USING (auth.uid() = user_id);
```

### 3. Auth Audit Log (Optional)
Track authentication events for security.

```sql
CREATE TABLE IF NOT EXISTS auth_audit_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  event_type VARCHAR(50), -- 'login', 'logout', 'signup', 'password_reset'
  ip_address VARCHAR(45),
  user_agent TEXT,
  success BOOLEAN,
  details JSONB,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_auth_audit_log_user_id ON auth_audit_log(user_id);
CREATE INDEX idx_auth_audit_log_event_type ON auth_audit_log(event_type);
CREATE INDEX idx_auth_audit_log_created_at ON auth_audit_log(created_at);
```

## Sample Data

### Insert Test Student Account

```sql
-- First, the user should be created via Supabase Auth UI or CLI
-- Then insert the corresponding student profile

INSERT INTO students (user_id, name, email, role)
VALUES (
  'YOUR_USER_ID_HERE',
  'John Doe',
  'john@example.com',
  'student'
);
```

### Insert Test Admin Account

```sql
INSERT INTO admins (user_id, name, email, role)
VALUES (
  'YOUR_ADMIN_USER_ID_HERE',
  'Admin User',
  'admin@example.com',
  'admin'
);
```

## Auto-Creating Student Profile

When a user registers, automatically create a student profile:

```sql
-- Create a PostgreSQL function
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.students (user_id, name, email, role)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email),
    NEW.email,
    'student'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
```

**Note**: This trigger automatically creates a student profile when a user signs up via Supabase Auth.

## Verification Steps

1. **Check students table exists**:
```sql
SELECT * FROM students LIMIT 1;
```

2. **Check admins table exists**:
```sql
SELECT * FROM admins LIMIT 1;
```

3. **Verify RLS is enabled**:
```sql
SELECT tablename, rowsecurity
FROM pg_tables
WHERE schemaname = 'public'
AND tablename IN ('students', 'admins');
```

4. **Check indexes exist**:
```sql
SELECT * FROM pg_indexes
WHERE tablename IN ('students', 'admins')
AND schemaname = 'public';
```

## Testing Authentication

### Test Student Login
1. Create a user via Supabase Auth (or use existing)
2. Verify student record exists in students table
3. Login with those credentials
4. Should see student dashboard

### Test Admin Login
1. Create a user via Supabase Auth
2. Manually insert record in admins table with same user_id
3. Login with those credentials
4. Should see admin dashboard

### Test Protected Routes
1. Visit `/student` without logging in → Redirect to `/login`
2. Login as student → Can access `/student`
3. Try to access `/admin` as student → Redirect to `/student`
4. Login as admin → Can access `/admin`

## Role Assignment

### Assign Admin Role
```sql
-- Insert user into admins table
INSERT INTO admins (user_id, name, email, role)
VALUES ('USER_ID', 'Admin Name', 'admin@example.com', 'admin');

-- Remove from students table if needed
DELETE FROM students WHERE user_id = 'USER_ID';
```

### Assign Student Role
```sql
-- Insert/update in students table
INSERT INTO students (user_id, name, email, role)
VALUES ('USER_ID', 'Student Name', 'student@example.com', 'student')
ON CONFLICT (user_id) DO UPDATE
SET role = 'student';
```

### Assign Instructor Role
```sql
-- Update existing student to instructor
UPDATE students
SET role = 'instructor'
WHERE user_id = 'USER_ID';
```

## Password Reset

### Enable Password Reset
1. Go to Supabase dashboard
2. Authentication → Email Templates
3. Configure "Confirm signup" and "Reset Password" templates

### Password Reset Flow
```
1. User visits /forgot-password
2. Enters email
3. Supabase sends reset link
4. User clicks link
5. Redirected to password reset page
6. User enters new password
7. Password updated
```

## Session Management

### Session Persistence
Sessions are automatically persisted in localStorage:
```typescript
// Configured in src/integrations/supabase/client.ts
auth: {
  storage: localStorage,
  persistSession: true,
  autoRefreshToken: true,
}
```

### Logout
```typescript
await supabase.auth.signOut();
// Clears session from localStorage
// Updates AuthContext
// Redirects to login
```

### Token Refresh
Tokens are automatically refreshed:
- Before expiry
- On app load
- On browser tab focus

## Security Best Practices

### 1. Environment Variables
```bash
# .env file (NEVER commit)
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=your_public_key
```

### 2. RLS Policies
- ✅ Enable RLS on all tables
- ✅ Restrict queries to authenticated users
- ✅ Admins can see more data
- ✅ Students see only their data

### 3. Password Requirements
- ✅ Minimum 6 characters (can be increased)
- ✅ No spaces allowed
- ✅ Email must be valid
- ✅ Passwords hashed with bcrypt

### 4. Authentication Tokens
- ✅ Short-lived access tokens (1 hour)
- ✅ Long-lived refresh tokens (7 days)
- ✅ Tokens stored securely
- ✅ Auto-refresh before expiry

## Troubleshooting

### User stuck in loading
- Check Supabase connection status
- Verify students table has user record
- Check browser console for errors

### Login fails
- Verify email and password are correct
- Check Supabase Auth settings
- Verify user exists in auth.users

### Can't access protected route
- Verify user is authenticated
- Check userProfile exists
- Check role in database

### Profile not loading
- Verify students table has user_id
- Check RLS policies aren't blocking queries
- Verify user_id matches auth.users.id

## API Endpoints

### Login
```
POST /auth/v1/token?grant_type=password
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

### Register
```
POST /auth/v1/signup
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

### Password Reset
```
POST /auth/v1/recover
Content-Type: application/json

{
  "email": "user@example.com"
}
```

### Sign Out
```
POST /auth/v1/logout
Authorization: Bearer {access_token}
```

## SQL Functions

### Get User Role
```sql
CREATE OR REPLACE FUNCTION public.get_user_role(user_id UUID)
RETURNS VARCHAR AS $$
DECLARE
  role VARCHAR;
BEGIN
  SELECT students.role INTO role FROM students WHERE user_id = $1;
  IF role IS NULL THEN
    SELECT admins.role INTO role FROM admins WHERE user_id = $1;
  END IF;
  RETURN COALESCE(role, 'guest');
END;
$$ LANGUAGE plpgsql;

-- Usage
SELECT public.get_user_role(auth.uid());
```

### Get User Profile
```sql
CREATE OR REPLACE FUNCTION public.get_user_profile()
RETURNS TABLE (
  id UUID,
  name VARCHAR,
  email VARCHAR,
  role VARCHAR
) AS $$
BEGIN
  RETURN QUERY
  SELECT students.id, students.name, students.email, students.role
  FROM students
  WHERE user_id = auth.uid()
  UNION ALL
  SELECT admins.id, admins.name, admins.email, admins.role
  FROM admins
  WHERE user_id = auth.uid();
END;
$$ LANGUAGE plpgsql;

-- Usage
SELECT * FROM public.get_user_profile();
```

## Backup & Recovery

### Backup Authentication Data
```sql
-- Export students
\copy students TO 'students.csv' WITH CSV HEADER;

-- Export admins
\copy admins TO 'admins.csv' WITH CSV HEADER;
```

### Recovery
```sql
-- Import students
\copy students FROM 'students.csv' WITH CSV HEADER;

-- Import admins
\copy admins FROM 'admins.csv' WITH CSV HEADER;
```

## Migration Checklist

- [ ] Create students table
- [ ] Create admins table
- [ ] Enable RLS on both tables
- [ ] Create RLS policies
- [ ] Create indexes
- [ ] Create auto-create trigger (optional)
- [ ] Insert test accounts
- [ ] Test login flow
- [ ] Test protected routes
- [ ] Test role-based access

---

**Status**: ✅ Ready to Use  
**Last Updated**: January 26, 2026
