import React, { useState } from 'react';
import { getCookie, getCookies, removeCookie } from 'typescript-cookie';
import { newWindow } from '../App';
import LoginPage from '../Login';
import { YourFormElement } from '../userProfile';
import DropDown from './FriendListDropDown';

async function addFriendToList(usernameFriend: string) {
  var inputString:string = 'http://localhost:4242/user-profile/status/' + getCookies().userID + '/' + usernameFriend;
  console.log("add friend");
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
    
    console.log('result is: ', JSON.stringify(result, null, 4));

    // cookie
    return result;
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
    listOfFriends: string[];
    functinInput: string;
  };

const handleDropDownFunction = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    console.log("hey");
    console.log(_functinInput);
    switch (_functinInput) {
      case "friendList": addFriendToList(_selectDropDownList);
    }
    console.log("done");
    _selectDropDownList = "";
  }

  var _functinInput:string = "";
  var _selectDropDownList:string;
const DropDownMenu: React.FC<DropDownProps> = ({nameOfMenu, listOfFriends, functinInput}: DropDownProps): JSX.Element =>  {
    //drop down menu
    _functinInput = functinInput;
    const [showDropDown, setShowDropDown] = useState<boolean>(false);
    const [selectDropDownList, setselectFriendList] = useState<string>("");
    const [selectsubmit, setselectSubmit] = useState<string>("");
    _selectDropDownList = selectDropDownList

    const [display, setDisplay] = useState<string>("")
    const friendList = () => {
      return listOfFriends;
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
      setselectSubmit("submit")
    };
    //add a funciton to this list that needs to add the string to the list.
    return (
        <div>
        <button className={showDropDown ? "active" : undefined}
          onClick={(): void => toggleDropDown()}
          onBlur={(e: React.FocusEvent<HTMLButtonElement>): void =>
            dismissHandler(e)
          }>
        <div>{_selectDropDownList ? "Submit to " + nameOfMenu +": " + _selectDropDownList : "Submit to " + nameOfMenu +": "} </div>
        {showDropDown && (
          <DropDown
            friendList={friendList()}
            showDropDown={false}
            toggleDropDown={(): void => toggleDropDown()}
            friendSelection={friendListSelection}
          />
        )}
      </button>
        <button type="submit" onClick={handleDropDownFunction}>
        <div>{selectsubmit ? "Submit" : "choose friend"} </div>
        </button>
      </div>
    )
}

export default DropDownMenu;