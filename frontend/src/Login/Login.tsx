import React, { } from 'react';
import '../App.css';
import { getCookies, removeCookie, setCookie } from 'typescript-cookie'

import { newWindow } from '../App';
import MainWindow from '../MainWindow/MainWindow';
import User from '../Utils/Cache/User';
import HTTP from '../Utils/HTTP';

async function AccCreate(username: string, password: string, email:string){
  try {
    const response = await fetch(HTTP.HostRedirect() + 'login/signup', {
      method: 'POST',
      body: `username=${username}&password=${password}&eMail=${email}`,
      headers: {
        Accept: 'application/json',
        'Content-Type': "application/x-www-form-urlencoded",
      },
    })
    
    if (!response.ok) {
      alert(`Error! status: ${(await response.json()).message}`)
      throw new Error(`Error! status: ${(await response.json()).message}`);
    }
    const result = (await response.json())
    
    console.log('result is: ', JSON.stringify(result, null, 4));
    return result;
  }
  catch (e: any) {
    alert(e)
    console.log(e)
  }
}

//when account created, returns the token that I need to use
async function Acclogin(username: string, password: string, email:string) {
  try {
    // 👇️ const response: Response
    const response = await fetch(HTTP.HostRedirect() + 'login/signin', {
      method: 'POST',
      body: `username=${username}&password=${password}&eMail=${email}`,
      headers: {
        Accept: 'application/json',
        'Content-Type': "application/x-www-form-urlencoded",
      },
    })
    if (!response.ok) {
      alert(`Error! status: ${(await response.json()).message}`)
    }
    
    const result = (await response.json())
    
    console.log('result is: ', JSON.stringify(result, null, 4));
    var accessToken: string = result["accessToken"];
    console.log('keycode: ', accessToken);
    removeCookie('accessToken');
    setCookie('accessToken', accessToken,{ expires: 1 });

    
    // Robin's changes
    await User.asyncUpdate(result["userID"])
    newWindow(<MainWindow/>)
    //
    
    return result;
  }
  catch (e: any) {
    alert(e)
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
  AccCreate(e.currentTarget.elements.username.value,
    e.currentTarget.elements.password.value,
    e.currentTarget.elements.eMail.value);
  const errorThingy = document.getElementById("errorCode")
}

const handleAccLogin = (e: React.FormEvent<YourFormElement>) => {
  e.preventDefault();
  Acclogin(e.currentTarget.elements.username.value,
    e.currentTarget.elements.password.value,
    e.currentTarget.elements.eMail.value);
  const errorThingy = document.getElementById("errorCode")
}

const LoginPage: React.FC = () => {
  return (

    <div className="LoginPage">
        <span className="heading">
          Create Account
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
          <span className="heading">
            Login
          </span>
          <form onSubmit={
            ( handleAccLogin)}>
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

export default LoginPage;
