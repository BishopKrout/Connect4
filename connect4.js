document.addEventListener("DOMContentLoaded", () => {
  /** Connect Four
   *
   * Player 1 and 2 alternate turns. On each turn, a piece is dropped down a
   * column until a player gets four-in-a-row (horiz, vert, or diag) or until
   * board fills (tie)
   */

  const WIDTH = 7;
  const HEIGHT = 6;

  let currPlayer = 1; // active player: 1 or 2
  let board = []; // array of rows, each row is array of cells  (board[y][x])

  /** makeBoard: create in-JS board structure:
   *    board = array of rows, each row is array of cells  (board[y][x])
   */

  function makeBoard() {
    //as long as y < HEIGHT, code will execute
    for (let y = 0; y < HEIGHT; y++) {
      board.push(Array.from({ length: WIDTH }));
      //makes the WIDTH of board an array
    }
  }

  /** makeHtmlBoard: make HTML table and row of column tops. */
  function makeHtmlBoard() {
    const htmlBoard = document.getElementById("board");
    // this grabs the ID from the html file

    //  Makes a row on the top of the board that is clickable.
    //  This makes the column a selectable choice for that turn.
    const top = document.createElement("tr");
    top.setAttribute("id", "column-top");
    top.addEventListener("click", handleClick);

    // as long as x < WIDTH, code will run
    for (let x = 0; x < WIDTH; x++) {
      const headCell = document.createElement("td");
      headCell.setAttribute("id", x);
      top.append(headCell);
      // creates data for each cell on the top
    }
    htmlBoard.append(top);
    //adds the coded functionality to the top of the board

    // adds functionality to main board
    //row will be created as long as y < HEIGHT
    for (let y = 0; y < HEIGHT; y++) {
      const row = document.createElement("tr");

      // cell will be created as long as x < WIDTH
      for (let x = 0; x < WIDTH; x++) {
        const cell = document.createElement("td");
        cell.setAttribute("id", `${y}-${x}`); //value placement
        row.append(cell);
        //adds data to each cell in the row
      }
      htmlBoard.append(row);
      //adds the coded functionality to the boards rows
    }
  }

  /** findSpotForCol: given column x, return top empty y (null if filled) */

  function findSpotForCol(x) {
    // JS is looking for available spot for player's piece
    for (let y = HEIGHT - 1; y >= 0; y--) {
      if (!board[y][x]) {
        return y;
      }
    }
    return null;
  }
  // Once column is selected it goes down until y = 0 unless another peice is found, if there is no space then null is returned and nothing happens.

  /** placeInTable: update DOM to place piece into HTML table of board */

  function placeInTable(y, x) {
    //creates div for the piece. It uses a div so it physically shows up on board.
    const piece = document.createElement("div");
    piece.classList.add("piece");
    piece.classList.add(`p${currPlayer}`);
    // so the board knows what color peice to display and who's turn it is
    piece.style.top = -50 * (y + 2);

    const spot = document.getElementById(`${y}-${x}`);
    //where x and y meet, where the piece will fall.
    spot.append(piece);
  }

  /** endGame: announce game end */

  function endGame(msg) {
    alert(msg);
  }

  /** handleClick: handle click of column top to play piece */

  function handleClick(evt) {
    // get x from ID of clicked cell
    const x = +evt.target.id;

    // get next spot in column (if none, ignore click)
    const y = findSpotForCol(x);
    if (y === null) {
      return;
    }

    // place piece in board and add to HTML table
    board[y][x] = currPlayer;
    placeInTable(y, x);
    // board knows who's pieces are where

    // check for win
    if (checkForWin()) {
      return endGame(`Player ${currPlayer} is the winner! 
Please refresh page to play again.`);
    } //displays winner if there is one

    // check for tie
    if (board.every((row) => row.every((cell) => cell))) {
      return endGame("Tie");
    } // checks is every selectable spot is filled. Happens if a win is not found

    // switch players
    currPlayer = currPlayer === 1 ? 2 : 1;
  } // use ternary operator to make it a player's turn

  /** checkForWin: check board cell-by-cell for "does a win start here?" */

  function checkForWin() {
    function _win(cells) {
      // Check four cells to see if they're all color of current player
      //  - cells: list of four (y, x) cells
      //  - returns true if all are legal coordinates & all match currPlayer

      return cells.every(
        ([y, x]) =>
          y >= 0 && y < HEIGHT && x >= 0 && x < WIDTH && board[y][x] === currPlayer
      ); //guidelines for win, all must be true
    }

    for (let y = 0; y < HEIGHT; y++) {
      for (let x = 0; x < WIDTH; x++) {
        // each different way of winning
        const horiz = [
          [y, x],
          [y, x + 1],
          [y, x + 2],
          [y, x + 3],
        ];
        const vert = [
          [y, x],
          [y + 1, x],
          [y + 2, x],
          [y + 3, x],
        ];
        const diagDR = [
          [y, x],
          [y + 1, x + 1],
          [y + 2, x + 2],
          [y + 3, x + 3],
        ];
        const diagDL = [
          [y, x],
          [y + 1, x - 1],
          [y + 2, x - 2],
          [y + 3, x - 3],
        ];
        //each number is how far the piece moves in either row or column

        // finds winner based on the code above. If either is found then true is returned
        if (_win(horiz) || _win(vert) || _win(diagDR) || _win(diagDL)) {
          return true;
        }
      }
    }
  }

  makeBoard();
  makeHtmlBoard();
});

