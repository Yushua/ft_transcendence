import React, { useState } from 'react';
import { removeCookie } from 'typescript-cookie';
import { newWindow } from '../../App';
import LoginPage from '../../Login/LoginPage';
import TWTCheckPage from '../../TwoFactorSystem/TWTCheckPage';
import SearchBarFriend from '../Search bar/SearchbarFriend';

export function ButtonRefresh() {
  newWindow(<SearchBarFriend/>)
}

function FriendListSearchButtonComponent() {
    return (
      <button onClick={() => {ButtonRefresh()}}>Friendlist</button>
    )
}

export default FriendListSearchButtonComponent;