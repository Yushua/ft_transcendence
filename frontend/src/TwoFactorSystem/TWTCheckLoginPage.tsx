import React, { useEffect, useState } from 'react';
import { getCookie, removeCookie, setCookie } from 'typescript-cookie';
import { newWindow } from '../App';
import '../App.css';
import LoginPage from '../Login/LoginPage';
import HTTP from '../Utils/HTTP';

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
  alert("wrong code input, try again")
  _setInputValue("")
};

async function asyncGetName():Promise<string> {
	const response = HTTP.Get(`user-profile/user`, null, {Accept: 'application/json'})
	var user = await JSON.parse(response)
	return await user["intraname"];
  }


var _inputValue: string
var _setInputValue: React.Dispatch<React.SetStateAction<string>>
var _intraName: string

//get the username in here
function TWTCheckLoginPage(){
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
  newWindow(<LoginPage/>)
  return (
    <form onSubmit={handleSubmit}>
    <label>
      enable two Factor Authentication to login
      <input type="text" value={inputValue} onChange={handleInputChange} />
    </label>
    <button type="submit">Submit Code</button>
  </form>
  );
}

export default TWTCheckLoginPage;
