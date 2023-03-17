import React, { useState } from 'react';
import { getCookie, removeCookie, setCookie } from 'typescript-cookie';
import { newWindow } from '../../../App';
import UserProfilePage from '../../../UserProfile/UserProfile';
import HTTP from '../../../Utils/HTTP';
import '../App.css';
import NewAccount from './NewAccount';

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

async function setLogin(){
  try {
    const response = await fetch(`http://localhost:4242/auth/token/${window.location.href.split('code=')[1]}` , {
      headers: {
        Accept: 'application/json',
      },
    })
    if (!response.ok) {
      throw new Error(`Error! status: ${response.status}`);
    }
    var result = await response.json();
    var authToken:string = result["authToken"]
    var code:string = result["code"]
    if (authToken == undefined){
      newWindow(<LoginPage/>)
    }
    else if (authToken == ""){
      removeCookie('code');
      removeCookie('authToken');
      setCookie('code', code,{ expires: 1 });
      //set new name
      newWindow(<NewAccount/>)
    }
    else {
      //check if you're logged in
      removeCookie('accessToken');
      setCookie('accessToken', authToken,{ expires: 1 });
      newWindow(<UserProfilePage/>)
    }
  } catch (error) {
    console.log(`error ${error}`)
    removeCookie("authToken")
    newWindow(<LoginPage/>)
  }
}


const loginIntoOAuth = () => {
  console.log("i am here")
  window.location.replace('https://api.intra.42.fr/oauth/authorize?client_id=u-s4t2ud-c73b865f02b3cf14638e1a50c5caa720828d13082db6ab753bdb24ca476e1a4c&redirect_uri=http%3A%2F%2Flocalhost%3A4242%2F&response_type=code');
}

function LoginPage(){
  if (getCookie("authToken") != undefined){
    //when you can login because you have an authenToken Cookie
    checkAuthentication()
  }
  if (window.location.href.split('code=')[1] == undefined){
    loginIntoOAuth()
  }
  else if (window.location.href.split('code=')[1] != undefined){
    setLogin()
  }
  return (

    <div className="LoginpageV2">

    </div>
  );
}

export default LoginPage;
