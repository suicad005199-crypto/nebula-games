import { api } from './api.js';
import { auth } from './auth.js';

let allGames = [];
let filteredGames = [];
let currentPage = 1;
const PAGE_SIZE = 8; // 增加每頁顯示數量，更符合娛樂城大廳排版

/**
 * 初始化載入資料與會員狀態
 */
async function initLobby() {
    const grid = document.getElementById('game-grid');
    
    // 1. 同步檢查會員狀態
    updateUserUI();

    try {
        // 2. 獲取遊戲資料
        allGames = await api.getActiveGames();
        filteredGames = [...allGames];
        renderCurrentPage();
    } catch (err) {
        console.error("Lobby Init Error:", err);
        grid.innerHTML = `
            <div style="grid-column: span 2; text-align: center; padding: 50px 20px;">
                <p style="color: #ff4436; margin-bottom: 10px;">連線異常，請檢查網路</p>
                <button onclick="location.reload()" style="background:var(--gold); border:none; padding:5px 15px; border-radius:4px;">重新整理</button>
            </div>
        `;
    }
}

/**
 * 更新頂部會員 UI (餘額、登入按鈕)
 */
async function updateUserUI() {
    const balanceBox = document.querySelector('.balance-box');
    const loginBtn = document.querySelector('.login-btn');
    
    try {
        const user = await auth.checkUser();
        if (user) {
            // 已登入：顯示餘額 (假設餘額存在 user_metadata 或由 api 獲取)
            // 這裡先以固定值或 0 演示，未來可對接餘額 API
            const balance = user.user_metadata?.balance || 0;
            balanceBox.innerText = `NT$ ${Number(balance).toLocaleString()}`;
            balanceBox.style.display = 'block';
            
            loginBtn.innerText = '退出';
            loginBtn.style.background = 'transparent';
            loginBtn.style.border = '1px solid var(--border)';
            loginBtn.style.color = '#aaa';
            loginBtn.onclick = async () => {
                await auth.logout();
                location.reload();
            };
        } else {
            // 未登入
            balanceBox.style.display = 'none';
            loginBtn.innerText = '登入';
            loginBtn.onclick = () => alert('導向登入頁面...');
        }
    } catch (err) {
        balanceBox.style.display = 'none';
    }
}

/**
 * 渲染當前頁面的遊戲卡片
 */
function renderCurrentPage() {
    const grid = document.getElementById('game-grid');
    const pagination = document.getElementById('pagination');
    const pageNum = document.getElementById('page-num');
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    
    if (!filteredGames.length) {
        grid.innerHTML = `
            <div style="grid-column: span 2; text-align: center; padding: 100px 0; color: #555;">
                <i style="font-size: 40px; display: block; margin-bottom: 10px;">🔍</i>
                暫無相關遊戲
            </div>
        `;
        pagination.style.display = 'none';
        return;
    }

    const start = (currentPage - 1) * PAGE_SIZE;
    const end = start + PAGE_SIZE;
    const itemsToShow = filteredGames.slice(start, end);

    grid.innerHTML = itemsToShow.map(game => `
        <div class="game-card" onclick="handleGameClick('${game.game_url}')">
            <div class="game-img-wrapper">
                <div class="game-img" style="background-image: url('./images/${game.image_path}')" 
                     onerror="this.style.backgroundImage='url(./images/default-game.jpg)'">
                </div>
                <div class="game-badge">${game.category}</div>
            </div>
            <div class="game-info">
                <div class="game-title">${game.name}</div>
                <div class="game-desc">${game.description || '立即開啟贏取大獎'}</div>
            </div>
        </div>
    `).join('');

    // 更新分頁器
    if (filteredGames.length > PAGE_SIZE) {
        pagination.style.display = 'flex';
        pageNum.innerText = currentPage;
        prevBtn.style.opacity = currentPage === 1 ? '0.3' : '1';
        prevBtn.disabled = currentPage === 1;
        nextBtn.style.opacity = end >= filteredGames.length ? '0.3' : '1';
        nextBtn.disabled = end >= filteredGames.length;
    } else {
        pagination.style.display = 'none';
    }
}

/**
 * 點擊遊戲處理 (檢查登入)
 */
window.handleGameClick = (url) => {
    auth.checkUser().then(user => {
        if (!user) {
            alert('請先登入會員方可開始遊戲');
        } else {
            location.href = url;
        }
    });
};

/**
 * 分頁切換
 */
window.changePage = (step) => {
    currentPage += step;
    renderCurrentPage();
    window.scrollTo({ top: 0, behavior: 'smooth' });
};

/**
 * 分類過濾
 */
window.filterCategory = (cat, el) => {
    // 1. 更新 UI 樣式
    document.querySelectorAll('.sidebar-menu li').forEach(item => item.classList.remove('active'));
    if (el) el.classList.add('active');

    // 2. 執行過濾
    filteredGames = cat === 'all' ? allGames : allGames.filter(g => g.category === cat);
    currentPage = 1; 

    // 3. 渲染與關閉選單
    renderCurrentPage();

    if (window.toggleMenu) {
        // 如果選單是開啟狀態才關閉
        if (document.getElementById('sidebar').classList.contains('open')) {
            window.toggleMenu();
        }
    }
    
    window.scrollTo({ top: 0, behavior: 'smooth' });
};

// 監聽 DOM 載入
document.addEventListener('DOMContentLoaded', initLobby);
