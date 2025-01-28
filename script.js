const startButton = document.getElementById('start-button');
const easyButton = document.getElementById('easy');
const interButton = document.getElementById('intermediate');
const hardButton = document.getElementById('hard');
const gameContainer = document.querySelector('.game-container');
const scoreDisplay = document.querySelector('.score');
const livesDisplay = document.querySelector('.lives');
const highScoreDisplay = document.getElementById('high-score-display');
let score = 0;
let lives = 5;
let circles = [];
let dotTimer = 1000;
let timerInterval;

// Retrieve the highest score from localStorage
let highestScore = localStorage.getItem('highestScore') || 0;
highScoreDisplay.textContent = `High Score: ${highestScore}`;

function getRandomColor() {
    const colors = ['#ff0000', '#0000ff', '#ffff00', '#006400', '#ff69b4', '#8a2be2'];
    return colors[Math.floor(Math.random() * colors.length)];
}

function isOverlapping(newCircle) {
    return circles.some(circle => {
        const rect1 = newCircle.getBoundingClientRect();
        const rect2 = circle.getBoundingClientRect();
        return !(rect1.right < rect2.left || 
                 rect1.left > rect2.right || 
                 rect1.bottom < rect2.top || 
                 rect1.top > rect2.bottom);
    });
}


function createCircle() {
    let circle;
    do {
        circle = document.createElement('div');
        circle.classList.add('circle');
        circle.style.backgroundColor = getRandomColor();
        circle.style.top = Math.random() * (gameContainer.offsetHeight - 100 - 20) + 20 + 'px';
        circle.style.left = Math.random() * (gameContainer.offsetWidth - 100) + 'px';
        circle.style.width = '100px';
        circle.style.height = '100px';
    } while (isOverlapping(circle) || (parseInt(circle.style.top) <= 50 && parseInt(circle.style.left) <= 200)) ;

    circle.addEventListener('click', (e) => {
        e.stopPropagation();
        score++;
        scoreDisplay.textContent = `Score: ${score}`;
        gameContainer.removeChild(circle);
        circles = circles.filter(c => c !== circle);
        if (circles.length < 2) {
            createCircle();
        }
    });

    gameContainer.appendChild(circle);
    circles.push(circle);
    setTimeout(() => {
        if (circles.includes(circle)) {
            circle.classList.add('fade-out');
            setTimeout(() => {
                gameContainer.removeChild(circle);
                circles = circles.filter(c => c !== circle);
                lives--;
                livesDisplay.textContent = `Lives: ${lives}`;
                if (lives <= 0) {
                    setTimeout(endGame, 100);
                } else {
                    createCircle();
                }
            }, 500);
        }
    }, dotTimer);
}


function endGame() {
    if (score > highestScore) {
        highestScore = score;
        localStorage.setItem('highestScore', highestScore);
        highScoreDisplay.textContent = `High Score: ${highestScore}`;
    }
    clearInterval(timerInterval);
    alert(`Game Over! Your final score is ${score}`);
    resetGame();
}

function startGame(){
   window.close();
}

function easyGame() {
    score = 0;
    lives = 5;
    dotTimer = 1000; // Reset dot timer
    scoreDisplay.textContent = `Score: ${score}`;
    livesDisplay.textContent = `Lives: ${lives}`;
    gameContainer.style.display = 'block';
    document.querySelector('.menu').style.display = 'none';
    createCircle();
    timerInterval = setInterval(() => {
        dotTimer -= 100;
    }, 5000);
}

function interGame() {
    score = 0;
    lives = 5;
    dotTimer = 750; // Reset dot timer
    scoreDisplay.textContent = `Score: ${score}`;
    livesDisplay.textContent = `Lives: ${lives}`;
    gameContainer.style.display = 'block';
    document.querySelector('.menu').style.display = 'none';
    createCircle();
    timerInterval = setInterval(() => {
        dotTimer -= 100;
    }, 5000);
}

function hardGame() {
    score = 0;
    lives = 3;
    dotTimer = 600; // Reset dot timer
    scoreDisplay.textContent = `Score: ${score}`;
    livesDisplay.textContent = `Lives: ${lives}`;
    gameContainer.style.display = 'block';
    document.querySelector('.menu').style.display = 'none';
    createCircle();
    createRectangle();
    timerInterval = setInterval(() => {
        dotTimer -= 100;
    }, 5000);
}

function resetGame() {
    gameContainer.style.display = 'none';
    document.querySelector('.menu').style.display = 'flex';
    circles.forEach(circle => gameContainer.removeChild(circle));
    circles = [];
}

gameContainer.addEventListener('click', () => {
    lives--;
    livesDisplay.textContent = `Lives: ${lives}`;
    if (lives <= 0) {
        endGame();
    }
});

startButton.addEventListener('click', startGame);
easyButton.addEventListener('click', easyGame);
interButton.addEventListener('click', interGame);
hardButton.addEventListener('click', hardGame);
