import React, { useState } from 'react';
import './userProfile.css';
import './App.css';
import { getCookie, removeCookie } from 'typescript-cookie';
import LoginPage from './Login';
import { newWindow } from './App';

export function logoutButton() {
  removeCookie('accessToken');
  removeCookie('userID');
  newWindow(<LoginPage />);
}

export async function getname() {
  var input:string = 'http://localhost:4242/user-profile/user/' + getCookie('userID');
  try
  {
    const response = await fetch(input, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': "application/x-www-form-urlencoded",
      },
    })
    if (!response.ok) {
      throw new Error(`Error! status: ${(await response.json()).message}`);
    }
      const result = (await response.json())
      console.log('result is: ', JSON.stringify(result, null, 4));
      name = result["username"];
      console.log(name);
      return name;
  }
  catch (e: any) {
    console.log(e)
  }
}

async function _delGetName(name: string ){
  if (!!_setDisplay){
    _setDisplay(name);
  }
} 

var name: string = "";
var _setDisplay: React.Dispatch<React.SetStateAction<string>> | null = null

const UserProfilePage: React.FC = () => {
  const [Display, setDisplay] = useState<string>("")
  _setDisplay = setDisplay

  if (name === ""){
    getname();
    _delGetName(name);
  }

//CAN ALSO be used, in case a string, for example a button
//is clicked, then I an switch between a page

  return (
    <div className="UserProfile">
        <button onClick={() => {logoutButton()}}>logout</button>
        <label id="name" htmlFor="name">Welcome {name}</label>
    </div>
  );
}

export default UserProfilePage;
