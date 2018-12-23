const MONSTER = 0 ; 
const PLAYER_1 = 1; 
const PLAYER_2 = 2; 
const EMPTY = null; 

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
  [ PLAYER_1, PLAYER_1, PLAYER_1, PLAYER_1, PLAYER_1 ],
  [  EMPTY  ,  EMPTY  ,  EMPTY  ,  EMPTY  ,  EMPTY   ],
  [  EMPTY  ,  EMPTY  , MONSTER ,  EMPTY  ,  EMPTY   ],
  [  EMPTY  ,  EMPTY  ,  EMPTY  ,  EMPTY  ,  EMPTY   ],
  [ PLAYER_2, PLAYER_2, PLAYER_2, PLAYER_2, PLAYER_2 ]
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
 * Un jugador pierde si : 
 * + se ve forzado a llevar el Neutrón hacia una casilla de la línea de partida 
 *   adversaria. 
 * + la situación está bloqueada y en su turno no puede mover el Neutrón  o, si después de mover el
 *   Neutrón, no puede mover ninguna de sus fichas} 
 */
export const won = state => { 
  if (currentPlayerWon(state) || nextPlayerLost(state))
    return state.currentPlayer;
  else if (lost(state))
    return nextPlayer(state.currentPlayer);

  return null; 
}
export const lost = ({ monsterCoordinates, currentPlayer, currentsMoves }) => {
  return currentsMoves === 1 && 
    pieceAtPlayersHouseRow(nextPlayer(currentPlayer), monsterCoordinates);
};

const currentPlayerWon = ({ monsterCoordinates, currentPlayer, currentsMoves }) => {
  return currentsMoves === 1 && pieceAtPlayersHouseRow(currentPlayer,monsterCoordinates);
};

const nextPlayerLost = ({board, monsterCoordinates, currentPlayer, currentsMoves}) => {
  return (currentsMoves === 0 && pieceCanGoOnlyToPlayersHouse(board, monsterCoordinates, nextPlayer(currentPlayer))) || 
    (currentsMoves === 0 && ! pieceCanMoveAtAll(board, monsterCoordinates)) || 
    (currentsMoves === 1 && ! playerCanMoveAnyPiece(board, currentPlayer));
};

const playerCanMoveAnyPiece = (board, currentPlayer) => {
  return board
    .some((row, row_index) => 
      row.some((piece, col_index) => piece === currentPlayer && pieceCanMoveAtAll(board, coord(row_index, col_index))
    ));
};

export const piecePossibleDestinations = (state, from) => {
  return piecePossibleDestinationsInBoard(state.board,from);
};

export const movePiece = (state,from,to) => {  
  if (isEmptyPosition(state.board,from) || coordEq(from,to)) 
    return state; 

  if (piecePossibleDestinationsInBoard(state.board,from).some(destination => coordEq(destination,to)))
    {
      const gameUpdates = {
        board: state.board.map(row => row.slice()) // duplicate board
      };
      const piece = gameUpdates.board[from.row][from.col];
      gameUpdates.board[from.row][from.col] = null;
      gameUpdates.board[to.row][to.col] = piece;

      if (piece === MONSTER) 
        gameUpdates.monsterCoordinates = to;

      return nextTurn({...state, ...gameUpdates});
    }
  throw new Error("Can't make that move");
}

export const coordEq = (c1,c2) => c2.row === c1.row && c2.col === c1.col;
export const coordNeq = (c1,c2) => c2.row !== c1.row || c2.col !== c1.col;
export const pieceAt = (state,position) => pieceAtInBoard(state.board, position);
export const nextPlayer = currentPlayer => currentPlayer === PLAYER_1 ? PLAYER_2 : PLAYER_1;





const pieceAtInBoard = (board, position) => board[position.row][position.col];

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

const playersHouseRow = player => player === PLAYER_1 ? 0 : 4;

const pieceAtPlayersHouseRow = (player,position) => position.row === playersHouseRow(player);

const pieceCanGoOnlyToPlayersHouse = (board, from, player) => {
  const houseRow = playersHouseRow(player);
  return piecePossibleDestinationsInBoard(board,from).every( ({ row }) => row === houseRow);
};

const nextTurn = state => {
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
  return {...state, ...turnUpdates};
}


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
    const newPosition = move(pieceCoords);
    return isAvailablePosition(board,newPosition);
  });
};

const isExistentPosition = (board,coords) => {
  return board[coords.row] !== undefined 
    && board[coords.row][coords.col] !== undefined;
};

const isEmptyPosition = (board,coords) => board[coords.row][coords.col] === EMPTY;

const isAvailablePosition = (board,coords) => {
  return isExistentPosition(board,coords) && isEmptyPosition(board,coords);
};


// tests
// const testingBoard = [
//   [null, 1  , 1  ,null,null],
//   [null, 2  , 1  , 1  ,null],
//   [null, 2  , 0  , 2  ,null],
//   [null, 2  ,null, 1  ,null],
//   [null,null,null,null, 2  ]
// ];
// const testingGame = {
//   ...makeGame(),
//   board: testingBoard
// }; 
// console.log(testingGame);
// console.log(pieceDestinationWithMove(testingBoard, coord(2,2), moves[6]));
// console.log(piecePossibleDestinations(testingGame, coord(2,2)));
// console.log(pieceCanGoOnlyToPlayersHouse(testingBoard, coord(2,2), 2));
// console.log(won(testingGame));
// console.log(movePiece(testingBoard,coord(2,2), coord(1,2)));
