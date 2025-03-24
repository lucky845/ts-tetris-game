/**
 * 俄罗斯方块的形状定义
 */
export type TetrominoType = 'I' | 'J' | 'L' | 'O' | 'S' | 'T' | 'Z';

export type TetrominoShape = number[][];

export type Position = {
  x: number;
  y: number;
};

export type RotationState = 0 | 1 | 2 | 3;

export class Tetromino {
  private static readonly SHAPES: Record<TetrominoType, TetrominoShape[]> = {
    I: [
      [
        [0, 0, 0, 0],
        [1, 1, 1, 1],
        [0, 0, 0, 0],
        [0, 0, 0, 0]
      ],
      [
        [0, 0, 1, 0],
        [0, 0, 1, 0],
        [0, 0, 1, 0],
        [0, 0, 1, 0]
      ],
      [
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [1, 1, 1, 1],
        [0, 0, 0, 0]
      ],
      [
        [0, 1, 0, 0],
        [0, 1, 0, 0],
        [0, 1, 0, 0],
        [0, 1, 0, 0]
      ]
    ],
    J: [
      [
        [1, 0, 0],
        [1, 1, 1],
        [0, 0, 0]
      ],
      [
        [0, 1, 1],
        [0, 1, 0],
        [0, 1, 0]
      ],
      [
        [0, 0, 0],
        [1, 1, 1],
        [0, 0, 1]
      ],
      [
        [0, 1, 0],
        [0, 1, 0],
        [1, 1, 0]
      ]
    ],
    L: [
      [
        [0, 0, 1],
        [1, 1, 1],
        [0, 0, 0]
      ],
      [
        [0, 1, 0],
        [0, 1, 0],
        [0, 1, 1]
      ],
      [
        [0, 0, 0],
        [1, 1, 1],
        [1, 0, 0]
      ],
      [
        [1, 1, 0],
        [0, 1, 0],
        [0, 1, 0]
      ]
    ],
    O: [
      [
        [0, 0, 0, 0],
        [0, 1, 1, 0],
        [0, 1, 1, 0],
        [0, 0, 0, 0]
      ],
      [
        [0, 0, 0, 0],
        [0, 1, 1, 0],
        [0, 1, 1, 0],
        [0, 0, 0, 0]
      ],
      [
        [0, 0, 0, 0],
        [0, 1, 1, 0],
        [0, 1, 1, 0],
        [0, 0, 0, 0]
      ],
      [
        [0, 0, 0, 0],
        [0, 1, 1, 0],
        [0, 1, 1, 0],
        [0, 0, 0, 0]
      ]
    ],
    S: [
      [
        [0, 1, 1],
        [1, 1, 0],
        [0, 0, 0]
      ],
      [
        [0, 1, 0],
        [0, 1, 1],
        [0, 0, 1]
      ],
      [
        [0, 0, 0],
        [0, 1, 1],
        [1, 1, 0]
      ],
      [
        [1, 0, 0],
        [1, 1, 0],
        [0, 1, 0]
      ]
    ],
    T: [
      [
        [0, 1, 0],
        [1, 1, 1],
        [0, 0, 0]
      ],
      [
        [0, 1, 0],
        [0, 1, 1],
        [0, 1, 0]
      ],
      [
        [0, 0, 0],
        [1, 1, 1],
        [0, 1, 0]
      ],
      [
        [0, 1, 0],
        [1, 1, 0],
        [0, 1, 0]
      ]
    ],
    Z: [
      [
        [1, 1, 0],
        [0, 1, 1],
        [0, 0, 0]
      ],
      [
        [0, 0, 1],
        [0, 1, 1],
        [0, 1, 0]
      ],
      [
        [0, 0, 0],
        [1, 1, 0],
        [0, 1, 1]
      ],
      [
        [0, 1, 0],
        [1, 1, 0],
        [1, 0, 0]
      ]
    ]
  };

  private static readonly COLORS: Record<TetrominoType, string> = {
    I: '#00FFFF', // 青色
    J: '#0000FF', // 蓝色
    L: '#FF7F00', // 橙色
    O: '#FFFF00', // 黄色
    S: '#00FF00', // 绿色
    T: '#800080', // 紫色
    Z: '#FF0000'  // 红色
  };

  public type: TetrominoType;
  public position: Position;
  public rotationState: RotationState;

  constructor(type: TetrominoType, position: Position = { x: 3, y: 0 }) {
    this.type = type;
    this.position = position;
    this.rotationState = 0;
  }

  public getShape(): TetrominoShape {
    return Tetromino.SHAPES[this.type][this.rotationState];
  }

  public getColor(): string {
    return Tetromino.COLORS[this.type];
  }

  public rotate(): void {
    this.rotationState = ((this.rotationState + 1) % 4) as RotationState;
  }

  public rotateBack(): void {
    this.rotationState = ((this.rotationState + 3) % 4) as RotationState;
  }

  public moveLeft(): void {
    this.position.x -= 1;
  }

  public moveRight(): void {
    this.position.x += 1;
  }

  public moveDown(): void {
    this.position.y += 1;
  }

  public moveUp(): void {
    this.position.y -= 1;
  }

  public static getRandomType(): TetrominoType {
    const types: TetrominoType[] = ['I', 'J', 'L', 'O', 'S', 'T', 'Z'];
    return types[Math.floor(Math.random() * types.length)];
  }

  public static createRandom(position: Position = { x: 3, y: 0 }): Tetromino {
    return new Tetromino(Tetromino.getRandomType(), position);
  }
} 