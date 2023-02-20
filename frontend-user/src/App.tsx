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

interface FormElements extends HTMLFormControlsCollection {
  username: HTMLInputElement
  password: HTMLInputElement
  eMail: HTMLInputElement
}

interface YourFormElement extends HTMLFormElement {
 readonly elements: FormElements
}

const handleFormSubmit = (e: React.FormEvent<YourFormElement>) => {
  e.preventDefault();
  console.log(e.currentTarget.elements.username.value)
  console.log(e.currentTarget.elements.password.value)
  console.log(e.currentTarget.elements.eMail.value)
  logIn(e.currentTarget.elements.username.value,
    e.currentTarget.elements.password.value,
    e.currentTarget.elements.eMail.value);
}

const App: React.FC = () => {

  return (

    <div className="App">
        <span className="heading">
          Login
        </span>
        <form onSubmit={handleFormSubmit}>
        <div>
          <label htmlFor="username">Username:</label>
          <input id="username" type="text" />
          <label htmlFor="password">UserPassword:</label>
          <input id="password" type="text" />
          <label htmlFor="eMail">UserEmail:</label>
          <input id="eMail" type="text" />
        </div>
        <button type="submit">Submit</button>
      </form>
    </div>
  );
}

export default App;
