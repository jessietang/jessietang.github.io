// 贪吃蛇游戏逻辑

// 游戏状态
let game = {
    canvas: null,
    ctx: null,
    width: 400,
    height: 400,
    gridSize: 20,
    snake: [],
    direction: 'right',
    nextDirection: 'right',
    food: {},
    score: 0,
    level: 1,
    speed: 1500,
    isPlaying: false,
    isPaused: false,
    gameLoop: null
};

// DOM元素
let scoreElement = document.getElementById('score');
let levelElement = document.getElementById('level');
let startBtn = document.getElementById('startBtn');
let pauseBtn = document.getElementById('pauseBtn');
let resetBtn = document.getElementById('resetBtn');

// 初始化游戏
function initGame() {
    game.canvas = document.getElementById('gameCanvas');
    game.ctx = game.canvas.getContext('2d');
    
    // 设置画布大小
    game.canvas.width = game.width;
    game.canvas.height = game.height;
    
    // 初始化蛇
    resetSnake();
    
    // 生成食物
    generateFood();
    
    // 绘制初始游戏
    drawGame();
    
    // 绑定事件监听器
    bindEvents();
}

// 重置蛇
function resetSnake() {
    let centerX = Math.floor(game.width / (2 * game.gridSize)) * game.gridSize;
    let centerY = Math.floor(game.height / (2 * game.gridSize)) * game.gridSize;
    
    game.snake = [
        { x: centerX, y: centerY },
        { x: centerX - game.gridSize, y: centerY },
        { x: centerX - 2 * game.gridSize, y: centerY }
    ];
    
    game.direction = 'right';
    game.nextDirection = 'right';
}

// 生成食物
function generateFood() {
    let x, y;
    let isOnSnake;
    
    do {
        x = Math.floor(Math.random() * (game.width / game.gridSize)) * game.gridSize;
        y = Math.floor(Math.random() * (game.height / game.gridSize)) * game.gridSize;
        
        isOnSnake = game.snake.some(segment => segment.x === x && segment.y === y);
    } while (isOnSnake);
    
    game.food = { x, y };
}

// 绘制游戏
function drawGame() {
    // 清空画布
    game.ctx.fillStyle = '#ecf0f1';
    game.ctx.fillRect(0, 0, game.width, game.height);
    
    // 绘制网格线
    drawGrid();
    
    // 绘制蛇
    drawSnake();
    
    // 绘制食物
    drawFood();
    
    // 更新分数和等级显示
    updateScore();
}

// 绘制网格线
function drawGrid() {
    game.ctx.strokeStyle = '#bdc3c7';
    game.ctx.lineWidth = 0.5;
    
    for (let x = 0; x <= game.width; x += game.gridSize) {
        game.ctx.beginPath();
        game.ctx.moveTo(x, 0);
        game.ctx.lineTo(x, game.height);
        game.ctx.stroke();
    }
    
    for (let y = 0; y <= game.height; y += game.gridSize) {
        game.ctx.beginPath();
        game.ctx.moveTo(0, y);
        game.ctx.lineTo(game.width, y);
        game.ctx.stroke();
    }
}

// 绘制蛇
function drawSnake() {
    for (let i = 0; i < game.snake.length; i++) {
        const segment = game.snake[i];
        
        if (i === 0) {
            // 蛇头
            game.ctx.fillStyle = '#27ae60';
        } else {
            // 蛇身
            game.ctx.fillStyle = '#2ecc71';
        }
        
        game.ctx.fillRect(segment.x, segment.y, game.gridSize - 1, game.gridSize - 1);
        
        // 绘制蛇身边框
        game.ctx.strokeStyle = '#229954';
        game.ctx.lineWidth = 1;
        game.ctx.strokeRect(segment.x, segment.y, game.gridSize - 1, game.gridSize - 1);
    }
}

// 绘制食物
function drawFood() {
    game.ctx.fillStyle = '#e74c3c';
    game.ctx.fillRect(game.food.x, game.food.y, game.gridSize - 1, game.gridSize - 1);
    
    // 绘制食物边框
    game.ctx.strokeStyle = '#c0392b';
    game.ctx.lineWidth = 1;
    game.ctx.strokeRect(game.food.x, game.food.y, game.gridSize - 1, game.gridSize - 1);
}

// 更新分数显示
function updateScore() {
    scoreElement.textContent = game.score;
    levelElement.textContent = game.level;
}

// 移动蛇
function moveSnake() {
    // 更新方向
    game.direction = game.nextDirection;
    
    // 获取蛇头位置
    let head = { ...game.snake[0] };
    
    // 根据方向移动蛇头
    switch (game.direction) {
        case 'up':
            head.y -= game.gridSize;
            break;
        case 'down':
            head.y += game.gridSize;
            break;
        case 'left':
            head.x -= game.gridSize;
            break;
        case 'right':
            head.x += game.gridSize;
            break;
    }
    
    // 添加新的蛇头
    game.snake.unshift(head);
    
    // 检查是否吃到食物
    if (head.x === game.food.x && head.y === game.food.y) {
        // 增加分数
        game.score += 10;
        
        // 检查是否升级
        if (game.score % 50 === 0) {
            game.level++;
            // 增加游戏速度
            game.speed = Math.max(50, game.speed - 10);
            // 重新设置游戏循环速度
            if (game.gameLoop) {
                clearInterval(game.gameLoop);
                game.gameLoop = setInterval(gameLoop, game.speed);
            }
        }
        
        // 生成新的食物
        generateFood();
    } else {
        // 移除蛇尾
        game.snake.pop();
    }
    
    // 检查碰撞
    if (checkCollision()) {
        gameOver();
        return;
    }
    
    // 绘制游戏
    drawGame();
}

// 检查碰撞
function checkCollision() {
    let head = game.snake[0];
    
    // 检查撞墙
    if (head.x < 0 || head.x >= game.width || head.y < 0 || head.y >= game.height) {
        return true;
    }
    
    // 检查撞到自己
    for (let i = 1; i < game.snake.length; i++) {
        if (head.x === game.snake[i].x && head.y === game.snake[i].y) {
            return true;
        }
    }
    
    return false;
}

// 游戏结束
function gameOver() {
    game.isPlaying = false;
    clearInterval(game.gameLoop);
    
    // 显示游戏结束信息
    game.ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    game.ctx.fillRect(0, 0, game.width, game.height);
    
    game.ctx.fillStyle = 'white';
    game.ctx.font = '30px Arial';
    game.ctx.textAlign = 'center';
    game.ctx.fillText('游戏结束', game.width / 2, game.height / 2 - 30);
    
    game.ctx.font = '20px Arial';
    game.ctx.fillText(`最终分数: ${game.score}`, game.width / 2, game.height / 2);
    game.ctx.fillText(`最终等级: ${game.level}`, game.width / 2, game.height / 2 + 30);
}

// 游戏循环
function gameLoop() {
    if (!game.isPaused) {
        moveSnake();
    }
}

// 开始游戏
function startGame() {
    if (!game.isPlaying) {
        game.isPlaying = true;
        game.isPaused = false;
        game.gameLoop = setInterval(gameLoop, game.speed);
    }
}

// 暂停游戏
function pauseGame() {
    if (game.isPlaying) {
        game.isPaused = !game.isPaused;
        pauseBtn.textContent = game.isPaused ? '继续' : '暂停';
        
        if (game.isPaused) {
            // 显示暂停信息
            game.ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
            game.ctx.fillRect(0, 0, game.width, game.height);
            
            game.ctx.fillStyle = 'white';
            game.ctx.font = '30px Arial';
            game.ctx.textAlign = 'center';
            game.ctx.fillText('游戏暂停', game.width / 2, game.height / 2);
        }
    }
}

// 重置游戏
function resetGame() {
    game.isPlaying = false;
    game.isPaused = false;
    game.score = 0;
    game.level = 1;
    game.speed = 150;
    pauseBtn.textContent = '暂停';
    
    if (game.gameLoop) {
        clearInterval(game.gameLoop);
    }
    
    resetSnake();
    generateFood();
    drawGame();
}

// 绑定事件监听器
function bindEvents() {
    // 按钮事件
    startBtn.addEventListener('click', startGame);
    pauseBtn.addEventListener('click', pauseGame);
    resetBtn.addEventListener('click', resetGame);
    
    // 键盘事件
    document.addEventListener('keydown', handleKeyPress);
}

// 处理键盘事件
function handleKeyPress(event) {
    switch (event.key) {
        case 'ArrowUp':
            // 允许同方向或垂直方向切换，禁止直接反向
            if (game.direction !== 'down') {
                game.nextDirection = 'up';
            }
            break;
        case 'ArrowDown':
            if (game.direction !== 'up') {
                game.nextDirection = 'down';
            }
            break;
        case 'ArrowLeft':
            if (game.direction !== 'right') {
                game.nextDirection = 'left';
            }
            break;
        case 'ArrowRight':
            if (game.direction !== 'left') {
                game.nextDirection = 'right';
            }
            break;
        case ' ': // 空格键暂停/继续
            event.preventDefault();
            pauseGame();
            break;
        case 'Enter': // 回车键开始/重新开始
            event.preventDefault();
            if (!game.isPlaying) {
                resetGame();
                startGame();
            }
            break;
    }
}

// 页面加载完成后初始化游戏
window.addEventListener('DOMContentLoaded', initGame);