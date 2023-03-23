import React, { Dispatch, SetStateAction, useState } from 'react';
import './UserProfile.css';
import '../App.css';
import ProfilePicture from './ProfilePicture';
import HTTP from '../Utils/HTTP'
import { newWindow } from '../App';
import SetUsername from './SetUsername';
import LogoutButtonComponent from './ButtonComponents/LogoutButton';
import TWTButtonComponent from './ButtonComponents/TWTButtonComponent';
import SearchButtonComponent from './ButtonComponents/SearchButtonComponent';
import FriendListSearchButtonComponent from './ButtonComponents/FriendListSearchButtonComponent';

async function asyncGetName():Promise<string> {
  const response = HTTP.Get(`user-profile/user`, null, {Accept: 'application/json'})
  var result = await JSON.parse(response)
  return await result["username"];
}

export async function asyncChangeName(newUsername:string) {
  HTTP.Post(`user-profile/userchange/${newUsername}`, null, {Accept: 'application/json'})
}

interface FormElements extends HTMLFormControlsCollection {
  username: HTMLInputElement
  newInput: HTMLInputElement
}

export interface YourFormElement extends HTMLFormElement {
  readonly elements: FormElements
 }

async function handleUsernameChange(e: React.FormEvent<YourFormElement>){
  e.preventDefault();
  await asyncChangeName(e.currentTarget.elements.username.value);
  _setNameDisplay(e.currentTarget.elements.username.value)
}

var _setNameDisplay: React.Dispatch<React.SetStateAction<string>>

async function asyncToggleGetName(){
  _setNameDisplay(await asyncGetName())
};

function UserProfilePage() {
  const [nameDisplay, setNameDisplay] = useState<string>("");
  _setNameDisplay = setNameDisplay
  if (nameDisplay == ""){
    asyncToggleGetName()
  }
  //in the end, Friendlist will be displayed on the side
  return (
    <div className="UserProfile">
      <div>
        <ProfilePicture/>
        <label id="name" htmlFor="name">Welcome {nameDisplay}</label>
      </div>
      <div>
      <form onSubmit={handleUsernameChange}>
        <div>
          <label htmlFor="username">new username Input:</label>
          <input id="username" type="text" />
          <button type="submit">Submit</button>
        </div>
      </form>
      </div>
    </div>
    //logout when initialized
  );
}

export default UserProfilePage;
