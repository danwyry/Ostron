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

export const makeGame = () => { 
  return {
    board: newBoard(),
    monsterCoordinates: coord(2,2), 
    currentPlayer: 1,
    currentsMoves: 0
  }
};
/*
 * Gana el primero que consigue llevar el Neutrón a cualquier casilla libre de su línea de partida.
 * Un jugador pierde si se ve forzado a llevar el Neutrón hacia una casilla de la línea de partida 
 * adversaria. También pierde si la situación está bloqueada y en su turno no puede mover el Neutrón 
 * o, si después de mover el Neutrón, no puede mover ninguna de sus fichas} 
 */
export const won = ({ board, monsterCoordinates, currentPlayer}) => {
  console.clear();
  console.log(board);
  console.log(monsterCoordinates);
  console.log(currentPlayer);
  console.log(! pieceCanMoveAtAll(board, monsterCoordinates));
  console.log(pieceCanGoOnlyToPlayersHouse(board, monsterCoordinates, currentPlayer));
  console.log(pieceAtPlayersHouseRow(currentPlayer,monsterCoordinates));
  return ! pieceCanMoveAtAll(board, monsterCoordinates) ||
    pieceAtPlayersHouseRow(currentPlayer,monsterCoordinates) ||
    pieceCanGoOnlyToPlayersHouse(board, monsterCoordinates, currentPlayer);
};

export const piecePossibleDestinations = (state, from) => {
  return piecePossibleDestinationsInBoard(state.board,from);
};

export const movePiece = (state,from,to) => { if (coordEq(from,to)) return ; 

  if (piecePossibleDestinationsInBoard(state.board,from).some(destination => coordEq(destination,to)))
    {
      const newBoard = state.board.map(row => row.slice()); // duplicate board
      const piece = newBoard[from.row][from.col];
      newBoard[from.row][from.col] = null;
      newBoard[to.row][to.col] = piece;
      return {...state, board: newBoard};
    }
  throw new Error("Can't make that move");
}

export const nextTurn = state => {
  const {currentPlayer, currentsMoves} = state; 
  let turnUpdates = {};
  switch (currentsMoves) {
    case 0 : turnUpdates.currentsMoves = 1; 
      break; 
    case 1 : 
      turnUpdates.currentsMoves = 0; 
      turnUpdates.currentPlayer = nextPlayer(currentPlayer); 
      break; 
    default: 
      break; 
  } 
  return Object.assign({}, state, turnUpdates);
}

export const coordEq = (c1,c2) => c2.row === c1.row && c2.col === c1.col;

const coordNeq = (c1,c2) => c2.row !== c1.row || c2.col !== c1.col;

const nextPlayer = currentPlayer => currentPlayer === 1 ? 2 : 1;

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

const playersHouseRow = player => player === 1 ? 0 : 4;

const pieceAtPlayersHouseRow = (player,position) => position.row === playersHouseRow(player);

const pieceCanGoOnlyToPlayersHouse = (board, from, player) => {
  const houseRow = playersHouseRow(player);
  return piecePossibleDestinationsInBoard(board,from).every( ({ row }) => row === houseRow);
};

const piecePossibleDestinationsInBoard = (board,from) => {
  return moves
    .map(move => pieceDestinationWithMove(board,from,move))
    .filter(to => coordNeq(to,from));
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
const testingBoard = [
  [null, 1  , 1  ,null,null],
  [null, 2  , 1  , 1  ,null],
  [null, 2  , 0  , 2  ,null],
  [null, 2  ,null, 1  ,null],
  [null,null,null,null, 2  ]
];
const testingGame = {
  ...makeGame(),
  board: testingBoard
}; 
// console.log(testingGame);
// console.log(pieceDestinationWithMove(testingBoard, coord(2,2), moves[6]));
// console.log(piecePossibleDestinations(testingGame, coord(2,2)));
// console.log(pieceCanGoOnlyToPlayersHouse(testingBoard, coord(2,2), 2));
// console.log(won(testingGame));
// console.log(movePiece(testingBoard,coord(2,2), coord(1,2)));
