import React, { useState } from 'react';
import { getCookie, removeCookie, setCookie } from 'typescript-cookie';
import { newWindow } from '../App';
import '../App.css';
import TWTCheckLoginPage from '../TwoFactorSystem/TWTCheckLoginPage';
import UserProfilePage from '../UserProfile/UserProfile';
import HTTP from '../Utils/HTTP';

async function RefreshAuthentication(){
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
    newWindow(<TWTCheckLoginPage/>)
    //or whats stored in the position
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
    var result = await response.json();
    var accessToken:string = result["accessToken"]
    if (accessToken == undefined || accessToken == null){
      removeCookie('accessToken');
      window.location.replace(HTTP.HostRedirect());
    }
    else {
      removeCookie('accessToken');
      setCookie('accessToken', accessToken,{ expires: 10000 });
      newWindow(<TWTCheckLoginPage/>)
    }
  } catch (error) {
    alert(`already logged in error ${error}`)
    //logout
    // removeCookie("accessToken")
    // window.location.replace(HTTP.HostRedirect());
  }
}

const loginIntoOAuth = () => {
  window.location.replace('https://api.intra.42.fr/oauth/authorize?client_id=u-s4t2ud-c73b865f02b3cf14638e1a50c5caa720828d13082db6ab753bdb24ca476e1a4c&redirect_uri=http%3A%2F%2Flocalhost%3A4242%2F&response_type=code');
}

async function setRefresh(){
  await RefreshAuthentication()
}

function LoginPage(){
  if (getCookie("accessToken") != undefined && getCookie("accessToken") != null){
    setRefresh()
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
