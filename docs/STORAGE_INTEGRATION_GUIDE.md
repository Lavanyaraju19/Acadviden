# Supabase Storage Integration Guide

## Quick Start

### 1. Create Storage Buckets

Log into your Supabase project and create these 4 public buckets:

```bash
# Via Supabase Dashboard:
# Storage → New Bucket

Bucket Name: course-videos
Bucket Type: Public
Max File Size: 500 MB

Bucket Name: course-pdfs
Bucket Type: Public
Max File Size: 50 MB

Bucket Name: student-assignments
Bucket Type: Public
Max File Size: 100 MB

Bucket Name: certificates
Bucket Type: Public
Max File Size: 20 MB
```

### 2. Create Required Database Tables

Execute these SQL scripts in your Supabase SQL editor:

#### Course Videos Table
```sql
CREATE TABLE public.course_videos (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  course_id uuid NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
  module_id uuid NOT NULL REFERENCES public.course_modules(id) ON DELETE CASCADE,
  title varchar(255) NOT NULL,
  description text,
  file_path text NOT NULL UNIQUE,
  file_url text NOT NULL,
  duration varchar(12),
  file_size bigint,
  thumbnail_url text,
  status varchar(20) DEFAULT 'uploaded'::character varying,
  published boolean DEFAULT false,
  view_count integer DEFAULT 0,
  created_at timestamp without time zone DEFAULT now(),
  updated_at timestamp without time zone DEFAULT now()
);

CREATE INDEX idx_course_videos_course_id ON public.course_videos(course_id);
CREATE INDEX idx_course_videos_module_id ON public.course_videos(module_id);
CREATE INDEX idx_course_videos_published ON public.course_videos(published);
```

#### Course PDFs Table
```sql
CREATE TABLE public.course_pdfs (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  course_id uuid NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
  module_id uuid NOT NULL REFERENCES public.course_modules(id) ON DELETE CASCADE,
  title varchar(255) NOT NULL,
  description text,
  file_path text NOT NULL UNIQUE,
  file_url text NOT NULL,
  file_size bigint,
  pages integer,
  resource_type varchar(50),
  published boolean DEFAULT false,
  download_count integer DEFAULT 0,
  created_at timestamp without time zone DEFAULT now(),
  updated_at timestamp without time zone DEFAULT now()
);

CREATE INDEX idx_course_pdfs_course_id ON public.course_pdfs(course_id);
CREATE INDEX idx_course_pdfs_module_id ON public.course_pdfs(module_id);
CREATE INDEX idx_course_pdfs_published ON public.course_pdfs(published);
```

#### Assignment Submissions Table
```sql
CREATE TABLE public.assignment_submissions (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  assignment_id uuid NOT NULL REFERENCES public.assignments(id) ON DELETE CASCADE,
  student_id uuid NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  file_path text NOT NULL,
  file_url text NOT NULL,
  file_name varchar(255),
  notes text,
  submitted_at timestamp without time zone DEFAULT now(),
  status varchar(20) DEFAULT 'submitted'::character varying,
  grade numeric(5,2),
  feedback text,
  graded_at timestamp without time zone,
  graded_by uuid REFERENCES public.users(id),
  created_at timestamp without time zone DEFAULT now(),
  updated_at timestamp without time zone DEFAULT now()
);

CREATE UNIQUE INDEX idx_assignment_submissions_unique 
ON public.assignment_submissions(assignment_id, student_id);
CREATE INDEX idx_assignment_submissions_student_id 
ON public.assignment_submissions(student_id);
CREATE INDEX idx_assignment_submissions_status 
ON public.assignment_submissions(status);
```

#### Certificates Table
```sql
CREATE TABLE public.certificates (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  course_id uuid NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
  student_id uuid NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  certificate_number varchar(50) NOT NULL UNIQUE,
  file_path text NOT NULL UNIQUE,
  file_url text NOT NULL,
  completion_date date NOT NULL,
  issued_date timestamp without time zone DEFAULT now(),
  status varchar(20) DEFAULT 'issued'::character varying,
  created_at timestamp without time zone DEFAULT now(),
  updated_at timestamp without time zone DEFAULT now()
);

CREATE INDEX idx_certificates_course_id ON public.certificates(course_id);
CREATE INDEX idx_certificates_student_id ON public.certificates(student_id);
CREATE UNIQUE INDEX idx_certificates_student_course 
ON public.certificates(student_id, course_id);
```

### 3. Enable Row Level Security (RLS)

For each table, enable RLS in Supabase dashboard:

```sql
-- Enable RLS
ALTER TABLE public.course_videos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.course_pdfs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.assignment_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.certificates ENABLE ROW LEVEL SECURITY;
```

## Component Usage Examples

### FileUpload Component

Basic file upload with validation:

```tsx
import { FileUpload } from "@/components/FileUpload";

export function MyComponent() {
  return (
    <FileUpload
      folder="videos"
      courseId="course-123"
      moduleId="module-456"
      onUploadSuccess={(path, url, fileName) => {
        console.log("Uploaded:", { path, url, fileName });
      }}
      onUploadError={(error) => {
        console.error("Upload failed:", error.message);
      }}
      label="Upload Course Video"
      description="Max 500MB, MP4 or WebM format"
      maxFiles={1}
    />
  );
}
```

### AssignmentUpload Component

Student assignment submission:

```tsx
import { AssignmentUpload } from "@/components/AssignmentUpload";

export function AssignmentPage() {
  return (
    <AssignmentUpload
      assignmentId="assign-123"
      assignmentTitle="Essay: The Future of AI"
      courseId="course-123"
      moduleId="module-456"
      onUploadSuccess={(submissionId) => {
        console.log("Submission stored:", submissionId);
      }}
      onUploadError={(error) => {
        console.error("Submission failed:", error);
      }}
    />
  );
}
```

### CertificateUpload Component

Issue certificates to students:

```tsx
import { CertificateUpload } from "@/components/CertificateUpload";

export function IssueCertificatePage() {
  return (
    <CertificateUpload
      courseId="course-123"
      courseName="Introduction to React"
      onUploadSuccess={(certificateId) => {
        console.log("Certificate issued:", certificateId);
      }}
      onUploadError={(error) => {
        console.error("Certificate issue failed:", error);
      }}
    />
  );
}
```

### VideoUpload Component

Instructor video upload:

```tsx
import { VideoUpload } from "@/components/VideoUpload";

export function UploadVideoPage() {
  return (
    <VideoUpload
      courseId="course-123"
      moduleId="module-456"
      courseName="React Fundamentals"
      moduleName="Module 1: Basics"
      onUploadSuccess={(videoId) => {
        console.log("Video published:", videoId);
      }}
      onUploadError={(error) => {
        console.error("Video upload failed:", error);
      }}
    />
  );
}
```

### PDFUpload Component

Course material PDF upload:

```tsx
import { PDFUpload } from "@/components/PDFUpload";

export function UploadMaterialPage() {
  return (
    <PDFUpload
      courseId="course-123"
      moduleId="module-456"
      courseName="React Fundamentals"
      moduleName="Module 1: Basics"
      onUploadSuccess={(pdfId) => {
        console.log("PDF published:", pdfId);
      }}
      onUploadError={(error) => {
        console.error("PDF upload failed:", error);
      }}
    />
  );
}
```

## Storage Module API Reference

### uploadFile()
Upload a file with progress tracking

```typescript
import { uploadFile } from "@/integrations/supabase/storage";

const { path, url } = await uploadFile(
  "course-videos", // bucket
  "videos/course-123/module-456/1704067200000-lecture.mp4", // filePath
  file, // File object
  (progress) => console.log(`${progress}% uploaded`)
);
```

### downloadFile()
Download a file as Blob

```typescript
import { downloadFile } from "@/integrations/supabase/storage";

const blob = await downloadFile(
  "student-assignments",
  "assignments/course-123/module-456/submission.pdf"
);

// Save to local file
const url = URL.createObjectURL(blob);
const link = document.createElement("a");
link.href = url;
link.download = "submission.pdf";
link.click();
```

### getPublicUrl()
Get public URL for file

```typescript
import { getPublicUrl } from "@/integrations/supabase/storage";

const publicUrl = getPublicUrl(
  "course-videos",
  "videos/course-123/module-456/lecture.mp4"
);

// Use in img, video, iframe, etc.
<video src={publicUrl} controls />
```

### getSignedUrl()
Get temporary signed URL (expires in 1 hour by default)

```typescript
import { getSignedUrl } from "@/integrations/supabase/storage";

const signedUrl = await getSignedUrl(
  "student-assignments",
  "assignments/course-123/submission.pdf",
  3600 // 1 hour
);

// URL valid for 1 hour, then expires
```

### listFiles()
List all files in a folder

```typescript
import { listFiles } from "@/integrations/supabase/storage";

const files = await listFiles(
  "videos",
  "course-123",
  "module-456"
);

files.forEach(file => {
  console.log(file.name, file.created_at);
});
```

### deleteFile()
Delete a single file

```typescript
import { deleteFile } from "@/integrations/supabase/storage";

await deleteFile(
  "course-videos",
  "videos/course-123/module-456/lecture.mp4"
);
```

### deleteFolder()
Recursively delete all files in a folder

```typescript
import { deleteFolder } from "@/integrations/supabase/storage";

await deleteFolder(
  "course-videos",
  "videos/course-123/module-456"
);
```

### validateFileType()
Check if file type is allowed

```typescript
import { validateFileType } from "@/integrations/supabase/storage";

const isValid = validateFileType("videos", file);
if (!isValid) {
  console.error("File type not allowed");
}
```

### validateFileSize()
Check if file size is within limit

```typescript
import { validateFileSize } from "@/integrations/supabase/storage";

const isValid = validateFileSize("videos", file.size);
if (!isValid) {
  console.error("File too large");
}
```

### generateFolderPath()
Generate folder path following structure

```typescript
import { generateFolderPath } from "@/integrations/supabase/storage";

const path = generateFolderPath("videos", "course-123", "module-456");
// Returns: "videos/course-123/module-456"
```

### generateFilePath()
Generate unique file path with timestamp

```typescript
import { generateFilePath } from "@/integrations/supabase/storage";

const path = generateFilePath("videos", "course-123", "module-456", "lecture.mp4");
// Returns: "videos/course-123/module-456/1704067200000-lecture.mp4"
```

## Folder Structure Reference

### Videos
```
course-videos/
└── videos/
    └── {courseId}/
        └── {moduleId}/
            ├── 1704067200000-intro-lecture.mp4
            └── 1704067201000-demo-walkthrough.webm
```

### PDFs
```
course-pdfs/
└── pdfs/
    └── {courseId}/
        └── {moduleId}/
            ├── 1704067200000-lecture-notes.pdf
            └── 1704067201000-reading-guide.pdf
```

### Assignments
```
student-assignments/
└── assignments/
    └── {courseId}/
        └── {moduleId}/
            ├── 1704067200000-submission.pdf
            └── 1704067201000-report.docx
```

### Certificates
```
certificates/
└── certificates/
    └── {courseId}/
        ├── 1704067200000-certificate.png
        └── 1704067201000-backup.pdf
```

## File Size Limits

| Type | Max Size |
|------|----------|
| Videos | 500 MB |
| PDFs | 50 MB |
| Assignments | 100 MB |
| Certificates | 20 MB |

## Allowed File Types

| Type | Formats |
|------|---------|
| Videos | MP4, WebM, QuickTime |
| PDFs | PDF |
| Assignments | PDF, DOC, DOCX, TXT |
| Certificates | PNG, JPEG, PDF |

## Error Handling

All components provide error callbacks:

```tsx
<FileUpload
  folder="videos"
  courseId="course-123"
  onUploadError={(error) => {
    console.error("Error code:", error.code);
    console.error("Error message:", error.message);
    
    // Handle specific errors
    if (error.message.includes("size")) {
      // File too large
    } else if (error.message.includes("type")) {
      // Invalid file type
    } else if (error.message.includes("Upload failed")) {
      // Network or server error
    }
  }}
/>
```

## Security Best Practices

1. **Always validate on client side** before upload
2. **Use signed URLs** for sensitive files (>1 hour expiry)
3. **Implement RLS policies** to restrict access
4. **Log file operations** for audit trail
5. **Regular backups** of critical files
6. **Monitor storage usage** against quotas
7. **Implement virus scanning** for submitted files
8. **Encrypt sensitive data** at rest and in transit

## Troubleshooting

### File Upload Fails
- Check file size doesn't exceed limit
- Verify file type is in allowed formats
- Ensure internet connection is stable
- Check Supabase bucket permissions

### Signed URL Expires Too Quickly
- Increase expiry time parameter (in seconds)
- Default is 3600 (1 hour)
- Max is 604800 (7 days)

### Files Not Appearing in Database
- Ensure database tables are created
- Check RLS policies aren't blocking inserts
- Verify course_id and module_id exist
- Look for error messages in browser console

### Storage Quota Exceeded
- Review and delete unnecessary files
- Archive old course materials
- Implement file retention policies
- Consider upgrading Supabase plan

## Performance Optimization

1. **Use signed URLs** instead of public for sensitive files
2. **Implement lazy loading** for file lists
3. **Cache file metadata** in frontend state
4. **Compress videos** before upload
5. **Use CDN** for frequent file access
6. **Batch operations** when possible
7. **Monitor API rate limits**

## Migration Checklist

- [ ] Create all 4 storage buckets
- [ ] Create all 4 database tables
- [ ] Enable RLS on all tables
- [ ] Set up storage policies
- [ ] Test file uploads with all types
- [ ] Verify folder structure creation
- [ ] Test database persistence
- [ ] Validate RLS policies
- [ ] Implement error handling
- [ ] Add activity logging
- [ ] Performance test with large files
- [ ] Create backup strategy

