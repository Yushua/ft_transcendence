import React, { useState } from 'react';
import { removeCookie } from 'typescript-cookie';
import { newWindow } from '../../App';
import UserProfilePage from '../UserProfile';

export function ButtonRefresh() {
  newWindow(<UserProfilePage/>);
}

function UserProfileComponent() {
    return (
      <button onClick={() => {ButtonRefresh()}}>UserProfile</button>
    )
}

export default UserProfileComponent;