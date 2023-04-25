import React, { useEffect, useState } from 'react';
import { getCookie, removeCookie, setCookie } from 'typescript-cookie';
import { newWindow } from '../App';
import '../App.css';
import LoginPage from '../Login/LoginPage';
import HTTP from '../Utils/HTTP';
import { Width } from '../MainWindow/MainWindow';
import { Box } from '@mui/material';

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
      setCookie(`TWToken${_intraName}`, await result["TWT"], { expires: 100000 });
    }
    else {
      _setMessage("wrong code input, try again")
        _setInputValue("")
    }
  } catch (error) {
    _setMessage("wrong code input, try again")
    _setInputValue("")
  }
}
async function handleSubmit(event:any){
  event.preventDefault();
  await turningTWTOn(_inputValue)
  _setMessage("wrong code input, try again")
  _setInputValue("")
};

async function asyncGetName():Promise<string> {
	const response = HTTP.Get(`user-profile/user`, null, {Accept: 'application/json'})
	var result = await JSON.parse(response)
	return result.intraName;
  }


var _inputValue: string
var _setInputValue: React.Dispatch<React.SetStateAction<string>>
var _intraName: string
var _setMessage:React.Dispatch<React.SetStateAction<string>>

//get the username in here
function TWTCheckLoginPage(){
  const [inputValue, setInputValue] = useState("");
  const [intraName, setintraName] = useState<string>('');
  const [Message, setMessage] = useState<string>("enable two Factor Authentication to login");
  _inputValue = inputValue
  _setInputValue = setInputValue
  _intraName = intraName
  _setMessage = setMessage
  const handleInputChange = (event:any) => {
    setInputValue(event.target.value);
  };
  async function getIntraName(){
    setintraName(await asyncGetName())
  }

  useEffect(() => {
    getIntraName()
  }, []);
  newWindow(<LoginPage/>)
  return (
    <center>
    <form onSubmit={handleSubmit}>
      <Box
          fontFamily={"'Courier New', monospace"}
          fontSize={"200%"}
          marginTop={`${Width*0.3}px`}>
        <div> {Message} </div>
      <input type="text" value={inputValue} onChange={handleInputChange} />

      <button type="submit">Submit Code</button>
      </Box>
    </form>
  </center>
  );
}

export default TWTCheckLoginPage;
