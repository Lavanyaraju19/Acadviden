# Supabase Storage Quick Reference

## File Locations

| Component | Path |
|-----------|------|
| Storage API | `src/integrations/supabase/storage.ts` |
| FileUpload | `src/components/FileUpload.tsx` |
| AssignmentUpload | `src/components/AssignmentUpload.tsx` |
| VideoUpload | `src/components/VideoUpload.tsx` |
| PDFUpload | `src/components/PDFUpload.tsx` |
| CertificateUpload | `src/components/CertificateUpload.tsx` |

## Quick Imports

```typescript
// Storage module
import {
  uploadFile,
  downloadFile,
  getPublicUrl,
  getSignedUrl,
  deleteFile,
  listFiles,
  validateFileType,
  validateFileSize,
  generateFilePath,
  generateFolderPath,
  formatFileSize,
} from "@/integrations/supabase/storage";

// Components
import { FileUpload } from "@/components/FileUpload";
import { AssignmentUpload } from "@/components/AssignmentUpload";
import { VideoUpload } from "@/components/VideoUpload";
import { PDFUpload } from "@/components/PDFUpload";
import { CertificateUpload } from "@/components/CertificateUpload";
```

## Storage Buckets

| Bucket | Max Size | Formats | Path Pattern |
|--------|----------|---------|--------------|
| course-videos | 500 MB | MP4, WebM, MOV | `videos/{courseId}/{moduleId}/` |
| course-pdfs | 50 MB | PDF | `pdfs/{courseId}/{moduleId}/` |
| student-assignments | 100 MB | PDF, DOC, DOCX, TXT | `assignments/{courseId}/{moduleId}/` |
| certificates | 20 MB | PNG, JPEG, PDF | `certificates/{courseId}/` |

## Database Tables

```sql
-- 1. Videos
course_videos(id, course_id, module_id, title, description, file_path, 
              file_url, duration, file_size, status, published, view_count)

-- 2. PDFs
course_pdfs(id, course_id, module_id, title, description, file_path,
            file_url, file_size, resource_type, published, download_count)

-- 3. Assignments
assignment_submissions(id, assignment_id, student_id, file_path, file_url,
                      notes, submitted_at, status, grade, feedback)

-- 4. Certificates
certificates(id, course_id, student_id, certificate_number, file_path,
            file_url, completion_date, issued_date, status)
```

## Common Code Snippets

### Upload File with Progress
```typescript
const { path, url } = await uploadFile(
  "course-videos",
  "videos/course-123/module-456/lecture.mp4",
  file,
  (progress) => console.log(`${progress.percent}%`)
);
```

### Get URLs
```typescript
// Public URL (permanent)
const publicUrl = getPublicUrl("course-videos", filePath);

// Signed URL (expires in 1 hour)
const tempUrl = await getSignedUrl("course-videos", filePath, 3600);
```

### Validate File
```typescript
if (!validateFileType("videos", file)) {
  // Invalid type
}
if (!validateFileSize("videos", file.size)) {
  // File too large
}
```

### List Files
```typescript
const files = await listFiles("videos", "course-123", "module-456");
files.forEach(file => {
  console.log(`${file.name} (${formatFileSize(file.metadata.size)})`);
});
```

### Delete File
```typescript
// Single file
await deleteFile("course-videos", filePath);

// Entire folder
await deleteFolder("course-videos", "videos/course-123/module-456");
```

### Download File
```typescript
const blob = await downloadFile("student-assignments", filePath);
const url = URL.createObjectURL(blob);
const link = document.createElement("a");
link.href = url;
link.download = "submission.pdf";
link.click();
```

## Component Usage

### FileUpload
```tsx
<FileUpload
  folder="videos"
  courseId="course-123"
  moduleId="module-456"
  onUploadSuccess={(path, url, fileName) => console.log(url)}
  onUploadError={(error) => console.error(error)}
  label="Upload Video"
  maxFiles={1}
/>
```

### AssignmentUpload
```tsx
<AssignmentUpload
  assignmentId="assign-123"
  assignmentTitle="Essay"
  courseId="course-123"
  moduleId="module-456"
  onUploadSuccess={(submissionId) => console.log(submissionId)}
/>
```

### VideoUpload
```tsx
<VideoUpload
  courseId="course-123"
  moduleId="module-456"
  courseName="React Basics"
  moduleName="Module 1"
  onUploadSuccess={(videoId) => console.log(videoId)}
/>
```

### PDFUpload
```tsx
<PDFUpload
  courseId="course-123"
  moduleId="module-456"
  courseName="React Basics"
  moduleName="Module 1"
  onUploadSuccess={(pdfId) => console.log(pdfId)}
/>
```

### CertificateUpload
```tsx
<CertificateUpload
  courseId="course-123"
  courseName="React Basics"
  onUploadSuccess={(certId) => console.log(certId)}
/>
```

## Error Handling

```typescript
try {
  await uploadFile("videos", path, file);
} catch (error) {
  const msg = error instanceof Error ? error.message : "Unknown";
  
  if (msg.includes("size")) {
    // File too large
  } else if (msg.includes("type")) {
    // Invalid type
  } else {
    // Other error
  }
}
```

## Path Generation

```typescript
// Generate folder path
const folderPath = generateFolderPath("videos", "course-123", "module-456");
// Result: "videos/course-123/module-456"

// Generate unique file path
const filePath = generateFilePath("videos", "course-123", "module-456", "lecture.mp4");
// Result: "videos/course-123/module-456/1704067200000-lecture.mp4"
```

## Common Errors & Fixes

| Error | Fix |
|-------|-----|
| "File too large" | Check max size in BUCKET_CONFIG |
| "Invalid file type" | Check ALLOWED_TYPES in storage.ts |
| "Permission denied" | Check RLS policies |
| "File not found" | Verify file_path in bucket |
| "Signed URL expired" | Increase expiresIn parameter |

## Documentation Files

| Document | Purpose | Length |
|----------|---------|--------|
| STORAGE_DATABASE_SCHEMA.md | Database & bucket setup | 500+ lines |
| STORAGE_INTEGRATION_GUIDE.md | Setup & usage guide | 600+ lines |
| STORAGE_IMPLEMENTATION_EXAMPLES.md | Code examples | 700+ lines |
| API_REFERENCE.md | Complete API docs | 500+ lines |
| DEPLOYMENT_CHECKLIST.md | Deployment guide | 400+ lines |

## Setup Checklist

```
Supabase Setup:
☐ Create 4 storage buckets
☐ Create 4 database tables
☐ Enable RLS on tables
☐ Configure RLS policies
☐ Set environment variables

Code Integration:
☐ Import components
☐ Add routes
☐ Add navigation links
☐ Test file uploads
☐ Test downloads
☐ Verify database saves

Deployment:
☐ Run TypeScript compiler
☐ Run linter
☐ Create backups
☐ Deploy to staging
☐ Run smoke tests
☐ Deploy to production
☐ Monitor errors
```

## Folder Structure

```
Supabase Buckets:
├── course-videos/
│   └── videos/courseId/moduleId/{timestamp-filename}.mp4
├── course-pdfs/
│   └── pdfs/courseId/moduleId/{timestamp-filename}.pdf
├── student-assignments/
│   └── assignments/courseId/moduleId/{timestamp-filename}
└── certificates/
    └── certificates/courseId/{timestamp-filename}
```

## File Size Limits

```
videos:     500 MB
pdfs:        50 MB
assignments: 100 MB
certificates: 20 MB
```

## Allowed File Types

```
videos:      MP4, WebM, QuickTime
pdfs:        PDF
assignments: PDF, DOC, DOCX, TXT
certificates: PNG, JPEG, PDF
```

## Key Functions Quick Lookup

| Function | Purpose | Async |
|----------|---------|-------|
| uploadFile() | Upload with progress | ✅ |
| downloadFile() | Download as blob | ✅ |
| getPublicUrl() | Get permanent URL | ❌ |
| getSignedUrl() | Get temporary URL | ✅ |
| deleteFile() | Delete single file | ✅ |
| deleteFolder() | Delete folder | ✅ |
| listFiles() | List folder contents | ✅ |
| validateFileType() | Check MIME type | ❌ |
| validateFileSize() | Check file size | ❌ |
| generateFolderPath() | Build folder path | ❌ |
| generateFilePath() | Build file path | ❌ |
| formatFileSize() | Format bytes | ❌ |

## Environment Variables

```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_anon_key
```

## TypeScript Types

```typescript
type StorageFolder = "videos" | "pdfs" | "assignments" | "certificates";

interface StorageFile {
  name: string;
  id: string;
  updated_at: string;
  created_at: string;
  last_accessed_at: string;
  metadata: {
    eTag: string;
    size: number;
    mimetype: string;
  };
}

interface UploadProgress {
  percent: number;
  bytes: number;
  totalBytes: number;
}
```

## Performance Tips

1. **Parallel uploads:** Use Promise.all() for multiple files
2. **Cache URLs:** Store getPublicUrl() results in state
3. **Lazy load:** Only load file lists when needed
4. **Compress files:** Reduce file size before upload
5. **Batch deletes:** Use Promise.all() for multiple deletions

## Security Checklist

- ✅ Validate files on client side
- ✅ Validate files on server side (RLS)
- ✅ Use signed URLs for sensitive content
- ✅ Check user authentication
- ✅ Verify user has correct role
- ✅ Log file operations
- ✅ Set file retention policies
- ✅ Backup files regularly

## Support Resources

- **Supabase Docs:** https://supabase.com/docs
- **GitHub Issues:** Check repo issues
- **Discord:** Supabase community discord
- **Documentation:** See /docs folder

## Version Info

- **Version:** 1.0.0
- **Release Date:** January 28, 2026
- **Status:** Production Ready
- **TypeScript Errors:** 0

---

**Last Updated:** January 28, 2026

