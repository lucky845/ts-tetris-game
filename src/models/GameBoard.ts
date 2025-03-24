import { Tetromino, TetrominoType, Position } from './Tetromino';

export interface GameState {
  score: number;
  level: number;
  lines: number;
  isGameOver: boolean;
  isPaused: boolean;
}

export class GameBoard {
  private static readonly BOARD_WIDTH = 10;
  private static readonly BOARD_HEIGHT = 20;

  // 墙踢偏移测试位置
  private static readonly WALL_KICK_TESTS: Position[] = [
    { x: 0, y: 0 },   // 原位置尝试
    { x: -1, y: 0 },  // 左移1格
    { x: 1, y: 0 },   // 右移1格
    { x: -2, y: 0 },  // 左移2格
    { x: 2, y: 0 },   // 右移2格
    { x: 0, y: -1 },  // 上移1格
    { x: -1, y: -1 }, // 左上移1格
    { x: 1, y: -1 }   // 右上移1格
  ];

  private board: (string | null)[][];
  private currentPiece: Tetromino | null;
  private nextPiece: Tetromino;
  private gameState: GameState;

  constructor() {
    this.board = this.createEmptyBoard();
    this.currentPiece = null;
    this.nextPiece = Tetromino.createRandom();
    this.gameState = {
      score: 0,
      level: 1,
      lines: 0,
      isGameOver: false,
      isPaused: false
    };
  }

  private createEmptyBoard(): (string | null)[][] {
    return Array(GameBoard.BOARD_HEIGHT).fill(null)
      .map(() => Array(GameBoard.BOARD_WIDTH).fill(null));
  }

  public getBoard(): (string | null)[][] {
    return this.board;
  }

  public getCurrentPiece(): Tetromino | null {
    return this.currentPiece;
  }

  public getNextPiece(): Tetromino {
    return this.nextPiece;
  }

  public getGameState(): GameState {
    return this.gameState;
  }

  public getBoardWidth(): number {
    return GameBoard.BOARD_WIDTH;
  }

  public getBoardHeight(): number {
    return GameBoard.BOARD_HEIGHT;
  }

  public resetGame(): void {
    this.board = this.createEmptyBoard();
    this.currentPiece = null;
    this.nextPiece = Tetromino.createRandom();
    this.gameState = {
      score: 0,
      level: 1,
      lines: 0,
      isGameOver: false,
      isPaused: false
    };
    this.spawnNewPiece();
  }

  public togglePause(): boolean {
    // 如果游戏已经结束，不允许切换暂停状态
    if (this.gameState.isGameOver) {
      return this.gameState.isPaused;
    }
    
    this.gameState.isPaused = !this.gameState.isPaused;
    return this.gameState.isPaused;
  }

  public spawnNewPiece(): boolean {
    this.currentPiece = this.nextPiece;
    this.nextPiece = Tetromino.createRandom();

    // 检查游戏是否结束
    if (this.isCollision()) {
      this.gameState.isGameOver = true;
      return false;
    }

    return true;
  }

  public movePieceLeft(): boolean {
    if (!this.currentPiece || this.gameState.isGameOver || this.gameState.isPaused) {
      return false;
    }

    this.currentPiece.moveLeft();

    if (this.isCollision()) {
      this.currentPiece.moveRight(); // 还原移动
      return false;
    }

    return true;
  }

  public movePieceRight(): boolean {
    if (!this.currentPiece || this.gameState.isGameOver || this.gameState.isPaused) {
      return false;
    }

    this.currentPiece.moveRight();

    if (this.isCollision()) {
      this.currentPiece.moveLeft(); // 还原移动
      return false;
    }

    return true;
  }

  public movePieceDown(): boolean {
    if (!this.currentPiece || this.gameState.isGameOver || this.gameState.isPaused) {
      return false;
    }

    this.currentPiece.moveDown();

    if (this.isCollision()) {
      this.currentPiece.moveUp(); // 还原移动
      this.lockPiece();
      return false;
    }

    return true;
  }

  public rotatePiece(): boolean {
    if (!this.currentPiece || this.gameState.isGameOver || this.gameState.isPaused) {
      return false;
    }

    // 保存原始位置和旋转状态
    const originalX = this.currentPiece.position.x;
    const originalY = this.currentPiece.position.y;
    const originalRotation = this.currentPiece.rotationState;

    // 先尝试常规旋转
    this.currentPiece.rotate();

    // 如果旋转后出现碰撞，尝试墙踢
    if (this.isCollision()) {
      // 尝试墙踢测试位置
      let kickSuccessful = false;

      for (const test of GameBoard.WALL_KICK_TESTS) {
        // 跳过第一个测试，因为我们已经测试过原位置
        if (test.x === 0 && test.y === 0) continue;

        // 应用测试偏移
        this.currentPiece.position.x = originalX + test.x;
        this.currentPiece.position.y = originalY + test.y;

        // 检查这个位置是否可行
        if (!this.isCollision()) {
          kickSuccessful = true;
          break;
        }
      }

      // 如果所有墙踢测试都失败，恢复原始状态
      if (!kickSuccessful) {
        this.currentPiece.position.x = originalX;
        this.currentPiece.position.y = originalY;
        this.currentPiece.rotationState = originalRotation;
        return false;
      }
    }

    return true;
  }

  public hardDrop(): void {
    if (!this.currentPiece || this.gameState.isGameOver || this.gameState.isPaused) {
      return;
    }

    // 下落方块直到到达底部
    while (this.movePieceDown()) {
      // 持续下落
    }

    // 当无法再下落时，手动锁定方块
    // 不需要再调用lockPiece()，因为最后一次movePieceDown()检测到碰撞时已经调用了lockPiece()
  }

  private isCollision(): boolean {
    if (!this.currentPiece) {
      return false;
    }

    const shape = this.currentPiece.getShape();
    const { x: pieceX, y: pieceY } = this.currentPiece.position;

    for (let y = 0; y < shape.length; y++) {
      for (let x = 0; x < shape[y].length; x++) {
        if (shape[y][x]) {
          const boardX = pieceX + x;
          const boardY = pieceY + y;

          // 检查是否超出边界
          if (
            boardX < 0 ||
            boardX >= GameBoard.BOARD_WIDTH ||
            boardY < 0 ||
            boardY >= GameBoard.BOARD_HEIGHT
          ) {
            return true;
          }

          // 检查是否与已锁定的方块碰撞
          if (boardY >= 0 && this.board[boardY][boardX] !== null) {
            return true;
          }
        }
      }
    }

    return false;
  }

  private lockPiece(): void {
    if (!this.currentPiece) {
      return;
    }

    const shape = this.currentPiece.getShape();
    const { x: pieceX, y: pieceY } = this.currentPiece.position;
    const color = this.currentPiece.getColor();

    for (let y = 0; y < shape.length; y++) {
      for (let x = 0; x < shape[y].length; x++) {
        if (shape[y][x]) {
          const boardX = pieceX + x;
          const boardY = pieceY + y;

          if (boardY >= 0 && boardY < GameBoard.BOARD_HEIGHT && boardX >= 0 && boardX < GameBoard.BOARD_WIDTH) {
            this.board[boardY][boardX] = color;
          }
        }
      }
    }

    // 清除完整的行并计算分数
    this.clearLines();

    // 生成新的方块
    this.spawnNewPiece();
  }

  private clearLines(): void {
    let linesCleared = 0;

    for (let y = GameBoard.BOARD_HEIGHT - 1; y >= 0; y--) {
      if (this.board[y].every(cell => cell !== null)) {
        // 删除该行
        this.board.splice(y, 1);
        // 在顶部添加一个新的空行
        this.board.unshift(Array(GameBoard.BOARD_WIDTH).fill(null));
        linesCleared++;
        y++; // 重新检查当前行，因为上面的行已经下移
      }
    }

    if (linesCleared > 0) {
      // 更新游戏状态
      this.updateScore(linesCleared);
    }
  }

  private updateScore(linesCleared: number): void {
    // 根据消除的行数计算得分
    const linePoints = [0, 40, 100, 300, 1200]; // 0, 1, 2, 3, 4行的得分
    this.gameState.score += linePoints[linesCleared] * this.gameState.level;
    this.gameState.lines += linesCleared;

    // 每消除10行提升一个等级
    this.gameState.level = Math.floor(this.gameState.lines / 10) + 1;
  }

  // 游戏主循环方法
  public update(): void {
    if (this.gameState.isGameOver || this.gameState.isPaused) {
      return;
    }

    this.movePieceDown();
  }

  // 用于渲染的方法，返回当前需要绘制的所有方块（包括活动方块和已锁定方块）
  public getDrawingState(): { board: (string | null)[][], activePiece: { shape: number[][], position: Position, color: string } | null } {
    const boardWithPiece = this.board.map(row => [...row]);

    let activePiece = null;
    if (this.currentPiece) {
      activePiece = {
        shape: this.currentPiece.getShape(),
        position: this.currentPiece.position,
        color: this.currentPiece.getColor()
      };
    }

    return {
      board: boardWithPiece,
      activePiece
    };
  }
} 