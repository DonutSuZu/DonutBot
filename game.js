let score = 0;
let buttonClickCount = 0;
const targetScore = 6;
const winningCode = 3923;
const totalButtons = 20;
const winButtons = 10;

function initGame() {
    const gameboard = document.getElementById('gameboard');
    gameboard.innerHTML = '';
    let buttons = [];
    for (let i = 0; i < totalButtons; i++) {
        buttons.push(i < winButtons);
    }
    buttons.sort(() => Math.random() - 0.5);

    for (let i = 0; i < totalButtons; i++) {
        const button = document.createElement('div');
        button.className = 'button button-before-click';
        button.onclick = () => clickButton(button, buttons[i]);
        gameboard.appendChild(button);
    }
}

function clickButton(button, isWin) {
    buttonClickCount++;
    button.classList.remove('hidden');
    button.classList.remove('button-before-click');
    if (isWin) {
        score++;
        button.style.backgroundImage = 'url("payusa.png")';
    } else {
        score -= 0.5;
        button.style.backgroundImage = 'url("gibsusa.png")';
    }
    button.onclick = null;
    document.getElementById('score').innerText = `Score: ${score}`;

    if (buttonClickCount === 10) {
        showResult();
    }
}

function showResult() {
    const result = document.getElementById('result');
    if (score >= targetScore) {
        result.innerText = `成功だよ！秘密のぱすわーど: ${winningCode}`;
    } else {
        result.innerText = '残念！ギブスにされちゃった';
    }
}

document.getElementById('startButton').onclick = () => {
    score = 0;
    buttonClickCount = 0;
    document.getElementById('score').innerText = `Score: ${score}`;
    document.getElementById('result').innerText = '';
    initGame();
};