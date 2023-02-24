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
  };

const DropDownMenu: React.FC<DropDownProps> = ({nameOfMenu, listOfFriends}: DropDownProps): JSX.Element =>  {
    const [Display, setDisplay] = useState<string>("")
    //drop down menu
    const [showDropDown, setShowDropDown] = useState<boolean>(false);
    const [selectFriendList, setselectFriendList] = useState<string>("");

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
    };
    return (
        <div>
        <button className={showDropDown ? "active" : undefined}
          onClick={(): void => toggleDropDown()}
          onBlur={(e: React.FocusEvent<HTMLButtonElement>): void =>
            dismissHandler(e)
          }>
        <div>{selectFriendList ? nameOfMenu + ": " + selectFriendList : nameOfMenu} </div>
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
    )
}

export default DropDownMenu;