const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const gridSize = 20;
const pacSize = gridSize - 2;
const speed = 4;
const blinkDuration = 2000; // 2 seconds
const blinkInterval = 500; // 0.5 seconds

let pacX = canvas.width / 2;
let pacY = canvas.height / 2;
let pacDir = 'RIGHT';
let isBlinking = false;
let blinkStartTime = 0;

const pacRadius = pacSize / 2;
const obstacles = [
    { x: 100, y: 100, width: 60, height: 20 },
    { x: 300, y: 200, width: 20, height: 60 },
    { x: 150, y: 300, width: 80, height: 20 }
];
const fruits = [
    { x: 50, y: 50, collected: false },
    { x: 400, y: 400, collected: false },
    { x: 250, y: 250, collected: false }
];
const ghosts = [
    { x: 100, y: 300, size: 20, dir: 'RIGHT', speed: 2 },
    { x: 400, y: 100, size: 20, dir: 'LEFT', speed: 2 }
];

function drawPacMan() {
    if (isBlinking) {
        const currentTime = Date.now();
        if (currentTime - blinkStartTime > blinkDuration) {
            isBlinking = false;
            return;
        }
        if ((Math.floor((currentTime - blinkStartTime) / blinkInterval) % 2) === 0) {
            return; // Don't draw Pac-Man while blinking
        }
    }
    ctx.beginPath();
    ctx.arc(pacX, pacY, pacRadius, 0.2 * Math.PI, 1.8 * Math.PI);
    ctx.lineTo(pacX, pacY);
    ctx.closePath();
    ctx.fillStyle = 'yellow';
    ctx.fill();
    ctx.strokeStyle = 'black';
    ctx.stroke();
}

function drawObstacles() {
    ctx.fillStyle = 'gray';
    obstacles.forEach(obstacle => {
        ctx.fillRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height);
    });
}

function drawFruits() {
    ctx.fillStyle = 'red';
    fruits.forEach(fruit => {
        if (!fruit.collected) {
            ctx.beginPath();
            ctx.arc(fruit.x, fruit.y, 10, 0, 2 * Math.PI);
            ctx.fill();
        }
    });
}

function drawGhosts() {
    ctx.fillStyle = 'blue';
    ghosts.forEach(ghost => {
        ctx.beginPath();
        ctx.arc(ghost.x, ghost.y, ghost.size, 0, 2 * Math.PI);
        ctx.fill();
    });
}

function updatePacMan() {
    if (isBlinking) return; // Stop updating Pac-Man while blinking
    switch (pacDir) {
        case 'UP':
            pacY -= speed;
            break;
        case 'DOWN':
            pacY += speed;
            break;
        case 'LEFT':
            pacX -= speed;
            break;
        case 'RIGHT':
            pacX += speed;
            break;
    }

    // Wrap Pac-Man around the canvas edges
    if (pacX < 0) pacX = canvas.width;
    if (pacX > canvas.width) pacX = 0;
    if (pacY < 0) pacY = canvas.height;
    if (pacY > canvas.height) pacY = 0;
}

function updateGhosts() {
    ghosts.forEach(ghost => {
        switch (ghost.dir) {
            case 'UP':
                ghost.y -= ghost.speed;
                break;
            case 'DOWN':
                ghost.y += ghost.speed;
                break;
            case 'LEFT':
                ghost.x -= ghost.speed;
                break;
            case 'RIGHT':
                ghost.x += ghost.speed;
                break;
        }
        if (ghost.x < 0 || ghost.x > canvas.width) ghost.dir = ghost.dir === 'LEFT' ? 'RIGHT' : 'LEFT';
        if (ghost.y < 0 || ghost.y > canvas.height) ghost.dir = ghost.dir === 'UP' ? 'DOWN' : 'UP';
    });
}

function checkCollisions() {
    fruits.forEach(fruit => {
        const dx = pacX - fruit.x;
        const dy = pacY - fruit.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        if (distance < pacRadius + 10) {
            fruit.collected = true;
        }
    });

    obstacles.forEach(obstacle => {
        if (pacX > obstacle.x && pacX < obstacle.x + obstacle.width &&
            pacY > obstacle.y && pacY < obstacle.y + obstacle.height) {
            // Move Pac-Man back to previous position if it collides
            switch (pacDir) {
                case 'UP':
                    pacY += speed;
                    break;
                case 'DOWN':
                    pacY -= speed;
                    break;
                case 'LEFT':
                    pacX += speed;
                    break;
                case 'RIGHT':
                    pacX -= speed;
                    break;
            }
        }
    });

    ghosts.forEach(ghost => {
        const dx = pacX - ghost.x;
        const dy = pacY - ghost.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        if (distance < pacRadius + ghost.size) {
            startBlinking();
        }
    });
}

function startBlinking() {
    if (!isBlinking) {
        isBlinking = true;
        blinkStartTime = Date.now();
        pacX = canvas.width / 2; // Reset position
        pacY = canvas.height / 2; // Reset position
    }
}

function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    updatePacMan();
    updateGhosts();
    checkCollisions();
    drawObstacles();
    drawFruits();
    drawGhosts();
    drawPacMan();
    requestAnimationFrame(gameLoop);
}
gameLoop();

// Event listeners for buttons
document.getElementById('up').addEventListener('click', () => pacDir = 'UP');
document.getElementById('down').addEventListener('click', () => pacDir = 'DOWN');
document.getElementById('left').addEventListener('click', () => pacDir = 'LEFT');
document.getElementById('right').addEventListener('click', () => pacDir = 'RIGHT');

// Handle keyboard input for desktop
document.addEventListener('keydown', (e) => {
    switch (e.code) {
        case 'ArrowUp':
            pacDir = 'UP';
            break;
        case 'ArrowDown':
            pacDir = 'DOWN';
            break;
        case 'ArrowLeft':
            pacDir = 'LEFT';
            break;
        case 'ArrowRight':
            pacDir = 'RIGHT';
            break;
    }
});
