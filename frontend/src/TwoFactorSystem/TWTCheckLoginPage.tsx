import React, { useState } from 'react';
import { getCookie, removeCookie, setCookie } from 'typescript-cookie';
import { newWindow } from '../App';
import '../App.css';
import LoginPage from '../Login/LoginPage';
import HTTP from '../Utils/HTTP';
import TurnTWTOnLoginPage from './TurnTWTOnLoginPage';

async function turningTWTOn(code:string):Promise<string>{
  try {
    const response = await fetch(HTTP.HostRedirect() + `auth/checkTWT/${getCookie('TWToken')}/${code}` , {
      headers: {
        Accept: 'application/json',
        'Authorization': 'Bearer ' + getCookie("accessToken"),
        'Content-Type': 'application/json',
      },
      method: 'GET'
    })
    if (!response.ok) {
      throw new Error(`Error! status: ${response.status}`);
    }
    var result = await response.json();
    console.log(`turning TWT on if {${await result["status"]}} == true`)
    if (await result["status"] === true){
      removeCookie('TWToken');
      return await result["TWT"]
    }
    else {
        alert("wrong code input, try again")
        _setInputValue("")
    }
  } catch (error) {
    alert("wrong code input, try again")
    _setInputValue("")
  }
  return ""
}
async function handleSubmit(event:any){
  event.preventDefault();
  var input:string = await turningTWTOn(_inputValue)
  if (input !== ""){
    setCookie('TWToken', input, { expires: 10000 });
  }
  alert("wrong code input, try again")
  _setInputValue("")
};

var _inputValue: string
var _setInputValue: React.Dispatch<React.SetStateAction<string>>

function TWTCheckLoginPage(){
  const [inputValue, setInputValue] = useState("");
  _inputValue = inputValue
  _setInputValue = setInputValue
  const handleInputChange = (event:any) => {
    setInputValue(event.target.value);
  };

  newWindow(<LoginPage/>)
  return (
    <form onSubmit={handleSubmit}>
    <label>
      enable two Factor Authentication to login
      <input type="text" value={inputValue} onChange={handleInputChange} />
    </label>
    <button type="submit">Submit</button>
  </form>
  );
}

export default TWTCheckLoginPage;
