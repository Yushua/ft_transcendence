import React, { useEffect, useState } from 'react';
import { getCookie, removeCookie } from 'typescript-cookie';
import { newWindow } from '../App';
import LoginPage from '../Login/LoginPage';
import ChatRoom from '../Utils/Cache/ChatRoom';
import ChatUser from '../Utils/Cache/ChatUser';
import User from '../Utils/Cache/User';
import HTTP from '../Utils/HTTP';

function OathLogout() {
  //https://www.baeldung.com/logout-spring-security-oauth
  try {
    var oathToken:string = getCookie(`oAth${User.intraname}`)
    const response = HTTP.Get(`auth/LogoutOauth/${oathToken}`, null, {Accept: 'application/json'})
    removeCookie(`oAth${User.intraname}`);
  } catch (error) {
  }
}

function LogoutButtonComponent() {
  alert("logging out now")
  removeCookie('accessToken');
  User.Clear();
  ChatUser.Clear();
  ChatRoom.Clear();
  removeCookie(`oAth${User.intraname}`);
  newWindow(<LoginPage/>);
    return (
      <div>
      </div>
    )
}

export default LogoutButtonComponent;
