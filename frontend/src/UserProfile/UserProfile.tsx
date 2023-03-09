import React, { Dispatch, SetStateAction, useState } from 'react';
import './UserProfile.css';
import '../App.css';
import DropDownMenuAddFriendList from './DropDownMenuAddFriendList';
import DropDownMenuRemoveFriendListId from './DropDownMenuRemoveFriendListId';
import ProfilePicture from './ProfilePicture';
import HTTP from '../Utils/HTTP'

async function asyncGetName() {
  const response = HTTP.Get(`user-profile/user`, null, {Accept: 'application/json'})
  var result = await JSON.parse(response)
  username = await result["username"];
}

export async function asyncChangeName(newUsername:string) {
  HTTP.Post(`user-profile/userchange/${newUsername}`, null, {Accept: 'application/json'})
  _setDisplay(false)
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

async function handleUsernameChange(e: React.FormEvent<YourFormElement>){
  e.preventDefault();
  await asyncChangeName(e.currentTarget.elements.username.value);
  _setDisplay(false)
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
        <ProfilePicture/>
        <label id="name" htmlFor="name">Welcome {username}</label>
      </div>
      <div>
      <form onSubmit={handleUsernameChange}>
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
