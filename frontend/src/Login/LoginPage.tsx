import React, { useState } from 'react';
import { getCookie, removeCookie, setCookie } from 'typescript-cookie';
import { newWindow } from '../App';
import '../App.css';
import UserProfilePage from '../UserProfile/UserProfile';
import HTTP from '../Utils/HTTP';

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
    const response = await fetch(HTTP.HostRedirect() + `auth/token/${window.location.href.split('code=')[1]}` , {
      headers: {
        Accept: 'application/json',
      },
    })
    if (!response.ok) {
      throw new Error(`Error! status: ${response.status}`);
    }
    var result = await response.json();
    var authToken:string = result["authToken"]
    if (authToken == undefined){
      window.location.replace(HTTP.HostRedirect());
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
    HTTP.HostRedirect()
  }
}

const loginIntoOAuth = () => {
  window.location.replace('https://api.intra.42.fr/oauth/authorize?client_id=u-s4t2ud-c73b865f02b3cf14638e1a50c5caa720828d13082db6ab753bdb24ca476e1a4c&redirect_uri=http%3A%2F%2Flocalhost%3A4242%2F&response_type=code');
}

function LoginPage(){
  //to check if your AuthToken is already valid
  if (getCookie("authToken") != undefined){
    //when you can login because you have an authenToken Cookie
    checkAuthentication()
  }
  //to check to see if the login works
  if (window.location.href.split('code=')[1] != undefined){
    setLogin()
  }
  //log into Oauth
  else {
    loginIntoOAuth()
  }
  return (
    <div className="Loginpage">
    </div>
  );
}

export default LoginPage;
