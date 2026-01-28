# Supabase Database Schema Setup Guide

## Overview
This guide provides the SQL schema needed for the Student Dashboard to work correctly with Supabase.

## Required Tables

### 1. students
Stores student profile information.

```sql
CREATE TABLE IF NOT EXISTS students (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255),
  avatar_url TEXT,
  bio TEXT,
  overall_completion_percentage INTEGER DEFAULT 0,
  total_courses INTEGER DEFAULT 0,
  total_lessons_completed INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_students_user_id ON students(user_id);
```

### 2. courses
Stores course information.

```sql
CREATE TABLE IF NOT EXISTS courses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(255) NOT NULL,
  description TEXT,
  thumbnail VARCHAR(500),
  category VARCHAR(100),
  instructor_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  level VARCHAR(50), -- 'beginner', 'intermediate', 'advanced'
  duration_weeks INTEGER,
  is_published BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_courses_instructor_id ON courses(instructor_id);
CREATE INDEX idx_courses_is_published ON courses(is_published);
```

### 3. enrollments
Tracks which students are enrolled in which courses.

```sql
CREATE TABLE IF NOT EXISTS enrollments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  enrollment_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  completion_date TIMESTAMP,
  completion_percentage INTEGER DEFAULT 0,
  is_completed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id, course_id)
);

CREATE INDEX idx_enrollments_user_id ON enrollments(user_id);
CREATE INDEX idx_enrollments_course_id ON enrollments(course_id);
CREATE INDEX idx_enrollments_user_course ON enrollments(user_id, course_id);
```

### 4. course_modules
Represents modules/lessons within courses.

```sql
CREATE TABLE IF NOT EXISTS course_modules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  content TEXT,
  video_url VARCHAR(500),
  order_number INTEGER NOT NULL,
  is_completed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_course_modules_course_id ON course_modules(course_id);
CREATE INDEX idx_course_modules_order ON course_modules(course_id, order_number);
```

### 5. student_module_progress
Tracks individual student progress on modules.

```sql
CREATE TABLE IF NOT EXISTS student_module_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  module_id UUID NOT NULL REFERENCES course_modules(id) ON DELETE CASCADE,
  is_completed BOOLEAN DEFAULT FALSE,
  completion_date TIMESTAMP,
  watch_duration_seconds INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id, module_id)
);

CREATE INDEX idx_student_module_progress_user_id ON student_module_progress(user_id);
CREATE INDEX idx_student_module_progress_module_id ON student_module_progress(module_id);
```

### 6. live_sessions
Stores information about live instructor sessions.

```sql
CREATE TABLE IF NOT EXISTS live_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(255) NOT NULL,
  description TEXT,
  instructor_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  instructor_name VARCHAR(255) NOT NULL,
  course_id UUID REFERENCES courses(id) ON DELETE SET NULL,
  scheduled_at TIMESTAMP NOT NULL,
  duration_minutes INTEGER DEFAULT 60,
  meeting_link VARCHAR(500),
  max_participants INTEGER,
  is_recorded BOOLEAN DEFAULT FALSE,
  recording_url VARCHAR(500),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_live_sessions_instructor_id ON live_sessions(instructor_id);
CREATE INDEX idx_live_sessions_scheduled_at ON live_sessions(scheduled_at);
CREATE INDEX idx_live_sessions_course_id ON live_sessions(course_id);
```

### 7. live_session_registrations
Tracks which students registered for live sessions.

```sql
CREATE TABLE IF NOT EXISTS live_session_registrations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  session_id UUID NOT NULL REFERENCES live_sessions(id) ON DELETE CASCADE,
  registered_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  attended BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id, session_id)
);

CREATE INDEX idx_session_registrations_user_id ON live_session_registrations(user_id);
CREATE INDEX idx_session_registrations_session_id ON live_session_registrations(session_id);
```

## Row Level Security (RLS) Policies

### Enable RLS on all tables
```sql
ALTER TABLE students ENABLE ROW LEVEL SECURITY;
ALTER TABLE courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE enrollments ENABLE ROW LEVEL SECURITY;
ALTER TABLE course_modules ENABLE ROW LEVEL SECURITY;
ALTER TABLE student_module_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE live_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE live_session_registrations ENABLE ROW LEVEL SECURITY;
```

### Students policies
```sql
-- Students can view their own profile
CREATE POLICY "Students view own profile"
  ON students FOR SELECT
  USING (auth.uid() = user_id);

-- Students can update their own profile
CREATE POLICY "Students update own profile"
  ON students FOR UPDATE
  USING (auth.uid() = user_id);

-- Instructors/admins can view all students
CREATE POLICY "Instructors view all students"
  ON students FOR SELECT
  USING (auth.jwt()->>'role' IN ('instructor', 'admin'));
```

### Courses policies
```sql
-- Public can view published courses
CREATE POLICY "Courses are viewable by everyone"
  ON courses FOR SELECT
  USING (is_published = TRUE);

-- Instructors can view their own courses
CREATE POLICY "Instructors view own courses"
  ON courses FOR SELECT
  USING (auth.uid() = instructor_id);
```

### Enrollments policies
```sql
-- Students can view their own enrollments
CREATE POLICY "Students view own enrollments"
  ON enrollments FOR SELECT
  USING (auth.uid() = user_id);

-- Students can enroll in courses
CREATE POLICY "Students create enrollments"
  ON enrollments FOR INSERT
  WITH CHECK (auth.uid() = user_id);
```

### Course modules policies
```sql
-- Students can view modules of enrolled courses
CREATE POLICY "Students view modules of enrolled courses"
  ON course_modules FOR SELECT
  USING (
    course_id IN (
      SELECT course_id FROM enrollments WHERE user_id = auth.uid()
    )
    OR (SELECT is_published FROM courses WHERE id = course_id)
  );
```

### Student module progress policies
```sql
-- Students can view their own progress
CREATE POLICY "Students view own progress"
  ON student_module_progress FOR SELECT
  USING (auth.uid() = user_id);

-- Students can update their own progress
CREATE POLICY "Students update own progress"
  ON student_module_progress FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Students update own progress update"
  ON student_module_progress FOR UPDATE
  USING (auth.uid() = user_id);
```

### Live sessions policies
```sql
-- Everyone can view future live sessions
CREATE POLICY "Live sessions are viewable"
  ON live_sessions FOR SELECT
  USING (scheduled_at > NOW());
```

### Live session registrations policies
```sql
-- Students can view their own registrations
CREATE POLICY "Students view own registrations"
  ON live_session_registrations FOR SELECT
  USING (auth.uid() = user_id);

-- Students can register for sessions
CREATE POLICY "Students register for sessions"
  ON live_session_registrations FOR INSERT
  WITH CHECK (auth.uid() = user_id);
```

## Sample Data Insert Statements

### Insert a test student
```sql
INSERT INTO students (user_id, name, email, overall_completion_percentage)
VALUES (
  'test-user-uuid-here',
  'John Doe',
  'john@example.com',
  45
);
```

### Insert sample courses
```sql
INSERT INTO courses (title, description, thumbnail, category, level, duration_weeks, is_published)
VALUES
  (
    'Digital Marketing Fundamentals',
    'Master the core concepts of digital marketing including SEO, SEM, and content strategy.',
    'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=250&fit=crop',
    'Marketing',
    'beginner',
    8,
    TRUE
  ),
  (
    'Social Media Marketing Mastery',
    'Learn to create viral campaigns and grow audiences across all major social platforms.',
    'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=400&h=250&fit=crop',
    'Marketing',
    'intermediate',
    6,
    TRUE
  ),
  (
    'Google Ads & PPC Advertising',
    'Become proficient in paid advertising with hands-on Google Ads campaigns.',
    'https://images.unsplash.com/photo-1553484771-371a605b060b?w=400&h=250&fit=crop',
    'Advertising',
    'intermediate',
    5,
    TRUE
  );
```

### Insert sample enrollments
```sql
INSERT INTO enrollments (user_id, course_id, completion_percentage)
SELECT 
  'test-user-uuid-here',
  id,
  CASE 
    WHEN title = 'Digital Marketing Fundamentals' THEN 75
    WHEN title = 'Social Media Marketing Mastery' THEN 45
    WHEN title = 'Google Ads & PPC Advertising' THEN 20
  END
FROM courses
WHERE is_published = TRUE;
```

### Insert sample modules
```sql
INSERT INTO course_modules (course_id, title, description, order_number)
SELECT
  id,
  'Module ' || (row_number() OVER (PARTITION BY id ORDER BY id))::text,
  'This is a module description',
  row_number() OVER (PARTITION BY id ORDER BY id)
FROM courses
CROSS JOIN LATERAL (SELECT 1 UNION ALL SELECT 2 UNION ALL SELECT 3) AS t
WHERE is_published = TRUE;
```

### Insert sample live sessions
```sql
INSERT INTO live_sessions (
  title,
  description,
  instructor_id,
  instructor_name,
  scheduled_at
)
VALUES
  (
    'Introduction to SEO',
    'Learn the basics of search engine optimization',
    'instructor-uuid-here',
    'Sarah Johnson',
    NOW() + INTERVAL '2 days'
  ),
  (
    'Content Strategy Workshop',
    'Develop a winning content strategy for your business',
    'instructor-uuid-here',
    'Mike Chen',
    NOW() + INTERVAL '5 days'
  ),
  (
    'Facebook Ads Mastery',
    'Advanced techniques for Facebook advertising',
    'instructor-uuid-here',
    'Sarah Johnson',
    NOW() + INTERVAL '7 days'
  );
```

## Verification Steps

After setting up the schema, verify:

1. All tables are created:
```sql
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public';
```

2. Indexes are created:
```sql
SELECT * FROM pg_indexes 
WHERE schemaname = 'public';
```

3. RLS is enabled:
```sql
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public';
```

4. Sample data exists:
```sql
SELECT COUNT(*) FROM courses;
SELECT COUNT(*) FROM students;
SELECT COUNT(*) FROM live_sessions;
```

## Notes

- All timestamps use `TIMESTAMP` type (with timezone)
- UUIDs are auto-generated using `gen_random_uuid()`
- Soft deletes are not used; CASCADE delete is implemented for data integrity
- Indexes are created on frequently queried columns (user_id, course_id, scheduled_at)
- RLS policies ensure data privacy and security
- Sample data uses realistic course information with actual image URLs

## Migration to Production

1. Test all RLS policies with actual user accounts
2. Verify performance with expected data volume
3. Set up automated backups
4. Monitor slow queries with Supabase analytics
5. Consider archiving old live session records
