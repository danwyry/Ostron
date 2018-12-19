import React from 'react'; 
import './Cell.css';

class Cell extends React.Component {

  onMouseOver = (event) => {
    this.props.onMouseOverCell();
  }

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
      <div className="column" onMouseOver={this.onMouseOver}>
        <div className={`ui segment board-cell ${highlight}`}>
          <i className={`${className}`}></i>
        </div>
      </div>
    );
  }
} 

export default Cell; 