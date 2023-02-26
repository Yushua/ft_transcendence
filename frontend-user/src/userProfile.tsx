import React, { } from 'react';
import './userProfile.css';
import './App.css';
import { getCookie } from 'typescript-cookie';
import LogoutButtonComponent from './componentsUserProfile/LogoutButton';
import HandleUsernameChange from './componentsUserProfile/HandleUsernameChange';
import DropDownMenuAddFriendList from './componentsUserProfile/DropDownMenuAddFriendList';
import DropDownMenuRemoveFriendListId from './componentsUserProfile/DropDownMenuRemoveFriendListId';

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
      name = await result["username"];
      console.log(name);
      return name;
  }
  catch (e: any) {
    console.log(e)
  }
}

export function setName(neww:string){
  name = neww;
}

// change the username form
interface FormElements extends HTMLFormControlsCollection {
  newInput: HTMLInputElement
}

export interface YourFormElement extends HTMLFormElement {
 readonly elements: FormElements
}

var name: string = "";
// var newList:string[] = ["yusha", "lol", "Robin", "bob"];
var newListN:string[] = [];

function UserProfilePage() {
  //make a system update that, when either clicked, of empty
  //fills it in with the friendlist for now, I do it here
  //now, when you submit, it shoudl update the page and get everything again
  //don't forget to update the player on their status
  //online, offline, ingame, inmessage

  return (
    <div className="UserProfile">
        <LogoutButtonComponent />
        <label id="name" htmlFor="name">Welcome {name}</label>

      <HandleUsernameChange/>
      <DropDownMenuAddFriendList
      nameOfMenu={"Add friendlist"}
      functinInput={"friendList"}
      //function
      />
      <DropDownMenuRemoveFriendListId
      nameOfMenu={"remove friend"}
      functinInput={"friendList"}
      //function
      />
    </div>

  );
}

export default UserProfilePage;
