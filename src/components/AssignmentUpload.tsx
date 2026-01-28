import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { FileUpload } from "@/components/FileUpload";
import { Card } from "@/components/ui/card";
import { AlertCircle, CheckCircle, Upload } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

export interface AssignmentUploadProps {
  assignmentId: string;
  assignmentTitle: string;
  courseId: string;
  moduleId: string;
  onUploadSuccess?: (submissionId: string) => void;
  onUploadError?: (error: Error) => void;
}

export const AssignmentUpload = ({
  assignmentId,
  assignmentTitle,
  courseId,
  moduleId,
  onUploadSuccess,
  onUploadError,
}: AssignmentUploadProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [notes, setNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<{
    path: string;
    url: string;
    fileName: string;
  } | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleUploadSuccess = (path: string, url: string, fileName: string) => {
    setUploadedFile({ path, url, fileName });
  };

  const handleSubmit = async () => {
    if (!user?.id) {
      toast({
        title: "Error",
        description: "You must be logged in to submit assignments",
        variant: "destructive",
      });
      return;
    }

    if (!uploadedFile) {
      toast({
        title: "Error",
        description: "Please upload a file before submitting",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Store submission in database
      const { data, error } = await (supabase as any)
        .from("assignment_submissions")
        .insert({
          assignment_id: assignmentId,
          student_id: user.id,
          file_path: uploadedFile.path,
          file_url: uploadedFile.url,
          notes: notes || null,
          submitted_at: new Date().toISOString(),
          status: "submitted",
        })
        .select()
        .single();

      if (error) {
        throw error;
      }

      toast({
        title: "Success",
        description: "Assignment submitted successfully",
      });

      setIsSubmitted(true);
      setNotes("");
      setUploadedFile(null);
      onUploadSuccess?.(data.id);
    } catch (error) {
      const err = error instanceof Error ? error : new Error("Submission failed");
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

  if (isSubmitted) {
    return (
      <Card className="p-6 bg-green-50 dark:bg-green-950 border-green-200 dark:border-green-800">
        <div className="flex items-center gap-3">
          <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
          <div>
            <h3 className="font-semibold text-green-900 dark:text-green-100">
              Assignment Submitted
            </h3>
            <p className="text-sm text-green-800 dark:text-green-200 mt-1">
              Your assignment has been successfully submitted. Your instructor will review it
              shortly.
            </p>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6 space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">{assignmentTitle}</h2>
        <p className="text-muted-foreground">Submit your assignment files and notes below</p>
      </div>

      {/* File Upload Section */}
      <div className="space-y-4">
        <div>
          <Label className="text-base font-semibold mb-2 block">Upload Assignment File</Label>
          <FileUpload
            folder="assignments"
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
            label="Select Assignment File"
            description="Upload your completed assignment (PDF, Word, or Text files)"
          />
        </div>

        {uploadedFile && (
          <div className="p-4 bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800 rounded-lg">
            <div className="flex items-center gap-2 text-sm text-green-700 dark:text-green-300">
              <CheckCircle className="w-4 h-4" />
              <span>File ready: {uploadedFile.fileName}</span>
            </div>
          </div>
        )}
      </div>

      {/* Notes Section */}
      <div className="space-y-2">
        <Label htmlFor="notes" className="text-base font-semibold">
          Submission Notes (Optional)
        </Label>
        <Textarea
          id="notes"
          placeholder="Add any notes about your submission, challenges you faced, or questions for your instructor..."
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          className="min-h-[120px]"
        />
        <p className="text-xs text-muted-foreground">
          {notes.length} characters used
        </p>
      </div>

      {/* Submission Info */}
      <div className="p-4 bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg">
        <div className="flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
          <div className="text-sm text-blue-700 dark:text-blue-200">
            <p className="font-semibold mb-1">Before Submitting</p>
            <ul className="space-y-1">
              <li>✓ Ensure your file is in the correct format</li>
              <li>✓ Check that all files have uploaded successfully</li>
              <li>✓ You can only submit once per assignment</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Submit Button */}
      <Button
        onClick={handleSubmit}
        disabled={isSubmitting || !uploadedFile}
        size="lg"
        className="w-full"
      >
        {isSubmitting ? (
          <>
            <Upload className="w-4 h-4 mr-2 animate-spin" />
            Submitting...
          </>
        ) : (
          <>
            <Upload className="w-4 h-4 mr-2" />
            Submit Assignment
          </>
        )}
      </Button>
    </Card>
  );
};

export default AssignmentUpload;
