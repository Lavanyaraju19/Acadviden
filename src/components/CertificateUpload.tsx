import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FileUpload } from "@/components/FileUpload";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  AlertCircle,
  CheckCircle,
  Award,
  Calendar,
  Download,
  Share2,
  Loader2,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { getPublicUrl } from "@/integrations/supabase/storage";

export interface CertificateUploadProps {
  courseId: string;
  courseName: string;
  onUploadSuccess?: (certificateId: string) => void;
  onUploadError?: (error: Error) => void;
}

export interface Certificate {
  id: string;
  course_id: string;
  student_id: string;
  certificate_number: string;
  file_path: string;
  file_url: string;
  completion_date: string;
  issued_date: string;
  status: "draft" | "issued" | "revoked";
  created_at: string;
}

export const CertificateUpload = ({
  courseId,
  courseName,
  onUploadSuccess,
  onUploadError,
}: CertificateUploadProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [certificateNumber, setCertificateNumber] = useState("");
  const [completionDate, setCompletionDate] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<{
    path: string;
    url: string;
    fileName: string;
  } | null>(null);
  const [issuedCertificate, setIssuedCertificate] = useState<Certificate | null>(null);
  const [isCopied, setIsCopied] = useState(false);

  // Generate certificate number
  const generateCertificateNumber = () => {
    const timestamp = Date.now().toString(36).toUpperCase();
    const random = Math.random().toString(36).substring(2, 8).toUpperCase();
    return `CERT-${timestamp}-${random}`;
  };

  const handleUploadSuccess = (path: string, url: string, fileName: string) => {
    setUploadedFile({ path, url, fileName });
  };

  const handleIssueCertificate = async () => {
    if (!user?.id) {
      toast({
        title: "Error",
        description: "You must be logged in to issue certificates",
        variant: "destructive",
      });
      return;
    }

    if (!uploadedFile) {
      toast({
        title: "Error",
        description: "Please upload a certificate file first",
        variant: "destructive",
      });
      return;
    }

    if (!completionDate) {
      toast({
        title: "Error",
        description: "Please enter the completion date",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const certNumber = certificateNumber || generateCertificateNumber();

      // Store certificate in database
      const { data, error } = await (supabase as any)
        .from("certificates")
        .insert({
          course_id: courseId,
          student_id: user.id,
          certificate_number: certNumber,
          file_path: uploadedFile.path,
          file_url: uploadedFile.url,
          completion_date: completionDate,
          issued_date: new Date().toISOString(),
          status: "issued",
        })
        .select()
        .single();

      if (error) {
        throw error;
      }

      toast({
        title: "Success",
        description: "Certificate issued successfully",
      });

      setIssuedCertificate(data);
      setCertificateNumber("");
      setCompletionDate("");
      setUploadedFile(null);
      onUploadSuccess?.(data.id);
    } catch (error) {
      const err = error instanceof Error ? error : new Error("Certificate issuance failed");
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

  const handleDownload = async () => {
    if (!issuedCertificate) return;

    try {
      const url = getPublicUrl("certificates", issuedCertificate.file_path);
      window.open(url, "_blank");
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to download certificate",
        variant: "destructive",
      });
    }
  };

  const handleShareCertificate = async () => {
    if (!issuedCertificate) return;

    const certificateUrl = issuedCertificate.file_url;
    const shareText = `I've earned a certificate of completion for ${courseName}! Certificate #${issuedCertificate.certificate_number}`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: "Certificate",
          text: shareText,
          url: certificateUrl,
        });
      } catch (error) {
        console.error("Share failed:", error);
      }
    } else {
      // Fallback: Copy to clipboard
      try {
        await navigator.clipboard.writeText(certificateUrl);
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
        toast({
          title: "Copied",
          description: "Certificate URL copied to clipboard",
        });
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to copy certificate URL",
          variant: "destructive",
        });
      }
    }
  };

  if (issuedCertificate) {
    return (
      <Card className="p-6 space-y-6">
        <div className="text-center space-y-4">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-amber-100 dark:bg-amber-950 rounded-full">
            <Award className="w-8 h-8 text-amber-600 dark:text-amber-400" />
          </div>
          <div>
            <h2 className="text-2xl font-bold">Certificate Issued</h2>
            <p className="text-muted-foreground mt-1">{courseName}</p>
          </div>
        </div>

        {/* Certificate Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-secondary/50 rounded-lg">
          <div>
            <p className="text-sm text-muted-foreground">Certificate Number</p>
            <p className="font-mono font-semibold text-lg">
              {issuedCertificate.certificate_number}
            </p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Issue Date</p>
            <p className="font-semibold">
              {new Date(issuedCertificate.issued_date).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Completion Date</p>
            <p className="font-semibold">
              {new Date(issuedCertificate.completion_date).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Status</p>
            <Badge variant="outline" className="bg-green-50 dark:bg-green-950 text-green-700 dark:text-green-300 border-green-200 dark:border-green-800">
              {issuedCertificate.status.toUpperCase()}
            </Badge>
          </div>
        </div>

        {/* File Info */}
        <div className="p-4 bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg">
          <p className="text-sm font-semibold text-blue-900 dark:text-blue-100 mb-2">
            Certificate File
          </p>
          <p className="text-sm text-blue-800 dark:text-blue-200">
            {issuedCertificate.file_path.split("/").pop()}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <Button
            onClick={handleDownload}
            variant="outline"
            className="w-full"
            size="lg"
          >
            <Download className="w-4 h-4 mr-2" />
            Download
          </Button>
          <Button
            onClick={handleShareCertificate}
            className="w-full"
            size="lg"
          >
            <Share2 className="w-4 h-4 mr-2" />
            {isCopied ? "Copied!" : "Share"}
          </Button>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6 space-y-6">
      <div className="space-y-2">
        <h2 className="text-2xl font-bold">Issue Certificate</h2>
        <p className="text-muted-foreground">Upload and issue a certificate of completion for {courseName}</p>
      </div>

      {/* Certificate File Upload */}
      <div className="space-y-4">
        <FileUpload
          folder="certificates"
          courseId={courseId}
          onUploadSuccess={handleUploadSuccess}
          onUploadError={(error) => {
            toast({
              title: "Upload Error",
              description: error.message,
              variant: "destructive",
            });
          }}
          label="Upload Certificate File"
          description="Upload the certificate image or PDF file"
          maxFiles={1}
        />

        {uploadedFile && (
          <div className="p-4 bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800 rounded-lg">
            <div className="flex items-center gap-2 text-sm text-green-700 dark:text-green-300">
              <CheckCircle className="w-4 h-4" />
              <span>Certificate file ready: {uploadedFile.fileName}</span>
            </div>
          </div>
        )}
      </div>

      {/* Certificate Details Form */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="cert-number">Certificate Number (Optional)</Label>
          <Input
            id="cert-number"
            placeholder="Auto-generated if left blank"
            value={certificateNumber}
            onChange={(e) => setCertificateNumber(e.target.value)}
          />
          <p className="text-xs text-muted-foreground">
            Leave blank to auto-generate
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="completion-date">Completion Date</Label>
          <Input
            id="completion-date"
            type="date"
            value={completionDate}
            onChange={(e) => setCompletionDate(e.target.value)}
            required
          />
        </div>
      </div>

      {/* Certificate Preview */}
      {uploadedFile && (
        <div className="p-4 bg-secondary/50 rounded-lg">
          <p className="text-sm font-semibold mb-3">Preview</p>
          <div className="border border-border rounded overflow-hidden">
            <img
              src={uploadedFile.url}
              alt="Certificate Preview"
              className="w-full h-auto max-h-72 object-contain bg-background"
            />
          </div>
        </div>
      )}

      {/* Info Box */}
      <div className="p-4 bg-amber-50 dark:bg-amber-950 border border-amber-200 dark:border-amber-800 rounded-lg">
        <div className="flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
          <div className="text-sm text-amber-700 dark:text-amber-200">
            <p className="font-semibold mb-1">Certificate Information</p>
            <ul className="space-y-1">
              <li>✓ Upload a high-quality certificate image or PDF</li>
              <li>✓ Certificate number is auto-generated or can be custom</li>
              <li>✓ Students will be able to download and share</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Issue Button */}
      <Button
        onClick={handleIssueCertificate}
        disabled={isSubmitting || !uploadedFile || !completionDate}
        size="lg"
        className="w-full"
      >
        {isSubmitting ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            Issuing Certificate...
          </>
        ) : (
          <>
            <Award className="w-4 h-4 mr-2" />
            Issue Certificate
          </>
        )}
      </Button>
    </Card>
  );
};

export default CertificateUpload;
