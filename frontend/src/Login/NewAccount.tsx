import React, { } from 'react';
import '../App.css';

import { newWindow } from '../App';
import MainWindow from '../MainWindow/MainWindow';
import User from '../Utils/Cache/User';
import HTTP from '../Utils/HTTP';
import LoginHandlerOAuth from './LoginHandlerOAuth';
import UserProfilePage from '../UserProfile/UserProfile';
import { getCookie } from 'typescript-cookie';

async function getAuthToken(username:string){
  try {
    const response = await fetch(`http://localhost:4242/auth/loginNew/${getCookie("code")}/${getCookie("authToken")}/`  , {
      headers: {
        Accept: 'application/json',
      },
    })
    if (!response.ok) {
      throw new Error(`Error! status: ${response.status}`);
    }
    var result = await response.json();
    var authToken:string = result["authToken"]
    if (authToken == undefined || authToken == ""){
      alert("access to changing the eMail errored. check back at OAuth")
      //if failed, delete account
      newWindow(<LoginHandlerOAuth/>)
    }
    else{
      newWindow(<UserProfilePage/>)
    }
  } catch (error) {
    console.log(`error ${error}`)
    alert(error)
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
  //username
  //check email
}

function NewAccount(){

  return (
    <div className="setting up new account for Team Zero">
        <form onSubmit={(handleUsername)}>
          <div>
            <label htmlFor="username">Username:</label>
            <input id="username" type="text" />
            <label htmlFor="eMail">eMail:</label>
            <input id="eMail" type="text" />
          </div>
        </form>
    </div>
  );
}

export default NewAccount;
