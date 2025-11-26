// Ultimate Gaming Hub - Game Collection
// Performance optimized with requestAnimationFrame and efficient rendering

// Global state
let currentGame = null;
let gameLoop = null;
let score = 0;

// Modal functions
function openGame(gameName) {
    const modal = document.getElementById('game-modal');
    const title = document.getElementById('modal-title');
    const canvas = document.getElementById('game-canvas');
    const container = document.getElementById('game-container');
    const instructions = document.getElementById('game-instructions');
    
    // Reset
    score = 0;
    updateScore();
    canvas.style.display = 'block';
    container.innerHTML = '';
    
    // Set game title and instructions
    const gameInfo = {
        snake: { title: 'Snake', instructions: 'Arrow keys or WASD to move. Eat food to grow!' },
        pong: { title: 'Pong', instructions: 'W/S or Up/Down to move paddle' },
        breakout: { title: 'Breakout', instructions: 'Left/Right arrows or A/D to move paddle' },
        flappy: { title: 'Flappy Bird', instructions: 'Space or Click to flap' },
        spaceinvaders: { title: 'Space Invaders', instructions: 'Arrow keys to move, Space to shoot' },
        asteroids: { title: 'Asteroids', instructions: 'Arrows to move/rotate, Space to shoot' },
        tetris: { title: 'Tetris', instructions: 'Arrow keys to move, Up to rotate' },
        memory: { title: 'Memory Match', instructions: 'Click cards to find matching pairs' },
        '2048': { title: '2048', instructions: 'Arrow keys to slide tiles' },
        runner: { title: 'Endless Runner', instructions: 'Space or Up arrow to jump' },
        shooter: { title: 'Target Shooter', instructions: 'Click targets to shoot!' },
        platformer: { title: 'Platformer', instructions: 'Arrow keys to move, Space to jump' },
        minesweeper: { title: 'Minesweeper', instructions: 'Left click to reveal, right click to flag mines' },
        tictactoe: { title: 'Tic-Tac-Toe', instructions: 'Click to place X, try to beat the AI!' },
        connectfour: { title: 'Connect Four', instructions: 'Click column to drop piece, connect 4 to win!' },
        whackamole: { title: 'Whack-a-Mole', instructions: 'Click the moles before they hide!' },
        dinorunner: { title: 'Dino Runner', instructions: 'Space to jump, Down to duck' },
        simonsays: { title: 'Simon Says', instructions: 'Watch the pattern and repeat it!' }
    };
    
    const info = gameInfo[gameName] || { title: 'Game', instructions: 'Have fun!' };
    title.textContent = info.title;
    instructions.textContent = info.instructions;
    
    modal.classList.add('active');
    currentGame = gameName;
    
    // Start the game
    startGame(gameName, canvas, container);
}

function closeGame() {
    const modal = document.getElementById('game-modal');
    modal.classList.remove('active');
    
    if (gameLoop) {
        cancelAnimationFrame(gameLoop);
        gameLoop = null;
    }
    currentGame = null;
}

function updateScore() {
    document.getElementById('game-score').textContent = 'Score: ' + score;
}

function startGame(gameName, canvas, container) {
    const ctx = canvas.getContext('2d');
    canvas.width = 800;
    canvas.height = 600;
    
    switch(gameName) {
        case 'snake': startSnake(ctx, canvas); break;
        case 'pong': startPong(ctx, canvas); break;
        case 'breakout': startBreakout(ctx, canvas); break;
        case 'flappy': startFlappy(ctx, canvas); break;
        case 'spaceinvaders': startSpaceInvaders(ctx, canvas); break;
        case 'asteroids': startAsteroids(ctx, canvas); break;
        case 'tetris': startTetris(ctx, canvas); break;
        case 'memory': startMemory(canvas, container); break;
        case '2048': start2048(canvas, container); break;
        case 'runner': startRunner(ctx, canvas); break;
        case 'shooter': startShooter(ctx, canvas); break;
        case 'platformer': startPlatformer(ctx, canvas); break;
        case 'minesweeper': startMinesweeper(canvas, container); break;
        case 'tictactoe': startTicTacToe(canvas, container); break;
        case 'connectfour': startConnectFour(canvas, container); break;
        case 'whackamole': startWhackAMole(ctx, canvas); break;
        case 'dinorunner': startDinoRunner(ctx, canvas); break;
        case 'simonsays': startSimonSays(canvas, container); break;
    }
}


// ==================== SNAKE GAME ====================
function startSnake(ctx, canvas) {
    const gridSize = 20;
    const tileCount = canvas.width / gridSize;
    let snake = [{x: 10, y: 10}];
    let food = {x: 15, y: 15};
    let dx = 0, dy = 0;
    let lastTime = 0;
    const gameSpeed = 100;
    
    function placeFood() {
        food.x = Math.floor(Math.random() * (canvas.width / gridSize));
        food.y = Math.floor(Math.random() * (canvas.height / gridSize));
    }
    
    function handleKey(e) {
        if (currentGame !== 'snake') return;
        switch(e.key.toLowerCase()) {
            case 'arrowup': case 'w': if (dy !== 1) { dx = 0; dy = -1; } break;
            case 'arrowdown': case 's': if (dy !== -1) { dx = 0; dy = 1; } break;
            case 'arrowleft': case 'a': if (dx !== 1) { dx = -1; dy = 0; } break;
            case 'arrowright': case 'd': if (dx !== -1) { dx = 1; dy = 0; } break;
        }
    }
    
    document.addEventListener('keydown', handleKey);
    
    function update(timestamp) {
        if (currentGame !== 'snake') return;
        
        if (timestamp - lastTime > gameSpeed) {
            lastTime = timestamp;
            
            if (dx !== 0 || dy !== 0) {
                const head = {x: snake[0].x + dx, y: snake[0].y + dy};
                
                // Wall collision
                if (head.x < 0 || head.x >= canvas.width/gridSize || 
                    head.y < 0 || head.y >= canvas.height/gridSize) {
                    snake = [{x: 10, y: 10}];
                    dx = 0; dy = 0;
                    score = 0;
                    updateScore();
                    placeFood();
                } else {
                    snake.unshift(head);
                    
                    if (head.x === food.x && head.y === food.y) {
                        score += 10;
                        updateScore();
                        placeFood();
                    } else {
                        snake.pop();
                    }
                    
                    // Self collision
                    for (let i = 1; i < snake.length; i++) {
                        if (head.x === snake[i].x && head.y === snake[i].y) {
                            snake = [{x: 10, y: 10}];
                            dx = 0; dy = 0;
                            score = 0;
                            updateScore();
                            placeFood();
                            break;
                        }
                    }
                }
            }
        }
        
        // Draw
        ctx.fillStyle = '#000';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Draw grid
        ctx.strokeStyle = '#111';
        for (let i = 0; i < canvas.width; i += gridSize) {
            ctx.beginPath();
            ctx.moveTo(i, 0);
            ctx.lineTo(i, canvas.height);
            ctx.stroke();
        }
        for (let i = 0; i < canvas.height; i += gridSize) {
            ctx.beginPath();
            ctx.moveTo(0, i);
            ctx.lineTo(canvas.width, i);
            ctx.stroke();
        }
        
        // Draw food
        ctx.fillStyle = '#ff0055';
        ctx.beginPath();
        ctx.arc(food.x * gridSize + gridSize/2, food.y * gridSize + gridSize/2, gridSize/2 - 2, 0, Math.PI * 2);
        ctx.fill();
        
        // Draw snake
        snake.forEach((segment, index) => {
            const gradient = ctx.createRadialGradient(
                segment.x * gridSize + gridSize/2, segment.y * gridSize + gridSize/2, 0,
                segment.x * gridSize + gridSize/2, segment.y * gridSize + gridSize/2, gridSize/2
            );
            gradient.addColorStop(0, index === 0 ? '#00ff88' : '#00cc66');
            gradient.addColorStop(1, index === 0 ? '#00cc66' : '#009944');
            ctx.fillStyle = gradient;
            ctx.fillRect(segment.x * gridSize + 1, segment.y * gridSize + 1, gridSize - 2, gridSize - 2);
        });
        
        gameLoop = requestAnimationFrame(update);
    }
    
    gameLoop = requestAnimationFrame(update);
}

// ==================== PONG GAME ====================
function startPong(ctx, canvas) {
    const paddleHeight = 100;
    const paddleWidth = 15;
    let playerY = canvas.height / 2 - paddleHeight / 2;
    let aiY = canvas.height / 2 - paddleHeight / 2;
    let ballX = canvas.width / 2;
    let ballY = canvas.height / 2;
    let ballSpeedX = 5;
    let ballSpeedY = 3;
    const ballSize = 10;
    
    function handleKey(e) {
        if (currentGame !== 'pong') return;
        switch(e.key.toLowerCase()) {
            case 'arrowup': case 'w': playerY = Math.max(0, playerY - 30); break;
            case 'arrowdown': case 's': playerY = Math.min(canvas.height - paddleHeight, playerY + 30); break;
        }
    }
    
    document.addEventListener('keydown', handleKey);
    
    function update() {
        if (currentGame !== 'pong') return;
        
        // Move ball
        ballX += ballSpeedX;
        ballY += ballSpeedY;
        
        // Ball collision with top/bottom
        if (ballY <= 0 || ballY >= canvas.height - ballSize) {
            ballSpeedY = -ballSpeedY;
        }
        
        // Ball collision with paddles
        if (ballX <= paddleWidth + 20 && ballY >= playerY && ballY <= playerY + paddleHeight) {
            ballSpeedX = Math.abs(ballSpeedX) * 1.05;
            score += 1;
            updateScore();
        }
        
        if (ballX >= canvas.width - paddleWidth - 30 && ballY >= aiY && ballY <= aiY + paddleHeight) {
            ballSpeedX = -Math.abs(ballSpeedX) * 1.05;
        }
        
        // Ball out of bounds
        if (ballX < 0 || ballX > canvas.width) {
            ballX = canvas.width / 2;
            ballY = canvas.height / 2;
            ballSpeedX = 5 * (ballX < 0 ? 1 : -1);
            ballSpeedY = 3;
        }
        
        // AI movement
        const aiCenter = aiY + paddleHeight / 2;
        if (aiCenter < ballY - 30) aiY += 4;
        if (aiCenter > ballY + 30) aiY -= 4;
        
        // Draw
        ctx.fillStyle = '#000';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Center line
        ctx.strokeStyle = '#333';
        ctx.setLineDash([10, 10]);
        ctx.beginPath();
        ctx.moveTo(canvas.width / 2, 0);
        ctx.lineTo(canvas.width / 2, canvas.height);
        ctx.stroke();
        ctx.setLineDash([]);
        
        // Paddles
        ctx.fillStyle = '#00ff88';
        ctx.fillRect(20, playerY, paddleWidth, paddleHeight);
        
        ctx.fillStyle = '#ff00ff';
        ctx.fillRect(canvas.width - paddleWidth - 20, aiY, paddleWidth, paddleHeight);
        
        // Ball
        ctx.fillStyle = '#fff';
        ctx.beginPath();
        ctx.arc(ballX, ballY, ballSize, 0, Math.PI * 2);
        ctx.fill();
        
        gameLoop = requestAnimationFrame(update);
    }
    
    gameLoop = requestAnimationFrame(update);
}

// ==================== BREAKOUT GAME ====================
function startBreakout(ctx, canvas) {
    const paddleWidth = 120;
    const paddleHeight = 15;
    let paddleX = (canvas.width - paddleWidth) / 2;
    let ballX = canvas.width / 2;
    let ballY = canvas.height - 50;
    let ballSpeedX = 4;
    let ballSpeedY = -4;
    const ballSize = 8;
    
    const rows = 5;
    const cols = 10;
    const brickWidth = 70;
    const brickHeight = 25;
    const brickPadding = 5;
    const brickOffsetTop = 50;
    const brickOffsetLeft = (canvas.width - (cols * (brickWidth + brickPadding))) / 2;
    
    const bricks = [];
    const colors = ['#ff0055', '#ff6600', '#ffcc00', '#00ff88', '#00d4ff'];
    
    for (let r = 0; r < rows; r++) {
        bricks[r] = [];
        for (let c = 0; c < cols; c++) {
            bricks[r][c] = { x: 0, y: 0, alive: true, color: colors[r] };
        }
    }
    
    function handleKey(e) {
        if (currentGame !== 'breakout') return;
        switch(e.key.toLowerCase()) {
            case 'arrowleft': case 'a': paddleX = Math.max(0, paddleX - 30); break;
            case 'arrowright': case 'd': paddleX = Math.min(canvas.width - paddleWidth, paddleX + 30); break;
        }
    }
    
    document.addEventListener('keydown', handleKey);
    
    function update() {
        if (currentGame !== 'breakout') return;
        
        ballX += ballSpeedX;
        ballY += ballSpeedY;
        
        // Wall collisions
        if (ballX <= ballSize || ballX >= canvas.width - ballSize) ballSpeedX = -ballSpeedX;
        if (ballY <= ballSize) ballSpeedY = -ballSpeedY;
        
        // Paddle collision
        if (ballY >= canvas.height - paddleHeight - 30 && 
            ballX >= paddleX && ballX <= paddleX + paddleWidth) {
            ballSpeedY = -Math.abs(ballSpeedY);
            const hitPos = (ballX - paddleX) / paddleWidth;
            ballSpeedX = 8 * (hitPos - 0.5);
        }
        
        // Ball out
        if (ballY > canvas.height) {
            ballX = canvas.width / 2;
            ballY = canvas.height - 50;
            ballSpeedX = 4;
            ballSpeedY = -4;
        }
        
        // Brick collisions
        for (let r = 0; r < rows; r++) {
            for (let c = 0; c < cols; c++) {
                const brick = bricks[r][c];
                if (brick.alive) {
                    brick.x = brickOffsetLeft + c * (brickWidth + brickPadding);
                    brick.y = brickOffsetTop + r * (brickHeight + brickPadding);
                    
                    if (ballX >= brick.x && ballX <= brick.x + brickWidth &&
                        ballY >= brick.y && ballY <= brick.y + brickHeight) {
                        ballSpeedY = -ballSpeedY;
                        brick.alive = false;
                        score += 10;
                        updateScore();
                    }
                }
            }
        }
        
        // Draw
        ctx.fillStyle = '#000';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Draw bricks
        for (let r = 0; r < rows; r++) {
            for (let c = 0; c < cols; c++) {
                const brick = bricks[r][c];
                if (brick.alive) {
                    ctx.fillStyle = brick.color;
                    ctx.fillRect(brick.x, brick.y, brickWidth, brickHeight);
                    ctx.strokeStyle = '#fff';
                    ctx.strokeRect(brick.x, brick.y, brickWidth, brickHeight);
                }
            }
        }
        
        // Draw paddle
        const gradient = ctx.createLinearGradient(paddleX, 0, paddleX + paddleWidth, 0);
        gradient.addColorStop(0, '#00ff88');
        gradient.addColorStop(1, '#00d4ff');
        ctx.fillStyle = gradient;
        ctx.fillRect(paddleX, canvas.height - paddleHeight - 20, paddleWidth, paddleHeight);
        
        // Draw ball
        ctx.fillStyle = '#fff';
        ctx.beginPath();
        ctx.arc(ballX, ballY, ballSize, 0, Math.PI * 2);
        ctx.fill();
        
        gameLoop = requestAnimationFrame(update);
    }
    
    gameLoop = requestAnimationFrame(update);
}


// ==================== FLAPPY BIRD ====================
function startFlappy(ctx, canvas) {
    let birdY = canvas.height / 2;
    let birdVelocity = 0;
    const gravity = 0.5;
    const jumpStrength = -10;
    const birdSize = 30;
    let pipes = [];
    let pipeTimer = 0;
    const pipeGap = 180;
    const pipeWidth = 60;
    
    function addPipe() {
        const gapY = Math.random() * (canvas.height - pipeGap - 100) + 50;
        pipes.push({
            x: canvas.width,
            gapY: gapY,
            passed: false
        });
    }
    
    function handleInput(e) {
        if (currentGame !== 'flappy') return;
        if (e.key === ' ' || e.type === 'click') {
            birdVelocity = jumpStrength;
        }
    }
    
    document.addEventListener('keydown', handleInput);
    canvas.addEventListener('click', handleInput);
    
    function update() {
        if (currentGame !== 'flappy') return;
        
        birdVelocity += gravity;
        birdY += birdVelocity;
        
        pipeTimer++;
        if (pipeTimer > 90) {
            addPipe();
            pipeTimer = 0;
        }
        
        pipes = pipes.filter(pipe => pipe.x > -pipeWidth);
        pipes.forEach(pipe => {
            pipe.x -= 4;
            
            const birdLeft = 100;
            const birdRight = 100 + birdSize;
            const birdTop = birdY;
            const birdBottom = birdY + birdSize;
            
            if (birdRight > pipe.x && birdLeft < pipe.x + pipeWidth) {
                if (birdTop < pipe.gapY || birdBottom > pipe.gapY + pipeGap) {
                    birdY = canvas.height / 2;
                    birdVelocity = 0;
                    pipes = [];
                    score = 0;
                    updateScore();
                }
            }
            
            if (!pipe.passed && pipe.x + pipeWidth < 100) {
                pipe.passed = true;
                score++;
                updateScore();
            }
        });
        
        if (birdY < 0 || birdY > canvas.height - birdSize) {
            birdY = canvas.height / 2;
            birdVelocity = 0;
            pipes = [];
            score = 0;
            updateScore();
        }
        
        const skyGradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
        skyGradient.addColorStop(0, '#1a1a2e');
        skyGradient.addColorStop(1, '#16213e');
        ctx.fillStyle = skyGradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        pipes.forEach(pipe => {
            const pipeGradient = ctx.createLinearGradient(pipe.x, 0, pipe.x + pipeWidth, 0);
            pipeGradient.addColorStop(0, '#00ff88');
            pipeGradient.addColorStop(1, '#00cc66');
            ctx.fillStyle = pipeGradient;
            ctx.fillRect(pipe.x, 0, pipeWidth, pipe.gapY);
            ctx.fillRect(pipe.x, pipe.gapY + pipeGap, pipeWidth, canvas.height - pipe.gapY - pipeGap);
        });
        
        ctx.fillStyle = '#ffcc00';
        ctx.beginPath();
        ctx.arc(100 + birdSize/2, birdY + birdSize/2, birdSize/2, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.fillStyle = '#000';
        ctx.beginPath();
        ctx.arc(100 + birdSize/2 + 5, birdY + birdSize/2 - 5, 4, 0, Math.PI * 2);
        ctx.fill();
        
        gameLoop = requestAnimationFrame(update);
    }
    
    gameLoop = requestAnimationFrame(update);
}


// ==================== SPACE INVADERS ====================
function startSpaceInvaders(ctx, canvas) {
    let playerX = canvas.width / 2 - 25;
    const playerY = canvas.height - 60;
    const playerWidth = 50;
    const playerHeight = 30;
    let bullets = [];
    let enemies = [];
    let enemyDirection = 1;
    let enemySpeed = 1;
    
    for (let r = 0; r < 4; r++) {
        for (let c = 0; c < 8; c++) {
            enemies.push({
                x: 100 + c * 70,
                y: 50 + r * 50,
                alive: true
            });
        }
    }
    
    function handleKey(e) {
        if (currentGame !== 'spaceinvaders') return;
        switch(e.key.toLowerCase()) {
            case 'arrowleft': case 'a': playerX = Math.max(0, playerX - 20); break;
            case 'arrowright': case 'd': playerX = Math.min(canvas.width - playerWidth, playerX + 20); break;
            case ' ': bullets.push({ x: playerX + playerWidth/2, y: playerY, speed: 8 }); break;
        }
    }
    
    document.addEventListener('keydown', handleKey);
    
    function update() {
        if (currentGame !== 'spaceinvaders') return;
        
        bullets = bullets.filter(b => b.y > 0);
        bullets.forEach(b => b.y -= b.speed);
        
        let moveDown = false;
        enemies.forEach(e => {
            if (e.alive) {
                e.x += enemySpeed * enemyDirection;
                if (e.x <= 0 || e.x >= canvas.width - 40) moveDown = true;
            }
        });
        
        if (moveDown) {
            enemyDirection *= -1;
            enemies.forEach(e => { if (e.alive) e.y += 20; });
        }
        
        bullets.forEach(bullet => {
            enemies.forEach(enemy => {
                if (enemy.alive && 
                    bullet.x >= enemy.x && bullet.x <= enemy.x + 40 &&
                    bullet.y >= enemy.y && bullet.y <= enemy.y + 30) {
                    enemy.alive = false;
                    bullet.y = -100;
                    score += 10;
                    updateScore();
                }
            });
        });
        
        ctx.fillStyle = '#000';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        ctx.fillStyle = '#fff';
        for (let i = 0; i < 50; i++) {
            ctx.fillRect((i * 37) % canvas.width, (i * 73) % canvas.height, 2, 2);
        }
        
        ctx.fillStyle = '#00ff88';
        ctx.beginPath();
        ctx.moveTo(playerX + playerWidth/2, playerY);
        ctx.lineTo(playerX, playerY + playerHeight);
        ctx.lineTo(playerX + playerWidth, playerY + playerHeight);
        ctx.closePath();
        ctx.fill();
        
        ctx.fillStyle = '#ffcc00';
        bullets.forEach(b => {
            ctx.fillRect(b.x - 2, b.y, 4, 15);
        });
        
        enemies.forEach(e => {
            if (e.alive) {
                ctx.fillStyle = '#ff00ff';
                ctx.fillRect(e.x, e.y, 40, 30);
                ctx.fillStyle = '#fff';
                ctx.fillRect(e.x + 8, e.y + 8, 8, 8);
                ctx.fillRect(e.x + 24, e.y + 8, 8, 8);
            }
        });
        
        gameLoop = requestAnimationFrame(update);
    }
    
    gameLoop = requestAnimationFrame(update);
}


// ==================== ASTEROIDS ====================
function startAsteroids(ctx, canvas) {
    let ship = {
        x: canvas.width / 2,
        y: canvas.height / 2,
        angle: -Math.PI / 2,
        velocity: { x: 0, y: 0 }
    };
    let bullets = [];
    let asteroids = [];
    const keys = {};
    
    for (let i = 0; i < 5; i++) {
        asteroids.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            vx: (Math.random() - 0.5) * 3,
            vy: (Math.random() - 0.5) * 3,
            size: 40
        });
    }
    
    function handleKeyDown(e) {
        if (currentGame !== 'asteroids') return;
        keys[e.key.toLowerCase()] = true;
        if (e.key === ' ') {
            bullets.push({
                x: ship.x + Math.cos(ship.angle) * 20,
                y: ship.y + Math.sin(ship.angle) * 20,
                vx: Math.cos(ship.angle) * 8,
                vy: Math.sin(ship.angle) * 8
            });
        }
    }
    
    function handleKeyUp(e) {
        keys[e.key.toLowerCase()] = false;
    }
    
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('keyup', handleKeyUp);
    
    function update() {
        if (currentGame !== 'asteroids') return;
        
        if (keys['arrowleft'] || keys['a']) ship.angle -= 0.1;
        if (keys['arrowright'] || keys['d']) ship.angle += 0.1;
        if (keys['arrowup'] || keys['w']) {
            ship.velocity.x += Math.cos(ship.angle) * 0.2;
            ship.velocity.y += Math.sin(ship.angle) * 0.2;
        }
        
        ship.x += ship.velocity.x;
        ship.y += ship.velocity.y;
        
        if (ship.x < 0) ship.x = canvas.width;
        if (ship.x > canvas.width) ship.x = 0;
        if (ship.y < 0) ship.y = canvas.height;
        if (ship.y > canvas.height) ship.y = 0;
        
        ship.velocity.x *= 0.99;
        ship.velocity.y *= 0.99;
        
        bullets = bullets.filter(b => b.x >= 0 && b.x <= canvas.width && b.y >= 0 && b.y <= canvas.height);
        bullets.forEach(b => {
            b.x += b.vx;
            b.y += b.vy;
        });
        
        asteroids.forEach(a => {
            a.x += a.vx;
            a.y += a.vy;
            if (a.x < 0) a.x = canvas.width;
            if (a.x > canvas.width) a.x = 0;
            if (a.y < 0) a.y = canvas.height;
            if (a.y > canvas.height) a.y = 0;
        });
        
        bullets.forEach((b, bi) => {
            asteroids.forEach((a, ai) => {
                const dx = b.x - a.x;
                const dy = b.y - a.y;
                const dist = Math.sqrt(dx*dx + dy*dy);
                if (dist < a.size) {
                    bullets.splice(bi, 1);
                    if (a.size > 15) {
                        asteroids.push({x: a.x, y: a.y, vx: a.vx + 1, vy: a.vy + 1, size: a.size/2});
                        asteroids.push({x: a.x, y: a.y, vx: a.vx - 1, vy: a.vy - 1, size: a.size/2});
                    }
                    asteroids.splice(ai, 1);
                    score += 10;
                    updateScore();
                }
            });
        });
        
        ctx.fillStyle = '#000';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        ctx.save();
        ctx.translate(ship.x, ship.y);
        ctx.rotate(ship.angle);
        ctx.strokeStyle = '#00ff88';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(20, 0);
        ctx.lineTo(-15, 12);
        ctx.lineTo(-10, 0);
        ctx.lineTo(-15, -12);
        ctx.closePath();
        ctx.stroke();
        ctx.restore();
        
        ctx.fillStyle = '#ffcc00';
        bullets.forEach(b => {
            ctx.beginPath();
            ctx.arc(b.x, b.y, 3, 0, Math.PI * 2);
            ctx.fill();
        });
        
        ctx.strokeStyle = '#888';
        ctx.lineWidth = 2;
        asteroids.forEach(a => {
            ctx.beginPath();
            ctx.arc(a.x, a.y, a.size, 0, Math.PI * 2);
            ctx.stroke();
        });
        
        gameLoop = requestAnimationFrame(update);
    }
    
    gameLoop = requestAnimationFrame(update);
}


// ==================== TETRIS ====================
function startTetris(ctx, canvas) {
    const cols = 10;
    const rows = 20;
    const blockSize = 28;
    const offsetX = (canvas.width - cols * blockSize) / 2;
    const offsetY = 20;
    
    const shapes = [
        [[1,1,1,1]],
        [[1,1],[1,1]],
        [[0,1,0],[1,1,1]],
        [[1,0,0],[1,1,1]],
        [[0,0,1],[1,1,1]],
        [[0,1,1],[1,1,0]],
        [[1,1,0],[0,1,1]]
    ];
    const colors = ['#00d4ff', '#ffcc00', '#ff00ff', '#ff6600', '#0066ff', '#00ff88', '#ff0055'];
    
    let board = Array(rows).fill().map(() => Array(cols).fill(0));
    let current = null;
    let currentX = 0;
    let currentY = 0;
    let currentColor = 0;
    let lastDrop = 0;
    let dropSpeed = 500;
    
    function newPiece() {
        currentColor = Math.floor(Math.random() * shapes.length);
        current = shapes[currentColor].map(row => [...row]);
        currentX = Math.floor(cols / 2) - Math.floor(current[0].length / 2);
        currentY = 0;
    }
    
    function canMove(dx, dy, piece) {
        piece = piece || current;
        for (let y = 0; y < piece.length; y++) {
            for (let x = 0; x < piece[y].length; x++) {
                if (piece[y][x]) {
                    const newX = currentX + x + dx;
                    const newY = currentY + y + dy;
                    if (newX < 0 || newX >= cols || newY >= rows) return false;
                    if (newY >= 0 && board[newY][newX]) return false;
                }
            }
        }
        return true;
    }
    
    function rotate() {
        const rotated = current[0].map((_, i) => current.map(row => row[i]).reverse());
        if (canMove(0, 0, rotated)) current = rotated;
    }
    
    function merge() {
        for (let y = 0; y < current.length; y++) {
            for (let x = 0; x < current[y].length; x++) {
                if (current[y][x] && currentY + y >= 0) {
                    board[currentY + y][currentX + x] = currentColor + 1;
                }
            }
        }
    }
    
    function clearLines() {
        let lines = 0;
        for (let y = rows - 1; y >= 0; y--) {
            if (board[y].every(cell => cell)) {
                board.splice(y, 1);
                board.unshift(Array(cols).fill(0));
                lines++;
                y++;
            }
        }
        if (lines > 0) {
            score += lines * 100;
            updateScore();
        }
    }
    
    newPiece();
    
    function handleKey(e) {
        if (currentGame !== 'tetris') return;
        switch(e.key.toLowerCase()) {
            case 'arrowleft': case 'a': if (canMove(-1, 0)) currentX--; break;
            case 'arrowright': case 'd': if (canMove(1, 0)) currentX++; break;
            case 'arrowdown': case 's': if (canMove(0, 1)) currentY++; break;
            case 'arrowup': case 'w': rotate(); break;
            case ' ': while (canMove(0, 1)) currentY++; break;
        }
    }
    
    document.addEventListener('keydown', handleKey);
    
    function update(timestamp) {
        if (currentGame !== 'tetris') return;
        
        if (timestamp - lastDrop > dropSpeed) {
            lastDrop = timestamp;
            if (canMove(0, 1)) {
                currentY++;
            } else {
                merge();
                clearLines();
                newPiece();
                if (!canMove(0, 0)) {
                    board = Array(rows).fill().map(() => Array(cols).fill(0));
                    score = 0;
                    updateScore();
                }
            }
        }
        
        ctx.fillStyle = '#000';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        ctx.strokeStyle = '#222';
        for (let y = 0; y < rows; y++) {
            for (let x = 0; x < cols; x++) {
                ctx.strokeRect(offsetX + x * blockSize, offsetY + y * blockSize, blockSize, blockSize);
                if (board[y][x]) {
                    ctx.fillStyle = colors[board[y][x] - 1];
                    ctx.fillRect(offsetX + x * blockSize + 1, offsetY + y * blockSize + 1, blockSize - 2, blockSize - 2);
                }
            }
        }
        
        ctx.fillStyle = colors[currentColor];
        for (let y = 0; y < current.length; y++) {
            for (let x = 0; x < current[y].length; x++) {
                if (current[y][x]) {
                    ctx.fillRect(
                        offsetX + (currentX + x) * blockSize + 1,
                        offsetY + (currentY + y) * blockSize + 1,
                        blockSize - 2, blockSize - 2
                    );
                }
            }
        }
        
        gameLoop = requestAnimationFrame(update);
    }
    
    gameLoop = requestAnimationFrame(update);
}


// ==================== MEMORY MATCH ====================
function startMemory(canvas, container) {
    canvas.style.display = 'none';
    
    const emojis = ['🎮', '🎯', '🏆', '⭐', '🎲', '🎪', '🎨', '🎵'];
    const cards = [...emojis, ...emojis].sort(() => Math.random() - 0.5);
    
    let flipped = [];
    let matched = [];
    let canFlip = true;
    
    const grid = document.createElement('div');
    grid.style.cssText = 'display:grid;grid-template-columns:repeat(4,80px);gap:10px;justify-content:center;';
    
    cards.forEach((emoji, index) => {
        const card = document.createElement('div');
        card.style.cssText = 'width:80px;height:80px;background:#1a1a2e;border:2px solid #00ff88;border-radius:10px;display:flex;align-items:center;justify-content:center;font-size:2rem;cursor:pointer;transition:all 0.3s;';
        card.dataset.index = index;
        card.dataset.emoji = emoji;
        card.textContent = '?';
        
        card.addEventListener('click', () => {
            if (!canFlip || flipped.includes(index) || matched.includes(index)) return;
            
            card.textContent = emoji;
            card.style.background = '#252545';
            flipped.push(index);
            
            if (flipped.length === 2) {
                canFlip = false;
                const [i1, i2] = flipped;
                const cards = grid.children;
                
                if (cards[i1].dataset.emoji === cards[i2].dataset.emoji) {
                    matched.push(i1, i2);
                    score += 10;
                    updateScore();
                    flipped = [];
                    canFlip = true;
                    
                    if (matched.length === cards.length) {
                        score += 50;
                        updateScore();
                    }
                } else {
                    setTimeout(() => {
                        cards[i1].textContent = '?';
                        cards[i2].textContent = '?';
                        cards[i1].style.background = '#1a1a2e';
                        cards[i2].style.background = '#1a1a2e';
                        flipped = [];
                        canFlip = true;
                    }, 1000);
                }
            }
        });
        
        grid.appendChild(card);
    });
    
    container.appendChild(grid);
}

// ==================== 2048 ====================
function start2048(canvas, container) {
    canvas.style.display = 'none';
    
    let grid = [[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0]];
    
    function addTile() {
        const empty = [];
        for (let r = 0; r < 4; r++) {
            for (let c = 0; c < 4; c++) {
                if (!grid[r][c]) empty.push({r, c});
            }
        }
        if (empty.length) {
            const {r, c} = empty[Math.floor(Math.random() * empty.length)];
            grid[r][c] = Math.random() < 0.9 ? 2 : 4;
        }
    }
    
    function move(direction) {
        let moved = false;
        const rotateGrid = (times) => {
            for (let i = 0; i < times; i++) {
                grid = grid[0].map((_, i) => grid.map(row => row[i]).reverse());
            }
        };
        
        if (direction === 'right') rotateGrid(2);
        else if (direction === 'up') rotateGrid(1);
        else if (direction === 'down') rotateGrid(3);
        
        for (let r = 0; r < 4; r++) {
            let row = grid[r].filter(x => x);
            for (let i = 0; i < row.length - 1; i++) {
                if (row[i] === row[i + 1]) {
                    row[i] *= 2;
                    score += row[i];
                    row.splice(i + 1, 1);
                }
            }
            while (row.length < 4) row.push(0);
            if (grid[r].join(',') !== row.join(',')) moved = true;
            grid[r] = row;
        }
        
        if (direction === 'right') rotateGrid(2);
        else if (direction === 'up') rotateGrid(3);
        else if (direction === 'down') rotateGrid(1);
        
        if (moved) {
            addTile();
            updateScore();
            render();
        }
    }
    
    const colors = {
        0: '#cdc1b4', 2: '#eee4da', 4: '#ede0c8', 8: '#f2b179',
        16: '#f59563', 32: '#f67c5f', 64: '#f65e3b', 128: '#edcf72',
        256: '#edcc61', 512: '#edc850', 1024: '#edc53f', 2048: '#edc22e'
    };
    
    const gameDiv = document.createElement('div');
    gameDiv.style.cssText = 'display:grid;grid-template-columns:repeat(4,70px);gap:8px;padding:15px;background:#bbada0;border-radius:10px;';
    
    function render() {
        gameDiv.innerHTML = '';
        for (let r = 0; r < 4; r++) {
            for (let c = 0; c < 4; c++) {
                const tile = document.createElement('div');
                const val = grid[r][c];
                tile.style.cssText = 'width:70px;height:70px;display:flex;align-items:center;justify-content:center;border-radius:5px;font-family:Orbitron,sans-serif;font-weight:700;font-size:' + (val > 512 ? '1rem' : '1.5rem') + ';background:' + (colors[val] || '#3c3a32') + ';color:' + (val > 4 ? '#f9f6f2' : '#776e65') + ';';
                tile.textContent = val || '';
                gameDiv.appendChild(tile);
            }
        }
    }
    
    function handleKey(e) {
        if (currentGame !== '2048') return;
        switch(e.key) {
            case 'ArrowLeft': move('left'); break;
            case 'ArrowRight': move('right'); break;
            case 'ArrowUp': move('up'); break;
            case 'ArrowDown': move('down'); break;
        }
    }
    
    document.addEventListener('keydown', handleKey);
    
    addTile();
    addTile();
    render();
    container.appendChild(gameDiv);
}


// ==================== ENDLESS RUNNER ====================
function startRunner(ctx, canvas) {
    let playerY = canvas.height - 100;
    let playerVelocity = 0;
    const gravity = 0.8;
    const jumpStrength = -15;
    let isJumping = false;
    let obstacles = [];
    let obstacleTimer = 0;
    let gameSpeed = 6;
    
    function handleInput(e) {
        if (currentGame !== 'runner') return;
        if ((e.key === ' ' || e.key === 'ArrowUp' || e.type === 'click') && !isJumping) {
            playerVelocity = jumpStrength;
            isJumping = true;
        }
    }
    
    document.addEventListener('keydown', handleInput);
    canvas.addEventListener('click', handleInput);
    
    function update() {
        if (currentGame !== 'runner') return;
        
        playerVelocity += gravity;
        playerY += playerVelocity;
        
        if (playerY >= canvas.height - 100) {
            playerY = canvas.height - 100;
            playerVelocity = 0;
            isJumping = false;
        }
        
        obstacleTimer++;
        if (obstacleTimer > 80 + Math.random() * 40) {
            obstacles.push({
                x: canvas.width,
                width: 30 + Math.random() * 20,
                height: 40 + Math.random() * 30
            });
            obstacleTimer = 0;
        }
        
        obstacles = obstacles.filter(o => o.x > -50);
        obstacles.forEach(o => {
            o.x -= gameSpeed;
            
            if (o.x < 150 && o.x + o.width > 100 && playerY + 50 > canvas.height - 60 - o.height) {
                obstacles = [];
                playerY = canvas.height - 100;
                score = 0;
                updateScore();
            }
            
            if (o.x + o.width < 100 && !o.passed) {
                o.passed = true;
                score += 10;
                updateScore();
            }
        });
        
        ctx.fillStyle = '#1a1a2e';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        ctx.fillStyle = '#00ff88';
        ctx.fillRect(0, canvas.height - 60, canvas.width, 60);
        
        ctx.fillStyle = '#ff00ff';
        ctx.fillRect(100, playerY, 50, 50);
        
        ctx.fillStyle = '#ff0055';
        obstacles.forEach(o => {
            ctx.fillRect(o.x, canvas.height - 60 - o.height, o.width, o.height);
        });
        
        gameLoop = requestAnimationFrame(update);
    }
    
    gameLoop = requestAnimationFrame(update);
}

// ==================== TARGET SHOOTER ====================
function startShooter(ctx, canvas) {
    let targets = [];
    let targetTimer = 0;
    
    function spawnTarget() {
        targets.push({
            x: Math.random() * (canvas.width - 60) + 30,
            y: Math.random() * (canvas.height - 100) + 30,
            radius: 20 + Math.random() * 20,
            life: 100
        });
    }
    
    canvas.addEventListener('click', (e) => {
        if (currentGame !== 'shooter') return;
        
        const rect = canvas.getBoundingClientRect();
        const x = (e.clientX - rect.left) * (canvas.width / rect.width);
        const y = (e.clientY - rect.top) * (canvas.height / rect.height);
        
        targets.forEach((t, i) => {
            const dx = x - t.x;
            const dy = y - t.y;
            const dist = Math.sqrt(dx*dx + dy*dy);
            if (dist < t.radius) {
                score += Math.floor(30 / t.radius * 10);
                updateScore();
                targets.splice(i, 1);
            }
        });
    });
    
    function update() {
        if (currentGame !== 'shooter') return;
        
        targetTimer++;
        if (targetTimer > 40) {
            spawnTarget();
            targetTimer = 0;
        }
        
        targets.forEach(t => t.life--);
        targets = targets.filter(t => t.life > 0);
        
        ctx.fillStyle = '#1a1a2e';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        targets.forEach(t => {
            ctx.strokeStyle = 'rgba(255, 0, 85, ' + (t.life/100) + ')';
            ctx.lineWidth = 3;
            ctx.beginPath();
            ctx.arc(t.x, t.y, t.radius, 0, Math.PI * 2);
            ctx.stroke();
            
            ctx.fillStyle = 'rgba(255, 0, 85, ' + (t.life/100) + ')';
            ctx.beginPath();
            ctx.arc(t.x, t.y, t.radius * 0.5, 0, Math.PI * 2);
            ctx.fill();
            
            ctx.fillStyle = 'rgba(255, 255, 255, ' + (t.life/100) + ')';
            ctx.beginPath();
            ctx.arc(t.x, t.y, t.radius * 0.2, 0, Math.PI * 2);
            ctx.fill();
        });
        
        ctx.strokeStyle = '#00ff88';
        ctx.lineWidth = 2;
        
        gameLoop = requestAnimationFrame(update);
    }
    
    gameLoop = requestAnimationFrame(update);
}


// ==================== PLATFORMER ====================
function startPlatformer(ctx, canvas) {
    let player = {
        x: 100,
        y: canvas.height - 150,
        vx: 0,
        vy: 0,
        width: 40,
        height: 40,
        onGround: false
    };
    
    const platforms = [
        { x: 0, y: canvas.height - 40, width: canvas.width, height: 40 },
        { x: 150, y: canvas.height - 140, width: 150, height: 20 },
        { x: 400, y: canvas.height - 200, width: 150, height: 20 },
        { x: 600, y: canvas.height - 280, width: 150, height: 20 },
        { x: 250, y: canvas.height - 340, width: 150, height: 20 }
    ];
    
    let coins = [
        { x: 200, y: canvas.height - 180, collected: false },
        { x: 450, y: canvas.height - 240, collected: false },
        { x: 650, y: canvas.height - 320, collected: false },
        { x: 300, y: canvas.height - 380, collected: false }
    ];
    
    const keys = {};
    
    function handleKeyDown(e) {
        if (currentGame !== 'platformer') return;
        keys[e.key.toLowerCase()] = true;
        if ((e.key === ' ' || e.key === 'ArrowUp') && player.onGround) {
            player.vy = -15;
            player.onGround = false;
        }
    }
    
    function handleKeyUp(e) {
        keys[e.key.toLowerCase()] = false;
    }
    
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('keyup', handleKeyUp);
    
    function update() {
        if (currentGame !== 'platformer') return;
        
        if (keys['arrowleft'] || keys['a']) player.vx = -5;
        else if (keys['arrowright'] || keys['d']) player.vx = 5;
        else player.vx *= 0.8;
        
        player.vy += 0.6;
        
        player.x += player.vx;
        player.y += player.vy;
        
        player.onGround = false;
        platforms.forEach(p => {
            if (player.x + player.width > p.x && player.x < p.x + p.width &&
                player.y + player.height > p.y && player.y + player.height < p.y + p.height + 10 &&
                player.vy >= 0) {
                player.y = p.y - player.height;
                player.vy = 0;
                player.onGround = true;
            }
        });
        
        if (player.x < 0) player.x = 0;
        if (player.x > canvas.width - player.width) player.x = canvas.width - player.width;
        if (player.y > canvas.height) {
            player.x = 100;
            player.y = canvas.height - 150;
            player.vx = 0;
            player.vy = 0;
        }
        
        coins.forEach(c => {
            if (!c.collected) {
                const dx = (player.x + player.width/2) - c.x;
                const dy = (player.y + player.height/2) - c.y;
                if (Math.sqrt(dx*dx + dy*dy) < 30) {
                    c.collected = true;
                    score += 20;
                    updateScore();
                }
            }
        });
        
        ctx.fillStyle = '#1a1a2e';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        ctx.fillStyle = '#00ff88';
        platforms.forEach(p => {
            ctx.fillRect(p.x, p.y, p.width, p.height);
        });
        
        ctx.fillStyle = '#ffcc00';
        coins.forEach(c => {
            if (!c.collected) {
                ctx.beginPath();
                ctx.arc(c.x, c.y, 15, 0, Math.PI * 2);
                ctx.fill();
            }
        });
        
        ctx.fillStyle = '#ff00ff';
        ctx.fillRect(player.x, player.y, player.width, player.height);
        
        gameLoop = requestAnimationFrame(update);
    }
    
    gameLoop = requestAnimationFrame(update);
}


// ==================== MINESWEEPER ====================
function startMinesweeper(canvas, container) {
    canvas.style.display = 'none';
    
    const rows = 10;
    const cols = 10;
    const mineCount = 15;
    let grid = [];
    let revealed = [];
    let flagged = [];
    let gameOver = false;
    
    function initGame() {
        grid = [];
        revealed = [];
        flagged = [];
        gameOver = false;
        score = 0;
        updateScore();
        
        for (let r = 0; r < rows; r++) {
            grid[r] = [];
            revealed[r] = [];
            flagged[r] = [];
            for (let c = 0; c < cols; c++) {
                grid[r][c] = 0;
                revealed[r][c] = false;
                flagged[r][c] = false;
            }
        }
        
        let minesPlaced = 0;
        while (minesPlaced < mineCount) {
            const r = Math.floor(Math.random() * rows);
            const c = Math.floor(Math.random() * cols);
            if (grid[r][c] !== -1) {
                grid[r][c] = -1;
                minesPlaced++;
            }
        }
        
        for (let r = 0; r < rows; r++) {
            for (let c = 0; c < cols; c++) {
                if (grid[r][c] !== -1) {
                    let count = 0;
                    for (let dr = -1; dr <= 1; dr++) {
                        for (let dc = -1; dc <= 1; dc++) {
                            const nr = r + dr, nc = c + dc;
                            if (nr >= 0 && nr < rows && nc >= 0 && nc < cols && grid[nr][nc] === -1) {
                                count++;
                            }
                        }
                    }
                    grid[r][c] = count;
                }
            }
        }
        render();
    }
    
    function reveal(r, c) {
        if (r < 0 || r >= rows || c < 0 || c >= cols || revealed[r][c] || flagged[r][c] || gameOver) return;
        
        revealed[r][c] = true;
        
        if (grid[r][c] === -1) {
            gameOver = true;
            for (let i = 0; i < rows; i++) {
                for (let j = 0; j < cols; j++) {
                    revealed[i][j] = true;
                }
            }
        } else if (grid[r][c] === 0) {
            for (let dr = -1; dr <= 1; dr++) {
                for (let dc = -1; dc <= 1; dc++) {
                    reveal(r + dr, c + dc);
                }
            }
        }
        
        let safe = 0;
        for (let i = 0; i < rows; i++) {
            for (let j = 0; j < cols; j++) {
                if (revealed[i][j] && grid[i][j] !== -1) safe++;
            }
        }
        score = safe * 10;
        updateScore();
        
        render();
    }
    
    function toggleFlag(r, c) {
        if (revealed[r][c] || gameOver) return;
        flagged[r][c] = !flagged[r][c];
        render();
    }
    
    const gameDiv = document.createElement('div');
    gameDiv.style.cssText = 'display:grid;grid-template-columns:repeat(' + cols + ',40px);gap:2px;padding:10px;background:#333;border-radius:10px;';
    
    function render() {
        gameDiv.innerHTML = '';
        const colors = ['#888', '#0000ff', '#008000', '#ff0000', '#000080', '#800000', '#008080', '#000', '#808080'];
        
        for (let r = 0; r < rows; r++) {
            for (let c = 0; c < cols; c++) {
                const cell = document.createElement('div');
                cell.style.cssText = 'width:40px;height:40px;display:flex;align-items:center;justify-content:center;font-weight:bold;font-size:1.2rem;cursor:pointer;border-radius:5px;user-select:none;';
                
                if (revealed[r][c]) {
                    cell.style.background = '#ddd';
                    if (grid[r][c] === -1) {
                        cell.textContent = '💣';
                        cell.style.background = '#ff0055';
                    } else if (grid[r][c] > 0) {
                        cell.textContent = grid[r][c];
                        cell.style.color = colors[grid[r][c]];
                    }
                } else {
                    cell.style.background = '#00ff88';
                    if (flagged[r][c]) {
                        cell.textContent = '🚩';
                    }
                }
                
                const row = r, col = c;
                cell.addEventListener('click', () => reveal(row, col));
                cell.addEventListener('contextmenu', (e) => {
                    e.preventDefault();
                    toggleFlag(row, col);
                });
                
                gameDiv.appendChild(cell);
            }
        }
        
        if (gameOver) {
            const restartBtn = document.createElement('button');
            restartBtn.textContent = 'Play Again';
            restartBtn.style.cssText = 'grid-column:1/-1;padding:10px;margin-top:10px;background:#00ff88;border:none;border-radius:5px;font-weight:bold;cursor:pointer;';
            restartBtn.onclick = initGame;
            gameDiv.appendChild(restartBtn);
        }
    }
    
    initGame();
    container.appendChild(gameDiv);
}


// ==================== TIC-TAC-TOE ====================
function startTicTacToe(canvas, container) {
    canvas.style.display = 'none';
    
    let board = ['', '', '', '', '', '', '', '', ''];
    let currentPlayer = 'X';
    let gameOver = false;
    
    function checkWinner() {
        const lines = [
            [0, 1, 2], [3, 4, 5], [6, 7, 8],
            [0, 3, 6], [1, 4, 7], [2, 5, 8],
            [0, 4, 8], [2, 4, 6]
        ];
        
        for (const [a, b, c] of lines) {
            if (board[a] && board[a] === board[b] && board[a] === board[c]) {
                return board[a];
            }
        }
        return board.includes('') ? null : 'tie';
    }
    
    function aiMove() {
        const empty = board.map((v, i) => v === '' ? i : -1).filter(i => i !== -1);
        if (empty.length === 0) return;
        
        for (const i of empty) {
            board[i] = 'O';
            if (checkWinner() === 'O') return;
            board[i] = '';
        }
        
        for (const i of empty) {
            board[i] = 'X';
            if (checkWinner() === 'X') {
                board[i] = 'O';
                return;
            }
            board[i] = '';
        }
        
        if (board[4] === '') {
            board[4] = 'O';
            return;
        }
        
        const corners = [0, 2, 6, 8].filter(i => board[i] === '');
        if (corners.length > 0) {
            board[corners[Math.floor(Math.random() * corners.length)]] = 'O';
            return;
        }
        
        board[empty[Math.floor(Math.random() * empty.length)]] = 'O';
    }
    
    function handleClick(index) {
        if (board[index] !== '' || gameOver || currentPlayer !== 'X') return;
        
        board[index] = 'X';
        const winner = checkWinner();
        
        if (winner) {
            gameOver = true;
            if (winner === 'X') score += 100;
            updateScore();
        } else {
            currentPlayer = 'O';
            setTimeout(() => {
                aiMove();
                const winner = checkWinner();
                if (winner) {
                    gameOver = true;
                    if (winner === 'X') score += 100;
                    updateScore();
                }
                currentPlayer = 'X';
                render();
            }, 500);
        }
        render();
    }
    
    function resetGame() {
        board = ['', '', '', '', '', '', '', '', ''];
        currentPlayer = 'X';
        gameOver = false;
        render();
    }
    
    const gameDiv = document.createElement('div');
    gameDiv.style.cssText = 'display:flex;flex-direction:column;align-items:center;gap:20px;';
    
    const gridDiv = document.createElement('div');
    gridDiv.style.cssText = 'display:grid;grid-template-columns:repeat(3,100px);gap:5px;';
    
    function render() {
        gridDiv.innerHTML = '';
        
        for (let i = 0; i < 9; i++) {
            const cell = document.createElement('div');
            cell.style.cssText = 'width:100px;height:100px;background:#1a1a2e;border:2px solid #00ff88;display:flex;align-items:center;justify-content:center;font-size:3rem;cursor:pointer;border-radius:10px;font-family:Orbitron,sans-serif;';
            cell.style.color = board[i] === 'X' ? '#00ff88' : '#ff00ff';
            cell.textContent = board[i];
            
            const index = i;
            cell.addEventListener('click', () => handleClick(index));
            gridDiv.appendChild(cell);
        }
    }
    
    const resetBtn = document.createElement('button');
    resetBtn.textContent = 'New Game';
    resetBtn.style.cssText = 'padding:15px 30px;background:linear-gradient(135deg,#00ff88,#00d4ff);border:none;border-radius:10px;font-family:Orbitron,sans-serif;font-weight:bold;cursor:pointer;';
    resetBtn.onclick = resetGame;
    
    gameDiv.appendChild(gridDiv);
    gameDiv.appendChild(resetBtn);
    container.appendChild(gameDiv);
    render();
}


// ==================== CONNECT FOUR ====================
function startConnectFour(canvas, container) {
    canvas.style.display = 'none';
    
    const rows = 6;
    const cols = 7;
    let board = [];
    let currentPlayer = 1;
    let gameOver = false;
    
    function initGame() {
        board = [];
        for (let r = 0; r < rows; r++) {
            board[r] = Array(cols).fill(0);
        }
        currentPlayer = 1;
        gameOver = false;
        render();
    }
    
    function dropPiece(col) {
        if (gameOver) return;
        
        for (let r = rows - 1; r >= 0; r--) {
            if (board[r][col] === 0) {
                board[r][col] = currentPlayer;
                
                if (checkWin(r, col)) {
                    gameOver = true;
                    if (currentPlayer === 1) {
                        score += 100;
                        updateScore();
                    }
                } else {
                    currentPlayer = currentPlayer === 1 ? 2 : 1;
                    if (currentPlayer === 2 && !gameOver) {
                        setTimeout(aiMove, 500);
                    }
                }
                render();
                return;
            }
        }
    }
    
    function checkWin(row, col) {
        const player = board[row][col];
        const directions = [[0, 1], [1, 0], [1, 1], [1, -1]];
        
        for (const [dr, dc] of directions) {
            let count = 1;
            for (let i = 1; i < 4; i++) {
                const nr = row + dr * i, nc = col + dc * i;
                if (nr >= 0 && nr < rows && nc >= 0 && nc < cols && board[nr][nc] === player) count++;
                else break;
            }
            for (let i = 1; i < 4; i++) {
                const nr = row - dr * i, nc = col - dc * i;
                if (nr >= 0 && nr < rows && nc >= 0 && nc < cols && board[nr][nc] === player) count++;
                else break;
            }
            if (count >= 4) return true;
        }
        return false;
    }
    
    function aiMove() {
        if (gameOver || currentPlayer !== 2) return;
        
        const validCols = [];
        for (let c = 0; c < cols; c++) {
            if (board[0][c] === 0) validCols.push(c);
        }
        
        if (validCols.length === 0) return;
        
        let chosenCol = -1;
        
        // Check if AI can win
        for (const col of validCols) {
            for (let r = rows - 1; r >= 0; r--) {
                if (board[r][col] === 0) {
                    board[r][col] = 2;
                    if (checkWin(r, col)) {
                        chosenCol = col;
                    }
                    board[r][col] = 0;
                    break;
                }
            }
            if (chosenCol !== -1) break;
        }
        
        // Block player's winning move
        if (chosenCol === -1) {
            for (const col of validCols) {
                for (let r = rows - 1; r >= 0; r--) {
                    if (board[r][col] === 0) {
                        board[r][col] = 1;
                        if (checkWin(r, col)) {
                            chosenCol = col;
                        }
                        board[r][col] = 0;
                        break;
                    }
                }
                if (chosenCol !== -1) break;
            }
        }
        
        // Default move: center or random
        if (chosenCol === -1) {
            if (validCols.includes(3)) {
                chosenCol = 3;
            } else {
                chosenCol = validCols[Math.floor(Math.random() * validCols.length)];
            }
        }
        
        // Place the AI piece directly
        for (let r = rows - 1; r >= 0; r--) {
            if (board[r][chosenCol] === 0) {
                board[r][chosenCol] = 2;
                
                if (checkWin(r, chosenCol)) {
                    gameOver = true;
                }
                
                currentPlayer = 1;
                render();
                return;
            }
        }
    }
    
    const gameDiv = document.createElement('div');
    gameDiv.style.cssText = 'display:flex;flex-direction:column;align-items:center;gap:20px;';
    
    const gridDiv = document.createElement('div');
    gridDiv.style.cssText = 'display:grid;grid-template-columns:repeat(' + cols + ',60px);gap:5px;padding:15px;background:#0066ff;border-radius:15px;';
    
    function render() {
        gridDiv.innerHTML = '';
        
        for (let r = 0; r < rows; r++) {
            for (let c = 0; c < cols; c++) {
                const cell = document.createElement('div');
                cell.style.cssText = 'width:60px;height:60px;border-radius:50%;cursor:pointer;transition:all 0.2s;';
                
                if (board[r][c] === 0) {
                    cell.style.background = '#1a1a2e';
                } else if (board[r][c] === 1) {
                    cell.style.background = '#ff0055';
                } else {
                    cell.style.background = '#ffcc00';
                }
                
                const col = c;
                cell.addEventListener('click', () => {
                    if (currentPlayer === 1) dropPiece(col);
                });
                gridDiv.appendChild(cell);
            }
        }
        
        if (gameOver) {
            const status = document.createElement('div');
            status.style.cssText = 'grid-column:1/-1;text-align:center;color:white;font-family:Orbitron,sans-serif;font-size:1.2rem;padding:10px;';
            status.textContent = currentPlayer === 1 ? 'You Win!' : 'AI Wins!';
            gridDiv.appendChild(status);
        }
    }
    
    const resetBtn = document.createElement('button');
    resetBtn.textContent = 'New Game';
    resetBtn.style.cssText = 'padding:15px 30px;background:linear-gradient(135deg,#00ff88,#00d4ff);border:none;border-radius:10px;font-family:Orbitron,sans-serif;font-weight:bold;cursor:pointer;';
    resetBtn.onclick = initGame;
    
    gameDiv.appendChild(gridDiv);
    gameDiv.appendChild(resetBtn);
    container.appendChild(gameDiv);
    initGame();
}


// ==================== WHACK-A-MOLE ====================
function startWhackAMole(ctx, canvas) {
    const holes = [];
    const holeCount = 9;
    const cols = 3;
    const holeSize = 80;
    const padding = 50;
    const startX = (canvas.width - (cols * (holeSize + padding))) / 2 + padding;
    const startY = 100;
    
    for (let i = 0; i < holeCount; i++) {
        const row = Math.floor(i / cols);
        const col = i % cols;
        holes.push({
            x: startX + col * (holeSize + padding),
            y: startY + row * (holeSize + padding),
            active: false,
            timer: 0
        });
    }
    
    let spawnTimer = 0;
    let gameTime = 30;
    let lastSecond = Date.now();
    
    function handleClick(e) {
        if (currentGame !== 'whackamole') return;
        
        const rect = canvas.getBoundingClientRect();
        const x = (e.clientX - rect.left) * (canvas.width / rect.width);
        const y = (e.clientY - rect.top) * (canvas.height / rect.height);
        
        holes.forEach(hole => {
            if (hole.active) {
                const dx = x - (hole.x + holeSize / 2);
                const dy = y - (hole.y + holeSize / 2);
                const dist = Math.sqrt(dx * dx + dy * dy);
                
                if (dist < holeSize / 2) {
                    hole.active = false;
                    score += 10;
                    updateScore();
                }
            }
        });
    }
    
    canvas.addEventListener('click', handleClick);
    
    function update() {
        if (currentGame !== 'whackamole') return;
        
        const now = Date.now();
        if (now - lastSecond >= 1000) {
            gameTime--;
            lastSecond = now;
            if (gameTime <= 0) {
                ctx.fillStyle = '#1a1a2e';
                ctx.fillRect(0, 0, canvas.width, canvas.height);
                ctx.fillStyle = '#00ff88';
                ctx.font = '48px Orbitron';
                ctx.textAlign = 'center';
                ctx.fillText('Game Over!', canvas.width / 2, canvas.height / 2);
                ctx.fillText('Score: ' + score, canvas.width / 2, canvas.height / 2 + 60);
                return;
            }
        }
        
        spawnTimer++;
        if (spawnTimer > 30) {
            const inactiveHoles = holes.filter(h => !h.active);
            if (inactiveHoles.length > 0) {
                const hole = inactiveHoles[Math.floor(Math.random() * inactiveHoles.length)];
                hole.active = true;
                hole.timer = 60;
            }
            spawnTimer = 0;
        }
        
        holes.forEach(hole => {
            if (hole.active) {
                hole.timer--;
                if (hole.timer <= 0) {
                    hole.active = false;
                }
            }
        });
        
        ctx.fillStyle = '#1a1a2e';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        ctx.fillStyle = '#00ff88';
        ctx.font = '24px Orbitron';
        ctx.textAlign = 'center';
        ctx.fillText('Time: ' + gameTime + 's', canvas.width / 2, 50);
        
        holes.forEach(hole => {
            ctx.fillStyle = '#4a3c2a';
            ctx.beginPath();
            ctx.ellipse(hole.x + holeSize / 2, hole.y + holeSize, holeSize / 2 + 10, 20, 0, 0, Math.PI * 2);
            ctx.fill();
            
            if (hole.active) {
                ctx.fillStyle = '#8B4513';
                ctx.beginPath();
                ctx.arc(hole.x + holeSize / 2, hole.y + holeSize / 2, holeSize / 2, 0, Math.PI * 2);
                ctx.fill();
                
                ctx.fillStyle = '#D2691E';
                ctx.beginPath();
                ctx.arc(hole.x + holeSize / 2, hole.y + holeSize / 2 - 10, holeSize / 3, 0, Math.PI * 2);
                ctx.fill();
                
                ctx.fillStyle = '#000';
                ctx.beginPath();
                ctx.arc(hole.x + holeSize / 2 - 10, hole.y + holeSize / 2 - 15, 5, 0, Math.PI * 2);
                ctx.arc(hole.x + holeSize / 2 + 10, hole.y + holeSize / 2 - 15, 5, 0, Math.PI * 2);
                ctx.fill();
                
                ctx.fillStyle = '#FF69B4';
                ctx.beginPath();
                ctx.arc(hole.x + holeSize / 2, hole.y + holeSize / 2, 8, 0, Math.PI * 2);
                ctx.fill();
            } else {
                ctx.fillStyle = '#2a2a2a';
                ctx.beginPath();
                ctx.ellipse(hole.x + holeSize / 2, hole.y + holeSize / 2 + 10, holeSize / 2 - 5, holeSize / 4, 0, 0, Math.PI * 2);
                ctx.fill();
            }
        });
        
        gameLoop = requestAnimationFrame(update);
    }
    
    gameLoop = requestAnimationFrame(update);
}


// ==================== DINO RUNNER ====================
function startDinoRunner(ctx, canvas) {
    const ground = canvas.height - 80;
    let dino = {
        x: 80,
        y: ground - 60,
        width: 50,
        height: 60,
        vy: 0,
        ducking: false
    };
    
    let obstacles = [];
    let clouds = [];
    let birds = [];
    let gameSpeed = 6;
    let obstacleTimer = 0;
    let cloudTimer = 0;
    let distance = 0;
    let gameOver = false;
    
    const gravity = 0.8;
    const jumpStrength = -16;
    
    for (let i = 0; i < 3; i++) {
        clouds.push({
            x: Math.random() * canvas.width,
            y: 50 + Math.random() * 100
        });
    }
    
    function handleKeyDown(e) {
        if (currentGame !== 'dinorunner') return;
        if (gameOver && (e.key === ' ' || e.key === 'ArrowUp')) {
            resetGame();
            return;
        }
        if ((e.key === ' ' || e.key === 'ArrowUp') && dino.y >= ground - dino.height) {
            dino.vy = jumpStrength;
        }
        if (e.key === 'ArrowDown') {
            dino.ducking = true;
            dino.height = 30;
            dino.y = ground - 30;
        }
    }
    
    function handleKeyUp(e) {
        if (e.key === 'ArrowDown') {
            dino.ducking = false;
            dino.height = 60;
            if (dino.y === ground - 30) {
                dino.y = ground - 60;
            }
        }
    }
    
    function resetGame() {
        dino.y = ground - 60;
        dino.vy = 0;
        dino.ducking = false;
        dino.height = 60;
        obstacles = [];
        birds = [];
        gameSpeed = 6;
        distance = 0;
        score = 0;
        gameOver = false;
        updateScore();
    }
    
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('keyup', handleKeyUp);
    
    function update() {
        if (currentGame !== 'dinorunner') return;
        
        if (!gameOver) {
            dino.vy += gravity;
            dino.y += dino.vy;
            
            if (dino.y > ground - dino.height) {
                dino.y = ground - dino.height;
                dino.vy = 0;
            }
            
            distance++;
            if (distance % 10 === 0) {
                score++;
                updateScore();
            }
            
            if (distance % 500 === 0) {
                gameSpeed += 0.5;
            }
            
            obstacleTimer++;
            if (obstacleTimer > 80 + Math.random() * 60) {
                if (Math.random() > 0.3) {
                    obstacles.push({
                        x: canvas.width,
                        y: ground - 40,
                        width: 20 + Math.random() * 20,
                        height: 30 + Math.random() * 30
                    });
                } else {
                    birds.push({
                        x: canvas.width,
                        y: ground - 80 - Math.random() * 60,
                        width: 40,
                        height: 30
                    });
                }
                obstacleTimer = 0;
            }
            
            cloudTimer++;
            if (cloudTimer > 100) {
                clouds.push({
                    x: canvas.width,
                    y: 50 + Math.random() * 100
                });
                cloudTimer = 0;
            }
            
            obstacles.forEach(o => o.x -= gameSpeed);
            birds.forEach(b => b.x -= gameSpeed * 1.2);
            clouds.forEach(c => c.x -= 1);
            
            obstacles = obstacles.filter(o => o.x > -50);
            birds = birds.filter(b => b.x > -50);
            clouds = clouds.filter(c => c.x > -50);
            
            [...obstacles, ...birds].forEach(o => {
                if (dino.x < o.x + o.width &&
                    dino.x + dino.width > o.x &&
                    dino.y < o.y + o.height &&
                    dino.y + dino.height > o.y) {
                    gameOver = true;
                }
            });
        }
        
        ctx.fillStyle = '#f7f7f7';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        ctx.fillStyle = '#ddd';
        clouds.forEach(c => {
            ctx.beginPath();
            ctx.arc(c.x, c.y, 25, 0, Math.PI * 2);
            ctx.arc(c.x + 25, c.y - 10, 20, 0, Math.PI * 2);
            ctx.arc(c.x + 50, c.y, 25, 0, Math.PI * 2);
            ctx.fill();
        });
        
        ctx.fillStyle = '#535353';
        ctx.fillRect(0, ground, canvas.width, 2);
        
        for (let i = 0; i < canvas.width; i += 20) {
            if (Math.random() > 0.7) {
                ctx.fillRect(i + (distance % 20), ground + 5, 2, 2);
            }
        }
        
        ctx.fillStyle = '#535353';
        if (dino.ducking) {
            ctx.fillRect(dino.x, dino.y, dino.width + 10, dino.height);
        } else {
            ctx.fillRect(dino.x, dino.y, dino.width - 10, dino.height);
            ctx.fillRect(dino.x + 30, dino.y, 20, 25);
            
            ctx.fillStyle = '#f7f7f7';
            ctx.fillRect(dino.x + 40, dino.y + 5, 5, 5);
        }
        
        ctx.fillStyle = '#535353';
        obstacles.forEach(o => {
            ctx.fillRect(o.x, o.y, o.width, o.height);
            ctx.fillRect(o.x + o.width / 4, o.y - 10, o.width / 2, 10);
        });
        
        birds.forEach(b => {
            ctx.beginPath();
            ctx.moveTo(b.x, b.y + b.height / 2);
            ctx.lineTo(b.x + b.width / 2, b.y);
            ctx.lineTo(b.x + b.width, b.y + b.height / 2);
            ctx.lineTo(b.x + b.width / 2, b.y + b.height);
            ctx.closePath();
            ctx.fill();
        });
        
        if (gameOver) {
            ctx.fillStyle = 'rgba(0,0,0,0.5)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            ctx.fillStyle = '#fff';
            ctx.font = '48px Orbitron';
            ctx.textAlign = 'center';
            ctx.fillText('GAME OVER', canvas.width / 2, canvas.height / 2);
            ctx.font = '24px Orbitron';
            ctx.fillText('Press SPACE to restart', canvas.width / 2, canvas.height / 2 + 50);
        }
        
        gameLoop = requestAnimationFrame(update);
    }
    
    gameLoop = requestAnimationFrame(update);
}


// ==================== SIMON SAYS ====================
function startSimonSays(canvas, container) {
    canvas.style.display = 'none';
    
    const colors = ['#ff0055', '#00ff88', '#0066ff', '#ffcc00'];
    let sequence = [];
    let playerIndex = 0;
    let isPlaying = false;
    let canClick = false;
    let level = 0;
    
    const gameDiv = document.createElement('div');
    gameDiv.style.cssText = 'display:flex;flex-direction:column;align-items:center;gap:30px;';
    
    const statusDiv = document.createElement('div');
    statusDiv.style.cssText = 'font-family:Orbitron,sans-serif;font-size:1.5rem;color:#00ff88;';
    statusDiv.textContent = 'Press Start!';
    
    const gridDiv = document.createElement('div');
    gridDiv.style.cssText = 'display:grid;grid-template-columns:repeat(2,120px);gap:15px;';
    
    const buttons = [];
    
    for (let i = 0; i < 4; i++) {
        const btn = document.createElement('div');
        btn.style.cssText = 'width:120px;height:120px;border-radius:15px;cursor:pointer;transition:all 0.2s;opacity:0.6;';
        btn.style.background = colors[i];
        
        btn.addEventListener('click', () => {
            if (!canClick) return;
            
            flashButton(i);
            
            if (sequence[playerIndex] === i) {
                playerIndex++;
                if (playerIndex === sequence.length) {
                    canClick = false;
                    score += level * 10;
                    updateScore();
                    statusDiv.textContent = 'Correct! Level ' + (level + 1);
                    setTimeout(nextRound, 1000);
                }
            } else {
                canClick = false;
                statusDiv.textContent = 'Wrong! Game Over';
                setTimeout(() => {
                    statusDiv.textContent = 'Press Start!';
                }, 2000);
            }
        });
        
        buttons.push(btn);
        gridDiv.appendChild(btn);
    }
    
    function flashButton(index, duration = 300) {
        buttons[index].style.opacity = '1';
        buttons[index].style.transform = 'scale(1.1)';
        setTimeout(() => {
            buttons[index].style.opacity = '0.6';
            buttons[index].style.transform = 'scale(1)';
        }, duration);
    }
    
    function playSequence() {
        isPlaying = true;
        canClick = false;
        let i = 0;
        
        const interval = setInterval(() => {
            if (i >= sequence.length) {
                clearInterval(interval);
                isPlaying = false;
                canClick = true;
                statusDiv.textContent = 'Your turn!';
                return;
            }
            flashButton(sequence[i], 500);
            i++;
        }, 800);
    }
    
    function nextRound() {
        level++;
        sequence.push(Math.floor(Math.random() * 4));
        playerIndex = 0;
        statusDiv.textContent = 'Watch...';
        setTimeout(playSequence, 500);
    }
    
    function startNewGame() {
        sequence = [];
        level = 0;
        score = 0;
        updateScore();
        nextRound();
    }
    
    const startBtn = document.createElement('button');
    startBtn.textContent = 'Start Game';
    startBtn.style.cssText = 'padding:15px 30px;background:linear-gradient(135deg,#00ff88,#00d4ff);border:none;border-radius:10px;font-family:Orbitron,sans-serif;font-weight:bold;cursor:pointer;font-size:1rem;';
    startBtn.onclick = startNewGame;
    
    gameDiv.appendChild(statusDiv);
    gameDiv.appendChild(gridDiv);
    gameDiv.appendChild(startBtn);
    container.appendChild(gameDiv);
}


// ==================== PREVIEW ANIMATIONS ====================
function initPreviews() {
    const snakeCanvas = document.getElementById('snake-preview');
    if (snakeCanvas) {
        const ctx = snakeCanvas.getContext('2d');
        let offset = 0;
        function animateSnake() {
            ctx.fillStyle = '#1a1a2e';
            ctx.fillRect(0, 0, 300, 200);
            ctx.fillStyle = '#00ff88';
            for (let i = 0; i < 5; i++) {
                ctx.fillRect(100 + i * 20 + Math.sin(offset + i * 0.5) * 10, 100 + Math.cos(offset + i * 0.5) * 20, 18, 18);
            }
            ctx.fillStyle = '#ff0055';
            ctx.beginPath();
            ctx.arc(230, 100, 10, 0, Math.PI * 2);
            ctx.fill();
            offset += 0.05;
            requestAnimationFrame(animateSnake);
        }
        animateSnake();
    }
    
    const pongCanvas = document.getElementById('pong-preview');
    if (pongCanvas) {
        const ctx = pongCanvas.getContext('2d');
        let ballX = 150, ballY = 100, dx = 2, dy = 1;
        function animatePong() {
            ctx.fillStyle = '#1a1a2e';
            ctx.fillRect(0, 0, 300, 200);
            ctx.fillStyle = '#00ff88';
            ctx.fillRect(20, 60, 10, 80);
            ctx.fillStyle = '#ff00ff';
            ctx.fillRect(270, 60, 10, 80);
            ctx.fillStyle = '#fff';
            ctx.beginPath();
            ctx.arc(ballX, ballY, 8, 0, Math.PI * 2);
            ctx.fill();
            ballX += dx; ballY += dy;
            if (ballX < 30 || ballX > 270) dx = -dx;
            if (ballY < 10 || ballY > 190) dy = -dy;
            requestAnimationFrame(animatePong);
        }
        animatePong();
    }
    
    const memoryPreview = document.getElementById('memory-preview');
    if (memoryPreview) {
        for (let i = 0; i < 16; i++) {
            const cell = document.createElement('div');
            cell.className = 'memory-cell';
            cell.style.opacity = 0.3 + (i % 4) * 0.2;
            memoryPreview.appendChild(cell);
        }
    }
    
    const preview2048 = document.getElementById('2048-preview');
    if (preview2048) {
        const values = [2, 4, 8, 16, 0, 2, 4, 0, 0, 0, 2, 0, 0, 0, 0, 2];
        const colors = { 0: '#cdc1b4', 2: '#eee4da', 4: '#ede0c8', 8: '#f2b179', 16: '#f59563' };
        values.forEach(val => {
            const cell = document.createElement('div');
            cell.className = 'cell-2048';
            cell.style.background = colors[val] || '#cdc1b4';
            cell.style.color = val > 4 ? '#f9f6f2' : '#776e65';
            cell.textContent = val || '';
            preview2048.appendChild(cell);
        });
    }
    
    // Minesweeper Preview
    const minesweeperPreview = document.getElementById('minesweeper-preview');
    if (minesweeperPreview) {
        const cells = ['1', '2', '💣', '', '1', '', '💣', '3', '2', '1', '', '', '1', '💣', '', '💣', '', '2', '1', '', '', '1', '2', '💣', '1'];
        cells.forEach(val => {
            const cell = document.createElement('div');
            cell.className = 'mine-cell';
            cell.textContent = val;
            cell.style.fontSize = val === '💣' ? '1rem' : '0.8rem';
            cell.style.fontWeight = 'bold';
            cell.style.color = val === '1' ? '#0000ff' : val === '2' ? '#008000' : val === '3' ? '#ff0000' : '#000';
            minesweeperPreview.appendChild(cell);
        });
    }
    
    // Tic-Tac-Toe Preview
    const tictactoePreview = document.getElementById('tictactoe-preview');
    if (tictactoePreview) {
        const cells = ['X', 'O', 'X', '', 'X', 'O', 'O', '', 'X'];
        cells.forEach(val => {
            const cell = document.createElement('div');
            cell.className = 'ttt-cell';
            cell.textContent = val;
            cell.style.color = val === 'X' ? '#00ff88' : '#ff00ff';
            tictactoePreview.appendChild(cell);
        });
    }
    
    // Connect Four Preview
    const connectfourPreview = document.getElementById('connectfour-preview');
    if (connectfourPreview) {
        const pattern = [
            0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 2, 0, 0, 0,
            0, 0, 1, 1, 0, 0, 0,
            0, 2, 2, 1, 2, 0, 0,
            1, 1, 2, 1, 2, 1, 0
        ];
        pattern.forEach(val => {
            const cell = document.createElement('div');
            cell.className = 'c4-cell' + (val === 1 ? ' red' : val === 2 ? ' yellow' : '');
            connectfourPreview.appendChild(cell);
        });
    }
    
    // Simon Says Preview
    const simonsaysPreview = document.getElementById('simonsays-preview');
    if (simonsaysPreview) {
        const colors = ['#ff0055', '#00ff88', '#0066ff', '#ffcc00'];
        colors.forEach(color => {
            const btn = document.createElement('div');
            btn.className = 'simon-btn';
            btn.style.background = color;
            simonsaysPreview.appendChild(btn);
        });
    }
    
    // Whack-a-Mole Preview
    const whackamoleCanvas = document.getElementById('whackamole-preview');
    if (whackamoleCanvas) {
        const ctx = whackamoleCanvas.getContext('2d');
        let moleY = 0;
        let direction = 1;
        function animateWhackamole() {
            ctx.fillStyle = '#1a1a2e';
            ctx.fillRect(0, 0, 300, 200);
            
            // Draw holes
            for (let i = 0; i < 3; i++) {
                const x = 50 + i * 100;
                const y = 120;
                
                // Hole shadow
                ctx.fillStyle = '#4a3c2a';
                ctx.beginPath();
                ctx.ellipse(x, y + 30, 35, 15, 0, 0, Math.PI * 2);
                ctx.fill();
                
                // Mole (only in center)
                if (i === 1) {
                    ctx.fillStyle = '#8B4513';
                    ctx.beginPath();
                    ctx.arc(x, y - 10 + moleY, 25, 0, Math.PI * 2);
                    ctx.fill();
                    
                    // Eyes
                    ctx.fillStyle = '#000';
                    ctx.beginPath();
                    ctx.arc(x - 8, y - 15 + moleY, 4, 0, Math.PI * 2);
                    ctx.arc(x + 8, y - 15 + moleY, 4, 0, Math.PI * 2);
                    ctx.fill();
                    
                    // Nose
                    ctx.fillStyle = '#FF69B4';
                    ctx.beginPath();
                    ctx.arc(x, y - 5 + moleY, 6, 0, Math.PI * 2);
                    ctx.fill();
                }
            }
            
            moleY += direction * 0.5;
            if (moleY > 10 || moleY < -20) direction *= -1;
            
            requestAnimationFrame(animateWhackamole);
        }
        animateWhackamole();
    }
    
    // Dino Runner Preview
    const dinorunnerCanvas = document.getElementById('dinorunner-preview');
    if (dinorunnerCanvas) {
        const ctx = dinorunnerCanvas.getContext('2d');
        let dinoY = 0;
        let dinoVY = 0;
        let obstacleX = 300;
        function animateDinoRunner() {
            ctx.fillStyle = '#f7f7f7';
            ctx.fillRect(0, 0, 300, 200);
            
            // Ground
            ctx.fillStyle = '#535353';
            ctx.fillRect(0, 160, 300, 2);
            
            // Dino
            dinoVY += 0.5;
            dinoY += dinoVY;
            if (dinoY > 0) {
                dinoY = 0;
                dinoVY = -8;
            }
            
            ctx.fillStyle = '#535353';
            ctx.fillRect(50, 120 + dinoY, 30, 40);
            ctx.fillRect(70, 110 + dinoY, 15, 20);
            
            // Obstacle
            obstacleX -= 3;
            if (obstacleX < -30) obstacleX = 300;
            
            ctx.fillRect(obstacleX, 130, 20, 30);
            
            requestAnimationFrame(animateDinoRunner);
        }
        animateDinoRunner();
    }
}

// Close modal on escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeGame();
});

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', initPreviews);

// Create particles
function createParticles() {
    const container = document.getElementById('particles');
    
    for (let i = 0; i < 50; i++) {
        const particle = document.createElement('div');
        particle.style.cssText = 'position:absolute;width:' + (2 + Math.random() * 4) + 'px;height:' + (2 + Math.random() * 4) + 'px;background:' + (Math.random() > 0.5 ? '#00ff88' : '#ff00ff') + ';border-radius:50%;left:' + (Math.random() * 100) + '%;top:' + (Math.random() * 100) + '%;opacity:' + (0.3 + Math.random() * 0.5) + ';animation:float ' + (3 + Math.random() * 4) + 's ease-in-out infinite;animation-delay:' + (Math.random() * 2) + 's;';
        container.appendChild(particle);
    }
}

document.addEventListener('DOMContentLoaded', createParticles);
