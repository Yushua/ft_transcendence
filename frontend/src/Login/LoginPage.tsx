import React, { useState } from 'react';
import { getCookie, removeCookie, setCookie } from 'typescript-cookie';
import { newWindow } from '../App';
import '../App.css';
import TWTCheckLoginPage from '../TwoFactorSystem/TWTCheckLoginPage';
import UserProfilePage from '../UserProfile/UserProfile';
import HTTP from '../Utils/HTTP';

async function checkAuthentication(){
  console.log(`auth token is in ${getCookie("accessToken")}`)
  try {
    const response = await fetch(HTTP.HostRedirect() + `auth/check` , {
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
    console.log("i am out")
    var result = await response.json();
    if (result["result"] == true){
      console.log("checking TWT token")
      newWindow(<TWTCheckLoginPage/>)
      //or whats stored in the position
    }
    else {
      removeCookie("accessToken")
      newWindow(<LoginPage/>)
    }
  } catch (error) {
    alert(`authentication code invalid ${error}`)
    removeCookie("accessToken")
    newWindow(<LoginPage/>)
  }
}

/**
 * set login makes two tokens. one for the JWT token and one TWT token
 * To is set wihth a secret code, false and the user ID to get information
 */
async function setLogin(){
  try {
    const response = await fetch(HTTP.HostRedirect() + `auth/loginUser/${window.location.href.split('code=')[1]}` , {
      headers: {
        Accept: 'application/json',
        'Authorization': 'Bearer ' + getCookie("accessToken"),
      },
    })
    if (!response.ok) {
      throw new Error(`Error! status: ${response.status}`);
    }
    console.log("succesfull")
    var result = await response.json();
    var accessToken:string = result["accessToken"]
    if (accessToken == undefined){
      removeCookie('accessToken');
    }
    if (accessToken == undefined){
      window.location.replace(HTTP.HostRedirect());
    }
    else {
      removeCookie('accessToken');
      setCookie('accessToken', accessToken,{ expires: 10000 });
      newWindow(<TWTCheckLoginPage/>)
    }
  } catch (error) {
    console.log(`error ${error}`)
    removeCookie("accessToken")
    window.location.replace(HTTP.HostRedirect());
    HTTP.HostRedirect()
  }
}

const loginIntoOAuth = () => {
  window.location.replace('https://api.intra.42.fr/oauth/authorize?client_id=u-s4t2ud-c73b865f02b3cf14638e1a50c5caa720828d13082db6ab753bdb24ca476e1a4c&redirect_uri=http%3A%2F%2Flocalhost%3A4242%2F&response_type=code');
}

async function checkRefresh(){
  await checkAuthentication()
}

function LoginPage(){
  if (getCookie("accessToken") != undefined &&  getCookie("accessToken") != null){
    //when you can login because you have an authenToken Cookie
    console.log("i am refreshing")
    checkRefresh()
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
