import { useState } from "react";
import { ChangeMemberWindow } from "./MembersWindow";

export default function RoomEdit() {
	
	const [members, setmembers] = useState<JSX.Element>(<></>)
	
	return (
		<>
			<div style={{width: "100%", display: "table"}}>
				<button
					style={{height: ".5cm", boxSizing: "border-box"}}
					onClick={() => ChangeMemberWindow("members")}
					>Back</button> Edit Room
			</div>
			
			<div style={{overflowY: "scroll", overflowX: "hidden", width: "3.5cm", fontSize: ".45cm", height: "5cm"}}>
				{members}
			</div>
		</>
	)
}
