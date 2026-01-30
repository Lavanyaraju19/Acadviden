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
import { Plus, Trash2, Edit2, ExternalLink, Loader } from 'lucide-react';

// Types
interface Tool {
  id: string;
  name: string;
  description: string;
  link: string | null;
  file_url: string | null;
  created_at?: string;
  updated_at?: string;
}

interface FormData {
  name: string;
  description: string;
  link: string;
  file?: File | null;
}

// Main Component
export default function AdminTools() {
  return (
    <RequireAdmin>
      <AdminToolsContent />
    </RequireAdmin>
  );
}

function AdminToolsContent() {
  const [tools, setTools] = useState<Tool[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingTool, setEditingTool] = useState<Tool | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<Tool | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [formData, setFormData] = useState<FormData>({
    name: '',
    description: '',
    link: '',
    file: null,
  });

  // Fetch tools on mount
  useEffect(() => {
    fetchTools();
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

  const fetchTools = async () => {
    try {
      setLoading(true);
      const { data, error: fetchError } = await supabase
        .from('tools')
        .select('*')
        .order('created_at', { ascending: false });

      if (fetchError) throw fetchError;
      setTools(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch tools');
    } finally {
      setLoading(false);
    }
  };

  const uploadFile = async (file: File): Promise<string> => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}.${fileExt}`;
    const filePath = `tools/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('tool-files')
      .upload(filePath, file);

    if (uploadError) throw uploadError;

    const { data: urlData } = supabase.storage.from('tool-files').getPublicUrl(filePath);

    return urlData.publicUrl;
  };

  const validateForm = (): boolean => {
    if (!formData.name.trim()) {
      setError('Tool name is required');
      return false;
    }

    if (!formData.description.trim()) {
      setError('Description is required');
      return false;
    }

    if (!formData.link.trim()) {
      setError('Link is required');
      return false;
    }

    // Basic URL validation
    try {
      new URL(formData.link);
    } catch {
      setError('Link must be a valid URL');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!validateForm()) return;

    try {
      setSubmitting(true);

      let file_url = editingTool?.file_url || null;

      // Upload file if provided
      if (formData.file) {
        file_url = await uploadFile(formData.file);
      }

      const toolData = {
        name: formData.name.trim(),
        description: formData.description.trim(),
        link: formData.link.trim(),
        file_url,
        updated_at: new Date().toISOString(),
      };

      if (editingTool) {
        // Update existing tool
        const { error: updateError } = await supabase
          .from('tools')
          .update(toolData)
          .eq('id', editingTool.id);

        if (updateError) throw updateError;
        setSuccess('Tool updated successfully');
      } else {
        // Create new tool
        const { error: insertError } = await supabase
          .from('tools')
          .insert([
            {
              ...toolData,
              created_at: new Date().toISOString(),
            },
          ]);

        if (insertError) throw insertError;
        setSuccess('Tool created successfully');
      }

      // Reset form and fetch updated tools
      resetForm();
      await fetchTools();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save tool');
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (tool: Tool) => {
    setEditingTool(tool);
    setFormData({
      name: tool.name,
      description: tool.description,
      link: tool.link || '',
      file: null,
    });
    setShowForm(true);
  };

  const handleDelete = async () => {
    if (!deleteConfirm) return;

    try {
      setSubmitting(true);
      const { error: deleteError } = await supabase
        .from('tools')
        .delete()
        .eq('id', deleteConfirm.id);

      if (deleteError) throw deleteError;

      setSuccess('Tool deleted successfully');
      setDeleteConfirm(null);
      await fetchTools();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete tool');
    } finally {
      setSubmitting(false);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      link: '',
      file: null,
    });
    setEditingTool(null);
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
            <h1 className="text-3xl font-bold text-gray-900">Manage Tools</h1>
            <p className="text-gray-600 mt-2">Create, edit, and delete tools</p>
          </div>
          {!showForm && (
            <Button
              onClick={() => setShowForm(true)}
              className="flex items-center gap-2"
            >
              <Plus size={20} />
              Add Tool
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
              {editingTool ? 'Edit Tool' : 'Add New Tool'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tool Name
                </label>
                <Input
                  type="text"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  placeholder="Enter tool name"
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
                  placeholder="Enter tool description"
                  disabled={submitting}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Link
                </label>
                <Input
                  type="url"
                  value={formData.link}
                  onChange={(e) =>
                    setFormData({ ...formData, link: e.target.value })
                  }
                  placeholder="https://example.com"
                  disabled={submitting}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  File {editingTool && '(Leave empty to keep current)'}
                </label>
                <Input
                  type="file"
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      file: e.target.files?.[0] || null,
                    })
                  }
                  disabled={submitting}
                />
                {editingTool?.file_url && !formData.file && (
                  <p className="text-sm text-gray-600 mt-2">
                    Current: <a href={editingTool.file_url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Download file</a>
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
                  {editingTool ? 'Update Tool' : 'Create Tool'}
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

        {/* Tools Table */}
        {loading ? (
          <Card className="p-8 flex justify-center items-center">
            <div className="flex flex-col items-center gap-3">
              <Loader size={32} className="animate-spin text-gray-400" />
              <p className="text-gray-600">Loading tools...</p>
            </div>
          </Card>
        ) : tools.length === 0 ? (
          <Card className="p-8 text-center">
            <p className="text-gray-600">No tools yet. Create your first tool!</p>
          </Card>
        ) : (
          <Card className="border border-gray-200 overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50 border-b">
                  <TableHead className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                    Name
                  </TableHead>
                  <TableHead className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                    Description
                  </TableHead>
                  <TableHead className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                    Link
                  </TableHead>
                  <TableHead className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                    File
                  </TableHead>
                  <TableHead className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {tools.map((tool) => (
                  <TableRow key={tool.id} className="border-b hover:bg-gray-50">
                    <TableCell className="px-6 py-4 text-sm font-medium text-gray-900">
                      {tool.name}
                    </TableCell>
                    <TableCell className="px-6 py-4 text-sm text-gray-600">
                      <span className="line-clamp-2">{tool.description}</span>
                    </TableCell>
                    <TableCell className="px-6 py-4 text-sm">
                      {tool.link && (
                        <a
                          href={tool.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-800"
                        >
                          <span className="truncate max-w-xs">{tool.link}</span>
                          <ExternalLink size={14} className="flex-shrink-0" />
                        </a>
                      )}
                    </TableCell>
                    <TableCell className="px-6 py-4 text-sm">
                      {tool.file_url && (
                        <a
                          href={tool.file_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-block px-2 py-1 text-xs font-medium text-blue-700 bg-blue-100 rounded hover:bg-blue-200"
                        >
                          Download
                        </a>
                      )}
                    </TableCell>
                    <TableCell className="px-6 py-4 text-sm">
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEdit(tool)}
                          disabled={submitting || showForm}
                          className="flex items-center gap-1"
                        >
                          <Edit2 size={16} />
                          Edit
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => setDeleteConfirm(tool)}
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
            <AlertDialogTitle>Delete Tool</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{deleteConfirm?.name}"? This action cannot be undone.
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
