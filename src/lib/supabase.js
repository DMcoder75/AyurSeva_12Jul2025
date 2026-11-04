import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://nwamtljqzutqhsejizqv.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im53YW10bGpxenV0cWhzZWppenF2Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MDA4NTc1OCwiZXhwIjoyMDY1NjYxNzU4fQ.bvkT69ej1aeSmcLcK22R_vYUpTfsTq16wOVo1k1HUbo';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
export default supabase;