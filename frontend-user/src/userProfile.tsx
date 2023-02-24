import React, { useState } from 'react';
import './userProfile.css';
import './App.css';
import { getCookie, removeCookie } from 'typescript-cookie';
import DropDown from './componentsUserProfile/FriendListDropDown';
import LogoutButtonComponent from './componentsUserProfile/LogoutButton';
import AddFriendToList from './componentsUserProfile/AddFriendToList';
import HandleUsernameChange from './componentsUserProfile/HandleUsernameChange';
import DropDownMenu from './componentsUserProfile/DropDownMenu';

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

export function setName(neww:string){
  name = neww;
}

//change the username form
interface FormElements extends HTMLFormControlsCollection {
  newInput: HTMLInputElement
}

export interface YourFormElement extends HTMLFormElement {
 readonly elements: FormElements
}

var name: string = "";

function UserProfilePage() {

  return (
    <div className="UserProfile">
        <LogoutButtonComponent />
        <label id="name" htmlFor="name">Welcome {name}</label>

      <AddFriendToList/>
      <HandleUsernameChange/>
      <DropDownMenu
      nameOfMenu={"friendlist"}
      listOfFriends={["hey", "lel"]}
      />
    </div>

  );
}

export default UserProfilePage;
