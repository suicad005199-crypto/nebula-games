// 需確保在 HTML 已載入 Supabase CDN
const SUPABASE_URL = '請填寫您的_SUPABASE_URL';
const SUPABASE_ANON_KEY = '請填寫您的_ANON_KEY';

export const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
