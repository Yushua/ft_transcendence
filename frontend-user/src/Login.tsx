import React from 'react';
import './App.css';
import fetch from 'node-fetch'

async function logIn(username: string, password: string) {
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


var username: string = "";
var password: string = "";

logIn(username, password);

const App: React.FC = () => {
  return (
    <div className="App">
        <span className="heading">
          Login
        </span>
    </div>
  );
}

export default App;
