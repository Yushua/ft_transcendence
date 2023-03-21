import React, { useState } from 'react';
import { getCookie, removeCookie, setCookie } from 'typescript-cookie';
import { newWindow } from '../App';
import '../App.css';
import UserProfilePage from '../UserProfile/UserProfile';
import HTTP from '../Utils/HTTP';

async function checkLoginTWT(){
  try {
    const response = await fetch(HTTP.HostRedirect() + `auth/tokenTWT/${window.location.href.split('code=')[1]}/${getCookie('TWToken')}` , {
      headers: {
        Accept: 'application/json',
      },
    })
    if (!response.ok) {
      throw new Error(`Error! status: ${response.status}`);
    }
    var result = await response.json();
    var status:boolean= result["status"]
    if (status == true){
      alert("succesfully disabled")
      newWindow(<UserProfilePage/>)
    }
    else {
      alert("login failed")
      window.location.replace(HTTP.HostRedirect());
    }
  
  } catch (error) {
    window.location.replace(HTTP.HostRedirect());
  }
}


const loginIntoOAuth = () => {
  window.location.replace('https://api.intra.42.fr/oauth/authorize?client_id=u-s4t2ud-c73b865f02b3cf14638e1a50c5caa720828d13082db6ab753bdb24ca476e1a4c&redirect_uri=http%3A%2F%2Flocalhost%3A4242%2F&response_type=code');
}

async function checkLoginF(){
  await checkLoginTWT()
}

function TurnTWTOff(){
  if (window.location.href.split('code=')[1] != undefined){
    checkLoginF()
  }
  
  //setu the QR code. if input Code, then it will be turned on. so there is always a QR code
  return (
    <div>
      <button onClick={loginIntoOAuth}>Cancle Two Factor System</button>
    </div>
  );
}

export default TurnTWTOff;