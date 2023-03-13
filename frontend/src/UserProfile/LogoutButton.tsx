import React, { useState } from 'react';
import { removeCookie } from 'typescript-cookie';
import { newWindow } from '../App';
import LoginPage from '../Login/Login';
import ChatRoom from '../Utils/Cache/ChatRoom';
import User from '../Utils/Cache/User';
import ChatUser from '../Utils/Cache/ChatUser';

export function logoutButtonRefresh() {
  removeCookie('accessToken');
  User.Clear();
  ChatUser.Clear();
  ChatRoom.Clear();
  newWindow(<LoginPage />);
}

function LogoutButtonComponent() {
    return (
      <button onClick={() => {logoutButtonRefresh()}}>logout</button>
    )
}

export default LogoutButtonComponent;
