import React, { useState } from 'react';
import { removeCookie } from 'typescript-cookie';
import { newWindow } from '../../App';
import LoginPage from '../../Login/LoginPage';
import TWTCheckPage from '../../TwoFactorSystem/TWTCheckPage';
import UserProfilePage from '../UserProfile';

export function ButtonRefresh() {
  newWindow(<UserProfilePage/>);
}

function UserProfileButtonComponent() {
    return (
      <button onClick={() => {ButtonRefresh()}}>Userprofile</button>
    )
}

export default UserProfileButtonComponent;