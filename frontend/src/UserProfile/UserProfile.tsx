import React, { Dispatch, SetStateAction, useState } from 'react';
import './UserProfile.css';
import '../App.css';
import DropDownMenuAddFriendList from './DropDownMenuAddFriendList';
import DropDownMenuRemoveFriendListId from './DropDownMenuRemoveFriendListId';
import ProfilePicture from './ProfilePicture';
import HTTP from '../Utils/HTTP'
import { newWindow } from '../App';
import SetUsername from './SetUsername';
import LogoutButtonComponent from './LogoutButton';
import TWTButtonComponent from './TWTButtonComponent';
import SearchButtonComponent from './SearchButtonComponent';
import FriendListSearchButtonComponent from './FriendListSearchButtonComponent';

async function asyncGetName():Promise<string> {
  const response = HTTP.Get(`user-profile/user`, null, {Accept: 'application/json'})
  var result = await JSON.parse(response)
  return await result["username"];
}

export async function asyncChangeName(newUsername:string) {
  HTTP.Post(`user-profile/userchange/${newUsername}`, null, {Accept: 'application/json'})
  _setDisplay(false)
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
  _setDisplay(false)
}

var username: string = "";
var _setDisplay: Dispatch<SetStateAction<boolean>>

async function asyncToggleGetName(){
  username = await asyncGetName()
  _setDisplay(true)
};

function UserProfilePage() {
  const [Display, setDisplay] = useState<boolean>(false);
  _setDisplay = setDisplay
  if (Display === false){
    asyncToggleGetName()
  }
  else if (Display == true && username == ""){
    console.log(`username change {${username}}`)
    newWindow(<SetUsername/>)
  }
  //in the end, Friendlist will be displayed on the side
  return (
    <div className="UserProfile">
      <LogoutButtonComponent/>
      <TWTButtonComponent/>
      <SearchButtonComponent/>
      <FriendListSearchButtonComponent/>
      <div>
        <ProfilePicture/>
        <label id="name" htmlFor="name">Welcome {username}</label>
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
