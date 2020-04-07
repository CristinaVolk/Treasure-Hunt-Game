import React from 'react';

export class ButtonRunGame extends React.Component {
  handleClick = (event) => {
    event.preventDefault();
    this.props.runGame();
  };

  render() {
    return (
      <button
        className="button"
        onClick={this.handleClick}
        style={{ fontSize: '24px' }}
      >
        <h6>Run Game</h6>
      </button>
    );
  }
}
