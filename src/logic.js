export const coord = (row,col) => {
  return {
    row: row, 
    col: col
  };
};

/**
 * Boards are represented as a 2 dim. array, represented with rows first,
 * columns later, meaning you'll access it space in it as board[row][column]
 * 
 * Symbols are: 
 * 0 = monster
 * 1 = player 1
 * 2 = player 2
 * null = empty space
 */
const newBoard = () => [
  [ 1  , 1  , 1  , 1  , 1  ],
  [null,null,null,null,null],
  [null,null, 0  ,null,null],
  [null,null,null,null,null],
  [ 2  , 2  , 2  , 2  , 2  ]
];

export const newState = () => { 
  return {
    board: newBoard(),
    monsterCoordinates: coord(2,2), 
    currentPlayer: 1,
    currentsMoves: 0
  }
};

export const won = (state) => {
  return ! pieceCanMoveAtAll(state.board, state.monsterCoordinates) ||
    pieceCanGoOnlyToCurrentsHouse(state.board, state.monsterCoordinates, state.currentPlayer);
};

export const piecePossibleDestinations = (board, from) => {
  return moves
  .map(move => pieceDestinationWithMove(board,from,move))
  .filter(to => coordNeq(to,from))
}  

export const movePiece = (board,from,to) => { if (coordEq(from,to)) return ; 

  if (piecePossibleDestinations(board,from).some(destination => coordEq(destination,to)))
    {
      const newBoard = board.map(row => row.slice()); // duplicate board
      const piece = newBoard[from.row][from.col];
      newBoard[from.row][from.col] = null;
      newBoard[to.row][to.col] = piece;
      return newBoard;
    }
  throw new Error("Can't make that move");
}

export const coordEq = (c1,c2) => c2.row === c1.row && c2.col === c1.col;

const coordNeq = (c1,c2) => c2.row !== c1.row || c2.col !== c1.col;

const moves = [
  ({row,col}) => coord(row-1, col-1),
  ({row,col}) => coord(row-1, col),
  ({row,col}) => coord(row-1, col+1),
  ({row,col}) => coord(row, col-1),
  ({row,col}) => coord(row, col+1),
  ({row,col}) => coord(row+1, col-1),
  ({row,col}) => coord(row+1, col),
  ({row,col}) => coord(row+1, col+1),
];

const pieceCanGoOnlyToCurrentsHouse = (board, from, currentPlayer) => {
  const currentsHouseRow = currentPlayer === 1 ? 0 : 4;
  return piecePossibleDestinations(board,from).every( ({ row }) => row === currentsHouseRow);
};

const pieceDestinationWithMove = (board, from, move) => {
  let destination = from; 
  let next = move(destination);
  while ( isAvailablePosition(board,next) )
    {
      destination = next; 
      next = move(next);
    }
  return destination;
};

const pieceCanMoveAtAll = (board, pieceCoords) => {
  return moves.some( move => {
    const {row,col} = move(pieceCoords);
    return board[row][col] === null ;
  });
};

const isExistentPosition = (board,coords) => {
  return board[coords.row] !== undefined 
    && board[coords.row][coords.col] !== undefined;
};

const isEmptyPosition = (board,coords) => board[coords.row][coords.col] === null;

const isAvailablePosition = (board,coords) => {
  return isExistentPosition(board,coords) && isEmptyPosition(board,coords);
};


// tests
// const center = coord(2,2);
// const testingBoard = [
//   [null, 1  , 1  ,null,null],
//   [null, 2  , 1  , 1  ,null],
//   [null, 2  , 0  , 2  ,null],
//   [null, 2  ,null, 1  ,null],
//   [null,null,null,null, 2  ]
// ];
// console.log(piecePossibleDestinations(testingBoard, center));
// console.log(pieceDestinationWithMove(testingBoard, center, moves[6]));
// console.log(piecePossibleDestinations(testingBoard, center));
// console.log(pieceCanGoOnlyToCurrentsHouse(testingBoard, center, 2));
// console.log(won(state));
// console.log(movePiece(testingBoard,coord(2,2), coord(1,2)));
