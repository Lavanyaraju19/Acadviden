# Supabase Storage & Database Schema

## Overview

This document defines the database schema and storage structure for the Acadvizen Digital Hub's file management and storage system.

## Storage Buckets Configuration

### 1. course-videos
**Purpose**: Store course video content  
**Max Size Per File**: 500MB  
**Max Total**: 50GB  
**Supported Formats**: MP4, WebM, QuickTime

```
Folder Structure:
course-videos/
├── videos/
│   ├── {courseId}/
│   │   ├── {moduleId}/
│   │   │   ├── 1704067200000-lecture-intro.mp4
│   │   │   └── 1704067201000-demo.webm
```

### 2. course-pdfs
**Purpose**: Store course materials (lecture notes, reading materials, guides)  
**Max Size Per File**: 50MB  
**Max Total**: 25GB  
**Supported Formats**: PDF

```
Folder Structure:
course-pdfs/
├── pdfs/
│   ├── {courseId}/
│   │   ├── {moduleId}/
│   │   │   ├── 1704067200000-lecture-notes.pdf
│   │   │   └── 1704067201000-reading-guide.pdf
```

### 3. student-assignments
**Purpose**: Store student assignment submissions  
**Max Size Per File**: 100MB  
**Max Total**: 30GB  
**Supported Formats**: PDF, DOC, DOCX, TXT

```
Folder Structure:
student-assignments/
├── assignments/
│   ├── {courseId}/
│   │   ├── {moduleId}/
│   │   │   ├── 1704067200000-submission.pdf
│   │   │   └── 1704067201000-report.docx
```

### 4. certificates
**Purpose**: Store issued certificates  
**Max Size Per File**: 20MB  
**Max Total**: 10GB  
**Supported Formats**: PNG, JPEG, PDF

```
Folder Structure:
certificates/
├── certificates/
│   ├── {courseId}/
│   │   └── {moduleId}/
│   │       ├── 1704067200000-certificate.png
│   │       └── 1704067201000-cert-backup.pdf
```

## Database Tables

### 1. course_videos
Stores metadata for uploaded course videos

```sql
CREATE TABLE course_videos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  module_id UUID NOT NULL REFERENCES course_modules(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  file_path TEXT NOT NULL UNIQUE,
  file_url TEXT NOT NULL,
  duration VARCHAR(12), -- HH:MM:SS format
  file_size BIGINT, -- in bytes
  thumbnail_url TEXT,
  status VARCHAR(20) DEFAULT 'uploaded', -- uploaded, processing, ready, error
  published BOOLEAN DEFAULT FALSE,
  view_count INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_course_videos_course_id ON course_videos(course_id);
CREATE INDEX idx_course_videos_module_id ON course_videos(module_id);
CREATE INDEX idx_course_videos_status ON course_videos(status);
CREATE INDEX idx_course_videos_published ON course_videos(published);
```

### 2. course_pdfs
Stores metadata for uploaded PDF course materials

```sql
CREATE TABLE course_pdfs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  module_id UUID NOT NULL REFERENCES course_modules(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  file_path TEXT NOT NULL UNIQUE,
  file_url TEXT NOT NULL,
  file_size BIGINT, -- in bytes
  pages INTEGER,
  resource_type VARCHAR(50), -- lecture_notes, reading_material, assignment_guide, reference
  published BOOLEAN DEFAULT FALSE,
  download_count INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_course_pdfs_course_id ON course_pdfs(course_id);
CREATE INDEX idx_course_pdfs_module_id ON course_pdfs(module_id);
CREATE INDEX idx_course_pdfs_resource_type ON course_pdfs(resource_type);
CREATE INDEX idx_course_pdfs_published ON course_pdfs(published);
```

### 3. assignment_submissions
Stores student assignment submissions

```sql
CREATE TABLE assignment_submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  assignment_id UUID NOT NULL REFERENCES assignments(id) ON DELETE CASCADE,
  student_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  file_path TEXT NOT NULL,
  file_url TEXT NOT NULL,
  file_name VARCHAR(255),
  notes TEXT,
  submitted_at TIMESTAMP DEFAULT NOW(),
  status VARCHAR(20) DEFAULT 'submitted', -- submitted, grading, graded, returned
  grade NUMERIC(5,2),
  feedback TEXT,
  graded_at TIMESTAMP,
  graded_by UUID REFERENCES users(id),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Indexes & Constraints
CREATE UNIQUE INDEX idx_assignment_submissions_unique ON assignment_submissions(assignment_id, student_id);
CREATE INDEX idx_assignment_submissions_student_id ON assignment_submissions(student_id);
CREATE INDEX idx_assignment_submissions_status ON assignment_submissions(status);
CREATE INDEX idx_assignment_submissions_submitted_at ON assignment_submissions(submitted_at);
```

### 4. certificates
Stores issued certificates

```sql
CREATE TABLE certificates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  student_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  certificate_number VARCHAR(50) NOT NULL UNIQUE,
  file_path TEXT NOT NULL UNIQUE,
  file_url TEXT NOT NULL,
  completion_date DATE NOT NULL,
  issued_date TIMESTAMP DEFAULT NOW(),
  status VARCHAR(20) DEFAULT 'issued', -- draft, issued, revoked, expired
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_certificates_course_id ON certificates(course_id);
CREATE INDEX idx_certificates_student_id ON certificates(student_id);
CREATE UNIQUE INDEX idx_certificates_student_course ON certificates(student_id, course_id);
CREATE INDEX idx_certificates_status ON certificates(status);
CREATE INDEX idx_certificates_issued_date ON certificates(issued_date);
```

### 5. file_activity_logs
Tracks all file operations for auditing

```sql
CREATE TABLE file_activity_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  action VARCHAR(50), -- upload, download, delete, share, view
  file_type VARCHAR(50), -- video, pdf, assignment, certificate
  file_path TEXT,
  file_size BIGINT,
  course_id UUID REFERENCES courses(id) ON DELETE SET NULL,
  module_id UUID REFERENCES course_modules(id) ON DELETE SET NULL,
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_file_activity_user_id ON file_activity_logs(user_id);
CREATE INDEX idx_file_activity_action ON file_activity_logs(action);
CREATE INDEX idx_file_activity_created_at ON file_activity_logs(created_at);
```

## Row Level Security (RLS) Policies

### course_videos
```sql
-- Allow public read access (students can view published videos)
CREATE POLICY "Enable read access for published videos" ON course_videos
  FOR SELECT USING (published = true);

-- Allow instructors to view all videos in their courses
CREATE POLICY "Instructors can view videos" ON course_videos
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM course_instructors 
      WHERE course_id = course_videos.course_id 
      AND instructor_id = auth.uid()
    )
  );

-- Allow instructors to insert videos
CREATE POLICY "Instructors can upload videos" ON course_videos
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM course_instructors 
      WHERE course_id = course_id 
      AND instructor_id = auth.uid()
    )
  );

-- Allow instructors to update their videos
CREATE POLICY "Instructors can update videos" ON course_videos
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM course_instructors 
      WHERE course_id = course_videos.course_id 
      AND instructor_id = auth.uid()
    )
  );

-- Allow instructors to delete videos
CREATE POLICY "Instructors can delete videos" ON course_videos
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM course_instructors 
      WHERE course_id = course_videos.course_id 
      AND instructor_id = auth.uid()
    )
  );
```

### assignment_submissions
```sql
-- Students can view their own submissions
CREATE POLICY "Students can view own submissions" ON assignment_submissions
  FOR SELECT USING (student_id = auth.uid());

-- Instructors can view submissions from their courses
CREATE POLICY "Instructors can view submissions" ON assignment_submissions
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM course_instructors ci
      JOIN assignments a ON a.course_id = ci.course_id
      WHERE a.id = assignment_submissions.assignment_id
      AND ci.instructor_id = auth.uid()
    )
  );

-- Students can insert their submissions
CREATE POLICY "Students can submit assignments" ON assignment_submissions
  FOR INSERT WITH CHECK (student_id = auth.uid());

-- Students can update their own submissions (if status allows)
CREATE POLICY "Students can update submissions" ON assignment_submissions
  FOR UPDATE USING (
    student_id = auth.uid() 
    AND status IN ('submitted', 'returned')
  );
```

### certificates
```sql
-- Users can view their own certificates
CREATE POLICY "Users can view own certificates" ON certificates
  FOR SELECT USING (student_id = auth.uid());

-- Instructors can view certificates for their courses
CREATE POLICY "Instructors can view certificates" ON certificates
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM course_instructors 
      WHERE course_id = certificates.course_id 
      AND instructor_id = auth.uid()
    )
  );

-- Admins/system can create certificates
CREATE POLICY "Admins can create certificates" ON certificates
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM users 
      WHERE id = auth.uid() 
      AND role = 'admin'
    )
  );
```

## Storage Policies

### Storage Access Control
```sql
-- course-videos bucket
CREATE POLICY "Public read access for published videos" ON storage.objects
  FOR SELECT USING (
    bucket_id = 'course-videos' AND 
    (auth.role() = 'authenticated')
  );

CREATE POLICY "Instructors can upload videos" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'course-videos' AND 
    auth.role() = 'authenticated'
  );

-- student-assignments bucket
CREATE POLICY "Students can upload assignments" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'student-assignments' AND 
    auth.role() = 'authenticated'
  );

Create POLICY "Students can read own assignments" ON storage.objects
  FOR SELECT USING (
    bucket_id = 'student-assignments' AND 
    owner = auth.uid()
  );

-- certificates bucket
CREATE POLICY "Users can read own certificates" ON storage.objects
  FOR SELECT USING (
    bucket_id = 'certificates' AND 
    auth.role() = 'authenticated'
  );
```

## File Naming Convention

### Pattern
```
{timestamp}-{sanitized-filename}.{extension}
```

### Examples
```
1704067200000-lecture-intro.mp4
1704067201000-assignment-submission.pdf
1704067202000-certificate.png
```

### Sanitization Rules
- Remove special characters except hyphens and underscores
- Convert spaces to hyphens
- Lowercase all characters
- Remove multiple consecutive hyphens
- Limit to 200 characters (before extension)

## Storage Client Configuration

### Bucket Names
```typescript
const BUCKETS = {
  videos: "course-videos",
  pdfs: "course-pdfs",
  assignments: "student-assignments",
  certificates: "certificates",
} as const;
```

### File Size Limits (Bytes)
```typescript
const FILE_LIMITS = {
  videos: 500 * 1024 * 1024, // 500 MB
  pdfs: 50 * 1024 * 1024, // 50 MB
  assignments: 100 * 1024 * 1024, // 100 MB
  certificates: 20 * 1024 * 1024, // 20 MB
} as const;
```

### Allowed MIME Types
```typescript
const ALLOWED_TYPES = {
  videos: ["video/mp4", "video/webm", "video/quicktime"],
  pdfs: ["application/pdf"],
  assignments: [
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "text/plain",
  ],
  certificates: ["image/png", "image/jpeg", "application/pdf"],
} as const;
```

## Signed URL Configuration

### Expiration Times
```typescript
const SIGNED_URL_EXPIRY = {
  assignment: 7 * 24 * 60 * 60, // 7 days
  certificate: 30 * 24 * 60 * 60, // 30 days
  temporaryAccess: 3600, // 1 hour
} as const;
```

## Data Retention Policy

### Auto-Deletion Rules
- **Submitted assignments**: Retain for 2 years after course completion
- **Issued certificates**: Retain indefinitely
- **Course materials**: Retain while course is active + 1 year
- **Activity logs**: Retain for 1 year

### Soft Deletion
Files marked as deleted are retained in archive storage for 90 days before permanent deletion.

## Backup & Recovery

### Backup Frequency
- Daily incremental backups
- Weekly full backups
- Monthly archives to long-term storage

### Recovery Point Objective (RPO)
- Maximum 24 hours of data loss

### Recovery Time Objective (RTO)
- Target: 4 hours for full recovery

## Migration Notes

### From Existing System
If migrating from existing file storage:
1. Map existing file paths to new bucket structure
2. Update database references
3. Verify file integrity with checksums
4. Test RLS policies before going live
5. Implement activity logging for audit trail

