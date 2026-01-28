import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Clock, Users, Star, ArrowRight, Play, Loader2, Plus, Pencil, Trash2, BookOpen } from "lucide-react";
import { supabase, isSupabaseConfigured } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Course {
  id: string;
  title: string;
  description: string | null;
  slug: string;
  thumbnail_url: string | null;
  duration_weeks: number;
  is_published: boolean;
  is_featured: boolean;
  price: number;
  discount_price: number | null;
  mode: 'online' | 'offline' | 'hybrid';
  max_students: number | null;
  start_date: string | null;
  end_date: string | null;
  created_at: string;
}

const getLevelColor = (mode: string) => {
  switch (mode) {
    case "online":
      return "bg-green-500/20 text-green-400";
    case "offline":
      return "bg-yellow-500/20 text-yellow-400";
    case "hybrid":
      return "bg-blue-500/20 text-blue-400";
    default:
      return "bg-primary/20 text-primary";
  }
};

const Courses = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  
  const { isAdmin } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    slug: "",
    thumbnail_url: "",
    duration_weeks: 12,
    price: 0,
    discount_price: "",
    mode: "online" as 'online' | 'offline' | 'hybrid',
    max_students: "",
    is_published: true,
    is_featured: false,
  });

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    if (!isSupabaseConfigured) {
      setIsLoading(false);
      setError("Database not configured. Please set up Supabase credentials.");
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      
      const { data, error: fetchError } = await supabase
        .from("courses")
        .select("*")
        .eq("is_published", true)
        .order("created_at", { ascending: false });

      if (fetchError) {
        throw fetchError;
      }

      setCourses(data || []);
    } catch (err: any) {
      console.error("Error fetching courses:", err);
      if (err.code === "42703" || err.message?.includes("does not exist")) {
        setError("Database tables not set up. Please run the migration in Supabase SQL Editor.");
      } else {
        setError(err.message || "Failed to load courses");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      slug: "",
      thumbnail_url: "",
      duration_weeks: 12,
      price: 0,
      discount_price: "",
      mode: "online",
      max_students: "",
      is_published: true,
      is_featured: false,
    });
    setEditingCourse(null);
  };

  const openAddDialog = () => {
    resetForm();
    setIsDialogOpen(true);
  };

  const openEditDialog = (course: Course) => {
    setEditingCourse(course);
    setFormData({
      title: course.title,
      description: course.description || "",
      slug: course.slug,
      thumbnail_url: course.thumbnail_url || "",
      duration_weeks: course.duration_weeks,
      price: course.price,
      discount_price: course.discount_price?.toString() || "",
      mode: course.mode,
      max_students: course.max_students?.toString() || "",
      is_published: course.is_published,
      is_featured: course.is_featured,
    });
    setIsDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const courseData = {
        title: formData.title,
        description: formData.description || null,
        slug: formData.slug || formData.title.toLowerCase().replace(/\s+/g, "-"),
        thumbnail_url: formData.thumbnail_url || null,
        duration_weeks: formData.duration_weeks,
        price: formData.price,
        discount_price: formData.discount_price ? parseFloat(formData.discount_price) : null,
        mode: formData.mode,
        max_students: formData.max_students ? parseInt(formData.max_students) : null,
        is_published: formData.is_published,
        is_featured: formData.is_featured,
      };

      if (editingCourse) {
        const { error } = await (supabase as any)
          .from("courses")
          .update(courseData)
          .eq("id", editingCourse.id);

        if (error) throw error;
        toast({ title: "Course updated successfully" });
      } else {
        const { error } = await (supabase as any)
          .from("courses")
          .insert(courseData);

        if (error) throw error;
        toast({ title: "Course created successfully" });
      }

      setIsDialogOpen(false);
      resetForm();
      fetchCourses();
    } catch (err: any) {
      console.error("Error saving course:", err);
      toast({
        title: "Error",
        description: err.message || "Failed to save course",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase
        .from("courses")
        .delete()
        .eq("id", id);

      if (error) throw error;
      
      toast({ title: "Course deleted successfully" });
      setDeleteConfirmId(null);
      fetchCourses();
    } catch (err: any) {
      console.error("Error deleting course:", err);
      toast({
        title: "Error",
        description: err.message || "Failed to delete course",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-24">
        {/* Header */}
        <section className="py-16 bg-card/50">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="font-display text-4xl md:text-5xl font-bold mb-6">
                <span className="text-foreground">Explore Our </span>
                <span className="text-gradient">Courses</span>
              </h1>
              <p className="text-muted-foreground text-lg">
                From fundamentals to advanced strategies, find the perfect course to accelerate your digital marketing career.
              </p>
              {isAdmin && (
                <Button onClick={openAddDialog} className="mt-6">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Course
                </Button>
              )}
            </div>
          </div>
        </section>

        {/* Course Grid */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            {isLoading ? (
              <div className="flex items-center justify-center py-20">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
                <span className="ml-3 text-muted-foreground">Loading courses...</span>
              </div>
            ) : error ? (
              <div className="text-center py-20">
                <p className="text-destructive mb-4">{error}</p>
                <Button onClick={fetchCourses} variant="outline">
                  Try Again
                </Button>
              </div>
            ) : courses.length === 0 ? (
              <div className="text-center py-20">
                <BookOpen className="w-16 h-16 mx-auto mb-4 text-muted-foreground/50" />
                <h3 className="text-xl font-semibold mb-2">No courses available yet</h3>
                <p className="text-muted-foreground">
                  Check back soon for new courses or contact us for more information.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {courses.map((course) => (
                  <div
                    key={course.id}
                    className="group glass rounded-xl overflow-hidden transition-all duration-300 hover:glow-teal cursor-pointer"
                    onClick={() => navigate(`/courses/${course.slug}`)}
                  >
                    {/* Image */}
                    <div className="relative h-48 overflow-hidden">
                      <img
                        src={course.thumbnail_url || "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=250&fit=crop"}
                        alt={course.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-card to-transparent" />
                      <div className="absolute top-4 left-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${getLevelColor(course.mode)}`}>
                          {course.mode}
                        </span>
                      </div>
                      {isAdmin && (
                        <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Button
                            size="icon"
                            variant="secondary"
                            className="h-8 w-8"
                            onClick={(e) => {
                              e.stopPropagation();
                              openEditDialog(course);
                            }}
                          >
                            <Pencil className="w-4 h-4" />
                          </Button>
                          <Button
                            size="icon"
                            variant="destructive"
                            className="h-8 w-8"
                            onClick={(e) => {
                              e.stopPropagation();
                              setDeleteConfirmId(course.id);
                            }}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      )}
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <div className="w-14 h-14 rounded-full bg-primary/90 flex items-center justify-center">
                          <Play className="w-6 h-6 text-primary-foreground ml-1" />
                        </div>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-6">
                      <h3 className="font-display text-lg font-semibold text-foreground mb-2 line-clamp-2">
                        {course.title}
                      </h3>
                      <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
                        {course.description || "Learn essential skills in this comprehensive course."}
                      </p>

                      {/* Meta */}
                      <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {course.duration_weeks} weeks
                        </div>
                        {course.max_students && (
                          <div className="flex items-center gap-1">
                            <Users className="w-4 h-4" />
                            {course.max_students}
                          </div>
                        )}
                        {course.is_featured && (
                          <div className="flex items-center gap-1 text-yellow-400">
                            <Star className="w-4 h-4 fill-current" />
                            Featured
                          </div>
                        )}
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="text-lg font-semibold">
                          {course.discount_price ? (
                            <>
                              <span className="text-primary">₹{course.discount_price}</span>
                              <span className="text-muted-foreground line-through ml-2 text-sm">₹{course.price}</span>
                            </>
                          ) : (
                            <span className="text-primary">₹{course.price}</span>
                          )}
                        </div>
                        <Button size="sm" className="bg-primary text-primary-foreground hover:bg-primary/90 group/btn">
                          View Course
                          <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover/btn:translate-x-1" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />

      {/* Add/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingCourse ? "Edit Course" : "Add New Course"}</DialogTitle>
            <DialogDescription>
              {editingCourse ? "Update the course details below." : "Fill in the details to create a new course."}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="slug">Slug</Label>
                <Input
                  id="slug"
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                  placeholder="auto-generated-from-title"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={3}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="thumbnail_url">Thumbnail URL</Label>
              <Input
                id="thumbnail_url"
                value={formData.thumbnail_url}
                onChange={(e) => setFormData({ ...formData, thumbnail_url: e.target.value })}
                placeholder="https://example.com/image.jpg"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="duration_weeks">Duration (weeks)</Label>
                <Input
                  id="duration_weeks"
                  type="number"
                  value={formData.duration_weeks}
                  onChange={(e) => setFormData({ ...formData, duration_weeks: parseInt(e.target.value) || 0 })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="price">Price (₹)</Label>
                <Input
                  id="price"
                  type="number"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="discount_price">Discount Price (₹)</Label>
                <Input
                  id="discount_price"
                  type="number"
                  value={formData.discount_price}
                  onChange={(e) => setFormData({ ...formData, discount_price: e.target.value })}
                  placeholder="Optional"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="mode">Mode</Label>
                <Select
                  value={formData.mode}
                  onValueChange={(value: 'online' | 'offline' | 'hybrid') => setFormData({ ...formData, mode: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="online">Online</SelectItem>
                    <SelectItem value="offline">Offline</SelectItem>
                    <SelectItem value="hybrid">Hybrid</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="max_students">Max Students</Label>
                <Input
                  id="max_students"
                  type="number"
                  value={formData.max_students}
                  onChange={(e) => setFormData({ ...formData, max_students: e.target.value })}
                  placeholder="Optional"
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Saving...
                  </>
                ) : (
                  editingCourse ? "Update Course" : "Create Course"
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={!!deleteConfirmId} onOpenChange={() => setDeleteConfirmId(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Course</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this course? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteConfirmId(null)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={() => deleteConfirmId && handleDelete(deleteConfirmId)}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Courses;
