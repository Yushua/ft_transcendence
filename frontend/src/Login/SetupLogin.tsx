import React, { } from 'react';
import { redirect } from 'react-router-dom';
import '../App.css';
import HTTP from '../Utils/HTTP';

const handleAccLogin = (e: any) => {
  e.preventDefault();
  redirect(`http://localhost:4242/auth/login`)
  //after this, you are logged in here
  console.log(HTTP.HostRedirect())
}

function SetupLogin(){
  return (

    <div className="LoginPage">
       <span className="heading">
          </span>
          <form onSubmit={( handleAccLogin)}>
          <button type="submit">Start Intra login</button>
          </form>
    </div>
  );
}

export default SetupLogin;
