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
  Play,
  Loader2,
  Video,
  Clock,
  FileText,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { listFiles } from "@/integrations/supabase/storage";

export interface VideoUploadProps {
  courseId: string;
  moduleId: string;
  courseName: string;
  moduleName: string;
  onUploadSuccess?: (videoId: string) => void;
  onUploadError?: (error: Error) => void;
}

export interface CourseVideo {
  id: string;
  course_id: string;
  module_id: string;
  title: string;
  description: string;
  file_path: string;
  file_url: string;
  duration: string; // HH:MM:SS format
  file_size: number; // in bytes
  thumbnail_url?: string;
  status: "uploaded" | "processing" | "ready" | "error";
  published: boolean;
  view_count: number;
  created_at: string;
  updated_at: string;
}

export const VideoUpload = ({
  courseId,
  moduleId,
  courseName,
  moduleName,
  onUploadSuccess,
  onUploadError,
}: VideoUploadProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [videoTitle, setVideoTitle] = useState("");
  const [videoDescription, setVideoDescription] = useState("");
  const [videoDuration, setVideoDuration] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<{
    path: string;
    url: string;
    fileName: string;
  } | null>(null);
  const [uploadedVideo, setUploadedVideo] = useState<CourseVideo | null>(null);
  const [videoList, setVideoList] = useState<CourseVideo[]>([]);

  const handleUploadSuccess = (path: string, url: string, fileName: string) => {
    setUploadedFile({ path, url, fileName });
  };

  const handlePublishVideo = async () => {
    if (!user?.id) {
      toast({
        title: "Error",
        description: "You must be logged in to upload videos",
        variant: "destructive",
      });
      return;
    }

    if (!uploadedFile) {
      toast({
        title: "Error",
        description: "Please upload a video file first",
        variant: "destructive",
      });
      return;
    }

    if (!videoTitle.trim()) {
      toast({
        title: "Error",
        description: "Please enter a video title",
        variant: "destructive",
      });
      return;
    }

    if (!videoDuration.trim()) {
      toast({
        title: "Error",
        description: "Please enter the video duration",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Calculate file size from file name pattern (if available)
      const fileSize = uploadedFile.path.length * 100; // Placeholder

      // Store video metadata in database
      const { data, error } = await (supabase as any)
        .from("course_videos")
        .insert({
          course_id: courseId,
          module_id: moduleId,
          title: videoTitle,
          description: videoDescription,
          file_path: uploadedFile.path,
          file_url: uploadedFile.url,
          duration: videoDuration,
          file_size: fileSize,
          status: "ready",
          published: true,
          view_count: 0,
        })
        .select()
        .single();

      if (error) {
        throw error;
      }

      toast({
        title: "Success",
        description: "Video published successfully",
      });

      setUploadedVideo(data);
      setVideoTitle("");
      setVideoDescription("");
      setVideoDuration("");
      setUploadedFile(null);
      
      // Refresh video list
      await loadVideoList();
      onUploadSuccess?.(data.id);
    } catch (error) {
      const err = error instanceof Error ? error : new Error("Video publishing failed");
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

  const loadVideoList = async () => {
    try {
      const videos = await listFiles("videos", courseId);
      setVideoList((videos as any[]).map((v, idx) => ({
        id: `video-${idx}`,
        course_id: courseId,
        module_id: moduleId,
        title: v.name,
        description: "",
        file_path: v.name,
        file_url: v.name,
        duration: "00:00:00",
        file_size: 0,
        status: "ready",
        published: true,
        view_count: 0,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })));
    } catch (error) {
      console.error("Failed to load videos:", error);
    }
  };

  if (uploadedVideo) {
    return (
      <Card className="p-6 space-y-6">
        <div className="text-center space-y-4">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 dark:bg-blue-950 rounded-full">
            <Play className="w-8 h-8 text-blue-600 dark:text-blue-400 fill-current" />
          </div>
          <div>
            <h2 className="text-2xl font-bold">Video Published</h2>
            <p className="text-muted-foreground mt-1">{moduleName}</p>
          </div>
        </div>

        {/* Video Details */}
        <div className="space-y-4 p-4 bg-secondary/50 rounded-lg">
          <div>
            <p className="text-sm text-muted-foreground">Video Title</p>
            <p className="font-semibold text-lg">{uploadedVideo.title}</p>
          </div>

          {uploadedVideo.description && (
            <div>
              <p className="text-sm text-muted-foreground">Description</p>
              <p className="text-sm">{uploadedVideo.description}</p>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Duration</p>
              <div className="flex items-center gap-2 font-semibold">
                <Clock className="w-4 h-4" />
                {uploadedVideo.duration}
              </div>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Status</p>
              <Badge variant="outline" className="bg-green-50 dark:bg-green-950 text-green-700 dark:text-green-300 border-green-200 dark:border-green-800">
                {uploadedVideo.status.toUpperCase()}
              </Badge>
            </div>
          </div>
        </div>

        {/* Video Preview */}
        <div className="rounded-lg overflow-hidden bg-black aspect-video">
          <video
            src={uploadedVideo.file_url}
            className="w-full h-full"
            controls
          />
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <Button
            onClick={() => window.open(uploadedVideo.file_url, "_blank")}
            variant="outline"
            className="w-full"
            size="lg"
          >
            <Video className="w-4 h-4 mr-2" />
            Open Video
          </Button>
          <Button
            onClick={() => {
              setUploadedVideo(null);
              setUploadedFile(null);
              setVideoTitle("");
              setVideoDescription("");
              setVideoDuration("");
            }}
            className="w-full"
            size="lg"
          >
            Upload Another
          </Button>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6 space-y-6">
      <div className="space-y-2">
        <h2 className="text-2xl font-bold">Upload Course Video</h2>
        <p className="text-muted-foreground">
          Add a video to {moduleName} in {courseName}
        </p>
      </div>

      {/* Video File Upload */}
      <div className="space-y-4">
        <FileUpload
          folder="videos"
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
          label="Upload Video File"
          description="Supported formats: MP4, WebM (Max 500MB)"
          maxFiles={1}
        />

        {uploadedFile && (
          <div className="p-4 bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800 rounded-lg">
            <div className="flex items-center gap-2 text-sm text-green-700 dark:text-green-300">
              <CheckCircle className="w-4 h-4" />
              <span>Video file ready: {uploadedFile.fileName}</span>
            </div>
          </div>
        )}
      </div>

      {/* Video Metadata Form */}
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="video-title">Video Title</Label>
          <Input
            id="video-title"
            placeholder="e.g., Introduction to React Hooks"
            value={videoTitle}
            onChange={(e) => setVideoTitle(e.target.value)}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="video-description">Description (Optional)</Label>
          <Textarea
            id="video-description"
            placeholder="Enter a brief description of the video content..."
            value={videoDescription}
            onChange={(e) => setVideoDescription(e.target.value)}
            rows={4}
          />
          <p className="text-xs text-muted-foreground">
            {videoDescription.length}/500 characters
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="video-duration">Video Duration</Label>
          <Input
            id="video-duration"
            placeholder="HH:MM:SS (e.g., 01:45:30)"
            value={videoDuration}
            onChange={(e) => setVideoDuration(e.target.value)}
            pattern="\d{2}:\d{2}:\d{2}"
            required
          />
          <p className="text-xs text-muted-foreground">
            Format: Hours:Minutes:Seconds
          </p>
        </div>
      </div>

      {/* Video Preview */}
      {uploadedFile && (
        <div className="rounded-lg overflow-hidden bg-black aspect-video border border-border">
          <video
            src={uploadedFile.url}
            className="w-full h-full"
            controls
          />
        </div>
      )}

      {/* Specs Box */}
      <div className="p-4 bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg">
        <div className="flex items-start gap-3">
          <FileText className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
          <div className="text-sm text-blue-700 dark:text-blue-200">
            <p className="font-semibold mb-2">Video Requirements</p>
            <ul className="space-y-1">
              <li>✓ Format: MP4 or WebM</li>
              <li>✓ Maximum size: 500MB</li>
              <li>✓ Recommended resolution: 1280x720 (720p) or higher</li>
              <li>✓ Audio: Clear and audible</li>
              <li>✓ Duration: Up to 2 hours</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Info Box */}
      <div className="p-4 bg-amber-50 dark:bg-amber-950 border border-amber-200 dark:border-amber-800 rounded-lg">
        <div className="flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
          <div className="text-sm text-amber-700 dark:text-amber-200">
            <p className="font-semibold mb-1">Publishing Information</p>
            <ul className="space-y-1">
              <li>✓ Video will be immediately available to students</li>
              <li>✓ You can edit video details after publishing</li>
              <li>✓ Student views and engagement will be tracked</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Publish Button */}
      <Button
        onClick={handlePublishVideo}
        disabled={isSubmitting || !uploadedFile || !videoTitle.trim() || !videoDuration.trim()}
        size="lg"
        className="w-full"
      >
        {isSubmitting ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            Publishing Video...
          </>
        ) : (
          <>
            <Play className="w-4 h-4 mr-2 fill-current" />
            Publish Video
          </>
        )}
      </Button>
    </Card>
  );
};

export default VideoUpload;
