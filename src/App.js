import React from 'react';
import Board from './Board';
import { piecePossibleDestinations, movePiece, makeGame, won } from './logic';

export default class App extends React.Component {
  state = { 
    game: makeGame(), 
    errorMsg: null, 
    winner: null
  } ;

  render() {
    const rendered = this.state.winner === null
      ? this.renderGame()
      : this.renderWinner();
    return (
      <div className="ui container">
        {rendered}
      </div>
    );
  }

  renderGame = () => {
    const pieceToMove = this.state.game.currentsMoves === 0 
      ? "the monster" 
      : "a piece";
    return (
      <div className="ui container">
        <h1>Player {this.state.game.currentPlayer} <small>Move {pieceToMove}</small></h1>
        {this.renderErrorMessage()}
      <Board board={this.state.game.board} 
        movablePieces={this.state.game.currentsMoves === 0 ? 0 : this.state.game.currentPlayer}
        getPossibleDestinationsFrom={this.getPossibleDestinationsFrom} 
        onPieceDragged={this.onPieceDragged}
        />
      </div>
    );
  };

  renderWinner = () => {
    return (
      <div>
        <h1>Ganó el jugador {this.state.winner}</h1>
        <button onClick={this.resetGame}>Volver a empezar</button>
      </div>
    );
  };

  renderErrorMessage() {
    return (this.state.errorMsg) 
      ? `${this.state.errorMsg}`
      : null;
  }

  resetGame = () => {
    this.setState({
      game: makeGame(),
      winner: null,
      errorMsg: null
    });
  }

  onPieceDragged = (from,to) => {
    try {
      let game = movePiece(this.state.game,from,to);
      const winner = won(game);
      if (winner) {
        this.setState({
          game: game, 
          winner: winner
        });
        return ; 
      } 
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