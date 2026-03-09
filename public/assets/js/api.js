// 需確保在 HTML 已載入 Supabase CDN
const SUPABASE_URL = 'https://xvdgcnzvkkwplmgczulv.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh2ZGdjbnp2a2t3cGxtZ2N6dWx2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI4MTQxNjcsImV4cCI6MjA4ODM5MDE2N30.b8g9HrI0lBRITqIQHpa3cbYM6C43kHuR1DS_ICMixE0';
export const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
