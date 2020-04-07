import React from 'react';

export class ButtonRunSet extends React.Component {
  handleClick = (event) => {
    event.preventDefault();
    this.props.runSet();
  };

  render() {
    return (
      <button
        className="button"
        onClick={this.handleClick}
        style={{ fontSize: '24px' }}
      >
        <h6>
          <p>Press the button to run the Set</p>
        </h6>
      </button>
    );
  }
}
