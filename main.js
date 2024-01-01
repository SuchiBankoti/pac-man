const body=document.querySelector('body')
const main = document.getElementById('main');
const start = document.getElementById('start')
const clock = document.getElementById('clock')
const gameOver = document.getElementById('gameover')
const scoreCard = document.getElementById('scorecard')
const player = document.getElementById('player')
const points=document.getElementById('points')
const gameScore = document.getElementById('score')
const intro = document.getElementById('intro')
const input = document.getElementById('username')
const introBtn = document.getElementById('btn')
const err = document.querySelector('.errMsg')
const restartBtn = document.getElementById('restartBtn')
const viewScoresBtn = document.getElementById('viewBtn')
const overlay = document.getElementById('overlay')
const allPlayers=document.getElementById('players')

let arr = [
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 1, 0, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1],
    [1, 0, 1, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1],
    [1, 0, 1, 1, 1, 1, 1, 1, 0, 1, 0, 1, 0, 1, 0, 1],
    [1, 0, 1, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 1, 0, 1],
    [1, 0, 1, 0, 1, 0, 0, 0, 0, 1, 0, 1, 0, 1, 0, 1],
    [1, 0, 1, 0, 1, 1, 1, 1, 0, 1, 0, 1, 0, 1, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 1, 1, 1, 1, 1, 1, 0, 1, 0, 1, 0, 1, 0, 1],
    [1, 0, 1, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 1, 0, 1],
    [1, 0, 1, 0, 1, 0, 0, 0, 0, 1, 0, 1, 0, 1, 0, 1],
    [1, 0, 1, 0, 1, 0, 0, 0, 0, 1, 0, 1, 0, 1, 0, 1],
    [1, 0, 1, 1, 1, 1, 1, 1, 0, 1, 0, 1, 0, 1, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
];
let username;
main.style.gridTemplateColumns = `repeat(16 ,20px)`
main.style.gridTemplateRows=`repeat(16,20px)`
let pacPosition = { x: 1, y: 1 };
let pacDirection="right"
let ghostPosition = { x: 5, y: 5 };
let currentDirection = { x: 0, y: 1 };
let ghostHelper1Position = { x: 14, y: 8 }
let ghostHelper1Direction = { x: 0, y: 1 }
let ghostHelper2Position = { x: 12, y: 14 }
let ghostHelper2Direction={x:0,y:1}
let intervalOut;
let isMouthOpen = false
let score = 0
let gameStarted = false
let touchStartX = null;
let touchStartY = null;

const keyAudio = new Audio('https://commondatastorage.googleapis.com/codeskulptor-demos/pyman_assets/eatpellet.ogg');
const overAudio = new Audio('https://codeskulptor-demos.commondatastorage.googleapis.com/GalaxyInvaders/bonus.wav');
const startAudio=new Audio('https://codeskulptor-demos.commondatastorage.googleapis.com/pang/paza-moduless.mp3')
keyAudio.load();
overAudio.load();
startAudio.load();
    
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
images.yellowDot.src = "./images/dot.png";
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
            tile.className = 'tile';
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
                tile.className='dot'
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
            tile.className='tile'
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
    if (gameStarted) {
        
       playOnkey()

        let newPosition = { ...pacPosition };
        switch (key) {
            case "ArrowDown":
                newPosition.y = newPosition.y + 1;
                pacDirection = "down"
                break;
            case "ArrowUp":
                newPosition.y = newPosition.y - 1;
                pacDirection = "up"
                break;
            case "ArrowLeft":
                newPosition.x = newPosition.x - 1;
                pacDirection = "left"
                break;
            case "ArrowRight":
                newPosition.x = newPosition.x + 1;
                pacDirection = "right"
                break;
        }
        if (
            newPosition.y >= 0 &&
            newPosition.y < arr.length &&
            newPosition.x >= 0 &&
            newPosition.x < arr[0].length &&
            arr[newPosition.y][newPosition.x] !== 1
        ) {
            if (arr[newPosition.y][newPosition.x] === 0) {
                score = score + 1
                gameScore.textContent = score
            }
            if ((newPosition.y === ghostPosition.y && newPosition.x === ghostPosition.x) ||
                (newPosition.y === ghostHelper1Position.y && newPosition.x === ghostHelper1Position.x) ||
                (newPosition.y === ghostHelper2Position.y && newPosition.x === ghostHelper2Position.x)) {
                renderGameOver()
                return;
            }
            arr[pacPosition.y][pacPosition.x] = 3;
            pacPosition = newPosition;
        }
    }
}

function moveGhost() {
    
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
        if (nextX === pacPosition.x && nextY === pacPosition.y) {
            renderGameOver()
            return
        }
    } else {
        currentDirection = getRandomDirection();
    }

    if (isValidMove(nextHelper1X, nextHelper1Y)) {
        ghostHelper1Position.x = nextHelper1X
        ghostHelper1Position.y = nextHelper1Y
        if (nextHelper1X === pacPosition.x && nextHelper1Y === pacPosition.y) {
            renderGameOver()
            return
        }
    } else {
        ghostHelper1Direction=getRandomDirection()
    }
    if (isValidMove(nextHelper2X, nextHelper2Y)) {
        ghostHelper2Position.x = nextHelper2X
        ghostHelper2Position.y = nextHelper2Y
        if (nextHelper2X === pacPosition.x && nextHelper2Y === pacPosition.y) {
            renderGameOver()
            return
        }
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
     playOnStart()
    let remainingTime = parseInt(clock.textContent, 10);
      
   
    const interval = setInterval(() => {
        remainingTime = remainingTime - 1;
        clock.textContent = remainingTime;

        if (remainingTime === 0) {
            gameStarted=true
            clearInterval(interval);
            start.style.display = "none";
            renderCanvas();
            startAudio.pause()
            intervalOut = setInterval(moveGhost, 500);
        }
    }, 1000);
}

function renderGameOver() {
    playOnGameOver()
    gameOverCanvas()
    clearInterval(intervalOut)
    handleScore()
    player.textContent = username
    points.textContent = score
    gameOver.style.display = "flex"
    gameStarted=false
    restartBtn.style.visibility = 'visible'
    viewScoresBtn.style.visibility='visible'
    
}
function resetGame() {
    restartBtn.style.visibility = 'hidden'
    viewScoresBtn.style.visibility='hidden'
 overAudio.pause()
 pacPosition = { x: 1, y: 1 };
 pacDirection="right"
 ghostPosition = { x: 5, y: 5 };
 currentDirection = { x: 0, y: 1 };
 ghostHelper1Position = { x: 14, y: 8 }
 ghostHelper1Direction = { x: 0, y: 1 }
 ghostHelper2Position = { x: 22, y: 13 }
 ghostHelper2Direction={x:0,y:1}
 intervalOut;
 isMouthOpen = false
 score = 0
    gameScore.textContent = 0
    clock.textContent=5
 gameOver.style.display = 'none'
    start.style.display = 'flex'
    arr.forEach((e,y) => {
        e.forEach((n,x)=> {
            if (n === 3) {
                arr[y][x]=0
            }
        })
    })
    startGame()
}
function handleEvent(e) {
    if (e.target == input) {
        return
    }
    handleMotion(e.key);
    e.preventDefault();
}
function handleTouchStart(event) {
    touchStartX = event.touches[0].clientX;
    touchStartY = event.touches[0].clientY;
}
function handleTouchMove(event) {
    if (!touchStartX || !touchStartY) {
        return;
    }

    let touchEndX = event.touches[0].clientX;
    let touchEndY = event.touches[0].clientY;

    let deltaX = touchEndX - touchStartX;
    let deltaY = touchEndY - touchStartY;

    touchStartX = null;
    touchStartY = null;

    if (Math.abs(deltaX) > Math.abs(deltaY)) {
        if (deltaX > 0) {
            handleMotion("ArrowRight");
        } else {
            handleMotion("ArrowLeft");
        }
    } else {
        if (deltaY > 0) {
            handleMotion("ArrowDown");
        } else {
            handleMotion("ArrowUp");
        }
    }

    event.preventDefault();
}
function playOnkey() {
    keyAudio.currentTime = 0
    keyAudio.play()
}
function playOnGameOver() {
    overAudio.currentTime = 0
    overAudio.play()
}
function playOnStart() {
    startAudio.currentTime = 0
    startAudio.play()
}
function removeIntro() {
    if (input.value) {
        handleUser()
        intro.style.display = 'none'
        startGame()
    } else {
        err.style.visibility='visible';
    }
    
}
function handleUser() {
    username = input.value
    fetch('https://react-http-f5f3d-default-rtdb.asia-southeast1.firebasedatabase.app/data.json', {
        method:"POST",
        body:JSON.stringify( {
            username:input.value
        }),
        headers: {
            "Content-type":"application/json"
        }

    })
        .then(res => res.json()).then(res => {
            sessionStorage.setItem('userkey',res.name)
        }).catch(err=>console.log(err))
}
function handleScore() {
    const key=sessionStorage.getItem('userkey')
    fetch(`https://react-http-f5f3d-default-rtdb.asia-southeast1.firebasedatabase.app/data/${key}.json`, {
        method:"PUT",
        body:JSON.stringify( {
            username: input.value,
            score:score
        }),
        headers: {
            "Content-type":"application/json"
        }
    })
        .then(res => res.json()).then(res => {
        }).catch(err=>console.log(err))
}
function addAllPlayers(arr) {
    const currentKey = sessionStorage.getItem('userkey')
    allPlayers.innerHTML = ''
    arr.forEach(e => {
        const playerCard = document.createElement('div')
        const name = document.createElement('p')
        const s=document.createElement('p')
        name.textContent = e.player
        s.textContent=e.score
        playerCard.className = e.key === currentKey ? 'playerCard card' : 'commonCard card'
        playerCard.appendChild(name)
        playerCard.appendChild(s)
        allPlayers.appendChild(playerCard)
    })
    overlay.style.display='block'
    allPlayers.style.display='flex'
}
function getAllScores() {
    fetch(`https://react-http-f5f3d-default-rtdb.asia-southeast1.firebasedatabase.app/data.json`)
        .then(res => res.json()).then(res => {
            const keys = Object.keys(res)
            let result = keys.map(key => ({ key: key, score: res[key].score ? res[key].score : 0, player: res[key].username }))
            const a = result.sort((a, b) => b.score - a.score);
            addAllPlayers(a)
        }).catch(err => console.log(err))
}

gameOverCanvas()
input.addEventListener('input', () => {err.style.visibility = 'hidden'})
restartBtn.addEventListener('click', resetGame)
viewScoresBtn.addEventListener('click',getAllScores)
document.addEventListener("keydown", handleEvent);
introBtn.addEventListener("click", removeIntro)
overlay.addEventListener('click', () => {
    allPlayers.style.display = 'none'
    overlay.style.display='none'
})
document.addEventListener('touchstart', handleTouchStart, false);
document.addEventListener('touchmove', handleTouchMove, false);

  