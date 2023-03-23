import {  } from 'q';
import React, { Dispatch, SetStateAction, useState } from 'react';
import NameStorage from '../../Utils/Cache/NameStorage';
import DropDown from './FriendListDropDown';
import HTTP from '../../Utils/HTTP'

var list_:string[];

async function asyncReturnID(usernameFriend: string) {
  const response = HTTP.Get(`user-profile/returnID/${usernameFriend}`, null, {Accept: 'application/json'})
  var result = await JSON.parse(response)
  friendID = await result["id"];
}

async function removeFriendToList(usernameRemove: string) {
  HTTP.Patch(`user-profile/friendlist/remove/${usernameRemove}`, null, {Accept: 'application/json'})
}

export async function asyncGetFriendListById(){
  const response = HTTP.Get(`user-profile/userFriendListID`, null, {Accept: 'application/json'})
  var result = await JSON.parse(response)
  list_ =  result.friendList.map((userID: string) => NameStorage.User.Get(userID));
}

var friendID:string = "";
async function handleDropDownFunction (e: React.MouseEvent<HTMLButtonElement>) {
    e.preventDefault();
    await asyncReturnID(_selectDropDownList);
    await removeFriendToList(friendID);
    _setDisplay(true)
  }

  var _setDisplay:Dispatch<SetStateAction<boolean>>;
  var _selectDropDownList:string;

function DropDownMenuRemoveFriend({}) {
    const [display, setDisplay] = useState(true)
    _setDisplay = setDisplay
    if (display === true){
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
        <div>{_selectDropDownList ? "Remove " : "Remove "} </div>
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
        <div>{_selectDropDownList ? "Remove " + _selectDropDownList : "Remove "} </div>
        </button>
      </div>
    )
}

export default DropDownMenuRemoveFriend;