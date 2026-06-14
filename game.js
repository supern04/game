const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// UI Elements
const lobby = document.getElementById('lobby');
const gameUi = document.getElementById('game-ui');
const playBtn = document.getElementById('playBtn');
const backToLobbyBtn = document.getElementById('backToLobbyBtn');
const restartBtn = document.getElementById('restartBtn');
const lobbyLevelSelect = document.getElementById('lobbyLevelSelect');

// Game Constants
const GRAVITY = 0.6;
const BOUNCE_VELOCITY = -14;
const SUPER_BOUNCE = -21;
const MOVE_SPEED = 7;
const DASH_SPEED = 20;
const DASH_FRAMES = 12;
const BLOCK_SIZE = 40;

// Game State
let gameState = 'lobby';
let currentLevel = 0;

// Player
const player = {
    x: 0, y: 0,
    vx: 0, vy: 0,
    radius: 14, color: '#f1c40f',
    dashCharges: 0,
    dashFrames: 0,
    dashDir: 1
};

const keys = { ArrowLeft: false, ArrowRight: false };

// Double tap logic
let lastKey = '';
let lastKeyTime = 0;

// Levels Data 
const levels = [
    // Level 1: Welcome
    [
        "                              ",
        "                              ",
        "                              ",
        "                              ",
        "                              ",
        "                              ",
        "                              ",
        "                              ",
        "                              ",
        "                              ",
        "                              ",
        "                              ",
        "P                            *",
        "XXXXXX    XXXXXX      XXXXXXXX",
        "                              ",
        "                              ",
        "                              ",
        "                              ",
        "                              ",
        "                              "
    ],
    // Level 2: Intro to Spikes
    [
        "                              ",
        "                              ",
        "                              ",
        "                              ",
        "                              ",
        "                              ",
        "                              ",
        "                              ",
        "                              ",
        "                              ",
        "            S S               ",
        "         XXXXXXXX             ",
        "P                            *",
        "XXXXX                  XXXXXXX",
        "                              ",
        "                              ",
        "                              ",
        "                              ",
        "                              ",
        "                              "
    ],
    // Level 3: Jump Pad and Dash Combo
    // Level 3: Jump Pad and Dash Combo
    [
        "                              ",
        "                              ",
        "                              ",
        "                              ",
        "                              ",
        "             XXXX             ",
        "                           *  ",
        "                          XXX ",
        "                              ",
        "                              ",
        "                              ",
        "                              ",
        "P  D             J            ",
        "XXXX        XXXXXXX           ",
        "                              ",
        "                              ",
        "                              ",
        "                              ",
        "                              ",
        "                              "
    ],
    // Level 4: Intro to Dash (D)
    [
        "                              ",
        "                              ",
        "                              ",
        "                              ",
        "                              ",
        "                              ",
        "                              ",
        "                              ",
        "P     D                       ",
        "XXXXXXX             S S S S  *",
        "           XXXX     XXXXXXXXXX",
        "                              ",
        "                              ",
        "                              ",
        "                              ",
        "                              ",
        "                              ",
        "                              ",
        "                              ",
        "                              "
    ],
    // Level 5: Fragile Stairs
    [
        "                              ",
        "                              ",
        "                              ",
        "                              ",
        "                              ",
        "                              ",
        "                              ",
        "                  XXXXXX   *  ",
        "                          XXX ",
        "           FFFXXX             ",
        "P                             ",
        "XXXXXX                        ",
        "                              ",
        "                              ",
        "                              ",
        "                              ",
        "                              ",
        "                              ",
        "                              ",
        "                              "
    ],
    // Level 6: Intro to Moving Buzzsaws (M)
    [
        "                              ",
        "                              ",
        "                              ",
        "                              ",
        "                              ",
        "                              ",
        "                              ",
        "                              ",
        "P                 M           ",
        "XXXXXXX    XXXXXXXXXXXXXXXXXX ",
        "                             *",
        "                             X",
        "                              ",
        "                              ",
        "                              ",
        "                              ",
        "                              ",
        "                              ",
        "                              ",
        "                              "
    ],
    // Level 7: Dash and Jump Pad Combos
    [
        "                              ",
        "                              ",
        "                              ",
        "                              ",
        "                   *          ",
        "                 XXXXX        ",
        "                              ",
        "                              ",
        "             M                ",
        "           XXXXXXX            ",
        "      D                       ",
        "P      J                      ",
        "XXXX  XX                      ",
        "                              ",
        "                              ",
        "                              ",
        "                              ",
        "                              ",
        "                              ",
        "                              "
    ],
    // Level 8: Island Hopping Mix
    [
        "                              ",
        "                              ",
        "                              ",
        "                              ",
        "                              ",
        "                              ",
        "                              ",
        "                              ",
        "                              ",
        "             FJ               ",
        "                              ",
        "        XX        XX          ",
        "P                             ",
        "XXXX       M           S   *  ",
        "         XXXXXXXX    XXXXXXX  ",
        "                              ",
        "                              ",
        "                              ",
        "                              ",
        "                              "
    ],
    // Level 9: Dash Fragile Bridge
    [
        "                              ",
        "                              ",
        "                              ",
        "                              ",
        "                              ",
        "                              ",
        "                              ",
        "                              ",
        "                              ",
        "                              ",
        "P  D   F   F   F   F   F   *  ",
        "XX                         X  ",
        "   S S S       S S S       S  ",
        "   XXXXX       XXXXX       X  ",
        "                              ",
        "                              ",
        "                              ",
        "                              ",
        "                              ",
        "                              "
    ],
    // Level 10: Final Gauntlet
    [
        "                              ",
        "                              ",
        "                              ",
        "                              ",
        "            D                 ",
        "          XXXX                ",
        "                           *  ",
        "       J                 XXXX ",
        "      XXXX                    ",
        "               S M            ",
        "           XXXXXXXXX          ",
        "                              ",
        "                              ",
        "       FFF                    ",
        "                              ",
        "P                             ",
        "XXXX                          ",
        "                              ",
        "                              ",
        "                              "
    ],
    // Level 11: Blink Blocks Intro
    [
        "                              ",
        "                              ",
        "                              ",
        "                              ",
        "                              ",
        "                              ",
        "                              ",
        "                              ",
        "                             *",
        "                            XX",
        "                       BBB    ",
        "                 BBB          ",
        "P          BBB                ",
        "XXXX     XXXX                 ",
        "                              ",
        "                              ",
        "                              ",
        "                              ",
        "                              ",
        "                              "
    ],
    // Level 12: Teleporters (Portals)
    [
        "                              ",
        "                              ",
        "                              ",
        "                              ",
        "                              ",
        "                              ",
        "                              ",
        "                              ",
        "P        O                Q  *",
        "XXXX                     XXXXX",
        "                              ",
        "                              ",
        "                              ",
        "                              ",
        "                              ",
        "                              ",
        "                              ",
        "                              ",
        "                              ",
        "                              "
    ],
    // Level 13: Falling Blocks
    [
        "                              ",
        "                              ",
        "                              ",
        "                              ",
        "                              ",
        "                              ",
        "                              ",
        "                              ",
        "P                             ",
        "XXXX    GGGG    GGGG    GGGG *",
        "                            XX",
        "                              ",
        "                              ",
        "                              ",
        "                              ",
        "                              ",
        "                              ",
        "                              ",
        "                              ",
        "                              "
    ],
    // Level 14: Mixed Gauntlet
    [
        "                              ",
        "                              ",
        "                              ",
        "                              ",
        "                              ",
        "                              ",
        "     Q                        ",
        "    XXX    BBB                ",
        "                 GGGG         ",
        "                              ",
        "                        J    *",
        "                       XXX  XX",
        "P      O                      ",
        "XXXX  XXX                     ",
        "                              ",
        "                              ",
        "                              ",
        "                              ",
        "                              ",
        "                              "
    ]
];

let blocks = [];
let spikes = [];
let jumpPads = [];
let fragileBlocks = [];
let buzzsaws = [];
let dashItems = [];
let blinkBlocks = [];
let portals = [];
let fallingBlocks = [];
let portalCooldown = 0;
let goal = null;

// Initialize Lobby Select UI
levels.forEach((_, i) => {
    const opt = document.createElement('option');
    opt.value = i;
    opt.innerText = `Map ${i + 1}`;
    lobbyLevelSelect.appendChild(opt);
});

playBtn.addEventListener('click', () => {
    currentLevel = parseInt(lobbyLevelSelect.value);
    startGamePlay();
});

backToLobbyBtn.addEventListener('click', () => {
    gameState = 'lobby';
    gameUi.style.display = 'none';
    lobby.style.display = 'flex';
});

restartBtn.addEventListener('click', () => {
    if (gameState !== 'win_all') {
        loadLevel(currentLevel);
    } else {
        currentLevel = 0;
        loadLevel(currentLevel);
    }
});

function startGamePlay() {
    lobby.style.display = 'none';
    gameUi.style.display = 'block';
    loadLevel(currentLevel);
}

function loadLevel(levelIndex) {
    if (levelIndex >= levels.length) {
        gameState = 'win_all';
        return;
    }
    blocks = [];
    spikes = [];
    jumpPads = [];
    fragileBlocks = [];
    buzzsaws = [];
    dashItems = [];
    blinkBlocks = [];
    portals = [];
    fallingBlocks = [];
    portalCooldown = 0;
    goal = null;
    gameState = 'playing';
    lobbyLevelSelect.value = levelIndex;

    player.dashCharges = 0;
    player.dashFrames = 0;

    const layout = levels[levelIndex];
    for (let row = 0; row < layout.length; row++) {
        for (let col = 0; col < layout[row].length; col++) {
            const char = layout[row][col];
            const x = col * BLOCK_SIZE;
            const y = row * BLOCK_SIZE;

            let w = BLOCK_SIZE, h = BLOCK_SIZE;

            if (char === 'X') blocks.push({ x, y, width: w, height: h });
            if (char === 'S') spikes.push({ x, y, width: w, height: h });
            if (char === '*') goal = { x, y, width: w, height: h };
            if (char === 'J') jumpPads.push({ x, y, width: w, height: h });
            if (char === 'F') fragileBlocks.push({ x, y, width: w, height: h, state: 'solid', timer: 0 });
            if (char === 'M') buzzsaws.push({ x: x + w / 2, y: y + h / 2, radius: 18, vx: 3, angle: 0 });
            if (char === 'D') dashItems.push({ x: x + 10, y: y + 10, width: 20, height: 20, active: true, offset: 0 });
            if (char === 'B') blinkBlocks.push({ x, y, width: w, height: h, state: 'solid', timer: 0 });
            if (char === 'O') portals.push({ x: x + w / 2, y: y + h / 2, radius: 15, type: 'A', partner: null });
            if (char === 'Q') portals.push({ x: x + w / 2, y: y + h / 2, radius: 15, type: 'B', partner: null });
            if (char === 'G') fallingBlocks.push({ x, y, width: w, height: h, state: 'solid', vy: 0, timer: 0 });

            if (char === 'P') {
                player.x = x + w / 2;
                player.y = y + h / 2;
                player.vx = 0;
                player.vy = 0;
            }
        }
    }

    // Link portals
    let portalA = portals.find(p => p.type === 'A');
    let portalB = portals.find(p => p.type === 'B');
    if (portalA && portalB) {
        portalA.partner = portalB;
        portalB.partner = portalA;
    }
}

window.addEventListener('keydown', (e) => {
    if (keys.hasOwnProperty(e.key)) {
        if (!keys[e.key]) { // Trigger only on fresh press down
            let now = Date.now();
            if (lastKey === e.key && now - lastKeyTime < 300) {
                // Double tap detected
                if (player.dashCharges > 0 && player.dashFrames === 0) {
                    player.dashCharges--;
                    player.dashFrames = DASH_FRAMES;
                    player.dashDir = (e.key === 'ArrowRight') ? 1 : -1;
                }
            }
            lastKey = e.key;
            lastKeyTime = now;
        }
        keys[e.key] = true;
    }
});

window.addEventListener('keyup', (e) => {
    if (keys.hasOwnProperty(e.key)) keys[e.key] = false;
});

function checkCircleRectCollision(circle, rect) {
    let closestX = Math.max(rect.x, Math.min(circle.x, rect.x + rect.width));
    let closestY = Math.max(rect.y, Math.min(circle.y, rect.y + rect.height));
    let dx = circle.x - closestX;
    let dy = circle.y - closestY;
    return (dx * dx + dy * dy) < (circle.radius * circle.radius);
}

function checkCircleCircleCollision(c1, c2) {
    let dx = c1.x - c2.x;
    let dy = c1.y - c2.y;
    let dist = Math.sqrt(dx * dx + dy * dy);
    return dist < (c1.radius + c2.radius);
}

function checkRectRectCollision(r1, r2) {
    return r1.x < r2.x + r2.width &&
        r1.x + r1.width > r2.x &&
        r1.y < r2.y + r2.height &&
        r1.y + r1.height > r2.y;
}

function killPlayer() {
    if (gameState === 'dead') return;
    gameState = 'dead';
    setTimeout(() => {
        loadLevel(currentLevel);
    }, 400);
}

function handleBlockCollision(blockArray) {
    for (const block of blockArray) {
        if (!block || block.state === 'broken' || block.state === 'invisible' || block.state === 'falling') continue;

        if (checkCircleRectCollision(player, block)) {
            // Horizontal push if moving into walls
            if (player.vx > 0 && player.x < block.x) {
                player.x = block.x - player.radius - 0.1;
                if (player.dashFrames > 0) player.dashFrames = 0; // stop dash if hitting wall
            } else if (player.vx < 0 && player.x > block.x + block.width) {
                player.x = block.x + block.width + player.radius + 0.1;
                if (player.dashFrames > 0) player.dashFrames = 0; // stop dash if hitting wall
            }
        }
    }
}

function handleVerticalBlockCollision(blockArray, bounceMult = 1, isJumpPad = false) {
    for (const block of blockArray) {
        if (!block || block.state === 'broken' || block.state === 'invisible' || block.state === 'falling') continue;

        if (checkCircleRectCollision(player, block)) {
            if (player.vy > 0 && player.y < block.y) {
                player.y = block.y - player.radius - 0.1;
                player.vy = isJumpPad ? SUPER_BOUNCE : BOUNCE_VELOCITY * bounceMult;

                if (block.timer === 0 && block.state === 'solid') {
                    block.timer = 1; // start breaking/falling timer
                }

            } else if (player.vy < 0 && player.y > block.y + block.height) {
                player.y = block.y + block.height + player.radius + 0.1;
                player.vy = 0;
            }
        }
    }
}

function updatePhysics() {
    if (gameState !== 'playing') return;

    // ----- X AXIS & DASH LOGIC -----
    if (player.dashFrames > 0) {
        player.dashFrames--;
        player.vx = player.dashDir * DASH_SPEED;
        player.vy = 0; // Dashing hovers the player momentarily
    } else {
        if (keys.ArrowLeft) player.vx = -MOVE_SPEED;
        else if (keys.ArrowRight) player.vx = MOVE_SPEED;
        else player.vx = 0;
    }

    player.x += player.vx;
    if (player.x - player.radius < 0) player.x = player.radius;
    if (player.x + player.radius > canvas.width) player.x = canvas.width - player.radius;

    handleBlockCollision(blocks);
    handleBlockCollision(jumpPads);
    handleBlockCollision(fragileBlocks);
    handleBlockCollision(blinkBlocks);
    handleBlockCollision(fallingBlocks);

    // ----- Y AXIS LOGIC -----
    if (player.dashFrames === 0) {
        player.vy += GRAVITY;
    }
    player.y += player.vy;

    handleVerticalBlockCollision(blocks);
    handleVerticalBlockCollision(jumpPads, 1, true);
    handleVerticalBlockCollision(fragileBlocks);
    handleVerticalBlockCollision(blinkBlocks);
    handleVerticalBlockCollision(fallingBlocks);

    // ----- ENTITIES ----- //

    // Moving Buzzsaws
    for (const saw of buzzsaws) {
        saw.x += saw.vx;
        saw.angle += 0.2 * Math.sign(saw.vx);

        let sawHitbox = { x: saw.x - saw.radius, y: saw.y - saw.radius, width: saw.radius * 2, height: saw.radius * 2 };
        for (const block of blocks) {
            if (checkRectRectCollision(sawHitbox, block)) {
                saw.vx *= -1;
                saw.x += saw.vx * 2;
                break;
            }
        }
        if (checkCircleCircleCollision(player, saw)) killPlayer();
    }

    // Unlocking Dash Items
    for (const item of dashItems) {
        if (item.active && checkCircleRectCollision(player, item)) {
            item.active = false;
            player.dashCharges++;
        }
        item.offset = Math.sin(Date.now() / 150) * 4; // Hover animation
    }

    // Update Fragile Blocks
    for (let i = 0; i < fragileBlocks.length; i++) {
        let f = fragileBlocks[i];
        if (f.timer > 0) {
            f.timer++;
            if (f.timer > 15) {
                f.state = 'broken';
            }
        }
    }

    // Update Blink Blocks
    for (const block of blinkBlocks) {
        block.timer++;
        if (block.timer > 90) { // Toggle state every 1.5 seconds (90 frames)
            block.timer = 0;
            block.state = (block.state === 'solid') ? 'invisible' : 'solid';
        }
    }

    // Update Falling Blocks
    for (const block of fallingBlocks) {
        if (block.timer > 0) {
            block.timer++;
            if (block.timer > 20) { // starts falling after 0.33s
                block.state = 'falling';
                block.vy = (block.vy || 0) + 0.4;
                block.y += block.vy;
            }
        }
    }

    // Portal Cooldown
    if (portalCooldown > 0) {
        portalCooldown--;
    }

    // Portal Teleportation
    if (portalCooldown === 0) {
        for (const portal of portals) {
            if (checkCircleCircleCollision(player, portal)) {
                if (portal.partner) {
                    player.x = portal.partner.x;
                    player.y = portal.partner.y;
                    portalCooldown = 30; // 0.5s cooldown
                    break;
                }
            }
        }
    }

    // Spike Collision
    for (const spike of spikes) {
        let spikeHitbox = {
            x: spike.x + 8,
            y: spike.y + 18,
            width: spike.width - 16,
            height: spike.height - 18
        };
        if (checkCircleRectCollision(player, spikeHitbox)) killPlayer();
    }

    // Goal
    if (goal && checkCircleRectCollision(player, goal)) {
        gameState = 'win';
        setTimeout(() => {
            currentLevel++;
            loadLevel(currentLevel);
        }, 800);
    }

    // Fall
    if (player.y > canvas.height + 100) killPlayer();
}

function draw() {
    if (gameState === 'lobby') return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Sky gradient
    let grad = ctx.createLinearGradient(0, 0, 0, canvas.height);
    grad.addColorStop(0, '#c2e9fb');
    grad.addColorStop(1, '#a1c4fd');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Grid pattern 
    ctx.strokeStyle = 'rgba(255,255,255,0.4)';
    ctx.lineWidth = 1;
    for (let i = 0; i < canvas.width; i += BLOCK_SIZE) {
        ctx.beginPath(); ctx.moveTo(i, 0); ctx.lineTo(i, canvas.height); ctx.stroke();
    }
    for (let i = 0; i < canvas.height; i += BLOCK_SIZE) {
        ctx.beginPath(); ctx.moveTo(0, i); ctx.lineTo(canvas.width, i); ctx.stroke();
    }

    // Dash Items
    for (const item of dashItems) {
        if (!item.active) continue;
        ctx.fillStyle = '#00e5ff'; // Cyan
        ctx.beginPath();
        // Draw diamond
        ctx.moveTo(item.x + item.width / 2, item.y + item.offset);
        ctx.lineTo(item.x + item.width, item.y + item.height / 2 + item.offset);
        ctx.lineTo(item.x + item.width / 2, item.y + item.height + item.offset);
        ctx.lineTo(item.x, item.y + item.height / 2 + item.offset);
        ctx.closePath();
        ctx.fill();

        ctx.strokeStyle = '#fff';
        ctx.lineWidth = 2;
        ctx.stroke();
    }

    // Draw Blocks
    for (const block of blocks) {
        ctx.fillStyle = '#bdc3c7';
        ctx.fillRect(block.x, block.y, block.width, block.height);

        ctx.fillStyle = '#95a5a6';
        ctx.fillRect(block.x, block.y, block.width, block.height / 2);

        ctx.strokeStyle = '#2c3e50';
        ctx.lineWidth = 2;
        ctx.strokeRect(block.x, block.y, block.width, block.height);
    }

    // Draw Fragile Blocks
    for (const block of fragileBlocks) {
        if (block.state === 'broken') continue;

        ctx.fillStyle = block.timer > 0 ? 'rgba(236, 240, 241, 0.5)' : '#ecf0f1';
        ctx.fillRect(block.x, block.y, block.width, block.height);

        ctx.strokeStyle = block.timer > 0 ? '#e74c3c' : '#7f8c8d';
        ctx.lineWidth = 2;
        ctx.setLineDash([5, 5]);
        ctx.strokeRect(block.x, block.y, block.width, block.height);
        ctx.setLineDash([]);
    }

    // Draw Blink Blocks
    for (const block of blinkBlocks) {
        ctx.save();
        if (block.state === 'invisible') {
            ctx.globalAlpha = 0.15; // Ghost outline
        }
        ctx.fillStyle = '#9b59b6'; // Purple
        ctx.fillRect(block.x, block.y, block.width, block.height);

        ctx.fillStyle = '#8e44ad'; // Darker Purple top highlight
        ctx.fillRect(block.x, block.y, block.width, block.height / 2);

        ctx.strokeStyle = '#2c3e50';
        ctx.lineWidth = 2;
        ctx.strokeRect(block.x, block.y, block.width, block.height);
        ctx.restore();
    }

    // Draw Falling Blocks
    for (const block of fallingBlocks) {
        if (block.state === 'broken') continue;
        ctx.fillStyle = '#e67e22'; // Orange/Brown wood color
        ctx.fillRect(block.x, block.y, block.width, block.height);

        ctx.fillStyle = '#d35400'; // Darker bottom
        ctx.fillRect(block.x, block.y + block.height / 2, block.width, block.height / 2);

        ctx.strokeStyle = '#2c3e50';
        ctx.lineWidth = 2;
        ctx.strokeRect(block.x, block.y, block.width, block.height);

        // Draw crack lines
        ctx.strokeStyle = '#7f8c8d';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(block.x + 5, block.y + 5);
        ctx.lineTo(block.x + 15, block.y + 15);
        ctx.lineTo(block.x + 10, block.y + 25);
        ctx.moveTo(block.x + 35, block.y + 10);
        ctx.lineTo(block.x + 25, block.y + 20);
        ctx.lineTo(block.x + 30, block.y + 35);
        ctx.stroke();
    }

    // Draw Portals
    for (const portal of portals) {
        ctx.save();
        ctx.translate(portal.x, portal.y);
        let rotation = (Date.now() / 200) * (portal.type === 'A' ? 1 : -1);
        ctx.rotate(rotation);

        // Swirling effect
        let color1 = portal.type === 'A' ? '#9b59b6' : '#2ecc71'; // Purple/Green
        let color2 = portal.type === 'A' ? '#8e44ad' : '#27ae60';

        // Draw outer ring
        ctx.strokeStyle = color1;
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(0, 0, portal.radius, 0, Math.PI * 1.5);
        ctx.stroke();

        // Draw inner ring
        ctx.strokeStyle = color2;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(0, 0, portal.radius - 5, Math.PI * 0.5, Math.PI * 2);
        ctx.stroke();

        // Center core
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(0, 0, 3, 0, Math.PI * 2);
        ctx.fill();

        ctx.restore();
    }

    // Draw Jump Pads
    for (const pad of jumpPads) {
        ctx.fillStyle = '#3498db';
        ctx.fillRect(pad.x, pad.y, pad.width, pad.height);
        ctx.strokeStyle = '#2980b9';
        ctx.lineWidth = 2;
        ctx.strokeRect(pad.x, pad.y, pad.width, pad.height);

        // Up Arrow
        ctx.fillStyle = 'white';
        ctx.beginPath();
        ctx.moveTo(pad.x + pad.width / 2, pad.y + pad.height * 0.2);
        ctx.lineTo(pad.x + pad.width * 0.8, pad.y + pad.height * 0.8);
        ctx.lineTo(pad.x + pad.width * 0.2, pad.y + pad.height * 0.8);
        ctx.fill();
        ctx.strokeStyle = 'black';
        ctx.lineWidth = 1;
        ctx.stroke();
    }

    // Draw Spikes
    ctx.fillStyle = '#e74c3c';
    for (const spike of spikes) {
        ctx.beginPath();
        ctx.moveTo(spike.x, spike.y + spike.height);
        ctx.lineTo(spike.x + spike.width / 2, spike.y + 10);
        ctx.lineTo(spike.x + spike.width, spike.y + spike.height);
        ctx.fill();
        ctx.lineWidth = 2;
        ctx.strokeStyle = '#c0392b';
        ctx.stroke();
    }

    // Draw Buzzsaws
    for (const saw of buzzsaws) {
        ctx.save();
        ctx.translate(saw.x, saw.y);
        ctx.rotate(saw.angle);

        ctx.fillStyle = '#bdc3c7';
        ctx.beginPath();
        ctx.arc(0, 0, saw.radius - 2, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#7f8c8d';
        ctx.stroke();

        ctx.fillStyle = '#7f8c8d';
        for (let i = 0; i < 8; i++) {
            ctx.rotate(Math.PI / 4);
            ctx.beginPath();
            ctx.moveTo(-5, saw.radius - 3);
            ctx.lineTo(5, saw.radius - 3);
            ctx.lineTo(0, saw.radius + 6);
            ctx.fill();
        }

        ctx.fillStyle = '#2c3e50';
        ctx.beginPath();
        ctx.arc(0, 0, 4, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
    }

    // Goal (Star)
    if (goal) {
        let cx = goal.x + goal.width / 2;
        let cy = goal.y + goal.height / 2;
        let spikes = 5;
        let outerRadius = goal.width / 2.5;
        let innerRadius = goal.width / 5;

        let rot = Math.PI / 2 * 3;
        let starX = cx; let starY = cy;
        let step = Math.PI / spikes;

        ctx.beginPath();
        ctx.moveTo(cx, cy - outerRadius);
        for (let i = 0; i < spikes; i++) {
            starX = cx + Math.cos(rot) * outerRadius;
            starY = cy + Math.sin(rot) * outerRadius;
            ctx.lineTo(starX, starY);
            rot += step;

            starX = cx + Math.cos(rot) * innerRadius;
            starY = cy + Math.sin(rot) * innerRadius;
            ctx.lineTo(starX, starY);
            rot += step;
        }
        ctx.lineTo(cx, cy - outerRadius);
        ctx.closePath();

        ctx.fillStyle = '#f1c40f';
        ctx.fill();
        ctx.strokeStyle = '#000';
        ctx.lineWidth = 2;
        ctx.stroke();
    }

    // Dash trail effects
    if (player.dashFrames > 0 && gameState !== 'dead') {
        ctx.fillStyle = 'rgba(46, 204, 113, 0.4)';
        for (let i = 1; i <= 3; i++) {
            ctx.beginPath();
            ctx.arc(player.x - player.dashDir * i * 15, player.y, player.radius * (1 - i * 0.2), 0, Math.PI * 2);
            ctx.fill();
        }
    }

    // Draw Player (Rotating Watermelon)
    if (gameState !== 'dead') {
        player.angle = (player.angle || 0) + player.vx * 0.05;

        ctx.save();
        ctx.translate(player.x, player.y);
        ctx.rotate(player.angle);

        ctx.fillStyle = '#2ecc71';
        ctx.beginPath();
        ctx.arc(0, 0, player.radius, 0, Math.PI * 2);
        ctx.fill();

        ctx.strokeStyle = '#186a3b';
        ctx.lineWidth = 3;
        ctx.lineCap = 'round';

        ctx.beginPath();
        ctx.moveTo(0, -player.radius);
        ctx.quadraticCurveTo(4, 0, 0, player.radius);
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(-player.radius * 0.7, -player.radius * 0.7);
        ctx.quadraticCurveTo(-player.radius * 0.3, 0, -player.radius * 0.7, player.radius * 0.7);
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(player.radius * 0.7, -player.radius * 0.7);
        ctx.quadraticCurveTo(player.radius * 0.3, 0, player.radius * 0.7, player.radius * 0.7);
        ctx.stroke();

        ctx.strokeStyle = '#000';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(0, 0, player.radius, 0, Math.PI * 2);
        ctx.stroke();
        ctx.restore();

        ctx.fillStyle = 'rgba(255,255,255,0.7)';
        ctx.beginPath();
        ctx.arc(player.x - 4, player.y - 5, player.radius * 0.3, 0, Math.PI * 2);
        ctx.fill();
    }

    // UI Overlay for Dash Charges
    if (player.dashCharges > 0) {
        ctx.textAlign = 'left';
        ctx.fillStyle = '#000';
        ctx.font = 'bold 24px "Comic Sans MS"';
        ctx.fillText('DASH: ', 20, 40);
        for(let i=0; i<player.dashCharges; i++) {
            ctx.fillStyle = '#00e5ff'; // dash icon
            let startX = 105 + i*30;
            let startY = 20;
            let size = 20;

            ctx.strokeStyle = '#000';
            ctx.lineWidth = 1.5;

            // Draw first arrow chevron
            ctx.beginPath();
            ctx.moveTo(startX + 2, startY + 2);
            ctx.lineTo(startX + size/2 - 2, startY + size/2);
            ctx.lineTo(startX + 2, startY + size - 2);
            ctx.lineTo(startX + size/4 + 2, startY + size/2);
            ctx.closePath();
            ctx.fill();
            ctx.stroke();

            // Draw second arrow chevron
            ctx.beginPath();
            ctx.moveTo(startX + size/2 - 2, startY + 2);
            ctx.lineTo(startX + size - 2, startY + size/2);
            ctx.lineTo(startX + size/2 - 2, startY + size - 2);
            ctx.lineTo(startX + 3*size/4 - 2, startY + size/2);
            ctx.closePath();
            ctx.fill();
            ctx.stroke();
        }
    }

    // Overlays
    if (gameState === 'dead') {
        ctx.fillStyle = 'rgba(231, 76, 60, 0.4)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    } else if (gameState === 'win') {
        ctx.fillStyle = 'rgba(255,255,255,0.6)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = '#000';
        ctx.font = 'bold 80px "Comic Sans MS"';
        ctx.textAlign = 'center';
        ctx.fillText('CLEAR!', canvas.width / 2, canvas.height / 2);
    } else if (gameState === 'win_all') {
        ctx.fillStyle = 'rgba(0,0,0,0.8)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = '#f1c40f';
        ctx.font = 'bold 80px "Comic Sans MS"';
        ctx.textAlign = 'center';
        ctx.fillText('ALL STAGES CLEARED!', canvas.width / 2, canvas.height / 2 - 40);
    }
}

function gameLoop() {
    if (gameState !== 'lobby') {
        updatePhysics();
        draw();
    }
    requestAnimationFrame(gameLoop);
}

gameLoop();
