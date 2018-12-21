import React from 'react'; 
import './Cell.css';

class Cell extends React.Component {
  render () {
    let className ; 
    switch (this.props.symbol) { 
      case 1:  className = "circle icon" ; break; 
      case 2:  className = "circle outline icon" ; break; 
      case 0:  className = "bug icon" ; break; 
      default: className = "icon";
    }
    const highlight = this.props.highlight ? "highlighted": "";
    return (
      <div className="column" 
        onMouseOver={this.onMouseOver} 
        draggable="true" 
        onDragStart={this.props.onDragStart} 
        onDrop={this.props.onDrop} 
        onDragOver={ this.onDragOver }
    >
        <div className={`ui segment board-cell ${highlight}`} >
          <i className={`${className}`}></i>
        </div>
      </div>
    );
  }

  onMouseOver = () => {
    this.props.onMouseOverCell();
  }

  onDragOver = (e) => { 
    e.preventDefault(); 
    e.stopPropagation(); 
    return false; 
  }
} 

export default Cell; 