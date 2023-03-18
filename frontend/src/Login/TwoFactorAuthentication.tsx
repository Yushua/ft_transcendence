import React, { useState } from 'react';
import '../App.css';
import QRCode from 'qrcode.react';
import HTTP from '../Utils/HTTP';

async function getStatusTwoFactor():Promise<boolean> {
  const response = HTTP.Get(`user-profile/getStatus`, null, {Accept: 'application/json'})
  var result = await JSON.parse(response)
  var status:boolean = await result["status"]
  console.log(`status ${status}`)
  return status
}

async function startTwoFactorSystem(code:string):Promise<string> {
  console.log("in to get the authentication code")
  console.log(`code ${code}`)
  return "";
}

async function setupTwoFactorAuthentication() {
  if (await getStatusTwoFactor() == true){
    _setQrText(await startTwoFactorSystem("hey"))
  }
}
var _setQrText:React.Dispatch<React.SetStateAction<string>>

function TwoFactorAuthentication(){
  const [qrText, setQrText] = useState<string>("");
  _setQrText = setQrText
  //
  //get the status of twoFactor Authentication

  /* if its false then continue to UserProfile */
  
  /* if true, AND in token the two factor is false, then request a code, which is checked
    if the token is correct, change the authentication code into that of true
    
    if token is true, then twof ctor has aready taken place, continue to userprofile
  */
  return (
    <div className="TwoFactorAuthentication">
      <button onClick={() => {setupTwoFactorAuthentication()}}>logout</button>
      <input type="text" onChange={(e)=>setQrText(e.target.value)} />
      <QRCode value={qrText} size={256} />
    </div>
  );
}

export default TwoFactorAuthentication;
