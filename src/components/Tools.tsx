import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Download, ExternalLink, Loader } from 'lucide-react';

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

export default function Tools() {
  const [tools, setTools] = useState<Tool[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch tools on mount
  useEffect(() => {
    fetchTools();
  }, []);

  const fetchTools = async () => {
    try {
      setLoading(true);
      setError(null);

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

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-center items-center min-h-96">
            <div className="flex flex-col items-center gap-3">
              <Loader size={40} className="animate-spin text-blue-600" />
              <p className="text-gray-600 text-lg">Loading tools...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-3">Tools & Resources</h1>
          <p className="text-lg text-gray-600">
            Access helpful tools and resources to support your learning journey.
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <Card className="mb-8 border-red-200 bg-red-50 p-4">
            <p className="text-red-800">{error}</p>
          </Card>
        )}

        {/* Tools Grid */}
        {tools.length === 0 ? (
          <Card className="p-12 text-center bg-white">
            <p className="text-gray-600 text-lg">No tools available at this time.</p>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {tools.map((tool) => (
              <Card
                key={tool.id}
                className="bg-white border border-gray-200 hover:border-gray-300 hover:shadow-lg transition-all duration-200 overflow-hidden"
              >
                <div className="p-6 space-y-4">
                  {/* Tool Name */}
                  <h2 className="text-xl font-semibold text-gray-900 line-clamp-2">
                    {tool.name}
                  </h2>

                  {/* Description */}
                  <p className="text-gray-600 text-sm line-clamp-3">
                    {tool.description}
                  </p>

                  {/* Actions */}
                  <div className="flex flex-col gap-3 pt-2">
                    {/* External Link */}
                    {tool.link && (
                      <a
                        href={tool.link}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Button
                          variant="outline"
                          className="w-full flex items-center justify-center gap-2 hover:bg-blue-50"
                        >
                          <ExternalLink size={16} />
                          Visit Tool
                        </Button>
                      </a>
                    )}

                    {/* Download File */}
                    {tool.file_url && (
                      <a
                        href={tool.file_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        download
                      >
                        <Button
                          className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white"
                        >
                          <Download size={16} />
                          Download File
                        </Button>
                      </a>
                    )}

                    {/* No actions available */}
                    {!tool.link && !tool.file_url && (
                      <p className="text-gray-500 text-sm text-center py-2">
                        No downloads available
                      </p>
                    )}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
