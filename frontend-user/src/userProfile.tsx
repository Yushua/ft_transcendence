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

var name: string = "";
var _setWindow: React.Dispatch<React.SetStateAction<JSX.Element>> | null = null

const UserProfilePage: React.FC = () => {
  const [window, setWindow] = useState<JSX.Element>(<UserProfilePage />)
  _setWindow = setWindow

  if (name === "")
    getname()


  return (
    <div className="UserProfile">
        <button onClick={() => {logoutButton()}}>logout</button>
        <label id="name" htmlFor="name">Welcome {name}</label>
    </div>
  );
}

export default UserProfilePage;
