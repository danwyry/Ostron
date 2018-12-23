import React from 'react'; 
import './Cell.css';

class Cell extends React.Component {
  render () {
    let className ; 
    switch (this.props.piece) { 
      case 1:  className = "blue circle icon" ; break; 
      case 2:  className = "red circle icon" ; break; 
      case 0:  className = "green bug icon" ; break; 
      default: className = "icon";
    }
    const highlight = this.props.highlight ? "highlighted": "";
    const movable = this.props.movable ? "movable": "";
    return (
      <div className="column" 
        onMouseOver={this.onMouseOver} 
        draggable="true" 
        onDragStart={this.props.onDragStart} 
        onDrop={this.props.onDrop}
        onDragOver={ this.onDragOver }
    >
        <div className={`ui segment board-cell ${highlight} ${movable}`} >
          <i className={`${className}`}></i>
        </div>
      </div>
    );
  }

  onMouseOver = () => this.props.onMouseOverCell();

  onDragOver = (e) => { 
    e.preventDefault(); 
    e.stopPropagation(); 
    return false; 
  }
} 

export default Cell; 