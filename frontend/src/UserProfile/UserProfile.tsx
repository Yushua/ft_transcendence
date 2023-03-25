import React, { useState } from 'react';
import './UserProfile.css';
import '../App.css';
import HTTP from '../Utils/HTTP'
import EXPBarComponent from '../ButtonComponents/EXPBarComponent';
import SearchBarFriend from '../Search bar/SearchbarFriend copy';
import User from '../Utils/Cache/User';

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

var _setNameDisplay: React.Dispatch<React.SetStateAction<string>>

async function asyncToggleGetName(){
  _setNameDisplay(await asyncGetName())
};

function UserProfilePage() {
  const [nameDisplay, setNameDisplay] = useState<string>("");
  const [TotalExp, setExp] = useState<number>((User.wins*10));
  _setNameDisplay = setNameDisplay
  if (nameDisplay == ""){
    asyncToggleGetName()
  }
  //in the end, Friendlist will be displayed on the side
  return (
    <div className="UserProfile">
      <div>
        <img src={User.ProfilePicture} alt="" style={{width: "2cm", height: "2cm"}}/>
        <div> <label id="name" htmlFor="name">Welcome {nameDisplay}</label> </div>
        <div> <label id="maxExp" htmlFor="maxExp">maxEXp - {TotalExp}</label> </div>
        <div> <EXPBarComponent/> </div>
      </div>
      <SearchBarFriend/>
    </div>
    //logout when initialized
  );
}

export default UserProfilePage;
