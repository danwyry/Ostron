import React from 'react';
import Board from './Board';
import { piecePossibleDestinations, coord, newState } from './logic';

export default class App extends React.Component {
  state = newState();

  getHightlightables = from => {
    const piece = this.state.board[from.row][from.col]; 
    return (this.state.currentsMoves === 0 && piece === 0) ||
        (this.state.currentsMoves === 1 && piece === this.state.currentPlayer)
      ? piecePossibleDestinations(this.state.board, from)
      : [];
  }

  render() {
    return (
      <div className="ui container">
        <h1>Player {this.state.currentPlayer}</h1>
        <Board board={this.state.board} getHightlightables={this.getHightlightables} />
      </div>
    );
  }
}