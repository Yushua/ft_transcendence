import React, { useEffect } from 'react';
import { getCookie, removeCookie, setCookie } from 'typescript-cookie';
import { newWindow } from '../App';
import '../App.css';
import TWTCheckLoginPage from '../TwoFactorSystem/TWTCheckLoginPage';
import UserProfilePage from '../UserProfile/UserProfile';
import HTTP from '../Utils/HTTP';
import ErrorPage from './ErrorPage';

async function RefreshAuthentication():Promise<boolean>{
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
    return true
    //or whats stored in the position
  } catch (error) {
    alert(`authentication code invalid ${error}`)
    removeCookie("accessToken")
    newWindow(<LoginPage/>)
  }
  return false
}

/** */
async function setLogin():Promise<string>{
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
    var accessToken:string = await result["accessToken"]
    if (accessToken === undefined || accessToken === null){
      removeCookie('accessToken');
      newWindow(<ErrorPage/>)
    }
    else {
      return accessToken
    }
  } catch (error) {
    alert(`already logged in error ${error}`)
    newWindow(<ErrorPage/>)
  }
  newWindow(<ErrorPage/>)
  return ""
}

/**
 * returns TWT TOken
 * @returns 
 */
async function setLoginTWT():Promise<string>{
  try {
    const response = await fetch(HTTP.HostRedirect() + `auth/makeNewTWT` , {
      headers: {
        Accept: 'application/json',
        'Authorization': 'Bearer ' + getCookie("accessToken"),
      },
    })
    if (!response.ok) {
      throw new Error(`Error! status: ${response.status}`);
    }
    var result = await response.json();
    var TWToken:string = await result["TWToken"]
    if (TWToken === undefined || TWToken === null){
      removeCookie('TWToken');
      console.log("TWT is UNdefined in LOGINPAGE check")
      newWindow(<ErrorPage/>)
    }
    else {
      return TWToken
    }
  } catch (error) {
    console.log(`error ${error}`)
    removeCookie("accessToken")
    //logout of the system
    newWindow(<ErrorPage/>)
  }
  newWindow(<ErrorPage/>)
  return ""
}

/**
 * false means that it can continue, else, go to TWT AUTHENTICATION
 * @returns 
 */
export async function asyncGetUserStatus():Promise<boolean> {
  try {
    const response = HTTP.Get(`auth/checkUserTWTStatus`, null, {Accept: 'application/json'})
    var result = await JSON.parse(response)
    return await result["status"]
  } catch (error) {
    alert(`${error}, Token is out of date Loginpage`)
    removeCookie('TWToken');
    newWindow(<ErrorPage/>)
  }
  return false
}

const loginIntoOAuth = () => {
  window.location.replace('https://api.intra.42.fr/oauth/authorize?client_id=u-s4t2ud-c73b865f02b3cf14638e1a50c5caa720828d13082db6ab753bdb24ca476e1a4c&redirect_uri=http%3A%2F%2Flocalhost%3A4242%2F&response_type=code');
}

/**
 * setting up, if there is no token, make them
 * if there is a token, validate the token
 * if valid, validate TWT
 */
async function setupLoginPage(){
  if (getCookie("accessToken") !== undefined && getCookie("accessToken") !== null){
    //token is already made
    if ((await RefreshAuthentication()) === false){
      alert("unable to access backend")
      newWindow(<ErrorPage/>)
    }
    //token is validated
    setupLoginTWT()
  }
  else if (window.location.href.split('code=')[1] !== undefined){
    alert("making the account")
    removeCookie('accessToken');
    setCookie('accessToken', await setLogin(),{ expires: 10000 });
    newWindow(<LoginPage/>)
  }
  else {
    alert("loggin in")
    loginIntoOAuth()
  }
}

async function setupLoginTWT(){
  //if token is not ehre, make one
  if (getCookie('TWToken') === null || getCookie('TWToken') === undefined){
    alert("undefined TWT")
    removeCookie('TWToken');
    setCookie('TWToken', await setLoginTWT(),{ expires: 10000 });
  }
  var status:boolean = await asyncGetUserStatus()
  if (status === false){
    newWindow(<UserProfilePage/>)
  }
  else {
    newWindow(<TWTCheckLoginPage/>)
  }
}

function LoginPage(){
  useEffect(() => {
    setupLoginPage()
  }, []);
  return (
    <div className="Loginpage">
    </div>
  );
}

export default LoginPage;
