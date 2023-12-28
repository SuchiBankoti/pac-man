const main = document.getElementById('main');

let arr = [
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 1, 0, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1],
    [1, 0, 1, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1],
    [1, 0, 1, 1, 1, 1, 1, 1, 0, 1, 0, 1, 0, 0, 0, 1],
    [1, 0, 1, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 1, 0, 1],
    [1, 0, 1, 0, 1, 0, 0, 0, 0, 1, 0, 1, 0, 1, 0, 1],
    [1, 0, 1, 0, 1, 1, 1, 1, 0, 1, 0, 1, 0, 1, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
];

let pacPosition = { x: 1, y: 1 };

const images = {
    wall: new Image(),
    yellowDot: new Image(),
    pac1: new Image(),
    empty: new Image(),
    ghost: new Image(),
};

images.wall.src = "./images/wall.png";
images.yellowDot.src = "./images/yellowDot.png";
images.pac1.src = "./images/pac1.png";
images.empty.src = "./images/empty.png";
images.ghost.src = "./images/ghost.png";

function preloadImages() {
    return Promise.all([
        images.wall.onload,
        images.yellowDot.onload,
        images.pac1.onload,
        images.empty.onload,
        images.ghost.onload,
    ]);
}

async function renderCanvas() {
    await preloadImages();

    main.innerHTML = "";
    arr.forEach((e, row) => {
        e.forEach((n, col) => {
            const tile = document.createElement('img');
            if (row === pacPosition.y && col === pacPosition.x) {
                tile.src = images.pac1.src;
                tile.id = "pacman";
            } else if (row === ghostPosition.y && col === ghostPosition.x) {
                tile.src = images.ghost.src;
            } else if (n === 1) {
                tile.src = images.wall.src;
            } else if (n === 0) {
                tile.src = images.yellowDot.src;
            } else {
                tile.src = images.empty.src;
            }
            main.appendChild(tile);
        });
    });
}

async function handleMotion(key) {
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
        await renderCanvas();
    }
}




let ghostPosition = { x: 5, y: 5 };
let currentDirection = { x: 0, y: 1 };

function moveGhost() {
    const currentX = ghostPosition.x;
    const currentY = ghostPosition.y;

    const nextX = currentX + currentDirection.x;
    const nextY = currentY + currentDirection.y;

    if (isValidMove(nextX, nextY)) {
        ghostPosition.x = nextX;
        ghostPosition.y = nextY;
    } else {
        currentDirection = getRandomDirection();
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


setInterval(moveGhost, 300);



function handleEvent(e) {
    handleMotion(e.key);
    e.preventDefault();
}

window.addEventListener("keydown", handleEvent);
renderCanvas();
