// 初始化 Supabase 客戶端
const supabaseUrl = 'https://xvdgcnzvkkwplmgczulv.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh2ZGdjbnp2a2t3cGxtZ2N6dWx2Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MjgxNDE2NywiZXhwIjoyMDg4MzkwMTY3fQ.jzty1GXdqDM6pQcUSe6ZmFIJ-blSGbRC0xOzY8fdUeM';
const _supabase = supabase.createClient(supabaseUrl, supabaseKey);

// 封裝常用功能
export const api = {
    // 獲取所有上架遊戲
    async getGames() {
        const { data, error } = await _supabase
            .from('games')
            .select('*')
            .eq('is_active', true)
            .order('sort_order', { ascending: true });
        if (error) throw error;
        return data;
    },
    // 管理員修改狀態 (admin.html 使用)
    async toggleGameStatus(id, status) {
        const { error } = await _supabase
            .from('games')
            .update({ is_active: status })
            .eq('id', id);
        if (error) throw error;
    }
};
