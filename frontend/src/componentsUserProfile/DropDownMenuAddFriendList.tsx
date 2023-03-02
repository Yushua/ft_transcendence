import React, { Dispatch, SetStateAction, useState } from 'react';
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
    return result;
  }
  catch (e: any) {
    console.log(e)
  }
}

var list_:string[];
export async function asyncGetFriendListById(){
  var input:string = 'http://localhost:4242/user-profile/userAddList/' + getCookie('userID');
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
      list_ = await result;
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

const handleDropDownFunction = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    addFriendToList(_selectDropDownList);
    _setDisplay(true)
  }

  var _selectDropDownList:string;
  
  var _setDisplay:Dispatch<SetStateAction<boolean>>;
  
function DropDownMenuAddFriend({}) {
    //drop down menu
    const [showDropDown, setShowDropDown] = useState<boolean>(false);
    const [selectDropDownList, setselectFriendList] = useState<string>("");
    const [display, setDisplay] = useState(true)
    _selectDropDownList = selectDropDownList
    _setDisplay = setDisplay

    if (display === true){
      asyncGetFriendListById();
      _setDisplay(false)
    }

    const friendList = () => {
      // asyncGetFriendListById();
      return list_;
    };

    /**
     * when clicking on the dropdown menu
     */
    async function asyncToggleDropDown(){
      await asyncGetFriendListById()
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
    //add a funciton to this list that needs to add the string to the list.
    return (
        <div>
        <button className={showDropDown ? "active" : undefined}
          onClick={asyncToggleDropDown}
          onBlur={(e: React.FocusEvent<HTMLButtonElement>): void =>
            dismissHandler(e)
          }>
        <div>{_selectDropDownList ? "add to " : "add to "} </div>
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
        <div>{_selectDropDownList ? "Add" + _selectDropDownList : "Add"} </div>
        </button>
      </div>
    )
}

export default DropDownMenuAddFriend;