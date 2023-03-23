import React, { useState } from 'react';
import { removeCookie } from 'typescript-cookie';
import { newWindow } from '../../App';
import LoginPage from '../../Login/LoginPage';

export function logoutButtonRefresh() {
  alert("logging out now")
  removeCookie('accessToken');
  //the session still remembers that you logged in and will automaticly log you back in. this should NOT happen
  //you should reinstate your login AGAIN after your Login
  newWindow(<LoginPage />);
}

function LogoutButtonComponent() {
    return (
      <button onClick={() => {logoutButtonRefresh()}}>logout</button>
    )
}

export default LogoutButtonComponent;