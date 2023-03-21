import React, { useState } from 'react';
import { removeCookie } from 'typescript-cookie';
import { newWindow } from '../App';
import LoginPage from '../Login/LoginPage';
import TWTCheckPage from '../TwoFactorSystem/TWTCheckPage';
import UserProfilePage from './UserProfile';

export function ButtonRefresh() {
  removeCookie('accessToken');
  newWindow(<UserProfilePage/>);
}

function UserProfileComponentt() {
    return (
      <button onClick={() => {ButtonRefresh()}}>UserProfile</button>
    )
}

export default UserProfileComponentt;