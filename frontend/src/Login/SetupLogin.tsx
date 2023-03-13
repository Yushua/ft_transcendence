import React, { } from 'react';
import { redirect } from 'react-router-dom';
import '../App.css';
import HTTP from '../Utils/HTTP';

const handleAccLogin = (e: any) => {
  e.preventDefault();
  redirect(`http://localhost:4242/auth/login`)
  //after this, you are logged in here
  console.log(HTTP.HostRedirect())
  /* d
    check if the person is already logged in
    send to userProfile
  */
 
 /*
    check the qauth
    if account is not created
       if the user DOES NOT HAVE AN EMAIL.. or the AUTHENTICATION CODE IS OUT OF DATE
      AccCreate(e.currentTarget.elements.intraname.value,
      e.currentTarget.elements.password.value);
      let him habve the login function
      //problem... what if two acounts are created at the same time?
    login
      Acclogin(e.currentTarget.elements.intraname.value,
        e.currentTarget.elements.password.value);
 */
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
