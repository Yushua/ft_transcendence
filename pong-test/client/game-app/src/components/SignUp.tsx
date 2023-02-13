import React, {useState} from "react";

function SignUp() {
	const [username, setUsername] = useState("")
	const [password, setPassword] = useState("")
	const [firstName, setFirstName] = useState("")

	const signUp  = () => {}

	return (
		<div className="SignUp">
			<label>
				Sign Up
			</label>
			<input
				placeholder="First Name"
				onChange={(event) => { 
					setFirstName(event.target.value)
				}}
			/>
			<input
				placeholder="Username"
				onChange={(event) => { 
					setUsername(event.target.value)
				}}
			/>
			<input
				placeholder="Password"
				type="password"
				onChange={(event) => { 
					setPassword(event.target.value)
				}}
			/>
			<button onClick={signUp} >
				Sign Up 
			</button>

		</div>
	)
}

export default SignUp


// import { type } from "os";
// import React, {useState} from "react";

// function SignUp() {

// 	type user = {
// 		firstName:string
// 	}
// 	function setfirstName(str:string, user:user) {
// 		user.firstName = str
// 	}

// 	var my_user:user

// 	// const [user:any, setUser:any] = useState(null)
	
// 	return (
// 		<div className="SignUp">
// 			<label> Sign Up </label>
// 			<input
// 				placeholder="First Name"
// 				onChange={(event) => { 
// 					setfirstName(event.target.value, my_user)
// 				}}
// 			/>
// 		</div>
// 	)
// }

// export default SignUp