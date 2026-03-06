import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm';

// 請替換為您的 Supabase URL 與 Anon Key
const SUPABASE_URL = 'https://xvdgcnzvkkwplmgczulv.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh2ZGdjbnp2a2t3cGxtZ2N6dWx2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI4MTQxNjcsImV4cCI6MjA4ODM5MDE2N30.b8g9HrI0lBRITqIQHpa3cbYM6C43kHuR1DS_ICMixE0';
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

export const api = {
    // [前台] 僅抓取「上架中」的遊戲
    async getActiveGames() {
        const { data, error } = await supabase
            .from('games')
            .select('*')
            .eq('is_active', true)
            .order('sort_order', { ascending: true });
        if (error) console.error(error);
        return data || [];
    },

    // [後台] 抓取「所有」遊戲 (包含下架)
    async getAllGamesAdmin() {
        const { data, error } = await supabase
            .from('games')
            .select('*')
            .order('sort_order', { ascending: true });
        if (error) console.error(error);
        return data || [];
    },

    // [後台] 更新遊戲狀態
    async updateGameStatus(id, isActive) {
        const { error } = await supabase
            .from('games')
            .update({ is_active: isActive })
            .eq('id', id);
        if (error) alert('更新失敗: ' + error.message);
    }
};
