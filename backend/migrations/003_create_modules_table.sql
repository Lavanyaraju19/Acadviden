-- Create modules table
CREATE TABLE IF NOT EXISTS public.modules (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    course_id UUID NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    order_index INTEGER DEFAULT 0,
    duration_minutes INTEGER,
    is_published BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.modules ENABLE ROW LEVEL SECURITY;

-- Policies for modules
CREATE POLICY "Anyone can view published modules" ON public.modules
    FOR SELECT USING (
        is_published = true AND
        EXISTS (
            SELECT 1 FROM public.courses 
            WHERE id = course_id AND is_published = true
        )
    );

CREATE POLICY "Enrolled students can view modules" ON public.modules
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.enrollments e
            JOIN public.profiles p ON p.id = auth.uid()
            WHERE e.student_id = auth.uid() 
            AND e.course_id = modules.course_id
            AND e.status = 'active'
            AND p.is_confirmed = true
        )
    );

CREATE POLICY "Admins can manage modules" ON public.modules
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

CREATE TRIGGER update_modules_updated_at
    BEFORE UPDATE ON public.modules
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE INDEX IF NOT EXISTS idx_modules_course_id ON public.modules(course_id);
CREATE INDEX IF NOT EXISTS idx_modules_order ON public.modules(course_id, order_index);
