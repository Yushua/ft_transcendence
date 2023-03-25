import React, { useEffect, useState } from 'react';
import { getCookie, removeCookie, setCookie } from 'typescript-cookie';
import { newWindow } from '../App';
import '../App.css';
import MainWindow from '../MainWindow/MainWindow';
import HTTP from '../Utils/HTTP';
import User from '../Utils/Cache/User';

async function turningTWTOn(code:string){
  var intraname:string = await asyncGetName()
  alert(`intraname {${_intraName}}{${intraname}}{${await asyncGetName()}}`)
  try {
    const response = await fetch(HTTP.HostRedirect() + `auth/checkTWT/${getCookie(`TWToken${intraname}`)}/${code}` , {
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
      removeCookie(`TWToken${intraname}`);
      setCookie(`TWToken${intraname}`, await result["TWT"],{ expires: 10000 });
      newWindow(<MainWindow/>);
    }
    else {
        alert("wrong code input, try again")
        _setInputValue("")
    }
  } catch (error) {
    alert("wrong code input, try again")
    _setInputValue("")
  }
}
async function handleSubmit(event:any){
  event.preventDefault();
  await turningTWTOn(_inputValue)
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