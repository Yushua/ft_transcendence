import React, { useState } from "react";
import UserProfilePage from "../UserProfile";
import MainChatWindow from "../Chat/Windows/MainChatWindow";
import LogoutButtonComponent from "../componentsUserProfile/LogoutButton";
import { Pong } from "../Games/pong/Pong";

export default function MainWindow() {
	
	const [window, setWindow] = useState<string>("")
	var display = <></>
	switch (window) {
		case "profile": display = <UserProfilePage/>; break
		case "chat": display = <MainChatWindow/>; break
		case "pong": display = <Pong/>; break
		default: break
	}
	
	return (
		<div>
			<div>
				<LogoutButtonComponent />
				<button
					onClick={() => setWindow("profile")}
					disabled={window === "profile"}
					>Profile</button>
				<button
					onClick={() => setWindow("chat")}
					disabled={window === "chat"}
					>Chat</button>
				<button
					onClick={() => setWindow("pong")}
					disabled={window === "chat"}
					>Play Pong</button>
			</div>
			{display}
		</div>
	)
}
