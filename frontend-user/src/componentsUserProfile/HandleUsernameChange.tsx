import React, { useState } from 'react';
import { getCookie, removeCookie } from 'typescript-cookie';
import { newWindow } from '../App';
import LoginPage from '../Login';
import { asyncGetName, setName, YourFormElement } from '../userProfile';

var message:string = "";

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

const UsernameChange = (e: React.FormEvent<YourFormElement>) => {
    e.preventDefault();
    asyncChangeName(e.currentTarget.elements.newInput.value);
    // const errorThingy = document.getElementById("errorCode")
    // if (!!errorThingy)
    //  errorThingy.innerHTML = message
  }

async function _delGetName(newName: string){
if (newName !== "")
    name = newName;
if (!!_setDisplay){
    await asyncGetName();
    _setDisplay(name);
}
} 

var name: string = "";
var _setDisplay: React.Dispatch<React.SetStateAction<string>> | null = null

function HandleUsernameChange() {
    const [Display, setDisplay] = useState<string>("")
    _setDisplay = setDisplay
  
      //if name is this, then update it with the right name
      //if name is updated, also update this with the new name, simply by making the name "" again
    if (name === ""){
      _delGetName("");
    }

    return (
        <div>
            <form onSubmit ={UsernameChange}>
                <button type="submit">Change username</button>
                <input id="newInput" type="text" />
                <label htmlFor="change username">{message}</label>
            </form>
        </div>
    )
}

export default HandleUsernameChange;