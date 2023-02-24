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

export async function asyncGetName() {
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

async function asyncChangeName(newUsername: string){
  try {
    // 👇️ const response: Response
    var tmp:string = 'http://localhost:4242/user-profile/userchange/' + getCookie('userID') + '/' + newUsername;
    const response = await fetch(tmp, {
      method: 'POST',
      body: `username=${newUsername}`,
      headers: {
        Accept: 'application/json',
        'Content-Type': "application/x-www-form-urlencoded",
      },
    })
    
    if (!response.ok) {
      message = `Error! status: ${(await response.json()).message}`;
      throw new Error(`Error! status: ${(await response.json()).message}`);
    }
    
    const result = (await response.json())
    
    console.log('result is: ', JSON.stringify(result, null, 4));
    //set the name here back to "" then say to delGetName to
    //get the name from the serverside
    setName("");
    _delGetName("")
    return result;
  }
  catch (e: any) {
    message = e;
    console.log(e)
  }
}

async function _delGetName(newName: string){
  if (newName != "")
    name = newName;
  if (!!_setDisplay){
    await asyncGetName();
    _setDisplay(name);
  }
} 

export function setName(neww:string){
  name = neww;
}

//change the username form
interface FormElements extends HTMLFormControlsCollection {
  newUsername: HTMLInputElement
}

interface YourFormElement extends HTMLFormElement {
 readonly elements: FormElements
}

const handleUsernameChange = (e: React.FormEvent<YourFormElement>) => {
  e.preventDefault();
  console.log(e.currentTarget.elements.newUsername.value)
  asyncChangeName(e.currentTarget.elements.newUsername.value);
  const errorThingy = document.getElementById("errorCode")
  if (!!errorThingy)
   errorThingy.innerHTML = message
}

var name: string = "";
var message:string = "";
var _setDisplay: React.Dispatch<React.SetStateAction<string>> | null = null

const UserProfilePage: React.FC = () => {
  const [Display, setDisplay] = useState<string>("")
  _setDisplay = setDisplay

    //if name is this, then update it with the right name
    //if name is updated, also update this with the new name, simply by making the name "" again
  if (name === ""){
    _delGetName("");
  }

//CAN ALSO be used, in case a string, for example a button
//is clicked, then I an switch between a page

//unique name is different from intra name
//get the profile link stored in the database
//show the stats on the user-profile
//remove friends
//add friends
//look up friends
  return (
    <div className="UserProfile">
        <button onClick={() => {logoutButton()}}>logout</button>
        <label id="name" htmlFor="name">Welcome {name}</label>
      <form onSubmit ={handleUsernameChange}>
        <label htmlFor="change username">{message}</label>
        <input id="newUsername" type="text" />
        <label htmlFor="username">username:</label>
        <button type="submit">Submit</button>
      </form>
      <div>
      </div>
    </div>

  );
}

export default UserProfilePage;
