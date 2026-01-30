import { createClient } from '@supabase/supabase-js'

// Read environment variables from Vite
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// Debug: check if variables are loaded
console.log('Supabase URL:', supabaseUrl)
console.log('Supabase Key:', supabaseAnonKey)

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    'Supabase is not configured. Please check .env.local and Vercel environment variables'
  )
}

// Export the Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey)
