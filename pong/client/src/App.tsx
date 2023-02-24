import { Component } from 'react';
import { RunPong } from './components/Pong';
import styled from 'styled-components'


const AppContainer = styled.div`
	width: 100%
	height:100%
	display: flex
	flex-direction: column
	align-items: center
	padding: 1em
`

class App extends Component  {
	render() {
		return (
		<div className="App">
			<RunPong />
		</div>
		)
	}
}

export default App;
