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
let pacDirection="right"
let ghostPosition = { x: 5, y: 5 };
let currentDirection = { x: 0, y: 1 };
let ghostHelper1Position = { x: 14, y: 8 }
let ghostHelper1Direction = { x: 0, y: 1 }
let ghostHelper2Position = { x: 22, y: 13 }
let ghostHelper2Direction={x:0,y:1}
let intervalOut;
let isMouthOpen=false

const images = {
    wall: new Image(),
    yellowDot: new Image(),
    pac1right: new Image(),
    pac2right: new Image(),
    pac1left: new Image(),
    pac2left: new Image(),
    pac1up: new Image(),
    pac2up: new Image(),
    pac1down: new Image(),
    pac2down:new Image(),
    empty: new Image(),
    ghost: new Image(),
    ghostHelper1: new Image(),
    ghostHelper2:new Image()
};

images.wall.src = "./images/wall.png";
images.yellowDot.src = "./images/yellowDot.png";
images.pac1right.src = "./images/pac1right.png";
images.pac2right.src = "./images/pac2right.png";
images.pac1left.src = "./images/pac1left.png";
images.pac2left.src = "./images/pac2left.png";

images.pac1up.src = "./images/pac1up.png";
images.pac2up.src = "./images/pac2up.png";
images.pac1down.src = "./images/pac1down.png";
images.pac2down.src = "./images/pac2down.png";


images.empty.src = "./images/empty.png";
images.ghost.src = "./images/ghost.png";
images.ghostHelper1.src = "./images/scaredGhost.png"
images.ghostHelper2.src="./images/scaredGhost2.png"


function preloadImages() {
    return Promise.all([
        images.wall.onload,
        images.yellowDot.onload,
        images.pac1right.onload,
        images.pac2right.onload,
        images.pac1left.onload,
        images.pac2left.onload,
        images.pac1up.onload,
        images.pac2up.onload,
        images.pac1down.onload,
        images.pac2down.onload,
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
                isMouthOpen = !isMouthOpen
                if (isMouthOpen) {
                    switch (pacDirection) {
                        case "right":
                            tile.src = images.pac2right.src
                            break;
                        case "left":
                            tile.src = images.pac2left.src
                            break;
                        case "up":
                            tile.src = images.pac2up.src
                            break;
                        case "down":
                            tile.src = images.pac2down.src
                            break;
                    }
                    
                } else {
                    switch (pacDirection) {
                        case "right":
                            tile.src = images.pac1right.src
                            break;
                        case "left":
                            tile.src = images.pac1left.src
                            break;
                        case "up":
                            tile.src = images.pac1up.src
                            break;
                        case "down":
                            tile.src = images.pac1down.src
                            break;
                    }
                }
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
            pacDirection="down"
            break;
        case "ArrowUp":
            newPosition.y = newPosition.y - 1;
            pacDirection="up"
            break;
        case "ArrowLeft":
            newPosition.x = newPosition.x - 1;
            pacDirection="left"
            break;
        case "ArrowRight":
            newPosition.x = newPosition.x + 1;
            pacDirection="right"
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
           renderCanvas();
            intervalOut = setInterval(moveGhost, 300);
        }
    }, 1000);
}

function renderGameOver() {
    gameOver.style.display="flex"
    
}

function handleEvent(e) {
    handleMotion(e.key);
    e.preventDefault();
}

startGame()
window.addEventListener("keydown", handleEvent);
gameOverCanvas()