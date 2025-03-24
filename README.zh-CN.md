# TypeScript 俄罗斯方块游戏

使用TypeScript和HTML5 Canvas构建的经典俄罗斯方块游戏现代实现。

![俄罗斯方块游戏截图](screenshot.png)

## 功能特点

- 经典俄罗斯方块玩法，现代化视觉效果
- 适用于桌面设备的响应式控制
- 分数追踪和等级进阶
- 随着等级提升而增加的下落速度
- 下一个方块预览
- 游戏暂停和继续功能
- 复古风格的游戏机控制台界面

## 开始使用

### 前置条件

- [Bun](https://bun.sh/) - 快速JavaScript运行时与包管理器

### 安装

1. 克隆仓库：
   ```bash
   git clone https://github.com/yourusername/ts-tetris-game.git
   cd ts-tetris-game
   ```

2. 安装依赖：
   ```bash
   bun install
   ```

3. 启动开发服务器：
   ```bash
   bun run start
   ```

4. 构建生产版本：
   ```bash
   bun run build
   ```

## 游戏控制

- **←, →**: 左右移动方块
- **↓**: 向下移动方块
- **↑**: 旋转方块
- **空格键**: 快速下落
- **P键**: 暂停/继续游戏
- 或使用屏幕上的控制按钮

## 技术细节

- 使用TypeScript编写
- 使用HTML5 Canvas渲染
- 不依赖外部游戏库 - 从零构建
- 使用Bun进行打包

## 项目结构

```
ts-tetris-game/
├── src/
│   ├── controllers/    # 游戏控制器
│   ├── models/         # 游戏逻辑和数据模型
│   ├── renderers/      # 渲染逻辑
│   └── index.ts        # 入口点
├── public/
│   ├── styles/         # CSS样式
│   └── index.html      # HTML模板
├── dist/               # 编译后的文件
└── package.json        # 项目配置
```

## 许可证

本项目采用MIT许可证 - 详情请参阅[LICENSE](LICENSE)文件。

## 致谢

- 受原始俄罗斯方块游戏启发
- 使用现代Web技术构建 