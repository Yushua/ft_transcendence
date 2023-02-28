import React, { useState } from "react";
import HTTP from "../../Utils/HTTP";
import { asyncUpdateUserDEBUG } from "../MainChatWindow";

class ProfileUser { constructor ( public ID: string, public Name: string ) {} }

export default function UserSelect() {
	
	const [options, setOptions] = useState<ProfileUser[]>([])
	
	if (options.length === 0) {
		const getUsers = async () => {
			const users: any[] = await JSON.parse(HTTP.Get("user-profile/user"))
			if (users.length !== 0)
				setOptions(users.map<ProfileUser>(user => new ProfileUser(user.id, user.username)))
			else
				console.log("No users available!")
			asyncUpdateUserDEBUG(users[0].id)
		}
		getUsers()
		return <></>
	}
	
	const onChange = async (data: React.ChangeEvent<HTMLSelectElement>) => {
		if (data.target.value === "")
			return
		asyncUpdateUserDEBUG(data.target.value)
	}
	
	return (
		<>
			<select onChange={onChange}>{options.map(
				(user) =>(<option value={user.ID}>{user.Name}</option>))
			}</select>
			<br />
		</>
	)
}
