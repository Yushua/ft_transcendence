import React, { useState } from "react";
import HTTP from "../HTTP";

export class ProfileUser { constructor ( public ID: string, public Name: string ) {} }

export default function UserSelect(props: any) {
	var onSelectCallBack: (userID: string) => void = props.onSelectCallBack
	
	const [options, setOptions] = useState<ProfileUser[]>([])
	
	if (options.length === 0) {
		const getUsers = async () => {
			const users: any[] = await JSON.parse(HTTP.Get("user-profile/user"))
			if (users.length !== 0)
				setOptions(users.map<ProfileUser>(user => new ProfileUser(user.id, user.username)))
			else
				console.log("No users available!")
		}
		getUsers()
		return <></>
	}
	
	const onChange = (data: React.ChangeEvent<HTMLSelectElement>) => {
		if (data.target.value !== "")
			onSelectCallBack(data.target.value)
	}
	
	return (
		<>
			<select onChange={onChange}>{options.map(
				(user) =>(<option value={user.ID}>{user.Name}</option>))
			}</select>
		</>
	)
}
