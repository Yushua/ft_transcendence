import React, { Dispatch, SetStateAction, useState } from 'react';
import { getCookie } from 'typescript-cookie';
import DropDown from './FriendListDropDown';
import HTTP from '../Utils/HTTP'

var friendID:string = "";

async function asyncReturnID(usernameFriend: string) {
  const response = HTTP.Get(`user-profile/returnID/${usernameFriend}`, null, {Accept: 'application/json'})
  var result = await JSON.parse(response)
  friendID = result.id;
}

//add the ID to the list
async function addFriendToList(_friendID: string) {
  HTTP.Patch(`user-profile/friendlist/add/${getCookie('userID')}/${_friendID}`, null, {Accept: 'application/json'})
}

var list_:string[];
export async function asyncGetFriendListById(){
  const response = HTTP.Get(`user-profile/user`, null, {Accept: 'application/json'})
  var result = await JSON.parse(response)
  list_ = result
}

async function handleDropDownFunction(e: React.MouseEvent<HTMLButtonElement>){
    e.preventDefault();
    await asyncReturnID(_selectDropDownList);
    await addFriendToList(friendID);
    _setDisplay(true)
  }

  var _selectDropDownList:string;
  
  var _setDisplay:Dispatch<SetStateAction<boolean>>;
  
function DropDownMenuAddFriend({}) {
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