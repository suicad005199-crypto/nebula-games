import { api } from './api.js';

// 用來儲存從資料庫抓下來的所有資料
let allGames = [];

/**
 * 初始化大廳
 */
async function initLobby() {
    const grid = document.getElementById('game-grid');
    
    try {
        // 從 api.js 抓取所有 is_active = true 的遊戲
        allGames = await api.getActiveGames();
        
        console.log('[Lobby] 初始資料載入成功:', allGames);
        
        // 初始載入顯示「全部」
        renderGames(allGames);
        
    } catch (err) {
        console.error('[Lobby] 初始化失敗:', err);
        grid.innerHTML = '<p style="text-align: center; grid-column: span 2; color: #ff4436; padding: 50px 0;">連線失敗，請重整頁面</p>';
    }
}

/**
 * 負責渲染遊戲卡片的通用函數
 * @param {Array} listToRender 
 */
function renderGames(listToRender) {
    const grid = document.getElementById('game-grid');
    
    if (!listToRender || listToRender.length === 0) {
        grid.innerHTML = '<p style="text-align: center; grid-column: span 2; color: #666; padding: 50px 0;">該分類目前尚無遊戲</p>';
        return;
    }

    grid.innerHTML = listToRender.map(game => `
        <div class="game-card" onclick="handleGameJump('${game.game_url}')">
            <div class="game-img" style="background-image: url('./images/${game.image_path}')"></div>
            <div class="game-info">
                <span class="game-title">${game.name}</span>
                <span class="game-desc">${game.description || ''}</span>
            </div>
        </div>
    `).join('');
}

/**
 * 處理遊戲跳轉邏輯
 */
window.handleGameJump = (url) => {
    if (!url) return;
    window.location.href = url;
};

/**
 * 分類篩選函數 (掛載到 window 供 HTML onclick 使用)
 */
window.filterCategory = (cat) => {
    console.log('[Lobby] 切換分類至:', cat);
    
    // 1. 篩選資料
    if (cat === 'all') {
        renderGames(allGames);
    } else {
        const filtered = allGames.filter(game => game.category === cat);
        renderGames(filtered);
    }

    // 2. 自動關閉側邊欄 (呼叫 index.html 的 script 函數)
    if (typeof toggleMenu === 'function') {
        toggleMenu();
    }
};

// 確保 DOM 載入後執行
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initLobby);
} else {
    initLobby();
}
