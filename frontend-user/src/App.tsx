import React, { useState } from 'react';
import './App.css';
import fetch from 'node-fetch'
import InputFieldsUsername from "./components/inputFieldsUsername"
import InputFieldsPassword from "./components/inputFieldsPassword"
async function logIn(username: string, password: string){
  try {
    // 👇️ const response: Response
    const response = await fetch('http://localhost:4242/signup', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
      },
      body: `username=${username}&password=${password}`
    });

    if (!response.ok) {
      throw new Error(`Error! status: ${response.status}`);
    }

    // 👇️ const result: GetUsersResponse
  } catch (error) {
    if (error instanceof Error) {
      console.log('error message: ', error.message);
      return error.message;
    } else {
      console.log('unexpected error: ', error);
      return 'An unexpected error occurred';
    }
  }
}

const App: React.FC = () => {

  // const [username, setUsername] = useState<string>("");
  // const [password, setPassword] = useState<string>("");
  var username: string = "";
  var password: string = "";

  logIn(username, password);

  console.log(username, password);

  return (

    <div className="App">
        <span className="heading">
          Login
        </span>
        {/* <InputFieldsUsername username={username} setUsername={setUsername}/>
        <InputFieldsPassword password={password} setPassword={setPassword}/> */}
        <form className= 'input' >
            <input type='input'
            placeholder="username"
            className="input_box"/>
            <input type='input'
            placeholder="password"
            className="input_box"/>
            <button className="input_submit" type="submit" onSubmit={logIn(username, password)} >go</button>
        </form>
    </div>
  );
}

export default App;
