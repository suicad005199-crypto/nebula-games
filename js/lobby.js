import { api } from './api.js';

async function initLobby() {
    const container = document.getElementById('game-grid');
    try {
        const games = await api.getGames();
        container.innerHTML = games.map(game => `
            <div class="game-card" onclick="location.href='game.html?id=${game.id}'">
                <div class="game-img" style="background-image: url('./images/${game.image_path}')"></div>
                <div class="game-info">
                    <span class="game-title">${game.name}</span>
                    <span class="game-desc">${game.description}</span>
                </div>
            </div>
        `).join('');
    } catch (err) {
        console.error('載入失敗:', err);
    }
}

document.addEventListener('DOMContentLoaded', initLobby);
