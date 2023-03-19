import React, { useState } from 'react';
import '../App.css';
import QRCode from 'qrcode.react';
import HTTP from '../Utils/HTTP';
import { getCookie, removeCookie } from 'typescript-cookie';
import { newWindow } from '../App';
import LoginPage from '../Login/LoginPage';
import TwoFactorLoginStatusOn from './TwoFactorLoginStatusOn';
import TwoFactorLoginStatusOff from './TwoFactorLoginStatusOff';

export async function getStatusTwoFactor():Promise<boolean> {
  try {
  const response = HTTP.Get(`auth/checkTwoStatus/${getCookie("TwoFactorToken")}`, null, {Accept: 'application/json'})
  var result = await JSON.parse(response)
  console.log(`status ${await result["status"]}`)
  return await result["status"]
  } catch (error) {
    alert("attmepted breach with fake token")
    removeCookie("TwoFactorToken")
    removeCookie("accessToken")
    newWindow(<LoginPage/>)
  }
  //need to return or else
  return false
}

async function checkDisplay(){
  if (await getStatusTwoFactor() == false){
    _setDisplay(false)
  }
}

var _setDisplay:React.Dispatch<React.SetStateAction<Boolean>>

function TwoFactorLoginCheckProfile(){
  const [Display, setDisplay] = useState<Boolean>(true);
  _setDisplay = setDisplay
  if (Display == true){
    checkDisplay()
    newWindow(<TwoFactorLoginStatusOn/>)
  }
  else {
    newWindow(<TwoFactorLoginStatusOff/>)
  }
  return (
    <div className="TwoFactorLoginCheckProfile">
      <div>
      </div>
    </div>
  );
}

export default TwoFactorLoginCheckProfile;
