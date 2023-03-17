import React, { } from 'react';
import '../App.css';

import { newWindow } from '../App';
import HTTP from '../Utils/HTTP';
import { removeCookie, setCookie } from 'typescript-cookie';
import LoginPage from './LoginPage';

async function getAccessToken(username:string){
  var code:string = window.location.href.split('code=')[1]
  console.log("i am in loginpage")
  try {
    const response = await fetch(HTTP.HostRedirect() + `auth/loginNew/${code}/${username}` , {
      headers: {
        Accept: 'application/json',
      },
    })
    console.log("still in")
    if (!response.ok) {
      throw new Error(`Error! status: ${response.status}`);
    }
    console.log("i am out")
    var result = await response.json();
    var accessToken:string = result["accessToken"]
    if (accessToken == undefined || accessToken == ""){
      alert("access to changing the eMail errored. check back at OAuth")
      //if failed, delete account
      window.location.replace('http://localhost:4242/');
    }
    else{
      removeCookie("accessToken")
      removeCookie('code');
      setCookie('accessToken', accessToken,{ expires: 10000 });
      console.log("created account succesfull")
      newWindow(<LoginPage/>)
    }
  } catch (error) {
    console.log(`error ${error}`)
    alert(`error in newAccount ${error}`)
    window.location.replace('http://localhost:4242/');
  }
}

interface FormElements extends HTMLFormControlsCollection {
  eMail: HTMLInputElement
  username: HTMLInputElement
}

interface YourFormElement extends HTMLFormElement {
 readonly elements: FormElements
}

const handleUsername = (e: any) => {
  e.preventDefault();
  getAccessToken(e.currentTarget.elements.username.value)
}

const ReturnToLoginPage = () => {
  newWindow(<LoginPage/>)
}

function NewAccount(){
  if (window.location.href.split('code=')[1] == undefined){
    newWindow(<LoginPage/>)
  }
  return (
    <div className="setting up new account for Team Zero">
      <button onClick={() => {ReturnToLoginPage()}}>Return to LoginPage</button>
        <form onSubmit={(handleUsername)}>
          <div>
            <label htmlFor="username">Username:</label>
            <input id="username" type="text" />
          </div>
        </form>
    </div>
  );
}

export default NewAccount;
