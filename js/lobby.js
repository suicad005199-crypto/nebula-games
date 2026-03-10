import { api } from './api.js';
import { auth } from './auth.js';

let allGames = [];
let filteredGames = [];
let currentPage = 1;
const PAGE_SIZE = 4;

/**
 * 初始化載入資料
 */
async function initLobby() {
    updateUserUI();

    try {
        allGames = await api.getActiveGames();
        filteredGames = [...allGames];
        renderCurrentPage();
    } catch (err) {
        console.error("載入失敗:", err);
        const grid = document.getElementById('game-grid');
        if (grid) grid.innerHTML = '<p style="color: #ff4436; text-align: center; grid-column: span 2; padding: 20px;">連線異常，請重整</p>';
    }
}

/**
 * 更新頂部會員 UI
 */
async function updateUserUI() {
    const balanceBox = document.querySelector('.balance-box');
    const loginBtn = document.querySelector('.login-btn');
    
    if (!loginBtn) return;

    try {
        const user = await auth.checkUser();
        if (user) {
            if (balanceBox) {
                balanceBox.innerText = `NT$ ${Number(user.balance || 0).toLocaleString()}`;
                balanceBox.style.display = 'block';
            }
            loginBtn.innerText = '退出';
            loginBtn.style.background = 'transparent';
            loginBtn.style.border = '1px solid var(--border)';
            loginBtn.style.color = '#aaa';
        } else {
            if (balanceBox) balanceBox.style.display = 'none';
            loginBtn.innerText = '登入';
        }
    } catch (err) {
        console.error('獲取狀態失敗', err);
    }
}

/**
 * 依據當前頁碼渲染卡片
 */
function renderCurrentPage() {
    const grid = document.getElementById('game-grid');
    const pagination = document.getElementById('pagination');
    const pageNum = document.getElementById('page-num');
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    
    if (!filteredGames.length) {
        grid.innerHTML = '<p style="text-align: center; grid-column: span 2; color: #555; padding: 50px 0;">暫無相關遊戲</p>';
        if (pagination) pagination.style.display = 'none';
        return;
    }

    const start = (currentPage - 1) * PAGE_SIZE;
    const end = start + PAGE_SIZE;
    const itemsToShow = filteredGames.slice(start, end);

    grid.innerHTML = itemsToShow.map(game => {
        // 判斷是否為維護狀態
        const isMaintenance = !game.target_path || game.target_path === 'null' || game.target_path === 'undefined' || game.target_path === '#';
        
        return `
            <div class="game-card ${isMaintenance ? 'maintenance' : ''}" onclick="handleGameClick('${game.target_path}')">
                <div class="game-img-wrapper">
                    <div class="game-img" style="background-image: url('./images/${game.image_path}')"
                         onerror="this.style.backgroundImage='url(./images/default-game.jpg)'"></div>
                    <div class="game-badge" style="position:absolute; top:8px; right:8px; background:rgba(0,0,0,0.6); padding:2px 6px; border-radius:4px; font-size:10px; color:var(--gold); border:1px solid var(--gold); z-index:11;">${game.category}</div>
                    
                    ${isMaintenance ? `
                    <div class="maintenance-overlay">
                        <div class="maintenance-icon">🛠️</div>
                        <div class="maintenance-text">該遊戲館維護中<br>敬請期待！</div>
                    </div>
                    ` : ''}
                </div>
                <div class="game-info">
                    <div class="game-title">${game.name}</div>
                    <div class="game-desc">${isMaintenance ? '維護中' : '立即開賽 | 試玩可用'}</div>
                </div>
            </div>
        `;
    }).join('');

    if (pagination) {
        if (filteredGames.length > PAGE_SIZE) {
            pagination.style.display = 'flex';
            if (pageNum) pageNum.innerText = currentPage;
            if (prevBtn) prevBtn.disabled = currentPage === 1;
            if (nextBtn) nextBtn.disabled = end >= filteredGames.length;
        } else {
            pagination.style.display = 'none';
        }
    }
}

/**
 * 點擊遊戲處理 (維護判斷 + 試玩邏輯)
 */
window.handleGameClick = async (url) => {
    if (!url || url === 'null' || url === 'undefined' || url === '#') {
        alert('🛠️ 該遊戲館維護中，敬請期待！');
        return;
    }

    const user = await auth.checkUser();
    
    if (!user) {
        alert('您目前以「試玩模式」進入，系統將不會紀錄您的遊戲數據。');
        location.href = url;
    } else {
        location.href = url;
    }
};

/**
 * 分頁切換功能
 */
window.changePage = (step) => {
    currentPage += step;
    renderCurrentPage();
    window.scrollTo({ top: 200, behavior: 'smooth' }); 
};

/**
 * 全域過濾函數
 */
window.filterCategory = (cat, el) => {
    const titleEl = document.getElementById('display-title');
    document.querySelectorAll('.sidebar-menu li').forEach(item => item.classList.remove('active'));
    if (el && typeof el !== 'string') el.classList.add('active');

    if (titleEl) {
        titleEl.innerText = cat === 'all' ? '熱門推薦 TOP 4' : `${cat}系列`;
    }

    filteredGames = cat === 'all' ? allGames : allGames.filter(g => g.category === cat);
    currentPage = 1; 
    renderCurrentPage();

    if (document.getElementById('sidebar')?.classList.contains('open') && window.toggleMenu) {
        window.toggleMenu();
    }
    window.scrollTo({ top: 200, behavior: 'smooth' });
};

document.addEventListener('DOMContentLoaded', initLobby);
