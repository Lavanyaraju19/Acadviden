import { supabase } from './client';

/**
 * Supabase Storage Integration
 * Handles file uploads, downloads, and management for:
 * - Videos (course content)
 * - PDFs (course materials)
 * - Assignments (student submissions)
 * - Certificates (completion credentials)
 */

export type StorageFolder = 'videos' | 'pdfs' | 'assignments' | 'certificates';

export interface StorageFile {
  id: string;
  name: string;
  path: string;
  size: number;
  created_at: string;
  updated_at: string;
}

export interface UploadProgress {
  progress: number;
  loaded: number;
  total: number;
}

/**
 * Generate folder structure: bucket/folder/courseId/moduleId/
 */
export const generateFolderPath = (
  folder: StorageFolder,
  courseId: string,
  moduleId?: string
): string => {
  const basePath = `${folder}/${courseId}`;
  return moduleId ? `${basePath}/${moduleId}` : basePath;
};

/**
 * Generate unique file path with timestamp
 */
export const generateFilePath = (
  folder: StorageFolder,
  courseId: string,
  fileName: string,
  moduleId?: string
): string => {
  const folderPath = generateFolderPath(folder, courseId, moduleId);
  const timestamp = Date.now();
  const uniqueFileName = `${timestamp}-${fileName}`;
  return `${folderPath}/${uniqueFileName}`;
};

/**
 * Upload file to Supabase Storage
 */
export const uploadFile = async (
  bucket: string,
  filePath: string,
  file: File,
  onProgress?: (progress: UploadProgress) => void
): Promise<{ path: string; url: string }> => {
  try {
    // Upload file
    const { data, error } = await (supabase as any)
      .storage
      .from(bucket)
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false,
      });

    if (error) {
      throw new Error(`Upload failed: ${error.message}`);
    }

    // Get public URL
    const { data: urlData } = (supabase as any)
      .storage
      .from(bucket)
      .getPublicUrl(filePath);

    return {
      path: data.path,
      url: urlData.publicUrl,
    };
  } catch (err) {
    console.error('File upload error:', err);
    throw err;
  }
};

/**
 * Download file from Supabase Storage
 */
export const downloadFile = async (
  bucket: string,
  filePath: string
): Promise<Blob> => {
  try {
    const { data, error } = await (supabase as any)
      .storage
      .from(bucket)
      .download(filePath);

    if (error) {
      throw new Error(`Download failed: ${error.message}`);
    }

    return data as Blob;
  } catch (err) {
    console.error('File download error:', err);
    throw err;
  }
};

/**
 * Get public URL for a file
 */
export const getPublicUrl = (bucket: string, filePath: string): string => {
  const { data } = (supabase as any)
    .storage
    .from(bucket)
    .getPublicUrl(filePath);

  return data.publicUrl;
};

/**
 * Get signed URL for temporary access (expires in 1 hour by default)
 */
export const getSignedUrl = async (
  bucket: string,
  filePath: string,
  expiresIn: number = 3600
): Promise<string> => {
  try {
    const { data, error } = await (supabase as any)
      .storage
      .from(bucket)
      .createSignedUrl(filePath, expiresIn);

    if (error) {
      throw new Error(`Signed URL creation failed: ${error.message}`);
    }

    return data.signedUrl;
  } catch (err) {
    console.error('Signed URL error:', err);
    throw err;
  }
};

/**
 * Delete file from Supabase Storage
 */
export const deleteFile = async (
  bucket: string,
  filePath: string
): Promise<void> => {
  try {
    const { error } = await (supabase as any)
      .storage
      .from(bucket)
      .remove([filePath]);

    if (error) {
      throw new Error(`Delete failed: ${error.message}`);
    }
  } catch (err) {
    console.error('File delete error:', err);
    throw err;
  }
};

/**
 * List files in a folder
 */
export const listFiles = async (
  bucket: string,
  folderPath: string
): Promise<StorageFile[]> => {
  try {
    const { data, error } = await (supabase as any)
      .storage
      .from(bucket)
      .list(folderPath, {
        limit: 100,
        offset: 0,
        sortBy: { column: 'created_at', order: 'desc' },
      });

    if (error) {
      throw new Error(`List files failed: ${error.message}`);
    }

    return (data || []).map((file: any) => ({
      id: file.id,
      name: file.name,
      path: `${folderPath}/${file.name}`,
      size: file.metadata?.size || 0,
      created_at: file.created_at,
      updated_at: file.updated_at,
    }));
  } catch (err) {
    console.error('List files error:', err);
    throw err;
  }
};

/**
 * Delete folder and all its contents
 */
export const deleteFolder = async (
  bucket: string,
  folderPath: string
): Promise<void> => {
  try {
    // List all files in folder
    const files = await listFiles(bucket, folderPath);

    // Delete each file
    const filePaths = files.map((file) => file.path);
    if (filePaths.length > 0) {
      const { error } = await (supabase as any)
        .storage
        .from(bucket)
        .remove(filePaths);

      if (error) {
        throw new Error(`Delete folder failed: ${error.message}`);
      }
    }
  } catch (err) {
    console.error('Delete folder error:', err);
    throw err;
  }
};

/**
 * Validate file size (in MB)
 */
export const validateFileSize = (file: File, maxSizeMB: number): boolean => {
  const maxSizeBytes = maxSizeMB * 1024 * 1024;
  return file.size <= maxSizeBytes;
};

/**
 * Validate file type
 */
export const validateFileType = (file: File, allowedTypes: string[]): boolean => {
  return allowedTypes.includes(file.type);
};

/**
 * Get file extension
 */
export const getFileExtension = (fileName: string): string => {
  return fileName.split('.').pop()?.toLowerCase() || '';
};

/**
 * Format file size for display
 */
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
};

/**
 * Storage buckets configuration
 */
export const STORAGE_BUCKETS = {
  videos: {
    name: 'course-videos',
    maxSize: 500, // MB
    types: ['video/mp4', 'video/webm', 'video/quicktime'],
  },
  pdfs: {
    name: 'course-pdfs',
    maxSize: 50, // MB
    types: ['application/pdf'],
  },
  assignments: {
    name: 'student-assignments',
    maxSize: 100, // MB
    types: [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'text/plain',
    ],
  },
  certificates: {
    name: 'certificates',
    maxSize: 20, // MB
    types: ['image/png', 'image/jpeg', 'application/pdf'],
  },
};

/**
 * Get bucket name for folder type
 */
export const getBucketName = (folder: StorageFolder): string => {
  return STORAGE_BUCKETS[folder].name;
};

/**
 * Get bucket configuration
 */
export const getBucketConfig = (folder: StorageFolder) => {
  return STORAGE_BUCKETS[folder];
};
