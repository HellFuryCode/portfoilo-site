//board setup
let board;
let boardWidth = 750;
let boardHeight = 250;
let context;

//cat setup
let catWidth = 90;
let catHeight = 100;
let catX = 50;
let catY = boardHeight - catHeight;

let cat = {
    x : catX,
    y : catY,
    width : catWidth,
    height : catHeight
}

// Cat animation
let runFrames = [];
let deathFrames = [];
let currentFrame = 0;
let frameTick = 0;
let catFrameDelay = 10;

let isRunning = true;
let isDead = false;
let deathAnimationFinished = false;

//bushws setup
let bushArry = [];

let bushWidth = 40;
let bush2Width = 40;
let bush3Width = 20;
let bushHeight = 50;
let bushX = 700;
let bushY = boardHeight - bushHeight;

let bush1IMG;
let bush2IMG;
let bush3IMG;

//physics
let velocityX = -4;
let velocityY = 0;
let gravity = 0.4;

//states
let gameOver = false;
let paused = false;
let score = 0;


window.onload = function(){
    board = document.getElementById("board");
    board.height = boardHeight;
    board.width = boardWidth;
    context = board.getContext("2d"); //used for drawing on the board

      // Load cat run 
    for (let i = 1; i <= 8; i++) {
        let img = new Image();
        img.src = `../images/${i}.png`; //hell yeah arrays i can code
        runFrames.push(img);
    }

    // Load cat death 
    for (let i = 1; i <= 7; i++) {
        let img = new Image();
        img.src = `../images/puff${i}.png`; //more arrys for death poof
        deathFrames.push(img); //death poof
    }

    //load bushes. why is thou a bitch
    //i got it to work
    bush1IMG = new Image();
    bush1IMG.src = "../images/bush1.png";

    bush2IMG = new Image();
    bush2IMG.src = "../images/bush2.png";

    bush3IMG = new Image();
    bush3IMG.src = "../images/flower.PNG";

    document.addEventListener("keydown", moveCat);
}

    //start game
    function startGame() {
    document.getElementById("mainMenu").style.display = "none";
    document.getElementById("gameContainer").style.display = "block";
   
    gameOver = false; //made seperate from pause so the death animation can play
    paused = false;
    score = 0;
    bushArry = [];
    velocityY = 0;
    cat.y = catY;

    isRunning = true;
    isDead = false;
    deathAnimationFinished = false;
    currentFrame = 0;
    frameTick = 0;

    requestAnimationFrame(update);
    setInterval(placeBush, 600);
    }

    //load game and looping
    function update(){
           if (paused || (gameOver && deathAnimationFinished)) return;

            requestAnimationFrame(update);
            context.clearRect(0, 0, board.width, board.height);

        
        context.clearRect(0,0, board.width, board.height);

        //cat
            velocityY += gravity;
            cat.y = Math.min(cat.y + velocityY, catY);
            drawCat();

         //bush
         for (let i = 0; i < bushArry.length; i++ ){
            let bush = bushArry[i]; //arry obiv
            bush.x += velocityX;
            context.drawImage(bush.img, bush.x, bush.y, bush.width, bush.height); //constant height and width

            if (detectCollision(cat, bush)&& !gameOver){
                gameOver = true;
                isRunning = false;
                isDead = true;
                currentFrame = 0;
                frameTick = 0;
            }
            
            if (bush.x + bush.width < 0) {
            bushArry.splice(i, 1);
            i--; 
        }

     }
        //score
        if (!gameOver) {
         score++;
         document.getElementById("scoreDisplay").innerText = "Score: " + score;
        }

        context.fillStyle = "black";
        context.font ="20px courier";
        context.fillText(score, 5, 20);
    }


    //draw the running cat 
   function drawCat() {
    let img;
    if (isRunning) {
        img = runFrames[currentFrame];
    } else if (isDead) {
        img = deathFrames[currentFrame];
    }

    if (img) {
        context.drawImage(img, cat.x, cat.y, cat.width, cat.height);
    }

    frameTick++;
    if (frameTick % catFrameDelay === 0) {
        currentFrame++;

        if (isRunning && currentFrame >= runFrames.length) {
            currentFrame = 0;
        }

        if (isDead && currentFrame >= deathFrames.length) {
            currentFrame = deathFrames.length - 1;
            deathAnimationFinished = true;

            //  Show Game Over screen after short delay
            setTimeout(() => {
                document.getElementById("gameOverScreen").style.display = "flex";
                document.getElementById("finalScore").innerText = score;
            }, 500);
        }
    }
}

    // jump cat
    function moveCat(e){
        if(gameOver|| paused){
            return;
        }

        if ((e.code == "Space" || e.code == "ArrowUp") && cat.y == catY){
            //jump
            velocityY = -10;
        }

         // Pause with "shift"
        if (e.code == "ShiftRight" || e.code === "ShiftLeft") {
            togglePause();
        }
    }

    //bushes creation
    function placeBush(){
        if(gameOver || paused){
            return;
        }

        let bush = {
            img: null,
            x : bushX,
            y : bushY,
            width: null,
            height : bushHeight

        };

        let placeBushChance = Math.random();

        if (placeBushChance > 0.9) {
            bush.img = bush3IMG;
            bush.width = bush3Width;
            bushArry.push(bush);
        }
        else if (placeBushChance > 0.7){
            bush.img = bush2IMG;
            bush.width = bush2Width;
            bushArry.push(bush);
        }

         else if (placeBushChance > 0.5){
            bush.img = bush1IMG;
            bush.width = bush1Width;
            bushArry.push(bush);
        }

        if (bushArry.length >5){
            bushArry.shift();
        }
    }

    //collsion
    function detectCollision(a, b){
            const buffer = 10; //because clipping is real and squarwes suck
        return (
            a.x < b.x + b.width &&
              a.x + a.width > b.x &&
              a.y < b.y + b.height &&
              a.y + a.height > b.y);
    }

// Pause toggle
function togglePause() {
    paused = !paused;
    document.getElementById("pauseMenu").style.display = paused ? "block" : "none";
    if (!paused) {
        requestAnimationFrame(update);}
}

function returnToMainMenu() {
    paused = false;
    gameOver = true;
    document.getElementById("pauseMenu").style.display = "none";
    document.getElementById("gameOverScreen").style.display = "none";
    document.getElementById("gameContainer").style.display = "none";
    document.getElementById("mainMenu").style.display = "flex";
}

// Restart game
function restartGame() {
    document.getElementById("pauseMenu").style.display = "none";
    document.getElementById("gameOverScreen").style.display = "none";
    startGame();
}