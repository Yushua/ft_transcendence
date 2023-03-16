import React, { useState } from 'react';
import '../App.css';

import { newWindow } from '../App';
import UserProfilePage from '../UserProfile/UserProfile';
import NewAccount from './NewAccount';
import { getCookie, getCookies, removeCookie, setCookie } from 'typescript-cookie';

async function checkAuthentication(){
}

const submitNewAccount = () => {
  newWindow(<NewAccount/>)
}

const loginIntoOAuth = () => {
  //means you can normally log in, jsut need ot check if it works. so log in
}

function LoginPage(){

  if (getCookie("authToken") != undefined){
    checkAuthentication()
  }

  return (
    <div className="LoginpageV2">
       <button onClick={() => {submitNewAccount()}}>new account</button>
       <button onClick={() => {loginIntoOAuth()}}> Login</button>
    </div>
  );
}

export default LoginPage;
