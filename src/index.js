import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square(props) {
  return (
    <button className="square" onClick={props.onClick}>
      {props.value}
    </button>
  );
}


class Board extends React.Component {

  renderSquare(i) { /* pass state and function to change state down to children */
    return <Square value={this.props.squares[i]} onClick={() => this.props.onClick(i)} />;
  }

  render() {
    return (
      <div>
        <div className="board-row">
          {this.renderSquare(0)}
          {this.renderSquare(1)}
          {this.renderSquare(2)}
        </div>
        <div className="board-row">
          {this.renderSquare(3)}
          {this.renderSquare(4)}
          {this.renderSquare(5)}
        </div>
        <div className="board-row">
          {this.renderSquare(6)}
          {this.renderSquare(7)}
          {this.renderSquare(8)}
        </div>
      </div>
    );
  }
}

class Game extends React.Component {
  constructor(props){
    super(props);
    /* init state */
    this.state = {
      history: [{
        squares: Array(9).fill(null)
      }],
      xIsNext: true,
      moveNumber: 0
    }
  }

  handleClick(i) { /* click handler passed to squares component */
    const history = this.state.history;
    const winner = calculateWinner(history[0].squares);

    if (winner || history[0].squares[i]){
      return; /* return early if the game is over or someone has already played that square */
    }
    const squares = history[0].squares.slice(); /* copy the state's squares array */
    squares[i] = this.state.xIsNext ? 'X' : 'O'; /* conditionally set x or o */

    /* add move to history */
    history.unshift({squares: squares})

    this.setState({
      history: history,
      xIsNext: !this.state.xIsNext,
      moveNumber: history.length - 1
    })
  }

  jumpTo(move){
    const history = this.state.history.slice(this.state.history.length-move-1, this.state.history.length)
    this.setState({
      moveNumber: move,
      xIsNext: (move % 2) === 0,
      history: history
    })
  }

  render() {
    const history = this.state.history;
    const current = history[history.length-this.state.moveNumber-1]
    const winner = calculateWinner(current.squares);
    let status;

    if (winner){
      status = 'Winner is ' + winner + '!!'
    } else {
      status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O')
    }

    const moves = history.map((step, move) => {
      const desc = move ?
        'Go to move #' + move :
        'Go to game start';
      return (
        <li key={move}>
          <button onClick={() => this.jumpTo(move)}>{desc}</button>
        </li>
      );
    });

    return (
      <div className="game">
        <div className="game-board">
          <Board squares={current.squares} onClick={(i) => this.handleClick(i)} />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <ol>{moves}</ol>
        </div>
      </div>
    );
  }
}

// ========================================

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}
