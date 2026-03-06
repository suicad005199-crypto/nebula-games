import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm';

// 需與 api.js 保持相同的參數
const supabase = createClient('YOUR_URL', 'YOUR_KEY');

export const auth = {
    async login(email, password) {
        const { data, error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        return data.user;
    },
    async logout() {
        const { error } = await supabase.auth.signOut();
        if (error) throw error;
    },
    async checkUser() {
        const { data } = await supabase.auth.getUser();
        return data.user;
    }
};

// 綁定大廳的登入按鈕
document.getElementById('login-btn')?.addEventListener('click', () => {
    alert('會員登入系統建置中...');
});
