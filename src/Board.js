import React from 'react'; 
import Cell from './Cell';
import './Board.css';
import { coord, coordEq } from './logic';


export default class Board extends React.Component {
  state = {
    highlightables: [],
  };
  movingPieceFrom = null; 
  render(){
    return (
      <div className="board"> 
        {this.renderRows()}
      </div>
    );
  }

  renderRows() {
    return this.props.board.map( (row,i) => (
      <div key={`row${i}`} className="board-row">
        {this.renderCells(row,i)}
      </div>
    ));
  }

  renderCells(row,row_index) {
    return row.map( 
      (piece,col_index) => {
        const key = `row${row_index}col${col_index}`;
        const position = coord(row_index,col_index);
        const highlight = this.isHighlightable(position);
        const movable = piece === this.props.movablePieces;
        const onDragStart = () => { this.movingPieceFrom =  position ; };
        const onDrop = (e) => { 
          e.preventDefault();
          this.props.onPieceDragged(this.movingPieceFrom, position);
          this.movingPieceFrom = null;
        };
        const onMouseOverCell = this.onMouseOverCell(position);

        return (
          <Cell key={key} piece={piece} 
            movable={movable}
            highlight={highlight} 
            onMouseOverCell={onMouseOverCell} 
            onDragStart={onDragStart} 
            onDrop={onDrop} 
          />);
      });
  }
  isHighlightable = position => this.state.highlightables.some(it => coordEq(it,position));
  onMouseOverCell = from => () => this.setState({ highlightables: this.props.getPossibleDestinationsFrom(from) });
}