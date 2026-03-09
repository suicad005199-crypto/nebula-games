// 修正：從 api.js 匯入核心請求函數
import { apiFetch } from './api.js';

/**
 * 取得所有啟用中的遊戲清單
 * @param {string} category - 分類過濾 (預設為 'all')
 */
export const getGames = async (category = 'all') => {
    try {
        // 1. 定義基本的查詢路徑 (只抓取啟用中的遊戲)
        let path = 'games?is_active=eq.true&select=*';

        // 2. 如果有指定分類，增加篩選條件
        if (category !== 'all') {
            path += `&category=eq.${category}`;
        }

        // 3. 透過 apiFetch 發送請求
        const data = await apiFetch(path, {
            method: 'GET'
        });

        // 確保回傳的是陣列
        return data || [];
    } catch (error) {
        console.error('取得遊戲資料時發生錯誤:', error.message);
        return [];
    }
};

/**
 * 取得單一遊戲詳細資訊 (供進入遊戲頁面使用)
 * @param {number} gameId 
 */
export const getGameById = async (gameId) => {
    try {
        const path = `games?id=eq.${gameId}&select=*`;
        const data = await apiFetch(path, { method: 'GET' });
        return data ? data[0] : null;
    } catch (error) {
        console.error('取得單一遊戲失敗:', error.message);
        return null;
    }
};
