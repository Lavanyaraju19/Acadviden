import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

// Make sure variable names match your .env
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Supabase URL or ANON KEY not set!');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function testConnection() {
  try {
    const { data, error } = await supabase
      .from('students') // Replace with any table you have
      .select('*')
      .limit(1);

    if (error) throw error;
    console.log('Supabase connected! Sample data:', data);
  } catch (err) {
    console.error('Error connecting to Supabase:', err.message);
  }
}

testConnection();
