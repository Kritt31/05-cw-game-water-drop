// Game state variables
let gameActive = false;  // Tracks if game is currently running
let gameInterval;        // Stores the interval that creates drops
let score = 0;           // Initialize score
let gameTimer;           // Stores the timer interval
let timeLeft = 60;       // Game duration in seconds
let highScore = 0;       // Initialize high score
let winCondition = 20; // Default win condition for Normal mode
let dropInterval = 1000; // Default drop interval for Normal mode
let gameDuration = 60; // Default game duration for Normal mode

// Event listener for the start button
document.getElementById('start-btn').addEventListener('click', startGame);

// Event listener for the reset button
document.getElementById('reset-btn').addEventListener('click', resetGame);

document.getElementById('difficulty-select').addEventListener('change', (event) => {
    const difficulty = event.target.value;

    if (difficulty === 'easy') {
        winCondition = 15;
        dropInterval = 1200;
        gameDuration = 70;
    } else if (difficulty === 'normal') {
        winCondition = 20;
        dropInterval = 1000;
        gameDuration = 60;
    } else if (difficulty === 'hard') {
        winCondition = 25;
        dropInterval = 800;
        gameDuration = 50;
    }
});

// Game initialization function
function startGame() {
    // Prevent multiple game instances
    if (gameActive) return;

    // Set up initial game state
    gameActive = true;
    timeLeft = gameDuration; // Set timer based on difficulty
    document.getElementById('timer').textContent = `Time Left: ${timeLeft}s`;

    // Start the game timer
    gameTimer = setInterval(() => {
        timeLeft--;
        document.getElementById('timer').textContent = `Time Left: ${timeLeft}s`;

        if (timeLeft <= 0) {
            endGame();
        }
    }, 1000);

    // Start creating drops based on difficulty
    gameInterval = setInterval(createDrop, dropInterval);
}

// Function to create and manage individual water drops
function createDrop() {
    const drop = document.createElement('div');

    // Randomly determine if this drop is good or bad (20% chance of bad)
    const isBadDrop = Math.random() < 0.2;
    drop.className = isBadDrop ? 'water-drop bad-drop' : 'water-drop';

    // Create random size variation for visual interest
    const scale = 0.8 + Math.random() * 0.7;  // Results in 80% to 150% of original size
    drop.style.transform = `scale(${scale})`;

    // Position drop randomly along the width of the game container
    const gameWidth = document.getElementById('game-container').offsetWidth;
    const randomX = Math.random() * (gameWidth - 40);
    drop.style.left = `${randomX}px`;

    // Set drop animation speed
    drop.style.animationDuration = '4s';

    // Simple click handler to remove drops
    drop.addEventListener('click', () => {
        if (!isBadDrop) {
            playWaterDropSound(); // Play sound for clean water drops
        } else {
            playMissedDropSound(); // Play sound for bad drops
        }
        updateScoreDisplay(isBadDrop ? -1 : 1, drop); // Pass the drop element to position the message
        drop.remove();
    });

    // Add drop to game container
    document.getElementById('game-container').appendChild(drop);

    // Remove drop if it reaches bottom without being clicked
    drop.addEventListener('animationend', () => {
        drop.remove(); // No sound is played here
    });
}

function playWaterDropSound() {
    const audio = new Audio('sounds/water-drip.mp3');
    audio.play();
}

function playMissedDropSound() {
    const audio = new Audio('sounds/water-drip.mp3');
    audio.play();
}

function playButtonClickSound() {
    const audio = new Audio('sounds/water-drip.mp3');
    audio.play();
}

function playWinSound() {
    const audio = new Audio('sounds/water-drip.mp3');
    audio.play();
}

// Function to update score display
function updateScoreDisplay(change, drop) {
    const messageDisplay = document.getElementById('message-display');
    const message = document.createElement('div');
    message.textContent = change > 0 ? '+1' : '-1';
    message.className = change > 0 ? 'score-message positive' : 'score-message negative';

    // Position the message over the clicked drop
    const dropRect = drop.getBoundingClientRect();
    const containerRect = document.getElementById('game-container').getBoundingClientRect();
    message.style.left = `${dropRect.left - containerRect.left + dropRect.width / 2}px`;
    message.style.top = `${dropRect.top - containerRect.top}px`;

    messageDisplay.appendChild(message);

    // Remove the message after animation
    setTimeout(() => {
        message.remove();
    }, 1000);

    // Update the score
    score += change;
    document.getElementById('score').textContent = score;

    // Update high score if the current score exceeds it
    if (score > highScore) {
        highScore = score;
        document.getElementById('high-score').textContent = highScore;
    }

    // Show a special message at score intervals of 10
    if (score > 0 && score % 10 === 0) {
        showMilestoneMessage();
    }
}

const facts = [
    "Great job! Did you know? 100% of donations to charity: water go towards funding clean water projects!",
    "Amazing! charity: water has funded over 91,000 water projects worldwide!",
    "Keep it up! Clean water can improve health, education, and economic opportunities!",
    "Fantastic! Over 14.7 million people have gained access to clean water thanks to charity: water!",
    "You're doing great! Every $40 donated can bring clean water to one person for life!"
];

function showMilestoneMessage() {
    const gameContainer = document.getElementById('game-container');
    const milestoneMessage = document.createElement('div');
    milestoneMessage.className = 'milestone-message';

    // Select a fact based on the current score
    const factIndex = (score / 10 - 1) % facts.length; // Cycle through facts
    milestoneMessage.textContent = facts[factIndex];

    gameContainer.appendChild(milestoneMessage);

    // Remove the message after 3 seconds
    setTimeout(() => {
        milestoneMessage.remove();
    }, 3000);
}

function endGame() {
    // Stop the game and timers
    clearInterval(gameInterval);
    clearInterval(gameTimer);
    gameActive = false;

    // Check if the player met the win condition
    const gameContainer = document.getElementById('game-container');
    const gameOverMessage = document.createElement('div');
    gameOverMessage.className = 'game-over-message';
    if (score >= winCondition) {
        gameOverMessage.textContent = `Congratulations! You won with a score of ${score}!`;
        playWinSound(); // Play win sound
    } else {
        gameOverMessage.textContent = `Game Over! Your final score is ${score}. Try again!`;
    }
    gameContainer.appendChild(gameOverMessage);

    // Remove the message after 5 seconds
    setTimeout(() => {
        gameOverMessage.remove();
    }, 5000);
}

function resetGame() {
    // Stop the game if it's running
    if (gameActive) {
        clearInterval(gameInterval);
        clearInterval(gameTimer);
        gameActive = false;
    }

    // Reset score, timer, and UI elements
    score = 0;
    timeLeft = 60;
    document.getElementById('score').textContent = score;
    document.getElementById('timer').textContent = `Time Left: ${timeLeft}s`;

    // Clear all drops from the game container
    const gameContainer = document.getElementById('game-container');
    gameContainer.innerHTML = '<div id="message-display" style="position: absolute; width: 100%; height: 100%; pointer-events: none;"></div>';
}

// Remove logic that disables the reset button
document.getElementById('reset-btn').disabled = false;
