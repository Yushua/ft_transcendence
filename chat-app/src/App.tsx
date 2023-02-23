import './App.css'
import HTTP from "./HTTP"
import UserSelect from './Divs/UserSelect';
import MainChatWindow, { SetMainWindow } from './Divs/MainChatWindow';

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
