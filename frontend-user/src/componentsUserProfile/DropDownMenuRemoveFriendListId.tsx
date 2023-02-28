import {  } from 'q';
import React, { Dispatch, SetStateAction, useState } from 'react';
import { getCookie, getCookies, removeCookie } from 'typescript-cookie';
import { newWindow } from '../App';
import LoginPage from '../Login';
import DropDown from './FriendListDropDown';

var list_:string[];
async function removeFriendToList(usernameRemove: string) {
  var inputString:string = 'http://localhost:4242/user-profile/friendlist/remove/' + getCookies().userID + '/' + usernameRemove;
  console.log("remove friend", usernameRemove);
  try {
    // 👇️ const response: Response
    const response = await fetch(inputString, {
      method: 'PATCH',
      body: ``,
      headers: {
        Accept: 'application/json',
        'Content-Type': "application/x-www-form-urlencoded",
      },
    })
    if (!response.ok) {
      throw new Error(`Error! status: ${(await response.json()).message}`);
    }
    
    const result = (await response.json())
    
    console.log('result removing is: ', JSON.stringify(result, null, 4));
  }
  catch (e: any) {
    console.log(e)
  }
}

export async function asyncGetFriendListById(){
  console.log("adding")
  var input:string = 'http://localhost:4242/user-profile/userFriendList/' + getCookie('userID');
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
     var result = await response.json()
      console.log('result getting is: ', await result);
      list_ =  await result;
  }
  catch (e: any) {
    console.log(e)
  }
}

export function logoutButtonRefresh() {
  removeCookie('accessToken');
  removeCookie('userID');
  newWindow(<LoginPage />);
}

type DropDownProps = {
    nameOfMenu: string;
    functinInput: string;
  };

async function handleDropDownFunction (e: React.MouseEvent<HTMLButtonElement>) {
    e.preventDefault();
    await removeFriendToList(_selectDropDownList);
    //update the display
    await asyncGetFriendListById();
    _setDisplay(true)
  }

  var _setDisplay:Dispatch<SetStateAction<boolean>>;
  var _selectDropDownList:string;

// const DropDownMenuRemoveFriend: React.FC<DropDownProps> = ({nameOfMenu}: DropDownProps): JSX.Element =>  {
function DropDownMenuRemoveFriend({nameOfMenu}: DropDownProps) {
    //remove a funciton to this list that needs to remove the string to the list.

    const [display, setDisplay] = useState(true)
    _setDisplay = setDisplay
    if (display === true){
      //get the list trough http get request
      asyncGetFriendListById();
      _setDisplay(false)
    }

    const friendList = () => {
      return list_;
    };

    const [showDropDown, setShowDropDown] = useState<boolean>(false);
    /**
     * when clicking on the drop down menu
     */
    async function asyncToggleDropDown() {
      await asyncGetFriendListById()
      setShowDropDown(!showDropDown);
    }

    const dismissHandler = (event: React.FocusEvent<HTMLButtonElement>): void => {
      if (event.currentTarget === event.target) {
        setShowDropDown(false);
      }
    };

    const [selectDropDownList, setselectFriendList] = useState<string>("");
    _selectDropDownList = selectDropDownList
    const friendListSelection = (friend: string): void => {
      setselectFriendList(friend);
    };

    return (
      <div>
          <button className={showDropDown ? "active" : undefined}
          onClick={asyncToggleDropDown}
          onBlur={(e: React.FocusEvent<HTMLButtonElement>): void =>
            dismissHandler(e)
          }>
        <div>{_selectDropDownList ? "Submit to " + nameOfMenu +": " + _selectDropDownList : "Submit to " + nameOfMenu +": "} </div>
        {showDropDown && (
          <DropDown
            list={friendList()}
            showDropDown={false}
            toggleDropDown={asyncToggleDropDown}
            friendSelection={friendListSelection}
          />
        )}
      </button>
        <button type="submit" onClick={handleDropDownFunction}>
        <div>{_selectDropDownList ? "Remove" : ""} </div>
        </button>
      </div>
    )
}

export default DropDownMenuRemoveFriend;