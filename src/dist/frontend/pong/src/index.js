"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const client_1 = require("react-dom/client");
require("./index.css");
function Square(props) {
    return (<button className="square" onClick={props.onClick}>
			{props.value}
		</button>);
}
class Board extends react_1.default.Component {
    renderSquare(i) {
        return <Square value={this.props.squares[i]} onClick={() => this.props.onClick(i)}/>;
    }
    render() {
        return (<div>
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
			</div>);
    }
}
class Game extends react_1.default.Component {
    constructor(props) {
        super(props);
        this.state = {
            history: [{ squares: Array(9).fill(null) }],
            oIsNext: false
        };
    }
    handleClick(i) {
        const history = this.state.history;
        const current = history[history.length - 1];
        const new_squares = current.squares.slice();
        if (new_squares[i])
            return;
        new_squares[i] = this.state.oIsNext ? 'O' : 'X';
        this.setState({
            history: history.concat([{ squares: new_squares }]),
            oIsNext: !this.state.oIsNext
        });
    }
    render() {
        const history = this.props.history;
        const current = history[history.length - 1];
        const winner = calculateWinner(this.state.squares);
        const status = winner ? 'Winner: ' + winner : 'Next Player: ' + (this.state.oIsNext ? 'O' : 'X');
        return (<div className="game">
		  		<div className="game-board">
					<Board squares={current.squares} onClick={(i) => this.handleClick(i)}/>
		 		</div>
		  		<div className="game-info">
					<div>
						
					</div>
					<ol>
						
					</ol>
				</div>
			</div>);
    }
}
const element = document.getElementById("root");
if (element != null) {
    const root = client_1.default.createRoot(element);
    root.render(<Game />);
}
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
//# sourceMappingURL=index.js.map