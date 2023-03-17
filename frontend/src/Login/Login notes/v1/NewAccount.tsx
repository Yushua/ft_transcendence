import React, { useState } from 'react';
import '../App.css';

import { getCookie, removeCookie, setCookie } from 'typescript-cookie';
import LoginPage from './LoginPage';
import HTTP from '../../../Utils/HTTP';
import { newWindow } from '../../../App';

async function getAccessToken(username:string){
  var code:string | undefined = getCookie('code');
  removeCookie('code');
  try {
    const response = await fetch(HTTP.HostRedirect() + `auth/loginNew/${code}/${username}` , {
      headers: {
        Accept: 'application/json',
      },
    })
    if (!response.ok) {
      throw new Error(`Error! status: ${response.status}`);
    }
    var result = await response.json();
    var accessToken:string = result["accessToken"]
    if (accessToken == undefined || accessToken == ""){
      alert("JWT authorization failed, returned nothing")
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
    //failed so try again
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

const loginIntoOAuth = () => {
  console.log("i am here")
  window.location.replace('https://api.intra.42.fr/oauth/authorize?client_id=u-s4t2ud-c73b865f02b3cf14638e1a50c5caa720828d13082db6ab753bdb24ca476e1a4c&redirect_uri=http%3A%2F%2Flocalhost%3A4242%2F&response_type=code');
}

var _setDisplay:React.Dispatch<React.SetStateAction<boolean>>

function NewAccount(){
  const [Display, setDisplay] = useState<boolean>(false);
  _setDisplay = setDisplay;

  //when it gets in here for the first time. make sure to set it redo the 
  if (window.location.href.split('code=')[1] != undefined && Display == false){
    
  }
  //if the code is undefined, then run
  if (window.location.href.split('code=')[1] == undefined){
    loginIntoOAuth()
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
