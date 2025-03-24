import { GameController } from './controllers/GameController';

// 当DOM加载完成后初始化游戏
document.addEventListener('DOMContentLoaded', () => {
  new GameController();
}); 