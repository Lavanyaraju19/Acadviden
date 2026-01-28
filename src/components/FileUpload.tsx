import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import {
  Upload,
  File,
  X,
  Check,
  AlertCircle,
  Loader2,
} from "lucide-react";
import {
  uploadFile,
  generateFilePath,
  validateFileSize,
  validateFileType,
  formatFileSize,
  getBucketName,
  getBucketConfig,
  StorageFolder,
} from "@/integrations/supabase/storage";

export interface FileUploadProps {
  folder: StorageFolder;
  courseId: string;
  moduleId?: string;
  onUploadSuccess?: (path: string, url: string, fileName: string) => void;
  onUploadError?: (error: Error) => void;
  maxFiles?: number;
  label?: string;
  description?: string;
  acceptedFormats?: string[];
}

export const FileUpload = ({
  folder,
  courseId,
  moduleId,
  onUploadSuccess,
  onUploadError,
  maxFiles = 1,
  label = "Upload File",
  description,
  acceptedFormats,
}: FileUploadProps) => {
  const [files, setFiles] = useState<File[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<Record<string, number>>({});
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const bucketConfig = getBucketConfig(folder);

  const allowedFormats = acceptedFormats || bucketConfig.types.map((type) => {
    const extension = type.split("/")[1];
    return `.${extension === "plain" ? "txt" : extension}`;
  });

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);

    // Check file count
    if (files.length + selectedFiles.length > maxFiles) {
      toast({
        title: "Too many files",
        description: `Maximum ${maxFiles} file(s) allowed`,
        variant: "destructive",
      });
      return;
    }

    // Validate files
    const validFiles = selectedFiles.filter((file) => {
      // Check size
      if (!validateFileSize(file, bucketConfig.maxSize)) {
        toast({
          title: "File too large",
          description: `${file.name} exceeds ${bucketConfig.maxSize}MB limit`,
          variant: "destructive",
        });
        return false;
      }

      // Check type
      if (!validateFileType(file, bucketConfig.types)) {
        toast({
          title: "Invalid file type",
          description: `${file.name} is not a supported format`,
          variant: "destructive",
        });
        return false;
      }

      return true;
    });

    setFiles((prev) => [...prev, ...validFiles]);

    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const removeFile = (fileName: string) => {
    setFiles((prev) => prev.filter((f) => f.name !== fileName));
    setUploadProgress((prev) => {
      const copy = { ...prev };
      delete copy[fileName];
      return copy;
    });
  };

  const handleUpload = async (file: File) => {
    try {
      setUploadProgress((prev) => ({ ...prev, [file.name]: 0 }));

      const filePath = generateFilePath(folder, courseId, file.name, moduleId);
      const bucketName = getBucketName(folder);

      const { path, url } = await uploadFile(
        bucketName,
        filePath,
        file,
        (progress) => {
          setUploadProgress((prev) => ({
            ...prev,
            [file.name]: Math.round((progress.loaded / progress.total) * 100),
          }));
        }
      );

      toast({
        title: "Upload successful",
        description: `${file.name} uploaded successfully`,
      });

      onUploadSuccess?.(path, url, file.name);
      removeFile(file.name);
    } catch (error) {
      const err = error instanceof Error ? error : new Error("Upload failed");
      toast({
        title: "Upload failed",
        description: err.message,
        variant: "destructive",
      });
      onUploadError?.(err);
    }
  };

  const handleUploadAll = async () => {
    if (files.length === 0) return;

    setIsUploading(true);
    try {
      await Promise.all(files.map((file) => handleUpload(file)));
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="w-full space-y-4">
      <div>
        <Label htmlFor="file-upload" className="text-base font-semibold">
          {label}
        </Label>
        {description && (
          <p className="text-sm text-muted-foreground mt-1">{description}</p>
        )}
      </div>

      {/* File Input Area */}
      <div className="relative border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-primary/50 transition-colors cursor-pointer bg-background/50">
        <input
          ref={fileInputRef}
          id="file-upload"
          type="file"
          multiple={maxFiles > 1}
          accept={allowedFormats.join(",")}
          onChange={handleFileSelect}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />

        <div className="space-y-2">
          <Upload className="w-8 h-8 mx-auto text-muted-foreground" />
          <div className="text-sm font-medium">Click to upload or drag and drop</div>
          <p className="text-xs text-muted-foreground">
            {allowedFormats.join(", ")} • Max {bucketConfig.maxSize}MB
          </p>
        </div>
      </div>

      {/* Selected Files List */}
      {files.length > 0 && (
        <div className="space-y-2">
          <p className="text-sm font-medium">Selected files ({files.length})</p>
          <div className="space-y-2">
            {files.map((file) => (
              <div
                key={file.name}
                className="flex items-center justify-between p-3 border border-border rounded-lg bg-background/50"
              >
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <File className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium truncate">{file.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {formatFileSize(file.size)}
                    </p>
                  </div>

                  {/* Progress Bar */}
                  {uploadProgress[file.name] !== undefined && (
                    <div className="w-24 bg-border rounded-full h-1.5">
                      <div
                        className="bg-primary h-1.5 rounded-full transition-all"
                        style={{
                          width: `${uploadProgress[file.name]}%`,
                        }}
                      />
                    </div>
                  )}

                  {/* Status Icons */}
                  {uploadProgress[file.name] === 100 && (
                    <Check className="w-4 h-4 text-green-500 flex-shrink-0" />
                  )}
                  {uploadProgress[file.name] !== undefined &&
                    uploadProgress[file.name] < 100 && (
                      <Loader2 className="w-4 h-4 animate-spin text-primary flex-shrink-0" />
                    )}
                </div>

                {/* Remove Button */}
                {uploadProgress[file.name] === undefined && (
                  <button
                    onClick={() => removeFile(file.name)}
                    className="p-1 hover:bg-destructive/10 rounded transition-colors flex-shrink-0"
                  >
                    <X className="w-4 h-4 text-muted-foreground" />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Error Message */}
      {files.length > 0 && files.some((f) => !validateFileSize(f, bucketConfig.maxSize)) && (
        <div className="flex items-center gap-2 p-3 rounded-lg bg-destructive/10 text-destructive">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <p className="text-sm">Some files exceed the size limit</p>
        </div>
      )}

      {/* Upload Button */}
      {files.length > 0 && (
        <Button
          onClick={handleUploadAll}
          disabled={isUploading || files.length === 0}
          className="w-full"
          size="lg"
        >
          {isUploading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Uploading...
            </>
          ) : (
            <>
              <Upload className="w-4 h-4 mr-2" />
              Upload {files.length} File{files.length !== 1 ? "s" : ""}
            </>
          )}
        </Button>
      )}
    </div>
  );
};

export default FileUpload;
