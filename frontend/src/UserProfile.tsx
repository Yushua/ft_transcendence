import React, { Dispatch, SetStateAction, useState } from 'react';
import './UserProfile.css';
import './App.css';
import { getCookie } from 'typescript-cookie';
import LogoutButtonComponent from './componentsUserProfile/LogoutButton';
import DropDownMenuAddFriendList from './componentsUserProfile/DropDownMenuAddFriendList';
import DropDownMenuRemoveFriendListId from './componentsUserProfile/DropDownMenuRemoveFriendListId';

var message:string = "";

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
      message = `Error! status: ${(await response.json()).message}`;
      throw new Error(`Error! status: ${(await response.json()).message}`);
    }
      const result = (await response.json())
      console.log('result name is: ', JSON.stringify(result, null, 4));
      username = await result["username"];
      message = "";
  }
  catch (e: any) {
    message = e;
    console.log(e)
  }
}

export async function asyncChangeName(username:string) {
  var input:string = `http://localhost:4242/user-profile/userchange/${getCookie('userID')}/${username}`;
  try
  {
    // 👇️ const response: Response
    const response = await fetch(input, {
      method: 'POST',
      body: ``,
      headers: {
        Accept: 'application/json',
        'Content-Type': "application/x-www-form-urlencoded",
      },
    })
    if (!response.ok) {
      message = `Error! status: ${(await response.json()).message}`;
      console.log(`Error! status: ${(await response.json()).message}`);
      throw new Error(`Error! status: ${(await response.json()).message}`);
    }
      _setDisplay(false)
      //if its the same name, error
  }
  catch (e: any) {
    message = e;
    console.log(e)
  }
}

interface FormElements extends HTMLFormControlsCollection {
  username: HTMLInputElement
  password: HTMLInputElement
  eMail: HTMLInputElement
  newInput: HTMLInputElement
}

export interface YourFormElement extends HTMLFormElement {
  readonly elements: FormElements
 }

async function handleusernameChange(e: React.FormEvent<YourFormElement>){
  e.preventDefault();
  console.log("input username == [", e.currentTarget.elements.username.value, "]")
  await asyncChangeName(e.currentTarget.elements.username.value);
  _setDisplay(false)
  // asyncChangeName(e.currentTarget.elements.username);
}

var username: string = "";
var _setDisplay: Dispatch<SetStateAction<boolean>>

async function asyncToggleGetName(){
  await asyncGetName()
  _setDisplay(true)
};

export async function asyncSetDisplay(){
  _setDisplay(true)
}

function UserProfilePage() {
  const [Display, setDisplay] = useState<boolean>(false);
  _setDisplay = setDisplay
  if (Display === false){
    asyncToggleGetName()
  }

  return (
    <div className="UserProfile">
      <div>
        <label id="name" htmlFor="name">Welcome {username}</label>
      </div>
      <div>
      <form onSubmit={handleusernameChange}>
        <div>
          <label htmlFor="username">Username:</label>
          <input id="username" type="text" />
          <button type="submit">Submit</button>
        </div>
      </form>
      </div>
        <DropDownMenuAddFriendList
        />
        <DropDownMenuRemoveFriendListId
        />
      </div>

  );
}

export default UserProfilePage;
