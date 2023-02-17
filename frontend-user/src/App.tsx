import React from 'react';
import './App.css';
import fetch from 'node-fetch'

type User = {
  id: string;
  name: string;
  authenticationCode: string;
}

type GetUsersResponse = {
  data: User[];
}

async function logIn() {
  try {
    // 👇️ const response: Response
    const response = await fetch('http://localhost:4242/signup', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
      },
      Form-encoded: {

      }
    });

    if (!response.ok) {
      throw new Error(`Error! status: ${response.status}`);
    }

    // 👇️ const result: GetUsersResponse
    const result = (await response.json()) as GetUsersResponse;

    console.log('result is: ', JSON.stringify(result, null, 4));

    return result;
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

logIn();

function App() {
  return (
    <div className="App">
        hello World yusha
    </div>
  );
}

export default App;

