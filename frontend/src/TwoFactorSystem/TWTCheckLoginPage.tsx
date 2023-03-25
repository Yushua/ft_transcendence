import React, { useEffect, useState } from 'react';
import { getCookie, removeCookie, setCookie } from 'typescript-cookie';
import { newWindow } from '../App';
import '../App.css';
import LoginPage from '../Login/LoginPage';
import HTTP from '../Utils/HTTP';

async function turningTWTOn(code:string):Promise<string>{
  alert(`intraname ${_intraName}`)
  try {
    const response = await fetch(HTTP.HostRedirect() + `auth/checkTWT/${getCookie(`TWToken${_intraName}`)}/${code}` , {
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
      removeCookie(`TWToken${_intraName}`);
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
  alert(`intraname ${_intraName}`)
  var input:string = await turningTWTOn(_inputValue)
  if (input !== ""){
    setCookie(`TWToken${_intraName}`, input, { expires: 10000 });
  }
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
var _setIntraName: React.Dispatch<React.SetStateAction<string>>

//get the username in here
function TWTCheckLoginPage(){
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
