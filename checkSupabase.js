import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

// Initialize Supabase client
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);

// List your actual tables here
const tables = ['students', 'courses']; // <-- add your table names

async function main() {
  try {
    console.log('Checking Supabase connection...\n');

    for (const table of tables) {
      const { data, error } = await supabase.from(table).select('*').limit(5);

      if (error) {
        console.log(`❌ Error fetching from table "${table}":`, error.message);
        continue;
      }

      console.log(`✅ Table: ${table}`);
      if (data.length === 0) console.log('   ⚠️ No rows found');
      else console.log('   Sample data:', data);
      console.log('-----------------------------------\n');
    }

    console.log('✅ Done checking Supabase!');
  } catch (err) {
    console.error('Error connecting to Supabase:', err.message);
  }
}

main();
