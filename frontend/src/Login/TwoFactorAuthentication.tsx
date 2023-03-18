import React, { useState } from 'react';
import '../App.css';
import QRCode from 'qrcode.react';
import HTTP from '../Utils/HTTP';
import { display } from '@mui/system';
import { removeCookie, setCookie } from 'typescript-cookie';

async function getStatusTwoFactor():Promise<boolean> {
  const response = HTTP.Get(`user-profile/getStatus`, null, {Accept: 'application/json'})
  var result = await JSON.parse(response)
  var status:boolean = await result["status"]
  console.log(`status ${status}`)
  return status
}

async function changeStatusTwoFactor(status: boolean){
  const response = HTTP.Get(`auth/changeStatusAuth/` + status , null, {Accept: 'application/json'})
  var result = await JSON.parse(response)
  removeCookie('accessToken');
  setCookie('accessToken', await result["accessToken"] ,{ expires: 10000 });
}

async function startTwoFactorSystem():Promise<string> {
  //setupQR
  console.log("setting up QR")
  return "";
}

//turn it on
async function enableTwoFactorAuthentication() {
  if (await getStatusTwoFactor() == true){
    qrText = await startTwoFactorSystem()
    //status, so enabled
    await changeStatusTwoFactor(true)
    _setDisplayTwo(false)
  }
  else{
    alert("two factor is already enabled")
    _setDisplayTwo(false)
  }
}

//to disable it
async function disableTwoFactorAuthentication() {
  //turn the status to false. and make a new JWT authentication with the twoFactor turned to false
  await changeStatusTwoFactor(false)
  _setDisplayTwo(true)
}

interface FormElements extends HTMLFormControlsCollection {
  qrText: HTMLInputElement
}
interface YourFormElement extends HTMLFormElement {
  readonly elements: FormElements
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

var qrText:string
var _setDisplayTwo:React.Dispatch<React.SetStateAction<boolean>>
var _setDisplay:React.Dispatch<React.SetStateAction<boolean>>

var _Display: boolean

function TwoFactorAuthentication(){
  const [DisplayTwo, setDisplayTwo] = useState<boolean>(true);
  const [Display, setDisplay] = useState<boolean>(true);
  //enable the display of the text
  // if its false, then its enabled, and you can only disable
  //when you disable, it gets true again,a nd enable is set, and the QR code dissapears
  _setDisplayTwo = setDisplayTwo
  _setDisplay = setDisplay
  _Display = Display

  //
  //get the status of twoFactor Authentication

  /* on click, use this, else, use this */

  /* if its false then continue to UserProfile */
  
  /* if true, AND in token the two factor is false, then request a code, which is checked
    if the token is correct, change the authentication code into that of true
    
    if token is true, then twof ctor has aready taken place, continue to userprofile
  */
  if (Display == true){
    checkDisplay()

  }
  return (
    <div className="TwoFactorAuthentication">
      <div>
        {DisplayTwo ? 
        <button onClick={() => {enableTwoFactorAuthentication()}}> enable two twoFactor </button> :
        <button onClick={() => {disableTwoFactorAuthentication()}}> disable two twoFactor </button>}
      </div>
      <div>
        <QRCode value={qrText} size={256} />
      </div>
    </div>
  );
}

export default TwoFactorAuthentication;
