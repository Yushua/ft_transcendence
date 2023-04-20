import React, { useEffect, useState } from 'react';
import { getCookie, removeCookie, setCookie } from 'typescript-cookie';
import { newWindow } from '../App';
import '../App.css';
import MainWindow, { Width } from '../MainWindow/MainWindow';
import HTTP from '../Utils/HTTP';
import { Box } from '@mui/material';

async function turningTWTOn(code:string){
  console.log("logging in with TWT")
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
        _setInputString("wrong code input, try again")
        _setInputValue("")
        return false
    }
  } catch (error) {
    _setInputString("wrong code input, try again")
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
var _setInputString: React.Dispatch<React.SetStateAction<string>>

function TurnTWTOnLoginPage(){
    const [inputValue, setInputValue] = useState("");
    const [intraName, setintraName] = useState<string>('');
    const [InputString, setInputString] = useState<string>('set your Two Factor Code To Login');
    _inputValue = inputValue
    _setInputValue = setInputValue
    _intraName = intraName
    _setInputString = setInputString
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
    <center>
      <form onSubmit={handleSubmit}>
        <Box
            fontFamily={"'Courier New', monospace"}
            fontSize={"200%"}
            marginTop={`${Width*0.3}px`}>
          <div> {InputString} </div>
          <input type="text" value={inputValue} onChange={handleInputChange} />
          {inputValue.length === 6 && (
          <button type="submit">Submit</button> )}
        </Box>
      </form>
    </center>
  );
}

export default TurnTWTOnLoginPage;