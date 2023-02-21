import React, { } from 'react';
import './App.css';

var error1: string = "";
var error2: string = "";

async function AccCreate(username: string, password: string, email:string){
  try {
    // 👇️ const response: Response
    const response = await fetch('http://localhost:4242/login/signup', {
      method: 'POST',
      body: `username=${username}&password=${password}&eMail=${email}`,
      headers: {
        Accept: 'application/json',
        'Content-Type': "application/x-www-form-urlencoded",
      },
    })
    
    if (!response.ok) {
      error1 = `Error! status: ${(await response.json()).message}`;
      throw new Error(`Error! status: ${(await response.json()).message}`);
    }
    
    const result = (await response.json())
    
    console.log('result is: ', JSON.stringify(result, null, 4));
    error1 = "succesfull";
    return result;
  }
  catch (e: any) {
    console.log(e)
    // error1 = "account name/email was done"
    // if (error instanceof Error) {
    //   error1 = 'error message: ' + error
    //   console.log('error message: ', error.message);
    //   return error.message;
    // } else {
    //   error1 = 'error message: ' + error
    //   console.log('unexpected error: ', error);
    //   return 'An unexpected error occurred';
    // }
  }
}

//when account created, returns the token that I need to use
async function Acclogin(username: string, password: string, email:string) {
  try {
    // 👇️ const response: Response
    const response = await fetch('http://localhost:4242/login/signin', {
      method: 'POST',
      body: `username=${username}&password=${password}&eMail=${email}`,
      headers: {
        Accept: 'application/json',
        'Content-Type': "application/x-www-form-urlencoded",
      },
    })
    
    if (!response.ok) {
      error2 = `Error! status: ${(await response.json()).message}`;
      throw new Error(`Error! status: ${(await response.json()).message}`);
    }
    
    const result = (await response.json())
    
    console.log('result is: ', JSON.stringify(result, null, 4));
    error2 = "succesfull";
    return result;
  }
  catch (e: any) {
    console.log(e)
    // error1 = "account name/email was done"
    // if (error instanceof Error) {
    //   error1 = 'error message: ' + error
    //   console.log('error message: ', error.message);
    //   return error.message;
    // } else {
    //   error1 = 'error message: ' + error
    //   console.log('unexpected error: ', error);
    //   return 'An unexpected error occurred';
    // }
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

const handleAccCreate = (e: React.FormEvent<YourFormElement>) => {
  e.preventDefault();
  console.log(e.currentTarget.elements.username.value)
  console.log(e.currentTarget.elements.password.value)
  console.log(e.currentTarget.elements.eMail.value)
  AccCreate(e.currentTarget.elements.username.value,
    e.currentTarget.elements.password.value,
    e.currentTarget.elements.eMail.value);
  const errorThingy = document.getElementById("errorCode")
  if (!!errorThingy)
   errorThingy.innerHTML = error1
}

const handleAccLogin = (e: React.FormEvent<YourFormElement>) => {
  e.preventDefault();
  console.log(e.currentTarget.elements.username.value)
  console.log(e.currentTarget.elements.password.value)
  console.log(e.currentTarget.elements.eMail.value)
  Acclogin(e.currentTarget.elements.username.value,
    e.currentTarget.elements.password.value,
    e.currentTarget.elements.eMail.value);
  const errorThingy = document.getElementById("errorCode")
  if (!!errorThingy)
    errorThingy.innerHTML = error2
}

// function GetUsername(): string { return "AAAAAA" }
// function GetPassword(): string { return "aaAA!!11" }
// function GetEmail(): string { return "AAA@AAA.AAA" }

// function SendingStuff() {
//   var req = new XMLHttpRequest()
//   req.open("POST", 'http://localhost:4242/login/signup')
//   req.setRequestHeader("Content-Type", "application/x-www-form-urlencoded")
//   req.send(`username=${GetUsername()}&password=${GetPassword()}&eMail=${GetEmail()}`)
// }

// document.cookie = "userId=oeschger; SameSite=None; Secure";
// document.cookie = "authenticationCode=oeschger; SameSite=None; Secure";

/* <button onClick={_ => { func(123) }}> </button> */
const App: React.FC = () => {

  return (

    <div className="App">
        <span className="heading">
          Login
        </span>
        <form onSubmit={handleAccCreate}>
        <div>
          <label htmlFor="username">Username:</label>
          <input id="username" type="text" />
          <label htmlFor="password">Password:</label>
          <input id="password" type="text" />
          <label htmlFor="eMail">Email:</label>
          <input id="eMail" type="text" />
        </div>
        <div><label id="errorCode1" htmlFor="error1"></label></div>
        <button type="submit">Submit</button>
      </form>

        <form onSubmit={handleAccLogin}>
        <div>
          <label htmlFor="username">Username:</label>
          <input id="username" type="text" />
          <label htmlFor="password">Password:</label>
          <input id="password" type="text" />
          <label htmlFor="eMail">Email:</label>
          <input id="eMail" type="text" />
        </div>
        <div><label id="errorCode2" htmlFor="error2"></label></div>
        <button type="submit">Submit</button>
      </form>
    </div>
  );
}

export default App;
