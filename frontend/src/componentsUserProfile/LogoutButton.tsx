import React, { useState } from 'react';
import { removeCookie } from 'typescript-cookie';
import { newWindow } from '../App';
import LoginPage from '../Login';

export function logoutButtonRefresh() {
  removeCookie('accessToken');
  removeCookie('userID');
  newWindow(<LoginPage />);
}

function LogoutButtonComponent() {
    return (
            <button onClick={() => {logoutButtonRefresh()}}>logout</button>
    )
}

export default LogoutButtonComponent;