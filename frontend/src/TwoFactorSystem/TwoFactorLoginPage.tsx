import React, { useState } from 'react';
import { getCookie, removeCookie, setCookie } from 'typescript-cookie';
import { newWindow } from '../App';
import '../App.css';
import LoginPage from '../Login/LoginPage';
import UserProfilePage from '../UserProfile/UserProfile';
import HTTP from '../Utils/HTTP';

async function asyncGetTWTStatus():Promise<boolean> {
  try {
    const response = HTTP.Get(`auth/checkStatusTWT/${getCookie('TWToken')}`, null, {Accept: 'application/json'})
    var result = await JSON.parse(response)
    return await result["username"];
  } catch (error) {
    alert(`${error}, Token is out of date`)
    removeCookie('TWToken');
    newWindow(<UserProfilePage/>)
  }
  return false
}

async function tmp(){
  if (await asyncGetTWTStatus()== true){
    console.log("status is true")
    _setDisplay(true)
  }
  else {
    console.log("status is false")
    newWindow(<LoginPage/>)
  }
}

var _setDisplay: React.Dispatch<React.SetStateAction<boolean>>

function TwoFactorLoginPage(){
  //to check if your accessToken is already valid
  const [Display, setDisplay] = useState<boolean>(false);
  _setDisplay = setDisplay
  if (Display == false){ tmp() }
  //if turned tue, then you need to get the input ready
  if (Display == true){
    alert("insert code now")
    newWindow(<LoginPage/>)
  }
  return (
    <div className="TwoFactorLoginPage">
    </div>
  );
}

export default TwoFactorLoginPage;
