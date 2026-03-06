import { api } from './api.js';

async function initLobby() {
    const grid = document.getElementById('game-grid');
    const games = await api.getActiveGames();
    
    if (games.length === 0) {
        grid.innerHTML = '<p style="text-align: center; grid-column: span 2;">目前尚無遊戲上架</p>';
        return;
    }

    grid.innerHTML = games.map(game => `
        <div class="game-card" onclick="alert('進入遊戲：${game.name}')">
            <div class="game-img" style="background-image: url('./images/${game.image_path}')"></div>
            <div class="game-info">
                <span class="game-title">${game.name}</span>
                <span class="game-desc">${game.description}</span>
            </div>
        </div>
    `).join('');
}

document.addEventListener('DOMContentLoaded', initLobby);
