const body=document.querySelector('body')
const main = document.getElementById('main');
const start = document.getElementById('start')
const clock = document.getElementById('clock')
const gameOver = document.createElement('div')
gameOver.id = "gameover"
gameOver.textContent="GAME-OVER"
body.appendChild(gameOver)

let arr = [
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 1, 0, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1],
    [1, 0, 1, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1],
    [1, 0, 1, 1, 1, 1, 1, 1, 0, 1, 0, 1, 0, 1, 1, 1, 0, 1, 0, 1, 0, 0, 0, 1],
    [1, 0, 1, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 1, 0, 0, 0, 1, 0, 1, 0, 1, 0, 1],
    [1, 0, 1, 0, 1, 0, 0, 0, 0, 1, 0, 1, 0, 1, 0, 0, 0, 1, 0, 1, 0, 1, 0, 1],
    [1, 0, 1, 0, 1, 1, 1, 1, 0, 1, 0, 1, 0, 1, 1, 1, 0, 1, 0, 1, 0, 1, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 1, 1, 1, 1, 1, 1, 0, 1, 0, 1, 0, 1, 1, 1, 0, 1, 0, 1, 0, 0, 0, 1],
    [1, 0, 1, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 1, 0, 0, 0, 1, 0, 1, 0, 1, 0, 1],
    [1, 0, 1, 0, 1, 0, 0, 0, 0, 1, 0, 1, 0, 1, 0, 0, 0, 1, 0, 1, 0, 1, 0, 1],
    [1, 0, 1, 0, 1, 1, 1, 1, 0, 1, 0, 1, 0, 1, 1, 1, 0, 1, 0, 1, 0, 1, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
];

let pacPosition = { x: 1, y: 1 };
let ghostPosition = { x: 5, y: 5 };
let currentDirection = { x: 0, y: 1 };
let ghostHelper1Position = { x: 14, y: 8 }
let ghostHelper1Direction = { x: 0, y: 1 }
let ghostHelper2Position = { x: 22, y: 13 }
let ghostHelper2Direction={x:0,y:1}
let intervalOut;

const images = {
    wall: new Image(),
    yellowDot: new Image(),
    pac1: new Image(),
    empty: new Image(),
    ghost: new Image(),
    ghostHelper1: new Image(),
    ghostHelper2:new Image()
};

images.wall.src = "./images/wall.png";
images.yellowDot.src = "./images/yellowDot.png";
images.pac1.src = "./images/pac1.png";
images.empty.src = "./images/empty.png";
images.ghost.src = "./images/ghost.png";
images.ghostHelper1.src = "./images/scaredGhost.png"
images.ghostHelper2.src="./images/scaredGhost2.png"


function preloadImages() {
    return Promise.all([
        images.wall.onload,
        images.yellowDot.onload,
        images.pac1.onload,
        images.empty.onload,
        images.ghost.onload,
        images.ghostHelper1.onload,
        images.ghostHelper2.onload

    ]);
}

async function renderCanvas() {
    await preloadImages();

    const fragment = document.createDocumentFragment();

    arr.forEach((e, row) => {
        e.forEach((n, col) => {
            const tile = document.createElement('img');
            if (row === pacPosition.y && col === pacPosition.x) {
                tile.src = images.pac1.src;
                tile.id = "pacman";
            } else if (row === ghostPosition.y && col === ghostPosition.x) {
                tile.src = images.ghost.src;
            } else if (row === ghostHelper1Position.y && col === ghostHelper1Position.x) {
                tile.src = images.ghostHelper1.src;
            } else if (row === ghostHelper2Position.y && col === ghostHelper2Position.x) {
                tile.src = images.ghostHelper2.src;
            } else if (n === 1) {
                tile.src = images.wall.src;
            } else if (n === 0) {
                tile.src = images.yellowDot.src;
            } else {
                tile.src = images.empty.src;
            } 
            fragment.appendChild(tile);
        });
    });

    main.innerHTML = "";
    main.appendChild(fragment);
}

async function gameOverCanvas() {
    console.log('gameover canvas')
    main.innerHTML = "";

    await preloadImages();

    const fragment = document.createDocumentFragment();

    arr.forEach((e, row) => {
        e.forEach((n, col) => {
            const tile = document.createElement('img');
             if (n === 1) {
                tile.src = images.wall.src;
            } else{
                tile.src = images.empty.src;
            } 
            fragment.appendChild(tile);
        });
    });

    main.appendChild(fragment);
}

function handleMotion(key) {
    let newPosition = { ...pacPosition };
    switch (key) {
        case "ArrowDown":
            newPosition.y = newPosition.y + 1;
            break;
        case "ArrowUp":
            newPosition.y = newPosition.y - 1;
            break;
        case "ArrowLeft":
            newPosition.x = newPosition.x - 1;
            break;
        case "ArrowRight":
            newPosition.x = newPosition.x + 1;
            break;
    }

    if (
        newPosition.y >= 0 &&
        newPosition.y < arr.length &&
        newPosition.x >= 0 &&
        newPosition.x < arr[0].length &&
        arr[newPosition.y][newPosition.x] !== 1
    ) {
        arr[pacPosition.y][pacPosition.x] = 3;

        pacPosition = newPosition;
    }
}

function moveGhost() {
    if ((ghostPosition.x === pacPosition.x && ghostPosition.y === pacPosition.y) ||
        (ghostHelper1Position.x === pacPosition.x && ghostHelper1Position.y === pacPosition.y) ||
    (ghostHelper2Position.x === pacPosition.x && ghostHelper2Position.y === pacPosition.y)) {
        gameOverCanvas()
        clearInterval(intervalOut)
        renderGameOver()
        return;
  }
    const currentX = ghostPosition.x;
    const currentY = ghostPosition.y;
    const currentHelper1X = ghostHelper1Position.x
    const currentHelper1Y = ghostHelper1Position.y
    const currentHelper2X = ghostHelper2Position.x
    const currentHelper2Y = ghostHelper2Position.y
    

    const nextX = currentX + currentDirection.x;
    const nextY = currentY + currentDirection.y;
    const nextHelper1X = currentHelper1X + ghostHelper1Direction.x
    const nextHelper1Y = currentHelper1Y + ghostHelper1Direction.y
    const nextHelper2X = currentHelper2X + ghostHelper2Direction.x
    const nextHelper2Y = currentHelper2Y + ghostHelper2Direction.y
    

    if (isValidMove(nextX, nextY)) {
        ghostPosition.x = nextX;
        ghostPosition.y = nextY;
    } else {
        currentDirection = getRandomDirection();
    }

    if (isValidMove(nextHelper1X, nextHelper1Y)) {
        ghostHelper1Position.x = nextHelper1X
        ghostHelper1Position.y=nextHelper1Y
    } else {
        ghostHelper1Direction=getRandomDirection()
    }
    if (isValidMove(nextHelper2X, nextHelper2Y)) {
        ghostHelper2Position.x = nextHelper2X
        ghostHelper2Position.y=nextHelper2Y
    } else {
        ghostHelper2Direction=getRandomDirection()
    }
    
    renderCanvas()
}

function isValidMove(x, y) {
    return x >= 0 && x < arr[0].length && y >= 0 && y < arr.length && arr[y][x] !== 1;
}

function getRandomDirection() {
    const directions = [
        { x: 0, y: 1 },  // Down
        { x: 0, y: -1 }, // Up
        { x: 1, y: 0 },  // Right
        { x: -1, y: 0 }   // Left
    ];

    const randomIndex = Math.floor(Math.random() * directions.length);
    return directions[randomIndex];
}

function startGame() {
    let remainingTime = parseInt(clock.textContent, 10);

    const interval = setInterval(() => {
        remainingTime = remainingTime - 1;
        clock.textContent = remainingTime;

        if (remainingTime === 0) {
            clearInterval(interval);
            start.style.display = "none";
            intervalOut = setInterval(moveGhost, 100);
        }
    }, 1000);
}

function renderGameOver() {
    gameOver.style.display = "flex";

    setTimeout(() => {
        restartGame();
    }, 5000);
}

async function restartGame() {
    arr=[
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
        [1, 0, 1, 0, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1],
        [1, 0, 1, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1],
        [1, 0, 1, 1, 1, 1, 1, 1, 0, 1, 0, 1, 0, 1, 1, 1, 0, 1, 0, 1, 0, 0, 0, 1],
        [1, 0, 1, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 1, 0, 0, 0, 1, 0, 1, 0, 1, 0, 1],
        [1, 0, 1, 0, 1, 0, 0, 0, 0, 1, 0, 1, 0, 1, 0, 0, 0, 1, 0, 1, 0, 1, 0, 1],
        [1, 0, 1, 0, 1, 1, 1, 1, 0, 1, 0, 1, 0, 1, 1, 1, 0, 1, 0, 1, 0, 1, 0, 1],
        [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
        [1, 0, 1, 1, 1, 1, 1, 1, 0, 1, 0, 1, 0, 1, 1, 1, 0, 1, 0, 1, 0, 0, 0, 1],
        [1, 0, 1, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 1, 0, 0, 0, 1, 0, 1, 0, 1, 0, 1],
        [1, 0, 1, 0, 1, 0, 0, 0, 0, 1, 0, 1, 0, 1, 0, 0, 0, 1, 0, 1, 0, 1, 0, 1],
        [1, 0, 1, 0, 1, 1, 1, 1, 0, 1, 0, 1, 0, 1, 1, 1, 0, 1, 0, 1, 0, 1, 0, 1],
        [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    ]
    pacPosition = { x: 1, y: 1 };
    ghostPosition = { x: 5, y: 5 };
    currentDirection = { x: 0, y: 1 };
    ghostHelper1Position = { x: 14, y: 8 };
    ghostHelper1Direction = { x: 0, y: 1 };
    ghostHelper2Position = { x: 22, y: 13 };
    ghostHelper2Direction = { x: 0, y: 1 };
    intervalOut = null;
    clock.textContent = "5";
    start.style.display = "flex";
    gameOver.style.display = "none";

    if (intervalOut) {
        clearInterval(intervalOut);
    }
    startGame();
    renderCanvas();
    
}
function handleEvent(e) {
    handleMotion(e.key);
    e.preventDefault();
}

startGame()
window.addEventListener("keydown", handleEvent);
renderCanvas();
