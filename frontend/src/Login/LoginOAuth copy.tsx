import React, { } from 'react';
import '../App.css';
import { getCookies, removeCookie, setCookie } from 'typescript-cookie'

import { newWindow } from '../App';
import MainWindow from '../MainWindow/MainWindow';
import User from '../Utils/Cache/User';
import HTTP from '../Utils/HTTP';

async function Qauthentication(){
  //body: `client_ide=${client_id}&redirect_uri=${redirect_uri}&scope=${scope}&state=${state}&response_type=${response_type}`,
  try {
    console.log(HTTP.HostRedirect() + 'auth/login')
    const response = await fetch(HTTP.HostRedirect() + 'auth/login', {
      method: 'GET',
      headers: {
        Accept: 'application/json', 
        'Content-Type': "application/x-www-form-urlencoded",
      },
      // credentials: "include",
      // mode: "no-cors"
    })
    
    if (!response.ok) {
      alert(`Error! status: ${(await response.json()).message}`)
      throw new Error(`Error! status: ${(await response.json()).message}`);
    }
    const result = (await response.json())
    console.log(`Get Token Result == ${result}`);
    console.log('result is: ', JSON.stringify(result, null, 4));
    return result;
  }
  catch (e: any) {
    alert(e)
    console.log(e)
  }
}

async function GetToken(token: string){
  try {
    const response = await fetch('https://api.intra.42.fr/oauth/' + token,{
      method: 'POST',
      body: ``,
      headers: {
        Accept: 'application/json',
        'Content-Type': "application/x-www-form-urlencoded",
      },
    })
    
    if (!response.ok) {
      alert(`Error! status: ${(await response.json()).message}`)
      throw new Error(`Error! status: ${(await response.json()).message}`);
    }
    const result = (await response.json())
    console.log(`Token Result == ${result}`);
    console.log('result is: ', JSON.stringify(result, null, 4));
    return result;
  }
  catch (e: any) {
    alert(e)
    console.log(e)
  }
}

async function AccCreate(intraname: string, password: string){
  try {
    const response = await fetch(HTTP.HostRedirect() + 'login/signup', {
      method: 'POST',
      body: `intraname=${intraname}&password=${password}`,
      headers: {
        Accept: 'application/json',
        'Content-Type': "application/x-www-form-urlencoded",
      },
    })
    
    if (!response.ok) {
      alert(`Error! status: ${(await response.json()).message}`)
      throw new Error(`Error! status: ${(await response.json()).message}`);
    }
    const result = (await response.json())
    
    console.log('result is: ', JSON.stringify(result, null, 4));
    return result;
  }
  catch (e: any) {
    alert(e)
    console.log(e)
  }
}

//when account created, returns the token that I need to use
async function Acclogin(intraname: string, password: string) {
  try {
    // 👇️ const response: Response
    const response = await fetch(HTTP.HostRedirect() + 'login/signin', {
      method: 'POST',
      body: `intraname=${intraname}&password=${password}`,
      headers: {
        Accept: 'application/json',
        'Content-Type': "application/x-www-form-urlencoded",
      },
    })
    if (!response.ok) {
      alert(`Error! status: ${(await response.json()).message}`)
    }
    
    const result = (await response.json())
    
    console.log('result is: ', JSON.stringify(result, null, 4));
    var accessToken: string = result["accessToken"];
    console.log('keycode: ', accessToken);
    removeCookie('accessToken');
    setCookie('accessToken', accessToken,{ expires: 1 });

    
    // Robin's changes
    await User.asyncUpdate(result["userID"])
    newWindow(<MainWindow/>)
    //
    
    return result;
  }
  catch (e: any) {
    alert(e)
  }
}

interface FormElements extends HTMLFormControlsCollection {
  intraname: HTMLInputElement
  password: HTMLInputElement
}

interface YourFormElement extends HTMLFormElement {
 readonly elements: FormElements
}

const handleAccLogin = (e: any) => {
  e.preventDefault();
  console.log("hello")
  Qauthentication()
  /*
    check if the person is already logged in
    send to userProfile
  */
 
 /*
    check the qauth
    if account is not created
       if the user DOES NOT HAVE AN EMAIL.. or the AUTHENTICATION CODE IS OUT OF DATE
      AccCreate(e.currentTarget.elements.intraname.value,
      e.currentTarget.elements.password.value);
      let him habve the login function
      //problem... what if two acounts are created at the same time?
    login
      Acclogin(e.currentTarget.elements.intraname.value,
        e.currentTarget.elements.password.value);
 */
}

function OAuthLoginpageV2(){
  return (

    <div className="LoginpageV2">
       <span className="heading">
          </span>
          <form onSubmit={( handleAccLogin)}>
          <button type="submit">Login</button>
          </form>
    </div>
  );
}

export default OAuthLoginpageV2;
