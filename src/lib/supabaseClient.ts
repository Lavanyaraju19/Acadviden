import { createClient } from '@supabase/supabase-js'

// Read environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Supabase is not configured. Please check your .env file')
}

// Create a Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey)
