import React, { } from 'react';
import { redirect } from 'react-router-dom';
import '../App.css';
import HTTP from '../Utils/HTTP';

const handleAccLogin = (e: any) => {
  e.preventDefault();
  //after this, you are logged in here
  console.log(HTTP.HostRedirect())
}

function SetupLogin(){
  return (

    <div className="Loging in">
       
    </div>
  );
}

export default SetupLogin;
