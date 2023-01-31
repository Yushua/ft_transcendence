import { stringify } from "querystring";
import React from "react";
import ReactDOM from 'react-dom/client';
import './index.css';

class Square extends React.Component<{index: any}, {value: any}> {
	constructor(props: any) {
	super(props)
	this.state = { value: null }
	}

	render() {
	  return (
		<button className="square"
				onClick={() => { this.setState({value: "X"}) }}>
		{this.state.value}
		</button>
	  );
	}
  }
  
  class Board extends React.Component {
	renderSquare(i: any) {
	  return <Square index={i} />;
	}
  
	render() {
	  const status = 'Next player: X';
  
	  return (
		<div>
		  <div className="status">{status}</div>
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
	render() {
	  return (
		<div className="game">
		  <div className="game-board">
			<Board />
		  </div>
		  <div className="game-info">
			<div>{/* status */}</div>
			<ol>{/* TODO */}</ol>
		  </div>
		</div>
	  );
	}
  }
  
  // ========================================
  
  const element = document.getElementById("root");
  if (element != null) {
  	const root = ReactDOM.createRoot(element);
	root.render(<Game />);

  }
