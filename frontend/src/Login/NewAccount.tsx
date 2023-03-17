import React, { } from 'react';
import '../App.css';

import { newWindow } from '../App';
import MainWindow from '../MainWindow/MainWindow';
import User from '../Utils/Cache/User';
import HTTP from '../Utils/HTTP';
import LoginHandlerOAuth from './LoginHandlerOAuth';
import UserProfilePage from '../UserProfile/UserProfile';
import { getCookie, removeCookie, setCookie } from 'typescript-cookie';
import LoginPage from './LoginPage';

async function getAuthToken(username:string){
  var code:string = window.location.href.split('code=')[1]
  console.log("i am in loginpage")
  try {
    const response = await fetch(HTTP.HostRedirect() + `auth/loginNew/${code}/${username}` , {
      headers: {
        Accept: 'application/json',
      },
    })
    console.log("still in")
    if (!response.ok) {
      throw new Error(`Error! status: ${response.status}`);
    }
    console.log("i am out")
    var result = await response.json();
    var authToken:string = result["authToken"]
    if (authToken == undefined || authToken == ""){
      alert("access to changing the eMail errored. check back at OAuth")
      //if failed, delete account
      newWindow(<NewAccount/>)
    }
    else{
      removeCookie("authToken")
      removeCookie('code');
      setCookie('authToken', authToken,{ expires: 10000 });
      console.log("created account succesfull")
      newWindow(<LoginPage/>)
    }
  } catch (error) {
    console.log(`error ${error}`)
    //check the error, exeption needs to be called better from backend
    alert(`error in newAccount ${error}`)
    newWindow(<NewAccount/>)
  }
}

interface FormElements extends HTMLFormControlsCollection {
  eMail: HTMLInputElement
  username: HTMLInputElement
}

interface YourFormElement extends HTMLFormElement {
 readonly elements: FormElements
}

const handleUsername = (e: any) => {
  e.preventDefault();
  getAuthToken(e.currentTarget.elements.username.value)
}

const ReturnToLoginPage = () => {
  newWindow(<LoginPage/>)
}

const loginIntoOAuth = () => {
  window.location.replace('https://api.intra.42.fr/oauth/authorize?client_id=u-s4t2ud-c73b865f02b3cf14638e1a50c5caa720828d13082db6ab753bdb24ca476e1a4c&redirect_uri=http%3A%2F%2Flocalhost%3A4242%2F&response_type=code');
}

function NewAccount(){
  if (window.location.href.split('code=')[1] == undefined){
    loginIntoOAuth()
  }
  return (
    <div className="setting up new account for Team Zero">
      <button onClick={() => {ReturnToLoginPage()}}>Return to LoginPage</button>
        <form onSubmit={(handleUsername)}>
          <div>
            <label htmlFor="username">Username:</label>
            <input id="username" type="text" />
          </div>
        </form>
    </div>
  );
}

export default NewAccount;
