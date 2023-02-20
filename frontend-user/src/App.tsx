import React, { } from 'react';
import './App.css';
import fetch from 'node-fetch'
async function logIn(username: string, password: string, email:string){
  console.log("sending message")
  try {
    // 👇️ const response: Response
    const response = await fetch('http://localhost:4242/signup', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
      },
      body: `username=${username}&password=${password}eMail=${email}`
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
const Print = (username:string, password:string, email:string) => {
  logIn(username, password, email);
  console.log(username)
  console.log(password)
  console.log(email)
}

const App: React.FC = () => {

  return (

    <div className="App">
        <span className="heading">
          Login
        </span>
        <form className= 'input' >
            <input type='input'
            placeholder="username"
            className="input_box"/>
            <input type='input'
            placeholder="password"
            className="input_box"/>
            <input type='input'
            placeholder="email"
            className="input_box"/>
            <button className="input_submit" type="submit" onClick={() => Print("username", "password", "email")}>submit</button>
        </form>
    </div>
  );
}

export default App;
