import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FileUpload } from "@/components/FileUpload";
import {
  AlertCircle,
  CheckCircle,
  FileText,
  Loader2,
  Download,
  Eye,
  Clock,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { getPublicUrl, listFiles } from "@/integrations/supabase/storage";

export interface PDFUploadProps {
  courseId: string;
  moduleId: string;
  courseName: string;
  moduleName: string;
  onUploadSuccess?: (pdfId: string) => void;
  onUploadError?: (error: Error) => void;
}

export interface CoursePDF {
  id: string;
  course_id: string;
  module_id: string;
  title: string;
  description: string;
  file_path: string;
  file_url: string;
  file_size: number; // in bytes
  pages?: number;
  resource_type: "lecture_notes" | "reading_material" | "assignment_guide" | "reference";
  published: boolean;
  download_count: number;
  created_at: string;
  updated_at: string;
}

// Format file size to human-readable format
const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i];
};

export const PDFUpload = ({
  courseId,
  moduleId,
  courseName,
  moduleName,
  onUploadSuccess,
  onUploadError,
}: PDFUploadProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [pdfTitle, setPdfTitle] = useState("");
  const [pdfDescription, setPdfDescription] = useState("");
  const [resourceType, setResourceType] = useState<
    "lecture_notes" | "reading_material" | "assignment_guide" | "reference"
  >("lecture_notes");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<{
    path: string;
    url: string;
    fileName: string;
  } | null>(null);
  const [uploadedPDF, setUploadedPDF] = useState<CoursePDF | null>(null);
  const [pdfList, setPdfList] = useState<CoursePDF[]>([]);

  const handleUploadSuccess = (path: string, url: string, fileName: string) => {
    setUploadedFile({ path, url, fileName });
  };

  const handlePublishPDF = async () => {
    if (!user?.id) {
      toast({
        title: "Error",
        description: "You must be logged in to upload PDFs",
        variant: "destructive",
      });
      return;
    }

    if (!uploadedFile) {
      toast({
        title: "Error",
        description: "Please upload a PDF file first",
        variant: "destructive",
      });
      return;
    }

    if (!pdfTitle.trim()) {
      toast({
        title: "Error",
        description: "Please enter a PDF title",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Extract file size from uploaded file (would need actual file size)
      const fileSize = uploadedFile.path.length * 100; // Placeholder

      // Store PDF metadata in database
      const { data, error } = await (supabase as any)
        .from("course_pdfs")
        .insert({
          course_id: courseId,
          module_id: moduleId,
          title: pdfTitle,
          description: pdfDescription,
          file_path: uploadedFile.path,
          file_url: uploadedFile.url,
          file_size: fileSize,
          resource_type: resourceType,
          published: true,
          download_count: 0,
        })
        .select()
        .single();

      if (error) {
        throw error;
      }

      toast({
        title: "Success",
        description: "PDF published successfully",
      });

      setUploadedPDF(data);
      setPdfTitle("");
      setPdfDescription("");
      setResourceType("lecture_notes");
      setUploadedFile(null);

      // Refresh PDF list
      await loadPdfList();
      onUploadSuccess?.(data.id);
    } catch (error) {
      const err = error instanceof Error ? error : new Error("PDF publishing failed");
      toast({
        title: "Error",
        description: err.message,
        variant: "destructive",
      });
      onUploadError?.(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const loadPdfList = async () => {
    try {
      const pdfs = await listFiles("pdfs", courseId);
      setPdfList(
        (pdfs as any[]).map((p, idx) => ({
          id: `pdf-${idx}`,
          course_id: courseId,
          module_id: moduleId,
          title: p.name,
          description: "",
          file_path: p.name,
          file_url: p.name,
          file_size: 0,
          resource_type: "lecture_notes",
          published: true,
          download_count: 0,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        }))
      );
    } catch (error) {
      console.error("Failed to load PDFs:", error);
    }
  };

  const resourceTypeLabels: Record<string, string> = {
    lecture_notes: "Lecture Notes",
    reading_material: "Reading Material",
    assignment_guide: "Assignment Guide",
    reference: "Reference Material",
  };

  const resourceTypeColors: Record<string, string> = {
    lecture_notes:
      "bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800",
    reading_material:
      "bg-purple-50 dark:bg-purple-950 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-800",
    assignment_guide:
      "bg-green-50 dark:bg-green-950 text-green-700 dark:text-green-300 border-green-200 dark:border-green-800",
    reference:
      "bg-orange-50 dark:bg-orange-950 text-orange-700 dark:text-orange-300 border-orange-200 dark:border-orange-800",
  };

  if (uploadedPDF) {
    return (
      <Card className="p-6 space-y-6">
        <div className="text-center space-y-4">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 dark:bg-red-950 rounded-full">
            <FileText className="w-8 h-8 text-red-600 dark:text-red-400" />
          </div>
          <div>
            <h2 className="text-2xl font-bold">PDF Published</h2>
            <p className="text-muted-foreground mt-1">{moduleName}</p>
          </div>
        </div>

        {/* PDF Details */}
        <div className="space-y-4 p-4 bg-secondary/50 rounded-lg">
          <div>
            <p className="text-sm text-muted-foreground">Document Title</p>
            <p className="font-semibold text-lg">{uploadedPDF.title}</p>
          </div>

          {uploadedPDF.description && (
            <div>
              <p className="text-sm text-muted-foreground">Description</p>
              <p className="text-sm">{uploadedPDF.description}</p>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Resource Type</p>
              <Badge variant="outline" className={resourceTypeColors[uploadedPDF.resource_type]}>
                {resourceTypeLabels[uploadedPDF.resource_type]}
              </Badge>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">File Size</p>
              <p className="font-semibold">
                {formatFileSize(uploadedPDF.file_size)}
              </p>
            </div>
          </div>
        </div>

        {/* PDF Preview */}
        <div className="rounded-lg overflow-hidden border border-border bg-gray-100 dark:bg-gray-900">
          <iframe
            src={`${uploadedPDF.file_url}#toolbar=1&navpanes=0&scrollbar=1`}
            className="w-full h-96"
            title="PDF Preview"
          />
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <Button
            onClick={() => window.open(uploadedPDF.file_url, "_blank")}
            variant="outline"
            className="w-full"
            size="lg"
          >
            <Eye className="w-4 h-4 mr-2" />
            View Full Document
          </Button>
          <Button
            onClick={() => {
              const link = document.createElement("a");
              link.href = uploadedPDF.file_url;
              link.download = uploadedPDF.title;
              link.click();
            }}
            className="w-full"
            size="lg"
          >
            <Download className="w-4 h-4 mr-2" />
            Download
          </Button>
        </div>

        {/* Continue Upload */}
        <Button
          onClick={() => {
            setUploadedPDF(null);
            setUploadedFile(null);
            setPdfTitle("");
            setPdfDescription("");
            setResourceType("lecture_notes");
          }}
          variant="outline"
          className="w-full"
        >
          Upload Another PDF
        </Button>
      </Card>
    );
  }

  return (
    <Card className="p-6 space-y-6">
      <div className="space-y-2">
        <h2 className="text-2xl font-bold">Upload Course Material</h2>
        <p className="text-muted-foreground">
          Add a PDF to {moduleName} in {courseName}
        </p>
      </div>

      {/* PDF File Upload */}
      <div className="space-y-4">
        <FileUpload
          folder="pdfs"
          courseId={courseId}
          moduleId={moduleId}
          onUploadSuccess={handleUploadSuccess}
          onUploadError={(error) => {
            toast({
              title: "Upload Error",
              description: error.message,
              variant: "destructive",
            });
          }}
          label="Upload PDF File"
          description="Supported format: PDF (Max 50MB)"
          maxFiles={1}
        />

        {uploadedFile && (
          <div className="p-4 bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800 rounded-lg">
            <div className="flex items-center gap-2 text-sm text-green-700 dark:text-green-300">
              <CheckCircle className="w-4 h-4" />
              <span>PDF file ready: {uploadedFile.fileName}</span>
            </div>
          </div>
        )}
      </div>

      {/* PDF Metadata Form */}
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="pdf-title">Document Title</Label>
          <Input
            id="pdf-title"
            placeholder="e.g., Chapter 3 Lecture Notes"
            value={pdfTitle}
            onChange={(e) => setPdfTitle(e.target.value)}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="pdf-description">Description (Optional)</Label>
          <Textarea
            id="pdf-description"
            placeholder="Enter a brief description of the document..."
            value={pdfDescription}
            onChange={(e) => setPdfDescription(e.target.value)}
            rows={4}
          />
          <p className="text-xs text-muted-foreground">
            {pdfDescription.length}/500 characters
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="resource-type">Resource Type</Label>
          <select
            id="resource-type"
            value={resourceType}
            onChange={(e) =>
              setResourceType(
                e.target.value as
                  | "lecture_notes"
                  | "reading_material"
                  | "assignment_guide"
                  | "reference"
              )
            }
            className="w-full px-3 py-2 border border-input bg-background rounded-md text-sm"
          >
            <option value="lecture_notes">Lecture Notes</option>
            <option value="reading_material">Reading Material</option>
            <option value="assignment_guide">Assignment Guide</option>
            <option value="reference">Reference Material</option>
          </select>
          <p className="text-xs text-muted-foreground">
            Categorize the resource for better organization
          </p>
        </div>
      </div>

      {/* PDF Preview */}
      {uploadedFile && (
        <div className="rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-900 border border-border">
          <iframe
            src={`${uploadedFile.url}#toolbar=1&navpanes=0&scrollbar=1`}
            className="w-full h-96"
            title="PDF Preview"
          />
        </div>
      )}

      {/* Resource Type Info */}
      <div className="p-4 bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg">
        <div className="flex items-start gap-3">
          <FileText className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
          <div className="text-sm text-blue-700 dark:text-blue-200">
            <p className="font-semibold mb-2">Resource Types</p>
            <ul className="space-y-1">
              <li><strong>Lecture Notes</strong>: Notes from class lectures</li>
              <li><strong>Reading Material</strong>: Recommended readings and textbooks</li>
              <li><strong>Assignment Guide</strong>: Instructions and rubrics for assignments</li>
              <li><strong>Reference</strong>: Additional references and resources</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Specs Box */}
      <div className="p-4 bg-amber-50 dark:bg-amber-950 border border-amber-200 dark:border-amber-800 rounded-lg">
        <div className="flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
          <div className="text-sm text-amber-700 dark:text-amber-200">
            <p className="font-semibold mb-1">Document Requirements</p>
            <ul className="space-y-1">
              <li>✓ Format: PDF</li>
              <li>✓ Maximum size: 50MB</li>
              <li>✓ Recommended: OCR-processed for text searchability</li>
              <li>✓ Quality: Clear, readable text</li>
              <li>✓ Pages: Up to 1000 pages</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Publish Button */}
      <Button
        onClick={handlePublishPDF}
        disabled={isSubmitting || !uploadedFile || !pdfTitle.trim()}
        size="lg"
        className="w-full"
      >
        {isSubmitting ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            Publishing PDF...
          </>
        ) : (
          <>
            <FileText className="w-4 h-4 mr-2" />
            Publish PDF
          </>
        )}
      </Button>
    </Card>
  );
};

export default PDFUpload;
