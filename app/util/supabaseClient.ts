import { createClient, SupabaseClient } from "@supabase/supabase-js";

const SUPABASE_KEY: string | undefined = process.env.NEXT_PUBLIC_SUPABASE_KEY;
const SUPABASE_URL: string | undefined = process.env.NEXT_PUBLIC_SUPABASE_URL;

if (!SUPABASE_KEY || !SUPABASE_URL) {
  throw new Error("Supabase key or URL not provided");
}

const supabase: SupabaseClient = createClient(SUPABASE_URL, SUPABASE_KEY);

export default supabase;
