import { stringify } from "querystring";
import React from "react";
import ReactDOM from 'react-dom/client';
import './index.css';

// ========================================
//render a square
function Square(props: any) 
{
	return (
		<button className="square"
			onClick={props.onClick}
		>
			{props.value}
		</button>
	)
}

// ========================================
//board class with state of 9 squares
type MyProps = {  }
type MyState = { squares: Array<any>, oIsNext: boolean }
class Board extends React.Component<MyProps, MyState> {
	constructor(props: any) {
		super(props)
		this.state = {	
			squares: Array(9).fill(null),
			oIsNext: false
		}
	}

	renderSquare(i: any) {
		return <Square
	  		value={ this.state.squares[i] }
			onClick={() => this.handleClick(i)}
		/>
	}
  
	handleClick(i:any) {
		const new_squares = this.state.squares.slice()
		new_squares[i] = this.state.oIsNext ? 'O' : 'X'
		this.setState({
			squares: new_squares,
			oIsNext: !this.state.oIsNext
		})
	}

	render() {
		const winner = calculateWinner(this.state.squares)
		const status = winner ? 'Winner: ' + winner : 'Next Player: ' + (this.state.oIsNext ? 'O' : 'X')

		return (
			<div>
		 		<div className="status">
					{status}
				</div>
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
	  )
	}
}

// ========================================
class Game extends React.Component {
	render() {
		return (
			<div className="game">
		  		<div className="game-board">
					<Board />
		 		</div>
		  		<div className="game-info">
					<div>
						{/* status */}
					</div>
					<ol>
						{/* TODO */}
					</ol>
				</div>
			</div>
		)
	}
}

// ========================================
const element = document.getElementById("root");
if (element != null) {
	const root = ReactDOM.createRoot(element);
	root.render(<Game />);
}

// ========================================
function calculateWinner(squares: any) {
	const lines = [
	  [0, 1, 2],
	  [3, 4, 5],
	  [6, 7, 8],
	  [0, 3, 6],
	  [1, 4, 7],
	  [2, 5, 8],
	  [0, 4, 8],
	  [2, 4, 6],
	]
	for (let i = 0; i < lines.length; i++) {
	  const [a, b, c] = lines[i]
	  if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
		return squares[a]
	  }
	}
	return null
  }
  