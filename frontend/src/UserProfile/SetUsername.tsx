import '../App.css';

import { getCookie, removeCookie } from 'typescript-cookie';
import HTTP from '../Utils/HTTP';

import { newWindow } from '../App';
import LoginPage from '../Login/LoginPage';
import { useState } from 'react';

async function GetAchievement(name: string, message:string, picture:string){
  alert("in function")
  HTTP.Post(`user-profile/PostAchievementList`, {nameAchievement: name, message:message, pictureLink:picture}, {Accept: 'application/json'})
  alert("it is done")
}

async function getAccessToken(username:string){
  try {
    const response = HTTP.Get(`auth/ChangeUsername/${username}`, null, {Accept: 'application/json'})
    var result = await JSON.parse(response)

    var status:boolean = result["status"]
    if (status === false){
      alert(`error in SetUsername already in use ${username}`)
      _setValue("")
    }
    else if (status === true){
      alert("setting achievement value is true here")
      await GetAchievement("setusername", "you set your username", "default_pfp.jpg")
      newWindow(<LoginPage/>)
    }
  } catch (error) {
    console.log(`error ${error.errorcode}`)
    _setValue("")
  }
}

var _setValue:React.Dispatch<React.SetStateAction<string>>
function SetUsername(){
  const [value, setValue] = useState<string>("");
  _setValue = setValue
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    getAccessToken(value)
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValue(event.target.value);
  };

  return (
    <form onSubmit={handleSubmit}>
      <input type="text" value={value} onChange={handleChange} />
      <button type="submit">Submit</button>
    </form>
  );
}

export default SetUsername;
