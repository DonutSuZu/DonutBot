document.addEventListener('DOMContentLoaded', () => {
    const gameBoard = document.getElementById('game-board');
    const resetButton = document.getElementById('reset-button');
    const pairsFoundDisplay = document.getElementById('pairs-found');
    const missesCountDisplay = document.getElementById('misses-count');
    const bonusMessage = document.getElementById('bonus-message');

    // 「おめでとうございます！」をエンコードしたものです
    const encodedBonusMessage = '44Ku44OW44K544OL44Kt44CB44GK6KqV55Sf5pel44GK44KB44Gn44Go44GGLi4hIeesrOS6jFBheVBheS1VUkzlh7rnj74hW2h0dHBzOi8vcGF5LnBheXBheS5uZS5qcC9Dd0tpODFxSk5PR3ZqTFZHXQ==';

    const CARD_NUMBERS = 13;
    // const MISS_LIMIT_FOR_BONUS = 5; // この行は不要になります

    let cards = [];
    let flippedCards = [];
    let matchedPairs = 0;
    let misses = 0;
    let lockBoard = false;

    function initGame() {
        gameBoard.innerHTML = '';
        bonusMessage.classList.remove('visible');
        bonusMessage.textContent = '';
        flippedCards = [];
        matchedPairs = 0;
        misses = 0;
        lockBoard = false;
        updateStats();
        createCards();
        shuffleCards();
        renderCards();
    }

    function updateStats() {
        pairsFoundDisplay.textContent = matchedPairs;
        missesCountDisplay.textContent = misses;
    }

    function createCards() {
        cards = [];
        for (let i = 1; i <= CARD_NUMBERS; i++) {
            cards.push({ id: i, isFlipped: false, isMatched: false });
            cards.push({ id: i, isFlipped: false, isMatched: false });
        }
        cards.push({ id: 0, isFlipped: false, isMatched: false });
        cards.push({ id: 0, isFlipped: false, isMatched: false });
    }

    function shuffleCards() {
        for (let i = cards.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [cards[i], cards[j]] = [cards[j], cards[i]];
        }
    }

    function renderCards() {
        cards.forEach((cardData, index) => {
            const cardElement = document.createElement('div');
            cardElement.classList.add('card');
            cardElement.dataset.index = index;
            cardElement.innerHTML = `
                <div class="card-face card-front" style="background-image: url('images/card_${cardData.id}.png');"></div>
                <div class="card-face card-back"></div>
            `;
            cardElement.addEventListener('click', handleCardClick);
            gameBoard.appendChild(cardElement);
        });
    }

    function handleCardClick(e) {
        if (lockBoard) return;
        const clickedCardElement = e.currentTarget;
        const clickedIndex = clickedCardElement.dataset.index;
        if (cards[clickedIndex].isFlipped || cards[clickedIndex].isMatched || flippedCards.length === 2) {
            return;
        }
        flipCard(clickedCardElement, clickedIndex);
        flippedCards.push({ element: clickedCardElement, index: clickedIndex });
        if (flippedCards.length === 2) {
            checkForMatch();
        }
    }

    function flipCard(cardElement, index) {
        cards[index].isFlipped = true;
        cardElement.classList.add('flipped');
    }

    function checkForMatch() {
        lockBoard = true;
        const [card1, card2] = flippedCards;
        const card1Data = cards[card1.index];
        const card2Data = cards[card2.index];

        if (card1Data.id === card2Data.id) {
            setTimeout(() => {
                card1Data.isMatched = true;
                card2Data.isMatched = true;
                matchedPairs++;
                updateStats();
                
                // ★★★ 修正点: ミス回数の条件を削除 ★★★
                if (card1Data.id === 0) {
                    try {
                        const decodedMessage = decodeURIComponent(escape(window.atob(encodedBonusMessage)));
                        bonusMessage.textContent = decodedMessage;
                        bonusMessage.classList.add('visible');
                    } catch (e) {
                        console.error('Base64のデコードに失敗しました:', e);
                    }
                }

                resetTurn();
                if (matchedPairs === CARD_NUMBERS + 1) {
                    setTimeout(() => alert('コンプリート！おめでとうございます！🎉'), 500);
                }
            }, 500);
        } else {
            setTimeout(() => {
                misses++;
                updateStats();
                unflipCards(card1, card2);
                resetTurn();
            }, 1200);
        }
    }
    
    function unflipCards(card1, card2) {
        cards[card1.index].isFlipped = false;
        cards[card2.index].isFlipped = false;
        card1.element.classList.remove('flipped');
        card2.element.classList.remove('flipped');
    }

    function resetTurn() {
        flippedCards = [];
        lockBoard = false;
    }

    resetButton.addEventListener('click', initGame);

    initGame();
});
