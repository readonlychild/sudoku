/**
snippets/functions out of 
https://www.codefellows.org/blog/sudoku-solver-from-scratch-in-javascript-tdd-style-a-tutorial
**/

var sudoku = sudoku || {};
sudoku.solver = {};
sudoku.solver.saveEmptyPositions = function(board) {
  // Create an array to save the positions
  var emptyPositions = [];

  // Check every square in the puzzle for a zero
  for(var i = 0; i < board.length; i++) {
    for(var j = 0; j < board[i].length; j++) {
      // If a zero is found, save that position
      if(board[i][j] === 0) {
        emptyPositions.push([i, j]);
      }
    }
  }

  // Return the positions
  return emptyPositions;
};
sudoku.solver.checkRow = function(board, row, value) {
  // Iterate through every value in the row
  for(var i = 0; i < board[row].length; i++) {
    // If a match is found, return false
    if(board[row][i] === value) {
      return false;
    }
  }
  // If no match was found, return true
  return true;
};
sudoku.solver.checkColumn = function(board, column, value) {
  // Iterate through each value in the column
  for(var i = 0; i < board.length; i++) {
    // If a match is found, return false
    if(board[i][column] === value) {
      return false;
    }
  }
  // If no match was found, return true
  return true;
};
sudoku.solver.check3x3Square = function(board, column, row, value) {
  // Save the upper left corner
  var columnCorner = 0,
      rowCorner = 0,
      squareSize = 3;

  // Find the left-most column
  while(column >= columnCorner + squareSize) {
    columnCorner += squareSize;
  }

  // Find the upper-most row
  while(row >= rowCorner + squareSize) {
    rowCorner += squareSize;
  }

  // Iterate through each row
  for(var i = rowCorner; i < rowCorner + squareSize; i++) {
    // Iterate through each column
    for(var j = columnCorner; j < columnCorner + squareSize; j++) {
      // Return false is a match is found
      if(board[i][j] === value) {        
        return false;
      }
    }
  }
  // If no match was found, return true
  return true;
};
sudoku.solver.checkValue = function(board, column, row, value) {
  if(this.checkRow(board, row, value) &&
    this.checkColumn(board, column, value) &&
    this.check3x3Square(board, column, row, value)) {
    return true;
  } else {
    return false;
  }
};
sudoku.solver.solvePuzzle = function(board, emptyPositions) {
  
  if (!emptyPositions) {
    emptyPositions = this.saveEmptyPositions(board);
  }
  
  if (emptyPositions.length == 0) {
    return board;
  }
  
  // Variables to track our position in the solver
  var limit = 9,
      i, row, column, value, found;
  for(i = 0; i < emptyPositions.length;) {
    row = emptyPositions[i][0];
    column = emptyPositions[i][1];
    // Try the next value
    value = board[row][column] + 1;
    // Was a valid number found?
    found = false;
    // Keep trying new values until either the limit
    // was reached or a valid value was found
    while(!found && value <= limit) {
      // If a valid value is found, mark found true,
      // set the position to the value, and move to the
      // next position
      if(this.checkValue(board, column, row, value)) {
        found = true;
        board[row][column] = value;
        i++;
      } 
      // Otherwise, try the next value
      else {
        value++;
      }
    }
    // If no valid value was found and the limit was
    // reached, move back to the previous position
    if(!found) {
      board[row][column] = 0;
      i--;
    }
  }

  // A solution was found! Log it
  board.forEach(function(row) {
    //console.log(row.join());
  });

  // return the solution
  return board;
};
sudoku.solver.putHint = function (board) {
  
  var emptyCells = this.saveEmptyPositions(board);
  if (emptyCells.length == 0) {
    return;
  }
  
  var clone = this._cloneBoard(board);
  this.solvePuzzle(clone);
  
  var digs = [0,1,2,3,4,5,6,7,8];
  
  var r = this._chooseDigit(digs);
  var c = this._chooseDigit(digs);
  
  while (board[r][c] != 0) {
    r = this._chooseDigit(digs);
    c = this._chooseDigit(digs);
  }
  
  board[r][c] = clone[r][c];
  
};

sudoku.solver.generatePuzzle = function (hintCount) {
  hintCount = hintCount || 35;
  var grid = [];
  grid.push([0,0,0,0,0,0,0,0,0]);
  grid.push([0,0,0,0,0,0,0,0,0]);
  grid.push([0,0,0,0,0,0,0,0,0]);
  grid.push([0,0,0,0,0,0,0,0,0]);
  grid.push([0,0,0,0,0,0,0,0,0]);
  grid.push([0,0,0,0,0,0,0,0,0]);
  grid.push([0,0,0,0,0,0,0,0,0]);
  grid.push([0,0,0,0,0,0,0,0,0]);
  grid.push([0,0,0,0,0,0,0,0,0]);

  var digs = [1,2,3,4,5,6,7,8,9];
  var cols = [0,1,2,3,4,5,6,7,8];
  var rows = [8,7,6,5,4,3,2,1,0];

  for (var i = 0; i < 9; i++) {
    var col = this._popDigit(cols);
    var dig = this._popDigit(digs);
    var row = this._popDigit(rows);
    grid[row][col] = dig;
  }

  var emptys = this.saveEmptyPositions(grid);
  var solved = this.solvePuzzle(grid, emptys);

  var grid2 = [];
  grid2.push([0,0,0,0,0,0,0,0,0]);
  grid2.push([0,0,0,0,0,0,0,0,0]);
  grid2.push([0,0,0,0,0,0,0,0,0]);
  grid2.push([0,0,0,0,0,0,0,0,0]);
  grid2.push([0,0,0,0,0,0,0,0,0]);
  grid2.push([0,0,0,0,0,0,0,0,0]);
  grid2.push([0,0,0,0,0,0,0,0,0]);
  grid2.push([0,0,0,0,0,0,0,0,0]);
  grid2.push([0,0,0,0,0,0,0,0,0]);

  cols = [0,1,2,3,4,5,6,7,8];
  rows = [8,7,6,5,4,3,2,1,0];
//console.log('hinting');
  for (var i = 0; i <= hintCount; i++) {
    var r = this._chooseDigit(rows);
    var c = this._chooseDigit(cols);
    while (grid2[r][c] != 0) {
      r = this._chooseDigit(rows);
      c = this._chooseDigit(cols);
    }
    grid2[r][c] = solved[r][c];
  }

  return grid2;

};
sudoku.solver._popDigit = function (availableArray) {
  var r = Math.floor((Math.random() * availableArray.length - 1) + 1);
  var d = availableArray[r];
  availableArray.splice(r, 1);
  //console.log('_popDigit', 'avail.count', availableArray.length, 'took', d);
  return d;
};
sudoku.solver._chooseDigit = function (availableArray) {
  var r = Math.floor((Math.random() * availableArray.length - 1) + 1);
  var d = availableArray[r];
  //availableArray.splice(r, 1);
  //console.log('_chooseDigit', 'avail.count', availableArray.length, 'took', d);
  return d;
};

sudoku.solver.isSolvable = function (board) {
  try {
    var clone = this._cloneBoard(board);
    this.solvePuzzle(clone);
    return true;
  } catch (ex) {
    return false;
  }
};
sudoku.solver._cloneBoard = function (board) {
  var clone = [];
  for (var i = 0; i < board.length; i++) {
    clone.push([]);
    for (var j = 0; j < board[i].length; j++) {
      clone[i].push(board[i][j]);
    }
  }
  return clone;
};