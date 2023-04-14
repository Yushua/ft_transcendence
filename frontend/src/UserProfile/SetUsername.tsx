import '../App.css';

import HTTP from '../Utils/HTTP';

import { newWindow } from '../App';
import LoginPage from '../Login/LoginPage';
import { useState } from 'react';
import { Box } from '@mui/material';
import { Width } from '../MainWindow/MainWindow';

export async function GetAchievement(name: string, picture:string, message:string){
  HTTP.Post(`user-profile/PostAchievementList`, {nameAchievement: name, pictureLink:picture, message:message}, {Accept: 'application/json'})
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
      await GetAchievement("setusername", "./public/default_pfp.jpg", "you set your username")
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
    <center>
      <form onSubmit={handleSubmit}>
        <Box
            fontFamily={"'Courier New', monospace"}
            fontSize={"200%"}
            marginTop={`${Width*0.3}px`}>
            Choose a username
          <input type="text" value={value} onChange={handleChange} />
          {value.length > 4 && value.length <= 20 && (
          <button type="submit">Submit</button> )}
        </Box>
      </form>
    </center>
  );
}

export default SetUsername;
