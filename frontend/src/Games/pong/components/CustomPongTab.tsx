import { Button } from '@mui/material'
import { useEffect, useState, Fragment} from 'react'
import { JoinPrivateButton } from './JoinPrivateButton'
import { CreateGameMenu, CreatingGameData } from './CreateGameMenu'
import { CustomGameList } from './CustomGameList'

var reset = false

const Enum = {
	menu: 0,
	showGameList: 1,
	gameCreated: 2,
	gameID: 3,
	customGames: 4,
}

/* Store states for when user switches tabs/windows and comes back  */
var localStorage = new Array<any>()
localStorage[Enum.menu] = false
localStorage[Enum.showGameList] = true
localStorage[Enum.gameCreated] = false
localStorage[Enum.gameID] = ''

export const CustomPongTab = (props:any) => {

	const [menu, setMenu] = useState(false)
	const [showGameList, setShowGameList] = useState(true)
	const [gameCreated, setGameCreated] = useState(false)
	const [gameID, setGameID] = useState('')

	if (reset) {
		setMenu(localStorage[Enum.menu])
		setShowGameList(localStorage[Enum.showGameList])
		setGameCreated(localStorage[Enum.gameCreated])
		setGameID(localStorage[Enum.gameID])
		reset = false
	}
	useEffect(() => {
		
		props.socket.on('game_created', (gameID:string) => {
			setShowGameList(false)
			setGameCreated(true)
			localStorage[Enum.showGameList] = false
			localStorage[Enum.gameCreated] = true
			if (gameID) {
				setGameID(gameID)
				localStorage[Enum.gameID] = gameID
			}
		})
		props.socket.on('joined', (controls:string) => {
			setShowGameList(true)
			setGameCreated(false)
			setGameID('')
			setMenu(false)
			localStorage[Enum.menu] = false
			localStorage[Enum.showGameList] = true
			localStorage[Enum.gameCreated] = false
			localStorage[Enum.gameID] = ''
		})
		return () => {
			reset = true
		}
	})

	function deleteGame() {
		props.socket.emit('deleteCreatedGame')
		setGameCreated(false)
		setGameID('')
		localStorage[Enum.gameCreated] = false
		localStorage[Enum.gameID] = ''
		CreatingGameData.gameID = null
	}

	function toggleCustomMenu() {
		localStorage[Enum.menu] = !menu
		setMenu(!menu)
	}

	return (
		<Fragment>
			<p></p>
			{ gameCreated ?
				<div>
					{gameID !== '' ? <>Code to join game: {gameID}</> : <></>}
					<p></p>
					<div>
						<>Waiting for other player...    </>
						<Button variant="contained" onClick={() => deleteGame()}>Delete Game</Button>
					</div>
				</div>
			:
				<div>
					<Button variant="outlined" onClick={() => toggleCustomMenu()}>Create Custom Game</Button>
					{ menu ? 
						<CreateGameMenu socket={props.socket} userID={props.userID} userName={props.userName}/>
					:
						<JoinPrivateButton socket={props.socket} userID={props.userID} userName={props.userName}/>
					}
					{ showGameList && !menu ?
						<div>
							<CustomGameList socket={props.socket} userID={props.userID} userName={props.userName} customGames={props.customGames}/>
						</div>
					:
						<></>
					}
				</div>
			}
		</Fragment>
	)
}