import React, { useState } from 'react';
import './userProfile.css';
import './App.css';
import { getCookie, removeCookie } from 'typescript-cookie';
import DropDown from './componentsUserProfile/friendListDropDown';
import LogoutButtonComponent from './componentsUserProfile/LogoutButton';

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

async function asyncChangeName(newInput: string){
  console.log('nameChange');
  try {
    // 👇️ const response: Response
    var tmp:string = 'http://localhost:4242/user-profile/userchange/' + getCookie('userID') + '/' + newInput;
    const response = await fetch(tmp, {
      method: 'POST',
      body: `username=${newInput}`,
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

async function asyncAddFriend(newInput: string){
  console.log('friendchange');
  try {
    // 👇️ const response: Response
    var tmp:string = 'http://localhost:4242/user-profile/userchange/' + getCookie('userID') + '/' + newInput;
    const response = await fetch(tmp, {
      method: 'POST',
      body: `username=${newInput}`,
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
    return result;
  }
  catch (e: any) {
    message = e;
    console.log(e)
  }
}

async function _delGetName(newName: string){
  if (newName !== "")
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
  newInput: HTMLInputElement
}

interface YourFormElement extends HTMLFormElement {
 readonly elements: FormElements
}

const handleUsernameChange = (e: React.FormEvent<YourFormElement>) => {
  e.preventDefault();
  asyncChangeName(e.currentTarget.elements.newInput.value);
  // const errorThingy = document.getElementById("errorCode")
  // if (!!errorThingy)
  //  errorThingy.innerHTML = message
}

const handleFriendListAddChange = (e: React.FormEvent<YourFormElement>) => {
  e.preventDefault();
  asyncAddFriend(e.currentTarget.elements.newInput.value);
  // const errorThingy = document.getElementById("errorCode")
  // if (!!errorThingy)
  //  errorThingy.innerHTML = message
}

var name: string = "";
var message:string = "";
var _setDisplay: React.Dispatch<React.SetStateAction<string>> | null = null

function UserProfilePage() {

  const [Display, setDisplay] = useState<string>("")
  _setDisplay = setDisplay

    //if name is this, then update it with the right name
    //if name is updated, also update this with the new name, simply by making the name "" again
  if (name === ""){
    _delGetName("");
  }
  //drop down menu
  const [showDropDown, setShowDropDown] = useState<boolean>(false);
  const [selectFriendList, setselectFriendList] = useState<string>("");

  const friendList = () => {
    return ["Hong Kong", "London", "New York City", "Paris"];
  };

  const toggleDropDown = () => {
    setShowDropDown(!showDropDown);
  };
  const dismissHandler = (event: React.FocusEvent<HTMLButtonElement>): void => {
    if (event.currentTarget === event.target) {
      setShowDropDown(false);
    }
  };

  const friendListSelection = (friend: string): void => {
    setselectFriendList(friend);
  };

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
        <LogoutButtonComponent />
        <label id="name" htmlFor="name">Welcome {name}</label>
      <form onSubmit ={handleUsernameChange}>
        <button type="submit">Change username</button>
        <input id="newInput" type="text" />
        <label htmlFor="change username">{message}</label>
      </form>
      <form onSubmit ={handleFriendListAddChange}>
        <button type="submit">Add Friend</button>
        <label htmlFor="add Friend">{message}</label>
        <input id="newInput" type="text" />
      </form>
      <form onSubmit ={handleUsernameChange}>
        <button type="submit">Remove Friend</button>
        <label htmlFor="change username">{message}</label>
        <input id="newInput" type="text" />
      </form>
      <div>
        <button className={showDropDown ? "active" : undefined}
          onClick={(): void => toggleDropDown()}
          onBlur={(e: React.FocusEvent<HTMLButtonElement>): void =>
            dismissHandler(e)
          }>
        <div>{selectFriendList ? "Select: " + selectFriendList : "Select ..."} </div>
        {showDropDown && (
          <DropDown
            friendList={friendList()}
            showDropDown={false}
            toggleDropDown={(): void => toggleDropDown()}
            friendSelection={friendListSelection}
          />
        )}
      </button>
      </div>
    </div>

  );
}

export default UserProfilePage;
