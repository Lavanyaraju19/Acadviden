import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import RequireAdmin from './RequireAdmin';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card } from './ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from './ui/table';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from './ui/alert-dialog';
import { Plus, Trash2, Edit2, X, Loader } from 'lucide-react';

// Types
interface Course {
  id: string;
  title: string;
  description: string;
  pdf_url: string | null;
  video_url: string | null;
  created_at?: string;
  updated_at?: string;
}

interface FormData {
  title: string;
  description: string;
  pdf_file?: File | null;
  video_file?: File | null;
}

// Main Component
export default function AdminCourses() {
  return (
    <RequireAdmin>
      <AdminCoursesContent />
    </RequireAdmin>
  );
}

function AdminCoursesContent() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<Course | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [formData, setFormData] = useState<FormData>({
    title: '',
    description: '',
    pdf_file: null,
    video_file: null,
  });

  // Fetch courses on mount
  useEffect(() => {
    fetchCourses();
  }, []);

  // Clear messages after 3 seconds
  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => setSuccess(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [success]);

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      const { data, error: fetchError } = await supabase
        .from('courses')
        .select('*')
        .order('created_at', { ascending: false });

      if (fetchError) throw fetchError;
      setCourses(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch courses');
    } finally {
      setLoading(false);
    }
  };

  const uploadFile = async (file: File, bucket: string): Promise<string> => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}.${fileExt}`;
    const filePath = `courses/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from(bucket)
      .upload(filePath, file);

    if (uploadError) throw uploadError;

    const { data: urlData } = supabase.storage.from(bucket).getPublicUrl(filePath);

    return urlData.publicUrl;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!formData.title.trim()) {
      setError('Title is required');
      return;
    }

    if (!formData.description.trim()) {
      setError('Description is required');
      return;
    }

    try {
      setSubmitting(true);

      let pdf_url = editingCourse?.pdf_url || null;
      let video_url = editingCourse?.video_url || null;

      // Upload PDF if provided
      if (formData.pdf_file) {
        pdf_url = await uploadFile(formData.pdf_file, 'course-pdfs');
      }

      // Upload video if provided
      if (formData.video_file) {
        video_url = await uploadFile(formData.video_file, 'course-videos');
      }

      const courseData = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        pdf_url,
        video_url,
        updated_at: new Date().toISOString(),
      };

      if (editingCourse) {
        // Update existing course
        const { error: updateError } = await supabase
          .from('courses')
          .update(courseData)
          .eq('id', editingCourse.id);

        if (updateError) throw updateError;
        setSuccess('Course updated successfully');
      } else {
        // Create new course
        const { error: insertError } = await supabase
          .from('courses')
          .insert([
            {
              ...courseData,
              created_at: new Date().toISOString(),
            },
          ]);

        if (insertError) throw insertError;
        setSuccess('Course created successfully');
      }

      // Reset form and fetch updated courses
      resetForm();
      await fetchCourses();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save course');
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (course: Course) => {
    setEditingCourse(course);
    setFormData({
      title: course.title,
      description: course.description,
      pdf_file: null,
      video_file: null,
    });
    setShowForm(true);
  };

  const handleDelete = async () => {
    if (!deleteConfirm) return;

    try {
      setSubmitting(true);
      const { error: deleteError } = await supabase
        .from('courses')
        .delete()
        .eq('id', deleteConfirm.id);

      if (deleteError) throw deleteError;

      setSuccess('Course deleted successfully');
      setDeleteConfirm(null);
      await fetchCourses();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete course');
    } finally {
      setSubmitting(false);
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      pdf_file: null,
      video_file: null,
    });
    setEditingCourse(null);
    setShowForm(false);
  };

  const handleCancel = () => {
    resetForm();
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Manage Courses</h1>
            <p className="text-gray-600 mt-2">Create, edit, and delete courses</p>
          </div>
          {!showForm && (
            <Button
              onClick={() => setShowForm(true)}
              className="flex items-center gap-2"
            >
              <Plus size={20} />
              Add Course
            </Button>
          )}
        </div>

        {/* Messages */}
        {error && (
          <Card className="mb-4 border-red-200 bg-red-50 p-4">
            <p className="text-red-800">{error}</p>
          </Card>
        )}
        {success && (
          <Card className="mb-4 border-green-200 bg-green-50 p-4">
            <p className="text-green-800">{success}</p>
          </Card>
        )}

        {/* Form Section */}
        {showForm && (
          <Card className="mb-8 p-6 border border-gray-200">
            <h2 className="text-xl font-semibold mb-4">
              {editingCourse ? 'Edit Course' : 'Add New Course'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Course Title
                </label>
                <Input
                  type="text"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  placeholder="Enter course title"
                  disabled={submitting}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  placeholder="Enter course description"
                  disabled={submitting}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  PDF File {editingCourse && '(Leave empty to keep current)'}
                </label>
                <Input
                  type="file"
                  accept=".pdf"
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      pdf_file: e.target.files?.[0] || null,
                    })
                  }
                  disabled={submitting}
                />
                {editingCourse?.pdf_url && !formData.pdf_file && (
                  <p className="text-sm text-gray-600 mt-2">
                    Current: <a href={editingCourse.pdf_url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">View PDF</a>
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Video File {editingCourse && '(Leave empty to keep current)'}
                </label>
                <Input
                  type="file"
                  accept="video/*"
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      video_file: e.target.files?.[0] || null,
                    })
                  }
                  disabled={submitting}
                />
                {editingCourse?.video_url && !formData.video_file && (
                  <p className="text-sm text-gray-600 mt-2">
                    Current: <a href={editingCourse.video_url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">View Video</a>
                  </p>
                )}
              </div>

              <div className="flex gap-3">
                <Button
                  type="submit"
                  disabled={submitting}
                  className="flex items-center gap-2"
                >
                  {submitting && <Loader size={16} className="animate-spin" />}
                  {editingCourse ? 'Update Course' : 'Create Course'}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleCancel}
                  disabled={submitting}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </Card>
        )}

        {/* Courses Table */}
        {loading ? (
          <Card className="p-8 flex justify-center items-center">
            <div className="flex flex-col items-center gap-3">
              <Loader size={32} className="animate-spin text-gray-400" />
              <p className="text-gray-600">Loading courses...</p>
            </div>
          </Card>
        ) : courses.length === 0 ? (
          <Card className="p-8 text-center">
            <p className="text-gray-600">No courses yet. Create your first course!</p>
          </Card>
        ) : (
          <Card className="border border-gray-200 overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50 border-b">
                  <TableHead className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                    Title
                  </TableHead>
                  <TableHead className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                    Description
                  </TableHead>
                  <TableHead className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                    Files
                  </TableHead>
                  <TableHead className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {courses.map((course) => (
                  <TableRow key={course.id} className="border-b hover:bg-gray-50">
                    <TableCell className="px-6 py-4 text-sm font-medium text-gray-900">
                      {course.title}
                    </TableCell>
                    <TableCell className="px-6 py-4 text-sm text-gray-600">
                      <span className="line-clamp-2">{course.description}</span>
                    </TableCell>
                    <TableCell className="px-6 py-4 text-sm">
                      <div className="flex gap-2">
                        {course.pdf_url && (
                          <a
                            href={course.pdf_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-block px-2 py-1 text-xs font-medium text-blue-700 bg-blue-100 rounded"
                          >
                            PDF
                          </a>
                        )}
                        {course.video_url && (
                          <a
                            href={course.video_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-block px-2 py-1 text-xs font-medium text-purple-700 bg-purple-100 rounded"
                          >
                            Video
                          </a>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="px-6 py-4 text-sm">
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEdit(course)}
                          disabled={submitting || showForm}
                          className="flex items-center gap-1"
                        >
                          <Edit2 size={16} />
                          Edit
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => setDeleteConfirm(course)}
                          disabled={submitting || showForm}
                          className="flex items-center gap-1"
                        >
                          <Trash2 size={16} />
                          Delete
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        )}
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deleteConfirm} onOpenChange={(open) => !open && setDeleteConfirm(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Course</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{deleteConfirm?.title}"? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="flex justify-end gap-3">
            <AlertDialogCancel disabled={submitting}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={submitting}
              className="bg-red-600 hover:bg-red-700"
            >
              {submitting && <Loader size={16} className="animate-spin mr-2" />}
              Delete
            </AlertDialogAction>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
