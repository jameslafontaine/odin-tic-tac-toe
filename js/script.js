// =================
// Objects / Modules
// =================
// #region
// Game constants (board size, mark representations, move codes, etc.)
const constants = Object.freeze({
    BOARD_SIZE: 3,
    CROSS: 'X',
    NOUGHT: 'O',
    EMPTY_CELL: ' ',
    MOVE_OK: 0,
    CELL_OCCUPIED: 1,
    OUT_OF_BOUNDS: 2,
});

const messages = Object.freeze({
    PLAYER_ONE_NAME: "Enter Player One's Name:",
    PLAYER_TWO_NAME: "Enter Player Two's Name:",
    DRAW_MESSAGE: "It's a draw! Good game!",
    playerWon: (winningPlayer) => `${winningPlayer.getName()} wins! Congratulations!`
});

function createCell() {

    let value = constants.EMPTY_CELL;

    const getMark = () => value;

    const setMark = (mark) => value = mark;

    return { getMark, setMark };
}

function createPlayer(name, mark) {
    const getName = () => name;

    const getMark = () => mark;

    let score = 0;

    const getScore = () => score;

    const incrementScore = () => ++score;

    const changeName = (newName) => name = newName;



    return { getName, getMark, getScore, incrementScore, changeName };
}


/* 
** The gameBoard tracks the state of the board and therefore win conditions
*/
const gameBoard = ((size) => {
    const board = [];

    let rowMarks = [0, 0, 0], colMarks = [0, 0, 0], diagMarks = 0, antiDiagMarks = 0;

    // Create a 2d array that will represent the state of the game board
    // For this 2d array, row 0 will represent the top row and
    // column 0 will represent the left-most column.
    for (let i = 0; i < size; i++) {
        board[i] = []
        for (let j = 0; j < size; j++) {
            board[i].push(createCell());
        }
    }

    const getBoard = () => board;
    const getSize = () => size;

    // Validate a candidate move (i.e. check if the specified cell is empty or not, and that the specified cell actually
    // exists on the board)
    const validateMove = (row, col) => {
        if (row < 0 || row >= size || col < 0 || col >= size) return constants.OUT_OF_BOUNDS;
        if (board[row][col].getMark() !== constants.EMPTY_CELL) return constants.CELL_OCCUPIED;
        return constants.MOVE_OK;
    }

    // Place the player's mark on the board, 
    // and maintain mark counters for each row, column and diagonal to detect a win
    const placeMark = (row, column, player) => {
        board[row][column].setMark(player.getMark());


        const mark = player.getMark() === constants.NOUGHT ? 1 : -1;

        rowMarks[row] += mark;
        colMarks[column] += mark;
        if (row === column) diagMarks += mark;
        if (row + column === size - 1) antiDiagMarks += mark;
    };

    const checkWin = (row, column, player) => {

        if (Math.abs(rowMarks[row]) === size ||
            Math.abs(colMarks[column]) === size ||
            Math.abs(diagMarks) === size ||
            Math.abs(antiDiagMarks) === size)
            return player; // winner
        return null; // no winner
    }

    const clearBoard = () => {
        for (let i = 0; i < size; i++) {
            for (let j = 0; j < size; j++) {
                board[i][j].setMark(constants.EMPTY_CELL);
            }
        }

        // reset mark counters
        rowMarks = [0, 0, 0], colMarks = [0, 0, 0], diagMarks = 0, antiDiagMarks = 0;
    }

    // This method is used to print the board to the console without the need for a UI.
    const printBoard = () => {
        const boardWithCellValues = board.map((row) => row.map((cell) => cell.getMark()))
        console.table(boardWithCellValues);
    };



    return { getBoard, getSize, validateMove, placeMark, checkWin, clearBoard, printBoard };
})(constants.BOARD_SIZE);



/* 
** The gameController is be responsible for controlling the flow and state of the game's turns, as well as whether
** anybody has won the game
*/
const gameController = ((playerOneName = "Player One",
    playerTwoName = "Player Two") => {

    const players = [
        createPlayer(playerOneName, constants.CROSS),
        createPlayer(playerTwoName, constants.NOUGHT)
    ];

    let activePlayer = players[0];
    let turnCount = 0;

    const switchPlayerTurn = () => {
        activePlayer = activePlayer === players[0] ? players[1] : players[0];
    };
    const getActivePlayer = () => activePlayer;

    const changePlayerName = (playerNum, newName) => {
        players[playerNum].changeName(newName);
    }

    const printNewRound = () => {
        gameBoard.printBoard();
        console.log(`${getActivePlayer().getName()}'s turn.`);
    };

    const printNewGame = () => {
        console.log("\n🔥🔥🔥 NEW GAME 🔥🔥🔥\n----------------------\n");
        printNewRound();
    }

    const startNewGame = () => {
        console.log("Starting new game...");
        gameBoard.clearBoard();
        activePlayer = players[0];
        turnCount = 0;
        printNewGame();
    }

    const handleDraw = () => {
        gameBoard.printBoard();
        console.log(messages.DRAW_MESSAGE);
        // startNewGame();
    }

    const handleWin = (winningPlayer) => {
        gameBoard.printBoard();
        console.log(messages.playerWon(winningPlayer));
        // startNewGame();
    }

    const playRound = (row, column) => {
        // Place a mark for the current player
        let moveStatus = gameBoard.validateMove(row, column)
        if (moveStatus !== constants.MOVE_OK) {
            if (moveStatus === constants.OUT_OF_BOUNDS) console.log("ERROR: Specified cell is out of bounds.");
            if (moveStatus === constants.CELL_OCCUPIED) console.log("ERROR: Specified cell is already occupied");
            console.log("Please specify a legal move.");
            return { valid: false, winner: null, draw: false };
        };
        console.log(
            `Placing ${getActivePlayer().getName()}'s mark into row ${row}, column ${column}... `
        );
        gameBoard.placeMark(row, column, getActivePlayer());
        turnCount++;

        // check for win
        const winningPlayer = gameBoard.checkWin(row, column, getActivePlayer());
        if (winningPlayer) {
            handleWin(winningPlayer);
            return { valid: true, winner: winningPlayer, draw: false };
        }
        // check for draw
        else if (turnCount >= constants.BOARD_SIZE ** 2) {
            handleDraw();
            return { valid: true, winner: null, draw: true };
        }

        // Switch player turn
        switchPlayerTurn();

        printNewRound();

        return { valid: true, winner: null, draw: false };
    };


    // Initial play game message
    printNewGame();

    // For the console version, we will only use playRound, but we will need
    // getActivePlayer for the UI version.
    return {
        playRound,
        getActivePlayer,
        changePlayerName,
        startNewGame
    };
})();

/* 
** The displayController is responsible for controlling the display of the game state to the players
*/
const displayController = (() => {
    const boardDiv = document.querySelector(".board");
    const playerTurnEl = document.querySelector('.turn');
    const messageEl = document.querySelector('.message');

    const updateDisplay = (message = '') => {
        // clear the board
        boardDiv.textContent = "";

        // get the newest version of the board and player turn
        const board = gameBoard.getBoard();
        const activePlayer = gameController.getActivePlayer();

        // Display player's turn
        playerTurnEl.textContent = `${activePlayer.getName()}'s turn...`

        // Display a message if specified
        if (message) messageEl.textContent = message;

        // Render board squares
        board.forEach((row, rowIndex) => {
            row.forEach((cell, colIndex) => {
                const cellButton = document.createElement("button");
                cellButton.classList.add("cell");
                // Create data attributes to identify the row and column
                cellButton.dataset.row = rowIndex;
                cellButton.dataset.column = colIndex;

                cellButton.textContent = cell.getMark();
                boardDiv.appendChild(cellButton);
            })
        })
    };
    // Add event listener for the board
    function clickHandlerBoard(e) {
        // Make sure a cell has been clicked and not the gaps in between
        const cell = e.target.closest(".cell");
        if (!cell) return;

        const selectedRow = Number(cell.dataset.row);
        const selectedColumn = Number(cell.dataset.column);

        let gameState = gameController.playRound(selectedRow, selectedColumn);

        if (!gameState.valid) {
            return;
        }
        if (gameState.winner) {
            updateDisplay(messages.playerWon(gameState.winner));
            boardDiv.classList.add("disabled"); // disables all clicks inside boardDiv
            return;
        }
        else if (gameState.draw) {
            updateDisplay(messages.DRAW_MESSAGE);
            boardDiv.classList.add("disabled"); // disables all clicks inside boardDiv
            return;
        }

        updateDisplay();
    }
    boardDiv.addEventListener("click", clickHandlerBoard);

    const clickHandlerRestart = () => {
        gameBoard.clearBoard();
        gameController.startNewGame();
        boardDiv.classList.remove("disabled");
        messageEl.textContent = "";
        updateDisplay();
    }
    const restartButton = document.querySelector(".restart");
    restartButton.addEventListener("click", clickHandlerRestart);

    const clickHandlerChangeNames = () => {
        gameController.changePlayerName(0, window.prompt(messages.PLAYER_ONE_NAME, "Player One"));
        gameController.changePlayerName(1, window.prompt(messages.PLAYER_TWO_NAME, "Player Two"));
    }
    const changeNamesButton = document.querySelector(".change-names");
    changeNamesButton.addEventListener("click", clickHandlerChangeNames);
    // Initial render
    updateDisplay();
})();
// #endregion
// =================
// Data / State
// =================



// =================
// Domain-Specific Functions
// =================


// =================
// DOM Manipulation Functions
// =================



// =================
// Main Execution Block / Script Body
// =================

// Console Tests
// #region
// --- Helper to separate games in console ---
/* function newGameHeader(name) {
    console.log(`\n===== ${name} =====\n--------------------------\n`);
}

// --- 1. Horizontal Win ---
newGameHeader("Horizontal Win");
gameController.playRound(0, 0); // P1
gameController.playRound(1, 0); // P2
gameController.playRound(0, 1); // P1
gameController.playRound(1, 1); // P2
gameController.playRound(0, 2); // P1 → horizontal win

// --- 2. Vertical Win ---
newGameHeader("Vertical Win");
gameController.playRound(0, 0); // P1
gameController.playRound(0, 1); // P2
gameController.playRound(1, 0); // P1
gameController.playRound(1, 1); // P2
gameController.playRound(2, 0); // P1 → vertical win

// --- 3. Diagonal Win ---
newGameHeader("Diagonal Win");
gameController.playRound(0, 0); // P1
gameController.playRound(0, 1); // P2
gameController.playRound(1, 1); // P1
gameController.playRound(0, 2); // P2
gameController.playRound(2, 2); // P1 → diagonal win

// --- 4. Anti-Diagonal Win ---
newGameHeader("Anti-Diagonal Win");
gameController.playRound(0, 2); // P1
gameController.playRound(0, 0); // P2
gameController.playRound(1, 1); // P1
gameController.playRound(1, 0); // P2
gameController.playRound(2, 0); // P1 → anti-diagonal win

// --- 5. Draw Game ---
newGameHeader("Draw Game");
gameController.playRound(0, 0); // P1
gameController.playRound(0, 1); // P2
gameController.playRound(0, 2); // P1
gameController.playRound(1, 1); // P2
gameController.playRound(1, 0); // P1
gameController.playRound(1, 2); // P2
gameController.playRound(2, 1); // P1
gameController.playRound(2, 0); // P2
gameController.playRound(2, 2); // P1 → draw

// --- 6. Invalid Moves ---
newGameHeader("Invalid Moves");
gameController.playRound(0, 0); // P1
gameController.playRound(0, 0); // P2 tries occupied cell
gameController.playRound(3, 3); // P1 tries out-of-bounds */
// #endregion
