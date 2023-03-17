import React, { useState } from 'react';
import '../App.css';

import { newWindow } from '../App';
import NewAccount from './NewAccount';
import { getCookie } from 'typescript-cookie';
import LoginHandlerOAuth from './LoginHandlerOAuth';
import HTTP from '../Utils/HTTP';

async function checkAuthentication(){
  try {
    const response = await fetch(HTTP.HostRedirect() + `auth/check` , {
      headers: {
        Accept: 'application/json',
        Authentication: `Bearer ${getCookie("authToken")}`,
      },
    })
    if (!response.ok) {
      throw new Error(`Error! status: ${response.status}`);
    }
  
  } catch (error) {
    alert(`authentication code invalid ${error}`)
    // newWindow(<NewAccount/>)
  }
  console.log("check token if it can be passed already")
}

const submitNewAccount = () => {
  //when you want to make a new account
  newWindow(<NewAccount/>)
}

const loginNormal = () => {
  //when you want to login when you haven't
  newWindow(<LoginHandlerOAuth/>)
}

function LoginPage(){

  if (getCookie("authToken") != undefined){
    //when you can login because you have an authenToken Cookie
    checkAuthentication()
  }
  return (
    <div className="LoginpageV2">
       <button onClick={() => {submitNewAccount()}}>new account</button>
       <button onClick={() => {loginNormal()}}> Login</button>
    </div>
  );
}

export default LoginPage;
