# Storage Module API Reference

## Overview

The storage module provides a complete API wrapper for Supabase Storage operations with integrated validation, error handling, and utility functions.

**Location:** `src/integrations/supabase/storage.ts`

## Type Definitions

### StorageFolder
```typescript
type StorageFolder = "videos" | "pdfs" | "assignments" | "certificates";
```

Specifies which bucket to use for storage operations.

### StorageFile
```typescript
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
```

Represents a file object returned from Supabase Storage.

### UploadProgress
```typescript
interface UploadProgress {
  percent: number;
  bytes: number;
  totalBytes: number;
}
```

Progress information during file upload.

## Configuration Constants

### Bucket Configuration
```typescript
const BUCKET_CONFIG = {
  videos: {
    name: "course-videos",
    maxSize: 500 * 1024 * 1024, // 500 MB
    types: ["video/mp4", "video/webm", "video/quicktime"],
  },
  pdfs: {
    name: "course-pdfs",
    maxSize: 50 * 1024 * 1024, // 50 MB
    types: ["application/pdf"],
  },
  assignments: {
    name: "student-assignments",
    maxSize: 100 * 1024 * 1024, // 100 MB
    types: [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "text/plain",
    ],
  },
  certificates: {
    name: "certificates",
    maxSize: 20 * 1024 * 1024, // 20 MB
    types: ["image/png", "image/jpeg", "application/pdf"],
  },
};
```

## Core Functions

### uploadFile()

Upload a file with optional progress tracking.

**Signature:**
```typescript
async function uploadFile(
  bucket: string,
  filePath: string,
  file: File,
  onProgress?: (progress: UploadProgress) => void
): Promise<{ path: string; url: string }>
```

**Parameters:**
- `bucket` (string): Bucket name (e.g., "course-videos")
- `filePath` (string): Full file path in bucket
- `file` (File): File object to upload
- `onProgress` (function, optional): Callback for progress updates

**Returns:**
- `path` (string): File path in storage
- `url` (string): Public URL to file

**Throws:**
- `Error`: If upload fails or file validation fails

**Example:**
```typescript
import { uploadFile } from "@/integrations/supabase/storage";

try {
  const { path, url } = await uploadFile(
    "course-videos",
    "videos/course-123/module-456/lecture.mp4",
    videoFile,
    (progress) => {
      console.log(`${progress.percent}% uploaded`);
      console.log(`${progress.bytes}/${progress.totalBytes} bytes`);
    }
  );
  
  console.log("Uploaded to:", path);
  console.log("Public URL:", url);
} catch (error) {
  console.error("Upload failed:", error);
}
```

---

### downloadFile()

Download a file from storage as a Blob.

**Signature:**
```typescript
async function downloadFile(
  bucket: string,
  filePath: string
): Promise<Blob>
```

**Parameters:**
- `bucket` (string): Bucket name
- `filePath` (string): File path in bucket

**Returns:**
- `Blob`: File contents as blob

**Throws:**
- `Error`: If download fails

**Example:**
```typescript
import { downloadFile } from "@/integrations/supabase/storage";

try {
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
  URL.revokeObjectURL(url);
} catch (error) {
  console.error("Download failed:", error);
}
```

---

### getPublicUrl()

Get the public URL for a file in storage.

**Signature:**
```typescript
function getPublicUrl(bucket: string, filePath: string): string
```

**Parameters:**
- `bucket` (string): Bucket name
- `filePath` (string): File path in bucket

**Returns:**
- `string`: Public URL (always valid, doesn't expire)

**Note:** Works for public buckets only. For private content, use `getSignedUrl()`.

**Example:**
```typescript
import { getPublicUrl } from "@/integrations/supabase/storage";

const videoUrl = getPublicUrl(
  "course-videos",
  "videos/course-123/module-456/lecture.mp4"
);

// Use in video tag
<video src={videoUrl} controls />
```

---

### getSignedUrl()

Get a temporary signed URL that expires after specified time.

**Signature:**
```typescript
async function getSignedUrl(
  bucket: string,
  filePath: string,
  expiresIn: number = 3600
): Promise<string>
```

**Parameters:**
- `bucket` (string): Bucket name
- `filePath` (string): File path in bucket
- `expiresIn` (number, optional): Expiration time in seconds (default: 3600 = 1 hour)
  - Maximum: 604800 seconds (7 days)

**Returns:**
- `string`: Temporary signed URL

**Throws:**
- `Error`: If signed URL creation fails

**Example:**
```typescript
import { getSignedUrl } from "@/integrations/supabase/storage";

try {
  // URL valid for 7 days
  const url = await getSignedUrl(
    "student-assignments",
    "assignments/course-123/submission.pdf",
    7 * 24 * 60 * 60 // 7 days
  );
  
  // Send URL to student via email
  console.log("Download link:", url);
} catch (error) {
  console.error("Failed to create signed URL:", error);
}
```

---

### deleteFile()

Delete a single file from storage.

**Signature:**
```typescript
async function deleteFile(
  bucket: string,
  filePath: string
): Promise<void>
```

**Parameters:**
- `bucket` (string): Bucket name
- `filePath` (string): File path in bucket

**Throws:**
- `Error`: If deletion fails

**Example:**
```typescript
import { deleteFile } from "@/integrations/supabase/storage";

try {
  await deleteFile(
    "course-videos",
    "videos/course-123/module-456/lecture.mp4"
  );
  console.log("File deleted");
} catch (error) {
  console.error("Deletion failed:", error);
}
```

---

### deleteFolder()

Recursively delete all files in a folder.

**Signature:**
```typescript
async function deleteFolder(
  bucket: string,
  folderPath: string
): Promise<void>
```

**Parameters:**
- `bucket` (string): Bucket name
- `folderPath` (string): Folder path (e.g., "videos/course-123/module-456")

**Note:** Deletes all files under the specified path.

**Throws:**
- `Error`: If deletion fails

**Example:**
```typescript
import { deleteFolder } from "@/integrations/supabase/storage";

try {
  // Delete entire module's videos
  await deleteFolder(
    "course-videos",
    "videos/course-123/module-456"
  );
  console.log("Folder deleted");
} catch (error) {
  console.error("Deletion failed:", error);
}
```

---

### listFiles()

List all files in a folder.

**Signature:**
```typescript
async function listFiles(
  folder: StorageFolder,
  courseId: string,
  moduleId?: string
): Promise<StorageFile[]>
```

**Parameters:**
- `folder` (StorageFolder): Type of folder ("videos", "pdfs", "assignments", "certificates")
- `courseId` (string): Course ID
- `moduleId` (string, optional): Module ID for nested folders

**Returns:**
- `StorageFile[]`: Array of files in the folder

**Throws:**
- `Error`: If listing fails

**Example:**
```typescript
import { listFiles } from "@/integrations/supabase/storage";

try {
  // List all videos in a module
  const videos = await listFiles("videos", "course-123", "module-456");
  
  videos.forEach(video => {
    console.log(`${video.name} (${formatFileSize(video.metadata.size)})`);
  });
} catch (error) {
  console.error("Failed to list files:", error);
}
```

---

## Validation Functions

### validateFileType()

Check if a file type is allowed for a storage folder.

**Signature:**
```typescript
function validateFileType(folder: StorageFolder, file: File): boolean
```

**Parameters:**
- `folder` (StorageFolder): Type of folder
- `file` (File): File to validate

**Returns:**
- `boolean`: True if file type is allowed

**Example:**
```typescript
import { validateFileType } from "@/integrations/supabase/storage";

if (!validateFileType("videos", file)) {
  console.error("Invalid file type for videos");
}
```

---

### validateFileSize()

Check if a file size is within limits for a storage folder.

**Signature:**
```typescript
function validateFileSize(folder: StorageFolder, fileSize: number): boolean
```

**Parameters:**
- `folder` (StorageFolder): Type of folder
- `fileSize` (number): File size in bytes

**Returns:**
- `boolean`: True if file size is acceptable

**Example:**
```typescript
import { validateFileSize } from "@/integrations/supabase/storage";

if (!validateFileSize("videos", file.size)) {
  console.error(`File exceeds maximum size for videos (500MB max)`);
}
```

---

## Path Generation Functions

### generateFolderPath()

Generate the folder path following storage structure conventions.

**Signature:**
```typescript
function generateFolderPath(
  folder: StorageFolder,
  courseId: string,
  moduleId?: string
): string
```

**Parameters:**
- `folder` (StorageFolder): Type of folder
- `courseId` (string): Course ID
- `moduleId` (string, optional): Module ID

**Returns:**
- `string`: Folder path (e.g., "videos/course-123/module-456")

**Example:**
```typescript
import { generateFolderPath } from "@/integrations/supabase/storage";

const path = generateFolderPath("videos", "course-123", "module-456");
// Returns: "videos/course-123/module-456"
```

---

### generateFilePath()

Generate a unique file path with timestamp prefix.

**Signature:**
```typescript
function generateFilePath(
  folder: StorageFolder,
  courseId: string,
  moduleId: string,
  fileName: string
): string
```

**Parameters:**
- `folder` (StorageFolder): Type of folder
- `courseId` (string): Course ID
- `moduleId` (string): Module ID
- `fileName` (string): Original file name

**Returns:**
- `string`: Unique file path with timestamp

**Example:**
```typescript
import { generateFilePath } from "@/integrations/supabase/storage";

const path = generateFilePath(
  "videos",
  "course-123",
  "module-456",
  "lecture.mp4"
);
// Returns: "videos/course-123/module-456/1704067200000-lecture.mp4"
```

**Note:** 
- Timestamps ensure unique file names and prevent overwrites
- Original file name is preserved for user-friendly storage
- Timestamp format: Unix milliseconds (13 digits)

---

## Utility Functions

### formatFileSize()

Format a file size in bytes to human-readable format.

**Signature:**
```typescript
function formatFileSize(bytes: number): string
```

**Parameters:**
- `bytes` (number): File size in bytes

**Returns:**
- `string`: Human-readable size (e.g., "5.25 MB")

**Example:**
```typescript
import { formatFileSize } from "@/integrations/supabase/storage";

console.log(formatFileSize(1024)); // "1 KB"
console.log(formatFileSize(1048576)); // "1 MB"
console.log(formatFileSize(5242880)); // "5 MB"
```

---

## Error Handling

All functions throw descriptive errors with helpful context.

### Common Errors

**File Too Large**
```
Error: File size exceeds maximum for videos (500MB max)
```

**Invalid File Type**
```
Error: File type not allowed for videos. Allowed: video/mp4, video/webm, video/quicktime
```

**Upload Failed**
```
Error: Upload failed: {Supabase error message}
```

**Not Found**
```
Error: File not found: videos/course-123/module-456/video.mp4
```

### Error Handling Best Practices

```typescript
try {
  const { path, url } = await uploadFile(
    "videos",
    "videos/course-123/module-456/video.mp4",
    file
  );
} catch (error) {
  const message = error instanceof Error ? error.message : "Unknown error";
  
  if (message.includes("size")) {
    // Handle file too large
    showErrorMessage("File is too large. Maximum size is 500MB.");
  } else if (message.includes("type")) {
    // Handle invalid type
    showErrorMessage("Invalid file type. Supported: MP4, WebM, QuickTime");
  } else if (message.includes("Upload failed")) {
    // Handle upload error
    showErrorMessage("Upload failed. Please check your connection and try again.");
  } else {
    // Handle unknown error
    showErrorMessage("An error occurred. Please try again.");
  }
}
```

---

## Complete Integration Example

```typescript
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
  formatFileSize,
} from "@/integrations/supabase/storage";

async function completeWorkflow() {
  try {
    const file = new File(["content"], "lecture.mp4", { type: "video/mp4" });
    const courseId = "course-123";
    const moduleId = "module-456";

    // 1. Validate file before upload
    if (!validateFileType("videos", file)) {
      throw new Error("Invalid file type");
    }
    if (!validateFileSize("videos", file.size)) {
      throw new Error("File too large");
    }

    // 2. Upload file with progress
    const filePath = generateFilePath("videos", courseId, moduleId, file.name);
    const { path, url } = await uploadFile(
      "course-videos",
      filePath,
      file,
      (progress) => {
        console.log(`${progress.percent}% uploaded`);
      }
    );

    // 3. Get public URL for immediate access
    const publicUrl = getPublicUrl("course-videos", path);
    console.log("Public URL:", publicUrl);

    // 4. Get signed URL for temporary access
    const tempUrl = await getSignedUrl("course-videos", path, 3600);
    console.log("Temporary URL (1 hour):", tempUrl);

    // 5. List other files in folder
    const files = await listFiles("videos", courseId, moduleId);
    files.forEach((file) => {
      console.log(`${file.name}: ${formatFileSize(file.metadata.size)}`);
    });

    // 6. Download file (if needed)
    const blob = await downloadFile("course-videos", path);
    console.log("Downloaded blob:", blob.size);

    // 7. Delete file when no longer needed
    await deleteFile("course-videos", path);
    console.log("File deleted");
  } catch (error) {
    console.error("Error:", error);
  }
}
```

---

## Performance Considerations

### Parallel Operations
```typescript
// Upload multiple files in parallel
const results = await Promise.all([
  uploadFile("pdfs", "pdfs/course-123/module-456/1.pdf", file1),
  uploadFile("pdfs", "pdfs/course-123/module-456/2.pdf", file2),
  uploadFile("pdfs", "pdfs/course-123/module-456/3.pdf", file3),
]);
```

### Batch Operations
```typescript
// Delete multiple files
const filesToDelete = ["file1.pdf", "file2.pdf", "file3.pdf"];
await Promise.all(
  filesToDelete.map((file) =>
    deleteFile("pdfs", `pdfs/course-123/module-456/${file}`)
  )
);
```

### Caching
```typescript
// Cache public URLs in component state
const [cachedUrl, setCachedUrl] = useState<string | null>(null);

if (!cachedUrl) {
  const url = getPublicUrl("videos", filePath);
  setCachedUrl(url);
}
```

---

## Limits & Quotas

| Resource | Limit |
|----------|-------|
| Videos bucket max file size | 500 MB |
| PDFs bucket max file size | 50 MB |
| Assignments bucket max file size | 100 MB |
| Certificates bucket max file size | 20 MB |
| Max folder depth | 3 levels |
| File name length | 255 characters |
| Signed URL validity | 7 days max |
| Concurrent uploads | Unlimited (per account limits) |

---

## Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0 | 2025-01-28 | Initial release with 15+ functions |

