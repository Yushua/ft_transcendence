import React, { } from 'react';
import { getCookie } from 'typescript-cookie';
import { YourFormElement } from '../UserProfile';
var message:string = "";

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

const handleFriendListAddChange = (e: React.FormEvent<YourFormElement>) => {
    e.preventDefault();
    asyncAddFriend(e.currentTarget.elements.newInput.value);
    // const errorThingy = document.getElementById("errorCode")
    // if (!!errorThingy)
    //  errorThingy.innerHTML = message
  }

function AddFriendToList() {
    return (
        <div>
            <form onSubmit ={handleFriendListAddChange}>
            <button type="submit">Add Friend</button>
            <label htmlFor="add Friend">{message}</label>
            <input id="newInput" type="text" />
        </form>
        </div>
    )
}

export default AddFriendToList;