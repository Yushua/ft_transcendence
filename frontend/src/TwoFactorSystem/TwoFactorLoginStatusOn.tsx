import React, { useState } from 'react';
import '../App.css';
import QRCode from 'qrcode.react';
import HTTP from '../Utils/HTTP';
import { getCookie, removeCookie } from 'typescript-cookie';
import { newWindow } from '../App';
import LoginPage from '../Login/LoginPage';

async function getStatusTwoFactor():Promise<boolean> {try {
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
  //so if it is not true, means display is correct
  if (await getStatusTwoFactor() != _Display){
    _setDisplayTwo(false)
  }
  else {
    //if it is correct, the don't have to update anymore
    _setDisplay(false)
  }
}

var _setDisplayTwo:React.Dispatch<React.SetStateAction<boolean>>
var _setDisplay:React.Dispatch<React.SetStateAction<boolean>>

var _Display:boolean
function TwoFactorLoginStatusOn(){
  //i first time to check if TwoFactor is on is on
  const [DisplayTwo, setDisplayTwo] = useState<boolean>(true);
  const [Display, setDisplay] = useState<boolean>(true);
  _setDisplayTwo = setDisplayTwo
  _setDisplay = setDisplay
  _Display = Display

  if (Display == true){
    checkDisplay()
  }
  return (
    <div className="TwoFactorLoginStatusOn">
      <div>
      </div>
    </div>
  );
}

export default TwoFactorLoginStatusOn;
