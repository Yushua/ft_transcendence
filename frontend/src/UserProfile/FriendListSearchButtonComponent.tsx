import React, { useState } from 'react';
import { removeCookie } from 'typescript-cookie';
import { newWindow } from '../App';
import LoginPage from '../Login/LoginPage';
import TWTCheckPage from '../TwoFactorSystem/TWTCheckPage';
import SearchBarFriend from './SearchbarFriend';

export function ButtonRefresh() {
  newWindow(<SearchBarFriend/>)
}

function FriendListSearchButtonComponent() {
    return (
      <button onClick={() => {ButtonRefresh()}}>TwoFactor</button>
    )
}

export default FriendListSearchButtonComponent;