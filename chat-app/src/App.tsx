import './App.css'
import HTTP from "./HTTP"
import UserSelect from './Divs/UserSelect';
import MainChatWindow, { SetMainWindow } from './Divs/MainChatWindow';
import User from './Downloadable/User';
import ChatUser from './Downloadable/ChatUser';
import { asyncUpdateFriendsList } from './Divs/FriendsList';
import { asyncUpdateRoomList } from './Divs/RoomList';
import NameStorage from './NameStorage';

function App() {
	return (
<div className="App">
	<div id="Label"></div>
	<UserSelect />
	<MainChatWindow/>
	<button onClick={_ => HTTP.asyncDelete(`chat/all`)}>{"[DEBUG] Delete all Chat Data"}</button>
</div>
	)
}

export default App;
