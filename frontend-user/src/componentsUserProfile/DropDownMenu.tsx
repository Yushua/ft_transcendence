import React, { useState } from 'react';
import { removeCookie } from 'typescript-cookie';
import { newWindow } from '../App';
import LoginPage from '../Login';
import DropDown from './FriendListDropDown';

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


const DropDownMenu: React.FC<DropDownProps> = ({nameOfMenu, listOfFriends, functinInput}: DropDownProps): JSX.Element =>  {
    const [Display, setDisplay] = useState<string>("")
    //drop down menu
    const [showDropDown, setShowDropDown] = useState<boolean>(false);
    const [selectDropDownList, setselectFriendList] = useState<string>("");
    const [selectsubmit, setselectSubmit] = useState<string>("");
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
        <div>{selectDropDownList ? "Submit to " + nameOfMenu +": " + selectDropDownList : "Submit to " + nameOfMenu +": "} </div>
        {showDropDown && (
          <DropDown
            friendList={friendList()}
            showDropDown={false}
            toggleDropDown={(): void => toggleDropDown()}
            friendSelection={friendListSelection}
          />
        )}
      </button>
      <button type="submit">
      <div>{selectsubmit ? "Submit" : "choose friend"} </div>
      </button>
      </div>
    )
}

export default DropDownMenu;