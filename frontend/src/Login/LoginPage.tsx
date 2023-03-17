import React, { useState } from 'react';
import '../App.css';

import { newWindow } from '../App';
import { getCookie, removeCookie } from 'typescript-cookie';
import LoginHandlerOAuth from './LoginHandlerOAuth';
import HTTP from '../Utils/HTTP';
import NewAccount from './NewAccount';
import UserProfilePage from '../UserProfile/UserProfile';

async function checkAuthentication(){
  console.log(`auth token is in ${getCookie("authToken")}`)
  try {
    const response = await fetch(HTTP.HostRedirect() + `auth/check` , {
      headers: {
        Accept: 'application/json',
        'Authorization': 'Bearer ' + getCookie("authToken"),
        'Content-Type': 'application/json',
      },
      method: 'GET'
    })
    if (!response.ok) {
      throw new Error(`Error! status: ${response.status}`);
    }
    console.log("i am out")
    var result = await response.json();
    if (result["result"] == true){
      newWindow(<UserProfilePage/>)
      //or whats stored in the position
    }
    else {
      removeCookie("authToken")
      newWindow(<LoginPage/>)
    }
  } catch (error) {
    alert(`authentication code invalid ${error}`)
    removeCookie("authToken")
    newWindow(<LoginPage/>)
  }
}

const submitNewAccount = () => {
  //when you want to make a new account
  newWindow(<NewAccount/>)
}

const loginNormal = () => {
  //when you want to login when you haven't
  newWindow(<LoginHandlerOAuth/>)
}

const loginIntoOAuth = () => {
  window.location.replace('https://api.intra.42.fr/oauth/authorize?client_id=u-s4t2ud-c73b865f02b3cf14638e1a50c5caa720828d13082db6ab753bdb24ca476e1a4c&redirect_uri=http%3A%2F%2Flocalhost%3A4242%2F&response_type=code');
}

function LoginPage() : any{

  if (getCookie("authToken") != undefined){
    //when you can login because you have an authenToken Cookie
    checkAuthentication()
  }
  if (window.location.href.split('code=')[1] == undefined){
    loginIntoOAuth()
  }
  return (
    <div className="LoginpageV2">
       <button onClick={() => {submitNewAccount()}}>new account</button>
       <button onClick={() => {loginNormal()}}> Login</button>
    </div>
  );
}

export default LoginPage;
