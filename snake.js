document.addEventListener("DOMContentLoaded", function() {
    const canvas = document.getElementById("gameCanvas");
    const ctx = canvas.getContext("2d");
    const scoreText = document.querySelector("#score");

    let snake = [
        {x: 150, y: 150},
        {x: 140, y: 150},
        {x: 130, y: 150},
        {x: 120, y: 150},
        {x: 110, y: 150},
    ];

    function sound(src) {
        this.sound = document.createElement("audio");
        this.sound.src = src;
        this.sound.setAttribute("preload", "auto");
        this.sound.setAttribute("controls", "none");
        this.sound.style.display = "none";
        document.body.appendChild(this.sound);
        this.play = function(){
          this.sound.play();
        }
        this.stop = function(){
          this.sound.pause();
        }
    }
    var eatSound;
    eatSound = new sound("eatSound.mp3");
    var deathSound;
    deathSound = new sound("deathSound.mp3");

    let dx = 10;
    let dy = 0;
    let foodX;
    let foodY;
    let score = 0;

    function drawSnakePart(snakePart) {
        ctx.fillStyle = "red";
        ctx.strokeStyle = "black";
        ctx.fillRect(snakePart.x, snakePart.y, 10, 10);
        ctx.strokeRect(snakePart.x, snakePart.y, 10, 10);
    }

    function drawSnake() {
        snake.forEach(drawSnakePart);
    }

    function advanceSnake() {
        const head = {x: snake[0].x + dx, y: snake[0].y + dy};
        snake.unshift(head);

        const didEatFood = snake[0].x === foodX && snake[0].y === foodY;
        if (didEatFood) {
            eatSound.play();
            score += 1;
            scoreText.textContent = score;
            createFood();
        } else {
            snake.pop();
        }
    }

    function clearCanvas() {
        ctx.fillStyle = "white";
        ctx.strokeStyle = "black";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.strokeRect(0, 0, canvas.width, canvas.height);
    }

    function changeDirection(event) {
        const LEFT_KEY = 37;
        const RIGHT_KEY = 39;
        const UP_KEY = 38;
        const DOWN_KEY = 40;
        const keyPressed = event.keyCode;
        const goingUp = dy === -10;
        const goingDown = dy === 10;
        const goingRight = dx === 10;
        const goingLeft = dx === -10;

        if (keyPressed === LEFT_KEY && !goingRight) {
            dx = -10;
            dy = 0;
        }
        if (keyPressed === UP_KEY && !goingDown) {
            dx = 0;
            dy = -10;
        }
        if (keyPressed === RIGHT_KEY && !goingLeft) {
            dx = 10;
            dy = 0;
        }
        if (keyPressed === DOWN_KEY && !goingUp) {
            dx = 0;
            dy = 10;
        }
    }

    document.addEventListener("keydown", changeDirection);

    function randomTen(min, max) {
        return Math.round((Math.random() * (max - min) + min) / 10) * 10;
    }

    function createFood() {
        foodX = randomTen(0, canvas.width - 10);
        foodY = randomTen(0, canvas.height - 10);
        snake.forEach(function isFoodOnSnake(part) {
            const foodIsOnSnake = part.x === foodX && part.y === foodY;
            if (foodIsOnSnake) {
                createFood();
            }
        });
    }

    function drawFood() {
        ctx.fillStyle = 'yellow';
        ctx.strokeStyle = 'darkyellow';
        ctx.fillRect(foodX, foodY, 10, 10);
        ctx.strokeRect(foodX, foodY, 10, 10);
    }

    function didGameEnd() {
        for (let i = 4; i < snake.length; i++) {
            const didCollide = snake[i].x === snake[0].x && snake[i].y === snake[0].y;
            if (didCollide) return true;
        }
        const hitLeftWall = snake[0].x < 0;
        const hitRightWall = snake[0].x > canvas.width - 10;
        const hitTopWall = snake[0].y < 0;
        const hitBottomWall = snake[0].y > canvas.height - 10;
        return hitLeftWall || hitRightWall || hitTopWall || hitBottomWall;
    }

    function main() {
        if (didGameEnd()) {
            deathSound.play();
            alert("Game Over! Your score was " + score + ".");
            return;
        }
        setTimeout(function onTick() {
            clearCanvas();
            drawFood();
            advanceSnake();
            drawSnake();
            main();
        }, 100);
    }

    createFood();
    main();
});
