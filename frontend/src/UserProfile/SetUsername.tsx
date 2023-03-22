import React, { useState } from 'react';
import '../App.css';

import { getCookie, removeCookie, setCookie } from 'typescript-cookie';
import HTTP from '../Utils/HTTP';
import LogoutButtonComponent from './ButtonComponents/LogoutButton';
import UserProfilePage from './UserProfile';
import { newWindow } from '../App';

async function getAccessToken(username:string){
  var code:string | undefined = getCookie('code');
  removeCookie('code');
  try {
    const response = await fetch(HTTP.HostRedirect() + `auth/ChangeUsername/${username}` , {
      headers: {
        Accept: 'application/json',
        'Authorization': 'Bearer ' + getCookie("accessToken"),
        'Content-Type': 'application/json',
      },
      method: 'GET'
    })
    if (!response.ok) {
      throw new Error(`Error! status: ${response.status}`);
    }
    var result = await response.json();
    var status:boolean = result["status"]
    console.log(`status == ${status}`)
    if (status == undefined){
      alert("JWT authorization failed, returned nothing")
      window.location.replace('http://localhost:4242/');
    }
    if (status == false){
      alert(`error in SetUsername already in use ${username}`)
    }
    else if (status == true){
      newWindow(<UserProfilePage/>)
    }
  } catch (error) {
    console.log(`error ${error}`)
    alert(`error in SetUsername already in use${error} username ${username}`)
    window.location.replace('http://localhost:4242/');
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
  getAccessToken(e.currentTarget.elements.username.value)
}

function SetUsername(){

  return (
    <div className="setting up new account for Team Zero">
      <LogoutButtonComponent/>
        <form onSubmit={(handleUsername)}>
          <div>
            <label htmlFor="username">Set you Username</label>
            <input id="username" type="text" />
          </div>
        </form>
    </div>
  );
}

export default SetUsername;
