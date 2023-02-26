import { async } from 'q';
import React, { useState } from 'react';
import { getCookie, getCookies, removeCookie } from 'typescript-cookie';
import { newWindow } from '../App';
import LoginPage from '../Login';
import DropDown from './FriendListDropDown';

async function addFriendToList(usernameFriend: string) {
  var inputString:string = 'http://localhost:4242/user-profile/friendlist/add/' + getCookies().userID + '/' + usernameFriend;
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

var list_:string[];
export async function asyncGetFriendListById(){
  var input:string = 'http://localhost:4242/user-profile/userList/' + getCookie('userID');
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
      console.log('result is: ', result);
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
  var _setDisplay;

const DropDownMenuAddFriend: React.FC<DropDownProps> = ({nameOfMenu, functinInput}: DropDownProps): JSX.Element =>  {
    //drop down menu
    _functinInput = functinInput;
    const [showDropDown, setShowDropDown] = useState<boolean>(false);
    const [selectDropDownList, setselectFriendList] = useState<string>("");
    const [selectsubmit, setselectSubmit] = useState<string>("");
    _selectDropDownList = selectDropDownList

    const [display, setDisplay] = useState<string>("")
    _setDisplay = setDisplay

    var newListN:string[] = [];
    if (display === ""){
      asyncGetFriendListById();
    }

    const friendList = () => {
      asyncGetFriendListById();
      return list_;
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
        <div>{selectsubmit ? "Submit" : "add"} </div>
        </button>
      </div>
    )
}

export default DropDownMenuAddFriend;