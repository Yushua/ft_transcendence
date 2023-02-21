import React from "react";
import { HTTP } from "./HTTP";
import { RefObject } from "react";
import { ChatUser } from "./Downloadable/ChatUser";
import { User } from "./Downloadable/User";

export class UserSelect extends React.Component {
	constructor(props: any) {
		super(props)
		if (UserSelect._onLoad())
			UserSelect._update()
	}
	
	private static DivUserSelect: HTMLElement | null = null
	
	private static _onLoad(): boolean {
		UserSelect.DivUserSelect = document.getElementById("UserSelect")
		return !!UserSelect.DivUserSelect
	}
	
	private static async _update() {
		if (!UserSelect.DivUserSelect && !UserSelect._onLoad())
			return
		
		const users = await JSON.parse(HTTP.Get("user-profile/user"))
		var options = ""
		for (const user of users)
			options += `<option value="${user.id}">${user.username}</option><br>`
		const userSelect = document.getElementById("UserSelect")
		if (!!userSelect)
			userSelect.innerHTML = options
	}
	
	private static async changeUser(userID: string) {
		await Promise.all([
			ChatUser.asyncDownload(userID),
			User.asyncDownload(userID)
		])
	}
	
	render() {
		return (
		<div>
			<button onClick={UserSelect._onLoad}>Reload</button>
			<select id="UserSelect" onChange={(choice) => UserSelect.changeUser(choice.target.value)}></select>
		</div>
	)}
}
