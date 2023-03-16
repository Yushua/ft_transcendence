import React, { useState } from 'react';
import '../App.css';

import { newWindow } from '../App';
import UserProfilePage from '../UserProfile/UserProfile';
import NewAccount from './NewAccount';
import { getCookie, getCookies, removeCookie, setCookie } from 'typescript-cookie';
import LoginHandlerOAuth from './LoginHandlerOAuth';

async function checkAuthentication(){
  console.log("check token if it can be passed already")
}

const submitNewAccount = () => {
  newWindow(<NewAccount/>)
}

const loginNormal = () => {
  newWindow(<LoginHandlerOAuth/>)
}

const loginIntoOAuth = () => {
  window.location.replace('https://api.intra.42.fr/oauth/authorize?client_id=u-s4t2ud-c73b865f02b3cf14638e1a50c5caa720828d13082db6ab753bdb24ca476e1a4c&redirect_uri=http%3A%2F%2Flocalhost%3A4242%2F&response_type=code');
}

function LoginPage(){

  if (getCookie("authToken") != undefined){
    checkAuthentication()
  }
  if (window.location.href.split('code=')[1] == undefined){
    loginIntoOAuth()
  }
  return (
    <div className="LoginpageV2">
       <button onClick={() => {submitNewAccount()}}>new account</button>
       <button onClick={() => {loginIntoOAuth()}}> Login</button>
    </div>
  );
}

export default LoginPage;
