import { useState } from 'react';
import { removeCookie, setCookie } from 'typescript-cookie';
import '../App.css';
import HTTP from '../Utils/HTTP';
import User from '../Utils/Cache/User';
import { SetMainProfileWindow } from '../UserProfile/ProfileMainWindow';

async function CheckTWTSetup(code:string){
  const response = HTTP.Get(`auth/checkTWTCodeUpdate/${code}`, null, {Accept: 'application/json'})
  var result = await JSON.parse(response)
  if (await result["status"] == true){
    User._ManualUpdate(result["user"])
    removeCookie(`TWToken${User.intraname}`);
    setCookie(`TWToken${User.intraname}`, await result["TWT"],{ expires: 100000 });
    SetMainProfileWindow("tWTDisplay")
  }
  else {
    alert("wrong code input, try again")
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
    alert("input too low")
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

function TWTEnabled(){
  const [inputValue, setInputValue] = useState("");
  const [otpSecret, setOtpSecret] = useState("");
  _inputValue = inputValue
  _setInputValue = setInputValue
  _setOtpSecret = setOtpSecret
  const handleInputChange = (event:any) => {
    setInputValue(event.target.value);
  };

  if (otpSecret === ""){
    getSecret()
  }

  return (
    <div className="TWTEnabled">
      <div>
      <img src={ otpSecret } alt="QR Code" />
        <form onSubmit={handleSubmit}>
          <label>
            please fill in the code to enable Two Factor Authorization
            <input type="text" value={inputValue} onChange={handleInputChange} />
          </label>
          <button type="submit">Submit</button>
        </form>
      </div>
    </div>
  );
}

export default TWTEnabled;
