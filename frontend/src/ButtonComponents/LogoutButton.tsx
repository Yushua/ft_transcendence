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

export function logoutButtonRefresh() {
  alert("logging out now")
  removeCookie('accessToken');
  User.Clear();
  ChatUser.Clear();
  ChatRoom.Clear();
  //the session still remembers that you logged in and will automaticly log you back in. this should NOT happen
  //you should reinstate your login AGAIN after your Login
  newWindow(<LoginPage/>);
}

function LogoutButtonComponent() {
  useEffect(() => {
		if (getCookie(`oAth${User.intraname}`) != undefined && getCookie(`oAth${User.intraname}`) != null){
			OathLogout()
		}
    else {
      logoutButtonRefresh()
    }
	}, []); // empty dependency array means it will only run once

    return (
      <div>

      </div>
    )
}

export default LogoutButtonComponent;
