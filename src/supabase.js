import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = https://rhjxttrfrunbytmhrjzp.supabase.co "YOUR_SUPABASE_URL";
const SUPABASE_ANON_KEY = sb_publishable_U8f8NnWUfdWtGegkWBBMlg_8P-CP4uY "YOUR_SUPABASE_ANON_KEY";

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);