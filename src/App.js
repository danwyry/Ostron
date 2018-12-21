import React from 'react';
import Board from './Board';
import { piecePossibleDestinations, movePiece, makeGame, nextTurn, won } from './logic';

export default class App extends React.Component {
  state = { 
    game: makeGame(), 
    errorMsg: null, 
    wonGame: null
  } ;

  render() {
    const pieceToMove = this.state.game.currentsMoves === 0 ? "the monster" : "a piece";
    return (
      <div className="ui container">
        <h1>Player {this.state.game.currentPlayer} <small>Move {pieceToMove}</small></h1>
        {this.renderErrorMessage()}
        <Board board={this.state.game.board} 
          getPossibleDestinationsFrom={this.getPossibleDestinationsFrom} 
          onPieceDragged={this.onPieceDragged}
          />
      </div>
    );
  }

  renderErrorMessage() {
    return (this.state.errorMsg) 
      ? `${this.state.errorMsg}`
      : null;
  }

  onPieceDragged = (from,to) => {
    try {
      let game = movePiece(this.state.game,from,to);
      const gano = won(game);
      console.log('??? -> ');
      console.log(gano);
      if (gano)
        {
          console.log('ganó ' + game.currentPlayer);
          this.setState({
            wonGame: this.state.game.currentPlayer,
            errorMsg: null,
          });
        }
        game = nextTurn(game);
      this.setState({game: game, errorMsg: null});
    } catch (error) {
      this.setState({errorMsg: error});
    }
  }

  getPossibleDestinationsFrom = from => {
    const piece = this.state.game.board[from.row][from.col]; 
    return (this.state.game.currentsMoves === 0 && piece === 0) ||
        (this.state.game.currentsMoves === 1 && piece === this.state.game.currentPlayer)
      ? piecePossibleDestinations(this.state.game, from)
      : [];
  }
}