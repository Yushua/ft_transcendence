import React from "react";
import ReactDOM from 'react-dom/client';
import './index.css';
import { CanvasHTMLAttributes } from "react";
import { Rectangle, Circle, Ellipse, Line, Polyline, CornerBox, Triangle } from "react-shapes";


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
class Board extends React.Component<any, any> {

	renderSquare(i: any) {
		return <Square
	  		value={ this.props.squares[i] }
			onClick={() => this.props.onClick(i)}
		/>
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
	  )
	}
}

// ========================================
class Game extends React.Component<{ }, { history: Array<any>, oIsNext: boolean }> {
	constructor(props:any) {
		super(props)
		this.state = {
			history: [{ squares: Array(9).fill(null) }],
			oIsNext: false
		}
	}

	handleClick(i:any) {
		const history = this.state.history;
		const current = history[history.length - 1];	
		const new_squares = current.squares.slice()
		if (new_squares[i] || calculateWinner(current.squares))
			return
		new_squares[i] = this.state.oIsNext ? 'O' : 'X'
		this.setState({
			history: history.concat([{squares: new_squares}]),
			oIsNext: !this.state.oIsNext
		})

	}

	render() {
		const history = this.state.history
		const current = history[history.length - 1]
		const winner = calculateWinner(current.squares)
		const status = winner ? 'Winner: ' + winner : 'Next Player: ' + (this.state.oIsNext ? 'O' : 'X')

		return (
			<div className="game">
		  		<div className="game-board">
				{status}
					<Board 
						squares = {current.squares}
						onClick={(i: any) => this.handleClick(i)}
					/>
		 		</div>
		  		<div className="game-info">
					<ol>
						{/* TODO */}
					</ol>
				</div>
			</div>
		)
	}
}


// ========================================
class Game2 extends React.Component<{ }, {  }> {
	constructor(props:any) {
		super(props)
	}

	rect: Rectangle 
	  

	render() {

		return (
			<div className="pong">
				{BackGround()}
			</div>
		)
	}

}

// ========================================
function BackGround() {
    return (
        <Rectangle width={1250} height={625} fill={{color:'#000000'}} stroke={{color:'#E65243'}} strokeWidth={3} />
    );
}

// ========================================
const element = document.getElementById("root");
if (element != null) {
	const root = ReactDOM.createRoot(element);
	root.render(<Game />)
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
  