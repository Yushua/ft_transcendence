import React, { useState } from "react";
import HTTP from "../HTTP";
import FriendsList from "./FriendsList";
import RoomList from "./RoomList";

export default function RoomSelectWindow(props: any) {
	var onSelectCallBack: (userID: string) => void = props.onSelectCallBack
	
	return (
		<div style={{width: "100px", display: "table-cell", border: "solid"}}>
			<FriendsList/>
			<RoomList/>
		</div>
	)
}
