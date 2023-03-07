import React, { useState } from "react";
import MainChatWindow from "../Chat/Windows/MainChatWindow";
import { Pong } from "../Games/pong/Pong";
import LogoutButtonComponent from "../UserProfile/LogoutButton";
import UserProfilePage from "../UserProfile/UserProfile";

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
