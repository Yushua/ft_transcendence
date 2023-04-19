import React, { useEffect, useState } from 'react';
import { getCookie, removeCookie, setCookie } from 'typescript-cookie';
import { newWindow } from '../App';
import '../App.css';
import MainWindow, { Width } from '../MainWindow/MainWindow';
import HTTP from '../Utils/HTTP';
import { Box } from '@mui/material';

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
    const response = await fetch(HTTP.HostRedirect() + `auth/checkTWTCodeUpdate/${code}` , {
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
    alert("wrong code input, error occured, try again")
    _setInputValue("")
    return false
  }
}
async function handleSubmit(event:any){
  event.preventDefault();
  var status:boolean =  await turningTWTOn(_inputValue)
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

function TurnTWTOnLoginPage(){
    const [inputValue, setInputValue] = useState("");
    const [intraName, setintraName] = useState<string>('');
    _inputValue = inputValue
    _setInputValue = setInputValue
    _intraName = intraName
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
       <Box
          fontFamily={"'Courier New', monospace"}
          fontSize={"200%"}
          marginTop={`${Width*0.3}px`}>
          Input Username
        <input type="text" value={inputValue} onChange={handleInputChange} />
        {inputValue.length === 6 && (
        <button type="submit">Submit</button> )}
      </Box>
  </form>
  );
}

export default TurnTWTOnLoginPage;