import React, { useState } from 'react';
import '../App.css';
import {  getCookie } from 'typescript-cookie'

import { newWindow } from '../App';
import HTTP from '../Utils/HTTP';
import UserProfilePage from '../componentsUserProfile/UserProfile';

interface FormElements extends HTMLFormControlsCollection {
  username: HTMLInputElement
  password: HTMLInputElement
}

interface YourFormElement extends HTMLFormElement {
 readonly elements: FormElements
}

const handleAccLogin = (e: React.FormEvent<YourFormElement>) => {
  e.preventDefault();
}

/**
 * if the authenticaiton fails
 * if the username doesn't exist
 * got to userProfile
 */
function checkLogin() {
  //check if the auth works, and if the username exist
  try {
    HTTP.Post(`login/test`, null, {Accept: 'application/json'})
    HTTP.Get(`login/testId/${getCookie('userID')}`, null, {Accept: 'application/json'})
    newWindow(<UserProfilePage/>);
  } catch (error) {
    console.log(error)
  }
  return
}

const LoginPage: React.FC = () => {
  const [cookiesCheck, setcookiesCheck] = useState<boolean>(false);
  // const [Storepicture, setStorePicture] = useState<string>("");
  if (cookiesCheck == false){
    checkLogin()
  }

  return (

    <div className="LoginPage">
        <span className="heading">
          Login
        </span>
          <form onSubmit={
            ( handleAccLogin )}>
          <div>
            <label htmlFor="username">Username:</label>
            <input id="username" type="text" />
            <label htmlFor="password">Password:</label>
            <input id="password" type="text" />
          </div>
            <button type="submit">Submit</button>
          </form>
    </div>
  );
}

export default LoginPage;
