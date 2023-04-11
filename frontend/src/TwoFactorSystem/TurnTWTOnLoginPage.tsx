import React, { useEffect, useState } from 'react';
import { getCookie, removeCookie, setCookie } from 'typescript-cookie';
import { newWindow } from '../App';
import '../App.css';
import MainWindow from '../MainWindow/MainWindow';
import HTTP from '../Utils/HTTP';

export async function asyncGetTWTStatusTWT(TWT:string):Promise<boolean> {
  try {
    const response = HTTP.Get(`auth/checkStatusTWT/${getCookie(`TWToken${_intraName}`)}`, null, {Accept: 'application/json'})
    var result = await JSON.parse(response)
    console.log("TWT token status in TWT check " + result["status"])
    return await result["status"]
  } catch (error) {
    alert(`${error}, Token is out of date Loginpage`)
    //react router
  }
  return false
}

async function turningTWTOn(code:string){
  try {
    const response = await fetch(HTTP.HostRedirect() + `auth/checkTWTOn/${getCookie(`TWToken${_intraName}`)}/${code}` , {
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
    if (await result["status"] === true){
      removeCookie(`TWToken${_intraName}`);
      setCookie(`TWToken${_intraName}`, await result["TWT"],{ expires: 100000 });
      return true
    }
    else {
        alert("wrong code input, try again")
        _setInputValue("")
        return false
    }
  } catch (error) {
    alert("wrong code input, try again")
    _setInputValue("")
    return false
  }
}
async function handleSubmit(event:any){
  event.preventDefault();
  var status:boolean =  await turningTWTOn(_inputValue)
  alert(`status ={${status}}`)
  if (status === true){
    newWindow(<MainWindow/>);
  }
};

async function asyncGetName():Promise<string> {
	const response = HTTP.Get(`user-profile/user`, null, {Accept: 'application/json'})
	var user = await JSON.parse(response)
	return await user["intraname"];
  }

var _inputValue: string
var _setInputValue: React.Dispatch<React.SetStateAction<string>>
var _intraName: string
var _setIntraName: React.Dispatch<React.SetStateAction<string>>

function TurnTWTOnLoginPage(){
    const [inputValue, setInputValue] = useState("");
    _inputValue = inputValue
    _setInputValue = setInputValue
    const [intraName, setintraName] = useState<string>('');
    _intraName = intraName
    _setIntraName = setintraName
    const handleInputChange = (event:any) => {
      setInputValue(event.target.value);
    };
    async function getIntraName(){
      setintraName(await asyncGetName())
    }
    useEffect(() => {
      getIntraName()
    }, []);
  //setu the QR code. if input Code, then it will be turned on. so there is always a QR code
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

export default TurnTWTOnLoginPage;