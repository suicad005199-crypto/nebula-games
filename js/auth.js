import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm';

// 自動同步 api.js 中的憑證
const SUPABASE_URL = 'https://xvdgcnzvkkwplmgczulv.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh2ZGdjbnp2a2t3cGxtZ2N6dWx2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI4MTQxNjcsImV4cCI6MjA4ODM5MDE2N30.b8g9HrI0lBRITqIQHpa3cbYM6C43kHuR1DS_ICMixE0';
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

export const auth = {
    /**
     * Google 登入 (符合 Gmail 綁定需求)
     */
    async loginWithGoogle() {
        const { error } = await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
                redirectTo: window.location.origin // 登入後回到當前網域
            }
        });
        if (error) {
            console.error('Google 登入失敗:', error.message);
            throw error;
        }
    },

    /**
     * 傳統 Email 登入
     */
    async login(email, password) {
        const { data, error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        return data.user;
    },

    /**
     * 登出並清除會話
     */
    async logout() {
        const { error } = await supabase.auth.signOut();
        if (error) throw error;
        // 登出後導回首頁或重整
        window.location.reload();
    },

    /**
     * 獲取當前用戶資訊與 metadata (包含餘額)
     */
    async checkUser() {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return null;
        
        // 模擬從 user_metadata 獲取資訊
        // 建議未來在 Supabase 建立 profiles 表，透過 userId 關聯餘額
        return {
            id: user.id,
            email: user.email,
            name: user.user_metadata?.full_name || user.email.split('@')[0],
            balance: user.user_metadata?.balance || 0 // 預留餘額欄位
        };
    },

    /**
     * 監聽登入狀態變化 (讓 UI 自動切換)
     */
    onAuthStateChange(callback) {
        supabase.auth.onAuthStateChange((event, session) => {
            callback(event, session?.user || null);
        });
    }
};

/**
 * 綁定 UI 事件
 */
document.addEventListener('DOMContentLoaded', () => {
    // 綁定所有 class 為 .login-btn 的按鈕 (對應 index.html 優化版)
    const loginBtns = document.querySelectorAll('.login-btn');
    
    loginBtns.forEach(btn => {
        btn.addEventListener('click', async () => {
            // 如果當前是登出狀態，點擊執行 Google 登入
            if (btn.innerText === '登入') {
                try {
                    // 這裡預設直接走 Google 登入，也可改為彈出 Modal 選擇方式
                    await auth.loginWithGoogle();
                } catch (err) {
                    alert('登入失敗，請稍後再試');
                }
            } else {
                // 如果是登入狀態 (顯示退出)，則執行登出
                if (confirm('確定要登出星雲娛樂城嗎？')) {
                    await auth.logout();
                }
            }
        });
    });
});
