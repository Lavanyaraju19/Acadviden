-- Create progress tracking table
CREATE TABLE IF NOT EXISTS public.progress (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    module_id UUID NOT NULL REFERENCES public.modules(id) ON DELETE CASCADE,
    video_id UUID REFERENCES public.videos(id) ON DELETE SET NULL,
    pdf_id UUID REFERENCES public.pdfs(id) ON DELETE SET NULL,
    is_completed BOOLEAN DEFAULT FALSE,
    completed_at TIMESTAMPTZ,
    watch_time_seconds INTEGER DEFAULT 0,
    last_position_seconds INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(student_id, module_id, video_id),
    UNIQUE(student_id, module_id, pdf_id)
);

-- Create certificates table
CREATE TABLE IF NOT EXISTS public.certificates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    course_id UUID NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
    enrollment_id UUID NOT NULL REFERENCES public.enrollments(id) ON DELETE CASCADE,
    certificate_number TEXT UNIQUE NOT NULL,
    certificate_url TEXT,
    issued_at TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(student_id, course_id)
);

-- Enable RLS
ALTER TABLE public.progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.certificates ENABLE ROW LEVEL SECURITY;

-- Policies for progress
CREATE POLICY "Students can manage their own progress" ON public.progress
    FOR ALL USING (student_id = auth.uid());

CREATE POLICY "Admins can view all progress" ON public.progress
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- Policies for certificates
CREATE POLICY "Students can view their own certificates" ON public.certificates
    FOR SELECT USING (student_id = auth.uid());

CREATE POLICY "Admins can manage certificates" ON public.certificates
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- Function to generate certificate number
CREATE OR REPLACE FUNCTION generate_certificate_number()
RETURNS TEXT AS $$
DECLARE
    new_number TEXT;
    number_exists BOOLEAN;
BEGIN
    LOOP
        new_number := 'CERT-' || TO_CHAR(NOW(), 'YYYYMMDD') || '-' || LPAD(FLOOR(RANDOM() * 10000)::TEXT, 4, '0');
        SELECT EXISTS(SELECT 1 FROM public.certificates WHERE certificate_number = new_number) INTO number_exists;
        EXIT WHEN NOT number_exists;
    END LOOP;
    RETURN new_number;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_progress_updated_at
    BEFORE UPDATE ON public.progress
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE INDEX IF NOT EXISTS idx_progress_student_id ON public.progress(student_id);
CREATE INDEX IF NOT EXISTS idx_progress_module_id ON public.progress(module_id);
CREATE INDEX IF NOT EXISTS idx_certificates_student_id ON public.certificates(student_id);
