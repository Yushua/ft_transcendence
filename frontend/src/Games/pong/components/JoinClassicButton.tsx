import React from 'react'

export const JoinClassicButton = (props:any) => {
	const [classicGame, setClassicGame] = React.useState(false)
	const [controls, setControls] = React.useState('mouse')

	const findGame = (controls:string) => {
		let userID = props.userID
		let userName = props.userName
		props.socket.emit('LFG', {controls, userID, userName})
	}
	const isClassicGame = () => {
		setClassicGame(!classicGame)
	}

	return (
		<div className='dropdown-menu'>
			<button onClick={() => isClassicGame()}>Join Classic Game</button>
			{classicGame ? 
			<ul>
				<li className='dropdownItem'><button onClick={() => findGame('mouse')}>Mouse</button></li>
				<li className='dropdownItem'><button onClick={() => findGame('keyboard')}>Keyboard</button></li>
			</ul> : <></> }
		</div>
	)
}