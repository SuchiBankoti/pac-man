const main = document.getElementById('main');

let arr = [
    // 0  1  2  3  4  5  6  7  8  9 10 11 12 13 14 15
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
let ghostPosition = { x: 14, y: 8 };

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


async function ghostMotion() {
    console.log(pacPosition)

    let diffX = ghostPosition.x - pacPosition.x;
    let diffY = ghostPosition.y - pacPosition.y;
    let newX = ghostPosition.x;
    let newY = ghostPosition.y;
    if (diffX === 0 && diffY === 0) {
        return
    } else if (diffX !== 0 && diffY !== 0) {
        if (Math.abs(diffY) < Math.abs(diffX)) {
            if (diffY > 0) {
                newY = newY - 1;
            } else {
                newY = newY + 1;
            }
        } else {
            if (diffX > 0) {
                newX = newX - 1;
            } else {
                newX = newX + 1;
            }
        }
    } else if (diffX===0 && diffY) {
        
    }
    
    if (
        newY >= 0 &&
        newY < arr.length &&
        newX >= 0 &&
        newX < arr[0].length &&
        arr[newY][newX] !== 1
    ) {
        ghostPosition = { ...ghostPosition, x: newX, y: newY };
        await renderCanvas();
    }

}

setInterval(ghostMotion, 500);

function handleEvent(e) {
    handleMotion(e.key);
    e.preventDefault();
}

window.addEventListener("keydown", handleEvent);
renderCanvas();
