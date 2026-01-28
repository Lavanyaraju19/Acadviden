-- Create videos table
CREATE TABLE IF NOT EXISTS public.videos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    module_id UUID NOT NULL REFERENCES public.modules(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    video_url TEXT NOT NULL,
    thumbnail_url TEXT,
    duration_seconds INTEGER,
    order_index INTEGER DEFAULT 0,
    is_published BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create PDFs table
CREATE TABLE IF NOT EXISTS public.pdfs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    module_id UUID NOT NULL REFERENCES public.modules(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    file_url TEXT NOT NULL,
    file_size_bytes BIGINT,
    order_index INTEGER DEFAULT 0,
    is_published BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create tools table
CREATE TABLE IF NOT EXISTS public.tools (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    module_id UUID REFERENCES public.modules(id) ON DELETE SET NULL,
    name TEXT NOT NULL,
    description TEXT,
    tool_url TEXT,
    icon_url TEXT,
    category TEXT,
    is_featured BOOLEAN DEFAULT FALSE,
    is_published BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS on all content tables
ALTER TABLE public.videos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pdfs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tools ENABLE ROW LEVEL SECURITY;

-- Policies for videos
CREATE POLICY "Enrolled students can view videos" ON public.videos
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.enrollments e
            JOIN public.modules m ON m.id = videos.module_id
            WHERE e.student_id = auth.uid() 
            AND e.course_id = m.course_id
            AND e.status = 'active'
        )
    );

CREATE POLICY "Admins can manage videos" ON public.videos
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- Policies for PDFs
CREATE POLICY "Enrolled students can view pdfs" ON public.pdfs
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.enrollments e
            JOIN public.modules m ON m.id = pdfs.module_id
            WHERE e.student_id = auth.uid() 
            AND e.course_id = m.course_id
            AND e.status = 'active'
        )
    );

CREATE POLICY "Admins can manage pdfs" ON public.pdfs
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- Policies for tools
CREATE POLICY "Anyone can view published tools" ON public.tools
    FOR SELECT USING (is_published = true);

CREATE POLICY "Admins can manage tools" ON public.tools
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- Triggers
CREATE TRIGGER update_videos_updated_at
    BEFORE UPDATE ON public.videos
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_pdfs_updated_at
    BEFORE UPDATE ON public.pdfs
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_tools_updated_at
    BEFORE UPDATE ON public.tools
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Indexes
CREATE INDEX IF NOT EXISTS idx_videos_module_id ON public.videos(module_id);
CREATE INDEX IF NOT EXISTS idx_pdfs_module_id ON public.pdfs(module_id);
CREATE INDEX IF NOT EXISTS idx_tools_module_id ON public.tools(module_id);
CREATE INDEX IF NOT EXISTS idx_tools_category ON public.tools(category);
