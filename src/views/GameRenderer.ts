import { GameBoard } from '../models/GameBoard';
import { Position } from '../models/Tetromino';

export class GameRenderer {
    private gameBoard: GameBoard;
    private boardCanvas: HTMLCanvasElement;
    private boardContext: CanvasRenderingContext2D;
    private nextPieceCanvas: HTMLCanvasElement;
    private nextPieceContext: CanvasRenderingContext2D;
    private blockSize: number;
    private nextBlockSize: number;

    constructor(gameBoard: GameBoard) {
        this.gameBoard = gameBoard;
        this.boardCanvas = document.getElementById('game-board') as HTMLCanvasElement;
        this.boardContext = this.boardCanvas.getContext('2d') as CanvasRenderingContext2D;
        this.nextPieceCanvas = document.getElementById('next-piece') as HTMLCanvasElement;
        this.nextPieceContext = this.nextPieceCanvas.getContext('2d') as CanvasRenderingContext2D;

        // 计算方块大小
        this.blockSize = this.boardCanvas.width / this.gameBoard.getBoardWidth();
        this.nextBlockSize = this.nextPieceCanvas.width / 4; // 下一个方块预览区域的方块大小
    }

    public render(): void {
        this.clearCanvas();
        this.drawBoard();
        this.drawActivePiece();
        this.drawNextPiece();
        this.updateGameStats();
    }

    private clearCanvas(): void {
        this.boardContext.clearRect(0, 0, this.boardCanvas.width, this.boardCanvas.height);
        this.nextPieceContext.clearRect(0, 0, this.nextPieceCanvas.width, this.nextPieceCanvas.height);
    }

    private drawBoard(): void {
        const board = this.gameBoard.getBoard();

        for (let y = 0; y < board.length; y++) {
            for (let x = 0; x < board[y].length; x++) {
                const color = board[y][x];
                if (color) {
                    this.drawBlock(x, y, color, this.boardContext, this.blockSize);
                }
            }
        }

        // 绘制网格
        this.drawGrid();
    }

    private drawActivePiece(): void {
        const drawingState = this.gameBoard.getDrawingState();

        if (drawingState.activePiece) {
            const { shape, position, color } = drawingState.activePiece;

            for (let y = 0; y < shape.length; y++) {
                for (let x = 0; x < shape[y].length; x++) {
                    if (shape[y][x]) {
                        const boardX = position.x + x;
                        const boardY = position.y + y;

                        if (boardY >= 0) { // 只绘制在板上可见的部分
                            this.drawBlock(boardX, boardY, color, this.boardContext, this.blockSize);
                        }
                    }
                }
            }
        }
    }

    private drawNextPiece(): void {
        const nextPiece = this.gameBoard.getNextPiece();
        const shape = nextPiece.getShape();
        const color = nextPiece.getColor();

        // 计算居中偏移
        const offsetX = (this.nextPieceCanvas.width - shape[0].length * this.nextBlockSize) / 2;
        const offsetY = (this.nextPieceCanvas.height - shape.length * this.nextBlockSize) / 2;

        for (let y = 0; y < shape.length; y++) {
            for (let x = 0; x < shape[y].length; x++) {
                if (shape[y][x]) {
                    const nextX = offsetX + x * this.nextBlockSize;
                    const nextY = offsetY + y * this.nextBlockSize;

                    this.nextPieceContext.fillStyle = color;
                    this.nextPieceContext.fillRect(nextX, nextY, this.nextBlockSize, this.nextBlockSize);
                    this.nextPieceContext.strokeStyle = '#000';
                    this.nextPieceContext.strokeRect(nextX, nextY, this.nextBlockSize, this.nextBlockSize);
                }
            }
        }
    }

    private drawBlock(x: number, y: number, color: string, context: CanvasRenderingContext2D, size: number): void {
        const xPos = x * size;
        const yPos = y * size;

        // 绘制方块
        context.fillStyle = color;
        context.fillRect(xPos, yPos, size, size);

        // 绘制边框
        context.strokeStyle = '#000';
        context.strokeRect(xPos, yPos, size, size);

        // 绘制高光效果
        context.fillStyle = 'rgba(255, 255, 255, 0.2)';
        context.beginPath();
        context.moveTo(xPos, yPos);
        context.lineTo(xPos + size, yPos);
        context.lineTo(xPos, yPos + size);
        context.closePath();
        context.fill();
    }

    private drawGrid(): void {
        const width = this.gameBoard.getBoardWidth();
        const height = this.gameBoard.getBoardHeight();

        this.boardContext.strokeStyle = 'rgba(255, 255, 255, 0.1)';
        this.boardContext.lineWidth = 0.5;

        // 绘制水平线
        for (let y = 0; y <= height; y++) {
            this.boardContext.beginPath();
            this.boardContext.moveTo(0, y * this.blockSize);
            this.boardContext.lineTo(width * this.blockSize, y * this.blockSize);
            this.boardContext.stroke();
        }

        // 绘制垂直线
        for (let x = 0; x <= width; x++) {
            this.boardContext.beginPath();
            this.boardContext.moveTo(x * this.blockSize, 0);
            this.boardContext.lineTo(x * this.blockSize, height * this.blockSize);
            this.boardContext.stroke();
        }
    }

    private updateGameStats(): void {
        const gameState = this.gameBoard.getGameState();

        const scoreElement = document.getElementById('score');
        const linesElement = document.getElementById('lines');
        const levelElement = document.getElementById('level');

        if (scoreElement) {
            scoreElement.textContent = gameState.score.toString();
        }

        if (linesElement) {
            linesElement.textContent = gameState.lines.toString();
        }

        if (levelElement) {
            levelElement.textContent = gameState.level.toString();
        }
    }

    public showGameOver(): void {
        this.boardContext.fillStyle = 'rgba(0, 0, 0, 0.7)';
        this.boardContext.fillRect(0, 0, this.boardCanvas.width, this.boardCanvas.height);

        this.boardContext.font = '30px Arial';
        this.boardContext.fillStyle = '#fff';
        this.boardContext.textAlign = 'center';
        this.boardContext.fillText('游戏结束', this.boardCanvas.width / 2, this.boardCanvas.height / 2);

        this.boardContext.font = '20px Arial';
        this.boardContext.fillText('按开始游戏重新开始', this.boardCanvas.width / 2, this.boardCanvas.height / 2 + 40);
    }
} 