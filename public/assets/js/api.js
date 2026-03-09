// 從 Cloudflare/Vite 環境變數中讀取連線資訊
// 變數名稱必須在 Cloudflare 後台設定為 VITE_ 開頭
const API_URL = import.meta.env.VITE_SUPABASE_URL;
const API_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

/**
 * 核心 API 請求函數
 * @param {string} path - 資料表名稱或路徑
 * @param {object} options - Fetch 選項
 */
export const apiFetch = async (path, options = {}) => {
    // 檢查變數是否正確讀取，若無則拋出錯誤
    if (!API_URL || !API_KEY) {
        console.error("Supabase 環境變數缺失，請檢查 Cloudflare 設定。");
        return null;
    }

    const defaultHeaders = {
        'apikey': API_KEY,
        'Authorization': `Bearer ${localStorage.getItem('sb-token') || API_KEY}`,
        'Content-Type': 'application/json',
        'Prefer': 'return=representation'
    };

    try {
        const response = await fetch(`${API_URL}/rest/v1/${path}`, {
            ...options,
            headers: { ...defaultHeaders, ...options.headers }
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'API 請求失敗');
        }

        return await response.json();
    } catch (err) {
        console.error(`API Error (${path}):`, err.message);
        throw err;
    }
};

/**
 * 取得當前登入用戶的 Profile 資料
 */
export const fetchProfile = async (userId) => {
    return apiFetch(`profiles?id=eq.${userId}&select=*`, { method: 'GET' });
};
