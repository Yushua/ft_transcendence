import React, { useState } from 'react';
import { getCookie, removeCookie, setCookie } from 'typescript-cookie';
import { newWindow } from '../App';
import '../App.css';
import UserProfilePage from '../UserProfile/UserProfile';
import HTTP from '../Utils/HTTP';

async function checkTWTCode(code:string){
    const response = HTTP.Get(`auth/checkTWT/${getCookie('TWToken')}/${code}`, null, {Accept: 'application/json'})
    var result = await JSON.parse(response)
    if (await result["status"] == true){
        removeCookie('TWToken');
        setCookie('TWToken', await result["TWT"],{ expires: 10000 });
        newWindow(<UserProfilePage/>)
    }
    else {
        alert("wrong code input, try again")
        _setInputValue("")
    }
}
async function handleSubmit(event:any){
  event.preventDefault();
  await checkTWTCode(_inputValue)
};

var _inputValue: string
var _setInputValue: React.Dispatch<React.SetStateAction<string>>

function TurnTWTOn(){
    const [inputValue, setInputValue] = useState("");
    _inputValue = inputValue
    _setInputValue = setInputValue
    const handleInputChange = (event:any) => {
      setInputValue(event.target.value);
    };
  
  //setu the QR code. if input Code, then it will be turned on. so there is always a QR code
  return (
    <form onSubmit={handleSubmit}>
    <label>
      enable Two Factor system
      <input type="text" value={inputValue} onChange={handleInputChange} />
    </label>
    <button type="submit">Submit</button>
  </form>
  );
}

export default TurnTWTOn;