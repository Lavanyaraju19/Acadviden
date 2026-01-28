import { useState, useEffect } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, ExternalLink, Loader2, Plus, Pencil, Trash2, Wrench } from "lucide-react";
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
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";

interface Tool {
  id: string;
  name: string;
  description: string | null;
  tool_url: string | null;
  icon_url: string | null;
  category: string | null;
  is_featured: boolean;
  is_published: boolean;
  created_at: string;
}

const Tools = () => {
  const [tools, setTools] = useState<Tool[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingTool, setEditingTool] = useState<Tool | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const { isAdmin } = useAuth();
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    tool_url: "",
    icon_url: "",
    category: "",
    is_featured: false,
    is_published: true,
  });

  useEffect(() => {
    fetchTools();
  }, []);

  const fetchTools = async () => {
    if (!isSupabaseConfigured) {
      setIsLoading(false);
      setError("Database not configured. Please set up Supabase credentials.");
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabase
        .from("tools")
        .select("*")
        .eq("is_published", true)
        .order("is_featured", { ascending: false })
        .order("name", { ascending: true });

      if (fetchError) {
        throw fetchError;
      }

      setTools(data || []);
    } catch (err: any) {
      console.error("Error fetching tools:", err);
      if (err.code === "42703" || err.message?.includes("does not exist")) {
        setError("Database tables not set up. Please run the migration in Supabase SQL Editor.");
      } else {
        setError(err.message || "Failed to load tools");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const categories = [...new Set(tools.map(tool => tool.category).filter(Boolean))].sort() as string[];

  const filteredTools = tools.filter(tool => {
    const matchesSearch = tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          (tool.category?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false) ||
                          (tool.description?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false);
    const matchesCategory = !selectedCategory || tool.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      tool_url: "",
      icon_url: "",
      category: "",
      is_featured: false,
      is_published: true,
    });
    setEditingTool(null);
  };

  const openAddDialog = () => {
    resetForm();
    setIsDialogOpen(true);
  };

  const openEditDialog = (tool: Tool) => {
    setEditingTool(tool);
    setFormData({
      name: tool.name,
      description: tool.description || "",
      tool_url: tool.tool_url || "",
      icon_url: tool.icon_url || "",
      category: tool.category || "",
      is_featured: tool.is_featured,
      is_published: tool.is_published,
    });
    setIsDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const toolData = {
        name: formData.name,
        description: formData.description || null,
        tool_url: formData.tool_url || null,
        icon_url: formData.icon_url || null,
        category: formData.category || null,
        is_featured: formData.is_featured,
        is_published: formData.is_published,
      };

      if (editingTool) {
        const { error } = await (supabase as any)
          .from("tools")
          .update(toolData)
          .eq("id", editingTool.id);

        if (error) throw error;
        toast({ title: "Tool updated successfully" });
      } else {
        const { error } = await (supabase as any)
          .from("tools")
          .insert(toolData);

        if (error) throw error;
        toast({ title: "Tool created successfully" });
      }

      setIsDialogOpen(false);
      resetForm();
      fetchTools();
    } catch (err: any) {
      console.error("Error saving tool:", err);
      toast({
        title: "Error",
        description: err.message || "Failed to save tool",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase
        .from("tools")
        .delete()
        .eq("id", id);

      if (error) throw error;

      toast({ title: "Tool deleted successfully" });
      setDeleteConfirmId(null);
      fetchTools();
    } catch (err: any) {
      console.error("Error deleting tool:", err);
      toast({
        title: "Error",
        description: err.message || "Failed to delete tool",
        variant: "destructive",
      });
    }
  };

  const handleToolClick = (tool: Tool) => {
    if (tool.tool_url) {
      window.open(tool.tool_url, "_blank", "noopener,noreferrer");
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
                <span className="text-foreground">Marketing </span>
                <span className="text-gradient">Tools Library</span>
              </h1>
              <p className="text-muted-foreground text-lg mb-8">
                Explore essential digital marketing tools. Learn how to use each one effectively in our courses.
              </p>

              {/* Search */}
              <div className="relative max-w-md mx-auto">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Search tools..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-12 h-12 bg-background border-border"
                />
              </div>

              {isAdmin && (
                <Button onClick={openAddDialog} className="mt-6">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Tool
                </Button>
              )}
            </div>
          </div>
        </section>

        {/* Category Filters */}
        {!isLoading && !error && categories.length > 0 && (
          <section className="py-6 border-b border-border">
            <div className="container mx-auto px-4">
              <div className="flex flex-wrap gap-2 justify-center">
                <button
                  onClick={() => setSelectedCategory(null)}
                  className={`px-4 py-2 rounded-full text-sm transition-all ${
                    !selectedCategory
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground hover:bg-muted/80"
                  }`}
                >
                  All Tools
                </button>
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`px-4 py-2 rounded-full text-sm transition-all ${
                      selectedCategory === category
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-muted-foreground hover:bg-muted/80"
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Tools Grid */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            {isLoading ? (
              <div className="flex items-center justify-center py-20">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
                <span className="ml-3 text-muted-foreground">Loading tools...</span>
              </div>
            ) : error ? (
              <div className="text-center py-20">
                <p className="text-destructive mb-4">{error}</p>
                <Button onClick={fetchTools} variant="outline">
                  Try Again
                </Button>
              </div>
            ) : tools.length === 0 ? (
              <div className="text-center py-20">
                <Wrench className="w-16 h-16 mx-auto mb-4 text-muted-foreground/50" />
                <h3 className="text-xl font-semibold mb-2">No tools available yet</h3>
                <p className="text-muted-foreground">
                  Check back soon for our curated list of marketing tools.
                </p>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                  {filteredTools.map((tool) => (
                    <div
                      key={tool.id}
                      className="group glass rounded-xl p-6 flex flex-col items-center text-center transition-all duration-300 hover:scale-105 hover:glow-teal cursor-pointer relative"
                      onClick={() => handleToolClick(tool)}
                    >
                      {isAdmin && (
                        <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Button
                            size="icon"
                            variant="secondary"
                            className="h-6 w-6"
                            onClick={(e) => {
                              e.stopPropagation();
                              openEditDialog(tool);
                            }}
                          >
                            <Pencil className="w-3 h-3" />
                          </Button>
                          <Button
                            size="icon"
                            variant="destructive"
                            className="h-6 w-6"
                            onClick={(e) => {
                              e.stopPropagation();
                              setDeleteConfirmId(tool.id);
                            }}
                          >
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        </div>
                      )}
                      <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-3 transition-transform group-hover:scale-110">
                        {tool.icon_url ? (
                          <img src={tool.icon_url} alt={tool.name} className="w-6 h-6 object-contain" />
                        ) : (
                          <Wrench className="w-6 h-6 text-primary" />
                        )}
                      </div>
                      <h3 className="font-medium text-sm text-foreground mb-1">
                        {tool.name}
                      </h3>
                      <p className="text-xs text-muted-foreground">
                        {tool.category || "General"}
                      </p>
                      <ExternalLink className="w-4 h-4 text-primary opacity-0 group-hover:opacity-100 mt-2 transition-opacity" />
                    </div>
                  ))}
                </div>

                {filteredTools.length === 0 && (
                  <div className="text-center py-12">
                    <p className="text-muted-foreground">No tools found matching your search.</p>
                  </div>
                )}
              </>
            )}
          </div>
        </section>
      </main>
      <Footer />

      {/* Add/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{editingTool ? "Edit Tool" : "Add New Tool"}</DialogTitle>
            <DialogDescription>
              {editingTool ? "Update the tool details below." : "Fill in the details to add a new tool."}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={2}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="tool_url">Tool URL</Label>
                <Input
                  id="tool_url"
                  value={formData.tool_url}
                  onChange={(e) => setFormData({ ...formData, tool_url: e.target.value })}
                  placeholder="https://example.com"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Input
                  id="category"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  placeholder="e.g. Analytics, SEO"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="icon_url">Icon URL</Label>
              <Input
                id="icon_url"
                value={formData.icon_url}
                onChange={(e) => setFormData({ ...formData, icon_url: e.target.value })}
                placeholder="https://example.com/icon.png"
              />
            </div>
            <div className="flex items-center gap-6">
              <div className="flex items-center space-x-2">
                <Switch
                  id="is_featured"
                  checked={formData.is_featured}
                  onCheckedChange={(checked) => setFormData({ ...formData, is_featured: checked })}
                />
                <Label htmlFor="is_featured">Featured</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="is_published"
                  checked={formData.is_published}
                  onCheckedChange={(checked) => setFormData({ ...formData, is_published: checked })}
                />
                <Label htmlFor="is_published">Published</Label>
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
                  editingTool ? "Update Tool" : "Create Tool"
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
            <DialogTitle>Delete Tool</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this tool? This action cannot be undone.
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

export default Tools;
