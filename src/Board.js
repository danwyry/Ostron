import React from 'react'; 
import Cell from './Cell';
import './Board.css';
import { coord, coordEq } from './logic';


export default class Board extends React.Component {
  state = {
    highlightables: []
  };
  renderRows() {
    return this.props.board.map( (row,i) => (
      <div key={`row${i}`} className="row">
        {this.renderCells(row,i)}
      </div>
    ));
  }
  renderCells(row,row_index) {
    return row.map( (symbol,col_index) => {
      const position = coord(row_index,col_index);
      const highlight = this.isHighlightable(position);
      return <Cell key={`row${row_index}col${col_index}`} symbol={symbol} highlight={highlight} onMouseOverCell={this.onMouseOverCell(position)} />
    } );
  }

  isHighlightable = position => this.state.highlightables.some(coord => coordEq(coord,position));

  onMouseOverCell = from => () => this.setState({ highlightables: this.props.getHightlightables(from) });

  render(){
    return (
      <div className="ui five column celled vertically padded horizontally padded grid"> 
        {this.renderRows()}
      </div>
    );
  }
}