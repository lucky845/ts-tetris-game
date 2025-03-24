import { GameBoard } from '../models/GameBoard';
import { GameRenderer } from '../views/GameRenderer';

export class GameController {
  private gameBoard: GameBoard;
  private renderer: GameRenderer;
  private gameLoop: number | null;
  private dropInterval: number;
  private lastDropTime: number;
  private isPaused: boolean;
  private gameCanvas: HTMLCanvasElement | null;
  private lastLevel: number;
  private isGameStarted: boolean;

  constructor() {
    this.gameBoard = new GameBoard();
    this.renderer = new GameRenderer(this.gameBoard);
    this.gameLoop = null;
    this.dropInterval = 1000; // 初始下落间隔，单位：毫秒
    this.lastDropTime = 0;
    this.isPaused = false;
    this.gameCanvas = document.getElementById('game-board') as HTMLCanvasElement;
    this.lastLevel = 1;
    this.isGameStarted = false;
    
    this.initializeGame();
  }

  private initializeGame(): void {
    this.setupControls();
    this.renderer.render();
  }

  private setupControls(): void {
    // 键盘控制
    document.addEventListener('keydown', this.handleKeyDown.bind(this));
    
    // 按钮控制
    const startButton = document.getElementById('start-button');
    const pauseButton = document.getElementById('pause-button');
    
    // 方向按钮
    const leftButton = document.getElementById('left-button');
    const rightButton = document.getElementById('right-button');
    const downButton = document.getElementById('down-button');
    const upButton = document.getElementById('up-button');
    const spaceButton = document.getElementById('space-button');
    const dropButton = document.getElementById('drop-button');
    
    if (startButton) {
      startButton.addEventListener('click', () => {
        if (this.isGameStarted && !this.gameBoard.getGameState().isGameOver) {
          if (confirm('游戏正在进行中，确定要重新开始吗？')) {
            this.startGame();
          }
        } else {
          this.startGame();
        }
      });
    }
    
    if (pauseButton) {
      pauseButton.addEventListener('click', this.togglePause.bind(this));
    }
    
    // 绑定方向按钮事件
    if (leftButton) {
      leftButton.addEventListener('click', () => {
        if (!this.isGameStarted || this.gameBoard.getGameState().isGameOver || this.gameBoard.getGameState().isPaused) {
          return;
        }
        this.gameBoard.movePieceLeft();
        this.renderer.render();
      });
    }
    
    if (rightButton) {
      rightButton.addEventListener('click', () => {
        if (!this.isGameStarted || this.gameBoard.getGameState().isGameOver || this.gameBoard.getGameState().isPaused) {
          return;
        }
        this.gameBoard.movePieceRight();
        this.renderer.render();
      });
    }
    
    if (downButton) {
      downButton.addEventListener('click', () => {
        if (!this.isGameStarted || this.gameBoard.getGameState().isGameOver || this.gameBoard.getGameState().isPaused) {
          return;
        }
        this.gameBoard.movePieceDown();
        this.renderer.render();
      });
    }
    
    if (upButton) {
      upButton.addEventListener('click', () => {
        if (!this.isGameStarted || this.gameBoard.getGameState().isGameOver || this.gameBoard.getGameState().isPaused) {
          return;
        }
        this.gameBoard.rotatePiece();
        this.renderer.render();
      });
    }
    
    if (spaceButton) {
      spaceButton.addEventListener('click', () => {
        if (!this.isGameStarted || this.gameBoard.getGameState().isGameOver || this.gameBoard.getGameState().isPaused) {
          return;
        }
        this.gameBoard.hardDrop();
        this.renderer.render();
      });
    }
    
    if (dropButton) {
      dropButton.addEventListener('click', () => {
        if (!this.isGameStarted || this.gameBoard.getGameState().isGameOver || this.gameBoard.getGameState().isPaused) {
          return;
        }
        this.gameBoard.rotatePiece();
        this.renderer.render();
      });
    }
    
    // 确保游戏区域点击时获取焦点
    if (this.gameCanvas) {
      this.gameCanvas.addEventListener('click', () => {
        this.gameCanvas?.focus();
      });
      
      // 设置Canvas可获取焦点
      this.gameCanvas.tabIndex = 0;
    }
    
    // 阻止空格键滚动页面
    document.addEventListener('keydown', (e) => {
      if (e.key === ' ' && e.target === document.body) {
        e.preventDefault();
      }
    });
  }

  private handleKeyDown(event: KeyboardEvent): void {
    if (!this.isGameStarted) {
      return;
    }
    
    if (this.gameBoard.getGameState().isGameOver) {
      return;
    }
    
    switch (event.key) {
      case 'ArrowLeft':
        event.preventDefault();
        this.gameBoard.movePieceLeft();
        this.renderer.render();
        break;
      case 'ArrowRight':
        event.preventDefault();
        this.gameBoard.movePieceRight();
        this.renderer.render();
        break;
      case 'ArrowDown':
        event.preventDefault();
        this.gameBoard.movePieceDown();
        this.renderer.render();
        break;
      case 'ArrowUp':
        event.preventDefault();
        this.gameBoard.rotatePiece();
        this.renderer.render();
        break;
      case ' ': // 空格键
        event.preventDefault();
        this.gameBoard.hardDrop();
        this.renderer.render();
        break;
      case 'p':
      case 'P':
        this.togglePause();
        break;
    }
  }

  public startGame(): void {
    // 如果游戏已经在运行，则先停止
    if (this.gameLoop !== null) {
      this.stopGameLoop();
    }
    
    // 重置游戏状态
    this.gameBoard.resetGame();
    this.isPaused = false;
    this.isGameStarted = true;
    this.updateDropInterval();
    this.renderer.render();
    
    // 隐藏所有蒙版
    this.hidePauseOverlay();
    this.hideGameOverOverlay();
    
    // 重置暂停按钮状态
    this.updatePauseButton(false);
    
    // 更新开始按钮为重玩按钮
    this.updateStartButton(true);
    
    // 开始游戏循环
    this.startGameLoop();
    
    // 自动获取焦点
    if (this.gameCanvas) {
      this.gameCanvas.focus();
    }
  }

  public togglePause(): void {
    if (!this.isGameStarted || this.gameBoard.getGameState().isGameOver) {
      return;
    }

    this.isPaused = this.gameBoard.togglePause();

    if (this.isPaused) {
      this.stopGameLoop();
      this.showPauseOverlay();
      this.updatePauseButton(true); // 更新为"继续"状态
    } else {
      this.startGameLoop();
      this.hidePauseOverlay();
      this.updatePauseButton(false); // 更新为"暂停"状态
    }

    this.renderer.render();
  }

  private startGameLoop(): void {
    if (this.gameLoop === null) {
      this.lastDropTime = performance.now();
      this.gameLoop = requestAnimationFrame(this.gameLoopCallback.bind(this));
    }
  }

  private stopGameLoop(): void {
    if (this.gameLoop !== null) {
      cancelAnimationFrame(this.gameLoop);
      this.gameLoop = null;
    }
  }

  private gameLoopCallback(timestamp: number): void {
    // 检查游戏等级是否改变
    const currentLevel = this.gameBoard.getGameState().level;
    if (currentLevel !== this.lastLevel) {
      this.lastLevel = currentLevel;
      this.updateDropInterval();
    }
    
    // 计算帧之间的时间差
    const deltaTime = timestamp - this.lastDropTime;
    
    if (deltaTime >= this.dropInterval) {
      // 更新游戏状态
      this.gameBoard.update();
      this.lastDropTime = timestamp;
      
      // 检查游戏是否结束
      if (this.gameBoard.getGameState().isGameOver) {
        this.handleGameOver();
        return;
      }
    }
    
    // 渲染游戏
    this.renderer.render();
    
    // 继续游戏循环
    this.gameLoop = requestAnimationFrame(this.gameLoopCallback.bind(this));
  }

  private updateDropInterval(): void {
    // 根据等级调整下落速度
    const level = this.gameBoard.getGameState().level;
    
    // 使用非线性公式计算速度，使得高等级时下落更快
    // 等级1: 1000ms
    // 等级10: 100ms 
    // 等级15: 50ms
    // 等级20+: 20ms
    if (level <= 10) {
      // 从1000ms线性降到100ms
      this.dropInterval = Math.max(100, 1000 - (level - 1) * 100);
    } else if (level <= 20) {
      // 从100ms降到20ms
      this.dropInterval = Math.max(20, 100 - (level - 10) * 8);
    } else {
      // 20级以上固定为20ms
      this.dropInterval = 20;
    }
    
    // 在UI上显示当前速度
    this.updateSpeedDisplay();
  }

  private updateSpeedDisplay(): void {
    const speedElement = document.getElementById('speed');
    if (speedElement) {
      // 将下落间隔转换为速度值显示（值越大表示速度越快）
      const speedValue = Math.floor(1000 / this.dropInterval);
      speedElement.textContent = speedValue.toString();
    }
  }

  private handleGameOver(): void {
    this.stopGameLoop();
    this.renderer.showGameOver();
    this.hidePauseOverlay(); // 确保暂停蒙版不会显示
    this.showGameOverOverlay();
    this.isGameStarted = false;
    this.updateStartButton(false); // 更新重玩按钮为开始游戏按钮
  }

  private showPauseOverlay(): void {
    const pauseOverlay = document.getElementById('pause-overlay');
    if (pauseOverlay && !this.gameBoard.getGameState().isGameOver) {
      pauseOverlay.style.display = 'flex';
    }
  }

  private hidePauseOverlay(): void {
    const pauseOverlay = document.getElementById('pause-overlay');
    if (pauseOverlay) {
      pauseOverlay.style.display = 'none';
    }
  }

  private showGameOverOverlay(): void {
    const gameOverOverlay = document.getElementById('gameover-overlay');
    if (gameOverOverlay) {
      gameOverOverlay.style.display = 'flex';
    }
  }

  private hideGameOverOverlay(): void {
    const gameOverOverlay = document.getElementById('gameover-overlay');
    if (gameOverOverlay) {
      gameOverOverlay.style.display = 'none';
    }
  }

  private updatePauseButton(isPaused: boolean): void {
    const pauseButton = document.getElementById('pause-button');
    if (pauseButton) {
      if (isPaused) {
        pauseButton.textContent = '开始/暂停';
        pauseButton.classList.remove('pause');
        pauseButton.classList.add('resume');
      } else {
        pauseButton.textContent = '开始/暂停';
        pauseButton.classList.remove('resume');
        pauseButton.classList.add('pause');
      }
    }
  }

  private updateStartButton(gameStarted: boolean): void {
    const startButton = document.getElementById('start-button');
    if (startButton) {
      if (gameStarted) {
        startButton.textContent = '开始/复位';
        startButton.classList.remove('start');
        startButton.classList.add('restart');
      } else {
        startButton.textContent = '开始/复位';
        startButton.classList.remove('restart');
        startButton.classList.add('start');
      }
    }
  }
} 