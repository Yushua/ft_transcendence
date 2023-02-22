import './App.css'
import HTTP from "./HTTP"
import UserSelect from './Divs/UserSelect';
import MainChatWindow from './Divs/MainChatWindow';
import User from './Downloadable/User';
import ChatUser from './Downloadable/ChatUser';
import { asyncUpdateFriendsList } from './Divs/FriendsList';

function App() {
	return (
<div className="App">
	<div id="Label"></div>
	<UserSelect onSelectCallBack={async (userID: string) => {
		await User.asyncDownload(userID)
		await ChatUser.asyncDownload(userID)
		await asyncUpdateFriendsList()
	}} />
	<MainChatWindow/>
</div>
	)
}

export default App;
