-- Create registrations table (for pending registrations before confirmation)
CREATE TABLE IF NOT EXISTS public.registrations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    phone TEXT NOT NULL,
    mode TEXT NOT NULL CHECK (mode IN ('online', 'offline')),
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'rejected', 'cancelled')),
    source TEXT DEFAULT 'website',
    google_sheet_synced BOOLEAN DEFAULT FALSE,
    google_sheet_row_id INTEGER,
    confirmed_at TIMESTAMPTZ,
    confirmed_by UUID REFERENCES public.profiles(id),
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.registrations ENABLE ROW LEVEL SECURITY;

-- Public can insert registrations (for registration form)
CREATE POLICY "Anyone can create registrations" ON public.registrations
    FOR INSERT WITH CHECK (true);

-- Admins can manage registrations
CREATE POLICY "Admins can manage registrations" ON public.registrations
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

CREATE TRIGGER update_registrations_updated_at
    BEFORE UPDATE ON public.registrations
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE INDEX IF NOT EXISTS idx_registrations_email ON public.registrations(email);
CREATE INDEX IF NOT EXISTS idx_registrations_status ON public.registrations(status);
CREATE INDEX IF NOT EXISTS idx_registrations_google_sheet_synced ON public.registrations(google_sheet_synced);
