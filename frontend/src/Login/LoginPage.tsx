import React, { useEffect, useState } from 'react';
import { Cookies, getCookie, removeCookie, setCookie } from 'typescript-cookie';
import { newWindow } from '../App';
import '../App.css';
import MainWindow from '../MainWindow/MainWindow';
import TurnTWTOnLoginPage from '../TwoFactorSystem/TurnTWTOnLoginPage';
import TWTCheckLoginPage from '../TwoFactorSystem/TWTCheckLoginPage';
import HTTP from '../Utils/HTTP';
import ErrorPage from './ErrorPage';

async function asyncGetintraName():Promise<string> {
  try {
    const response = HTTP.Get(`user-profile/user`, null, {Accept: 'application/json'})
    var result = await JSON.parse(response)
    return await result["intraname"];
  }
  catch {
    removeCookie("accessToken")
    newWindow(<ErrorPage message={"System fault, unable to connect to our website"}/>)
  }
}

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
    _intraName = await result["intraname"]
    setCookie(`oAth${_intraName}`, await result["OAuthToken"],{ expires: 1000000 });
    if (accessToken === undefined || accessToken === null){
      removeCookie('accessToken');
      newWindow(<ErrorPage message={"Accesstoken was undefined, please refresh the page"}/>)
    }
    else {
      return accessToken
    }
  } catch (error) {
    newWindow(<ErrorPage message={"you are already logged in"}/>)
  }
  newWindow(<ErrorPage message={"you are already logged in"}/>)
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
      newWindow(<ErrorPage message={"Please refresh"}/>)
    }
    else {
      return TWToken
    }
  } catch (error) {
    removeCookie("accessToken")
    newWindow(<ErrorPage message={` please refresh ${error}`}/>)
  }
  newWindow(<ErrorPage message={"Please refresh"}/>)
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
    removeCookie(`TWToken${_intraName}`);
    newWindow(<LoginPage/>)
  }
  return false
}

/**
 * check the TWT token status. if coming in ehre, first check if the User has TWT on
 * @returns 
 */
export async function asyncGetTWTStatus(TWT: string):Promise<boolean> {
  try {
    const response = HTTP.Get(`auth/checkStatusTWT/${getCookie(`TWToken${_intraName}`)}`, null, {Accept: 'application/json'})
    var result = await JSON.parse(response)
    return await result["status"]
  } catch (error) {
    alert(`${error}, Token is out of date Loginpage`)
    removeCookie(`TWToken${_intraName}`);
    setCookie(`TWToken${_intraName}`, await setLoginTWT(),{ expires: 100000 });
    newWindow(<TWTCheckLoginPage />)
  }
  return false
}

//when login in for the first time, this is the first function set. logs into intra and redirects back
async function loginIntoOAuth(){
  try {
    const response = HTTP.Get(`auth/authGetLink`, null, {Accept: 'application/json'})
    var result = await JSON.parse(response)
    if (result["status"] === true){
      window.location.replace(result["link"]);
    }
    else {
      alert(".env file in backend is wrong")
      newWindow(<ErrorPage message={"our .env file in backend is wrong, unable to enter our webpage"}/>)
    }
  } catch (error) {
    newWindow(<ErrorPage message={`error in get message ${error}`}/>)
  }
}

/**
 * setting up, if there is no token, make them
 * if there is a token, validate the token
 * if valid, validate TWT
 */
async function setupLoginPage(){
  if (getCookie("accessToken") !== undefined && getCookie("accessToken") !== null){
    //token is already made
    _setintraName(await asyncGetintraName())
    if ((await RefreshAuthentication()) === false){
      newWindow(<ErrorPage message={"our .env file in backend is wrong, unable to enter our webpage"}/>)
    }
    //if there already is one, set intraname
    setupLoginTWT()
  }
  else if (window.location.href.split('code=')[1] !== undefined){
    removeCookie('accessToken');
    setCookie('accessToken', await setLogin(),{ expires: 100000 });
    setupLoginPage()
  }
  else {
    //no token
    loginIntoOAuth()
  }
}

async function setupLoginTWT(){
  //if token is not ehre, make one

  if (getCookie(`TWToken${_intraName}`) === null || getCookie(`TWToken${_intraName}`) === undefined){
    removeCookie(`TWToken${_intraName}`);
    setCookie(`TWToken${_intraName}`, await setLoginTWT(),{ expires: 100000 });
  }
  var status:boolean = await asyncGetUserStatus()
  if (status === false){
    newWindow(<MainWindow/>)
  }
  else {
    //check here sees false in the cookie. it seems something is set wrong here
    const statusTWT:boolean = await asyncGetTWTStatus(getCookie(`TWToken${_intraName}`))
    if (statusTWT === true){
      newWindow(<MainWindow/>)
    }
    else {
      newWindow(<TurnTWTOnLoginPage/>)
    }
  }
}

var _setintraName: React.Dispatch<React.SetStateAction<string>>
var _intraName: string

function LoginPage(){
  const [intraName, setintraName] = useState<string>('');
  _intraName = intraName
  _setintraName = setintraName
  useEffect(() => {
    setupLoginPage()
  }, []);
  return (
    <div className="Loginpage">
    </div>
  );
}

export default LoginPage;
