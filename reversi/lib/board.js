let Piece = require("./piece");

/**
 * Returns a 2D array (8 by 8) with two black pieces at [3, 4] and [4, 3]
 * and two white pieces at [3, 3] and [4, 4]
 */
function _makeGrid () {
  let grid = [];
  for (let i = 0; i < 8; i++) {
    grid.push(new Array(8));
    // let row = [];
    // for (let j = 0; j < 8; j++) {
    //   row.push(new Piece("_"));
    // }
    // grid.push(row);
  };
  return grid;
}

/**
 * Constructs a Board with a starting grid set up.
 */
function Board () {
  this.grid = _makeGrid();
  this.grid[3][3] = new Piece("white");
  this.grid[4][4] = new Piece("white");
  this.grid[4][3] = new Piece("black");
  this.grid[3][4] = new Piece("black");
}

Board.DIRS = [
  [ 0,  1], [ 1,  1], [ 1,  0],
  [ 1, -1], [ 0, -1], [-1, -1],
  [-1,  0], [-1,  1]
];

/**
 * Returns the piece at a given [x, y] position,
 * throwing an Error if the position is invalid.
 */
Board.prototype.getPiece = function (pos) {
  return this.grid[pos[1]][pos[0]];
};

/**
 * Checks if there are any valid moves for the given color.
 */
Board.prototype.hasMove = function (color) {
  return this.validMoves(color).length > 0;
};

/**
 * Checks if the piece at a given position
 * matches a given color.
 */
Board.prototype.isMine = function (pos, color) {
  let myPiece = this.getPiece(pos);
  if (!this.isOccupied(pos)) return false;
  return myPiece.color === color;
};

/**
 * Checks if a given position has a piece on it.
 */
Board.prototype.isOccupied = function (pos) {
  return this.getPiece(pos) !== undefined;
};

/**
 * Checks if both the white player and
 * the black player are out of moves.
 */
Board.prototype.isOver = function () {
};

/**
 * Checks if a given position is on the Board.
 */
Board.prototype.isValidPos = function (pos) {
  return pos[0] >= 0 && pos[0] < 8 && pos[1] >= 0 && pos[1] < 8;
};



// - - - - B - - -
// - - - - B - - -
// - - - - B - - -
// - - - B B W - -
// - - - B B - - -
// - - - W W B - -
// - - - - w - - -
// - - - - - - - -

// piecesToFlip = []


/**
 * Recursively follows a direction away from a starting position, adding each
 * piece of the opposite color until hitting another piece of the current color.
 * It then returns an array of all pieces between the starting position and
 * ending position.
 *
 * Returns null if it reaches the end of the board before finding another piece
 * of the same color.
 *
 * Returns null if it hits an empty position.
 *
 * Returns null if no pieces of the opposite color are found.
 */
function _positionsToFlip (board, pos, color, dir, piecesToFlip) {
  let newPos = [pos[0] + dir[0], pos[1] + dir[1]];
  if (!board.isValidPos(newPos)) return null;

  let nextPiece = board.getPiece(newPos);
  if (nextPiece === undefined) return null;


  if (nextPiece.color === color) {
    if (piecesToFlip.length === 0){
      return null;
    }else {
      return true;
    }
  };

  piecesToFlip.push(nextPiece);
  return _positionsToFlip(board, newPos, color, dir, piecesToFlip);

};

/**
 * Adds a new piece of the given color to the given position, flipping the
 * color of any pieces that are eligible for flipping (piecesToFlip).
 *
 * Throws an error if the position represents an invalid move.
 */
Board.prototype.placePiece = function (pos, color) {
  if (this.isOccupied(pos)) return false;
  if (!this.validMove(pos, color)) return false;
  
  this.grid[pos[0]][pos[1]] = new Piece(color);
  
  let validArr = [], board = this;
  Board.DIRS.forEach(function (newDir) {
    let piecesToFlip = [],
      validity = _positionsToFlip(board, pos, color, newDir, piecesToFlip);
    if (validity) validArr = validArr.concat(piecesToFlip);
  });

  validArr.forEach( function(piece) {
    piece.oppColor();
  });
};

/**
 * Prints a string representation of the Board to the console.
 */
Board.prototype.print = function () {
  this.grid.forEach( function(row) {
    let newRow = row.map( function(col) {
      if (col instanceof Piece) return col.toString();
    });
    console.log(newRow.join(" "));
  });
};

/**
 * Checks that a position is not already occupied and that the color
 * taking the position will result in some pieces of the opposite
 * color being flipped.
 */
Board.prototype.validMove = function (pos, color) {
  if (this.isOccupied(pos) || !this.isValidPos(pos)) return false;

  let validArr = [], board = this;
  Board.DIRS.forEach( function(newDir) {
    let piecesToFlip = [],
        validity = _positionsToFlip(board, pos, color, newDir, piecesToFlip);
    if (validity) validArr = validArr.concat(piecesToFlip);
  });

  return validArr.length > 0;
};

/**
 * Produces an array of all valid positions on
 * the Board for a given color.
 */
Board.prototype.validMoves = function (color) {
  let posArr = [], board = this;
  for (let row = 0; row < 8; row++) {
    for (let col = 0; col < 8; col++) {
      let gridPos = [row, col];
      if (board.validMove(gridPos, color)) posArr.push(gridPos);
    };
  };
  return posArr;
};

module.exports = Board;
