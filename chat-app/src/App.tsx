import './App.css'
import ChatRoom from './Cache/ChatRoom';
import ChatUser from './Cache/ChatUser';
import HTTP from "./Utils/HTTP"
import UserSelect from './Windows/Debug/UserSelect';
import MainChatWindow, { SetMainWindow } from './Windows/MainChatWindow';

function App() {
	return (
<div className="App">
	<div id="Label"></div>
	<UserSelect />
	<MainChatWindow/>
	<button
		onClick={async () => {
		HTTP.Delete(`chat/all`)
		ChatUser.Clear()
		ChatRoom.Clear()
	}}
	>{"[DEBUG] Delete all Chat Data"}</button>
</div>
	)
}

export default App;
