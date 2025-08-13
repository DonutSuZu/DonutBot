document.addEventListener('DOMContentLoaded', () => {

    // --- ゲーム設定 ---
    const WIDTH = 10;
    const HEIGHT = 10;
    const BOMB_COUNT = 15;
    // ------------------

    const gameBoard = document.getElementById('game-board');
    const successCountEl = document.getElementById('success-count');
    const resetButton = document.getElementById('reset-button');
    const messageEl = document.getElementById('message');

    let board = [];
    let isGameOver = false;
    let successCount = 0;

    // ゲーム開始
    function startGame() {
        // ... (この部分は変更ありません) ...
        isGameOver = false;
        successCount = 0;
        board = [];
        gameBoard.innerHTML = '';
        messageEl.classList.add('hidden');
        successCountEl.textContent = '0';

        for (let y = 0; y < HEIGHT; y++) {
            const row = [];
            for (let x = 0; x < WIDTH; x++) {
                row.push({
                    isBomb: false,
                    isRevealed: false,
                    neighborBombs: 0,
                    element: null
                });
            }
            board.push(row);
        }

        let bombsPlaced = 0;
        while (bombsPlaced < BOMB_COUNT) {
            const x = Math.floor(Math.random() * WIDTH);
            const y = Math.floor(Math.random() * HEIGHT);
            if (!board[y][x].isBomb) {
                board[y][x].isBomb = true;
                bombsPlaced++;
            }
        }

        for (let y = 0; y < HEIGHT; y++) {
            for (let x = 0; x < WIDTH; x++) {
                if (board[y][x].isBomb) continue;
                let count = 0;
                for (let j = -1; j <= 1; j++) {
                    for (let i = -1; i <= 1; i++) {
                        const newY = y + j;
                        const newX = x + i;
                        if (newY >= 0 && newY < HEIGHT && newX >= 0 && newX < WIDTH && board[newY][newX].isBomb) {
                            count++;
                        }
                    }
                }
                board[y][x].neighborBombs = count;
            }
        }

        for (let y = 0; y < HEIGHT; y++) {
            for (let x = 0; x < WIDTH; x++) {
                const cellEl = document.createElement('div');
                cellEl.classList.add('cell');
                cellEl.dataset.y = y;
                cellEl.dataset.x = x;
                cellEl.addEventListener('click', () => handleCellClick(x, y));
                gameBoard.appendChild(cellEl);
                board[y][x].element = cellEl;
            }
        }
    }

    // マスがクリックされたときの処理
    function handleCellClick(x, y) {
        // ... (この部分は変更ありません) ...
        if (isGameOver || board[y][x].isRevealed) {
            return;
        }
        const cell = board[y][x];
        cell.isRevealed = true;
        cell.element.classList.add('revealed');
        if (cell.isBomb) {
            gameOver(cell.element);
        } else {
            successCount++;
            successCountEl.textContent = successCount;
            if (cell.neighborBombs > 0) {
                cell.element.textContent = cell.neighborBombs;
                cell.element.classList.add(`n${cell.neighborBombs}`);
            } else {
                revealNeighbors(x, y);
            }
            if (successCount > 40) {
                winGame();
            }
        }
    }

    // 周りのマスを連鎖して開く処理 (再帰関数)
    function revealNeighbors(x, y) {
        // ... (この部分は変更ありません) ...
        for (let j = -1; j <= 1; j++) {
            for (let i = -1; i <= 1; i++) {
                if (i === 0 && j === 0) continue;
                const newY = y + j;
                const newX = x + i;
                if (newY >= 0 && newY < HEIGHT && newX >= 0 && newX < WIDTH) {
                    if (!board[newY][newX].isRevealed) {
                         handleCellClick(newX, newY);
                    }
                }
            }
        }
    }

    // ゲームオーバー処理
    function gameOver(clickedCell) {
        // ... (この部分は変更ありません) ...
        isGameOver = true;
        clickedCell.classList.add('exploded');
        board.forEach(row => {
            row.forEach(cell => {
                if (cell.isBomb) {
                    if (cell.element !== clickedCell) {
                        cell.element.classList.add('bomb');
                    }
                }
            });
        });
    }

    // ゲームクリア処理
    function winGame() {
        isGameOver = true;
        // '🎉 おめでとう！クリアです！ 🎉' をBASE64エンコードした文字列
        const encodedMessage = '44GK44KB44Gn44Go44GG44GU44GW44GE44G+44GZ77yB';

        // BASE64をデコードしてバイナリ文字列に変換
        const binaryString = atob(encodedMessage);
        // バイナリ文字列をバイト配列に変換
        const len = binaryString.length;
        const bytes = new Uint8Array(len);
        for (let i = 0; i < len; i++) {
            bytes[i] = binaryString.charCodeAt(i);
        }

        // バイト配列をUTF-8として正しくデコード
        const decodedMessage = new TextDecoder().decode(bytes);

        messageEl.textContent = decodedMessage;
        messageEl.className = 'success'; // .hidden を削除して .success を追加
    }

    // リセットボタンのイベント
    resetButton.addEventListener('click', startGame);

    // 初期ゲーム開始
    startGame();
});