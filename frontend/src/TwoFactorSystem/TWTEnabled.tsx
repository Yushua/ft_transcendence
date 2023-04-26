import { useState } from 'react';
import { removeCookie, setCookie } from 'typescript-cookie';
import '../App.css';
import HTTP from '../Utils/HTTP';
import User from '../Utils/Cache/User';
import { SetWindowProfile } from '../UserProfile/ProfileMainWindow';
import TWTDisabled from './TWTDisabled';
import { Width } from '../MainWindow/MainWindow';
import { Box } from '@mui/material';

async function CheckTWTSetup(code:string){
  const response = HTTP.Get(`auth/checkTWTCodeUpdate/${code}`, null, {Accept: 'application/json'})
  var result = await JSON.parse(response)
  if (await result["status"] === true){
    User._user.status = result["status"]
    removeCookie(`TWToken${User.intraname}`);
    setCookie(`TWToken${User.intraname}`, await result["TWT"], { expires: 1000000});
    SetWindowProfile(<TWTDisabled/>)
  }
  else {
    _setMessage("wrong code input, try again")
    _setInputValue("")
  }
}

async function getBackendTWTSecret():Promise<string>{
  const response = HTTP.Get(`auth/getQRCode`, null, {Accept: 'application/json'})
  var result = await JSON.parse(response)
  return await result["QRCode"]
}

async function handleSubmit(event:any){
  event.preventDefault();
  if (_inputValue.length < 2){
    _setInputValue("")
    _setMessage("input too low")
  }
  else {
    await CheckTWTSetup(_inputValue)
  }
};

async function getSecret(){
  _setOtpSecret(await getBackendTWTSecret())
}
var _inputValue: string
var _setInputValue: React.Dispatch<React.SetStateAction<string>>
var _setOtpSecret: React.Dispatch<React.SetStateAction<string>>
var _setMessage:React.Dispatch<React.SetStateAction<string>>

function TWTEnabled(){
  const [inputValue, setInputValue] = useState("");
  const [otpSecret, setOtpSecret] = useState("");
  const [Message, setMessage] = useState<string>("enable two Factor Authentication to login");

  _inputValue = inputValue
  _setInputValue = setInputValue
  _setOtpSecret = setOtpSecret
  _setMessage = setMessage
  const handleInputChange = (event:any) => {
    setInputValue(event.target.value);
  };

  if (otpSecret === ""){
    getSecret()
  }

  return (
    <center>
    <form onSubmit={handleSubmit}>
      <Box
          fontFamily={"'Courier New', monospace"}
          fontSize={"200%"}
          marginTop={`${Width*0.1}px`}>
        <img src={ otpSecret } alt="QR Code" />
        <div> {Message} </div>
      <input type="text" value={inputValue} onChange={handleInputChange} />

      <button type="submit">Submit Code</button>
      </Box>
    </form>
  </center>

  );
}

export default TWTEnabled;
