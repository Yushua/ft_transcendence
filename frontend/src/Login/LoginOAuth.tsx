import React, { } from 'react';
import '../App.css';
import { getCookies, removeCookie, setCookie } from 'typescript-cookie'

import { newWindow } from '../App';
import MainWindow from '../MainWindow/MainWindow';
import User from '../Utils/Cache/User';
import HTTP from '../Utils/HTTP';

async function AccCreate(intraname: string, password: string){
  try {
    const response = await fetch(HTTP.HostRedirect() + 'login/signup', {
      method: 'POST',
      body: `intraname=${intraname}&password=${password}`,
      headers: {
        Accept: 'application/json',
        'Content-Type': "application/x-www-form-urlencoded",
      },
    })
    
    if (!response.ok) {
      alert(`Error! status: ${(await response.json()).message}`)
      throw new Error(`Error! status: ${(await response.json()).message}`);
    }
    const result = (await response.json())
    
    console.log('result is: ', JSON.stringify(result, null, 4));
    return result;
  }
  catch (e: any) {
    alert(e)
    console.log(e)
  }
}

//when account created, returns the token that I need to use
async function Acclogin(intraname: string, password: string) {
  try {
    // 👇️ const response: Response
    const response = await fetch(HTTP.HostRedirect() + 'login/signin', {
      method: 'POST',
      body: `intraname=${intraname}&password=${password}`,
      headers: {
        Accept: 'application/json',
        'Content-Type': "application/x-www-form-urlencoded",
      },
    })
    if (!response.ok) {
      alert(`Error! status: ${(await response.json()).message}`)
    }
    
    const result = (await response.json())
    
    console.log('result is: ', JSON.stringify(result, null, 4));
    var accessToken: string = result["accessToken"];
    console.log('keycode: ', accessToken);
    removeCookie('accessToken');
    setCookie('accessToken', accessToken,{ expires: 1 });

    
    // Robin's changes
    await User.asyncUpdate(result["userID"])
    newWindow(<MainWindow/>)
    //
    
    return result;
  }
  catch (e: any) {
    alert(e)
  }
}

interface FormElements extends HTMLFormControlsCollection {
  intraname: HTMLInputElement
  password: HTMLInputElement
}

interface YourFormElement extends HTMLFormElement {
 readonly elements: FormElements
}

const handleAccLogin = (e: React.FormEvent<YourFormElement>) => {
  e.preventDefault();
  console.log("hello")
  console.log(`${ e.currentTarget.elements.password.value} ${e.currentTarget.elements.intraname.value}`)
  /*
    check if the person is already logged in
    send to userProfile
  */
 
 /*
    check the qauth
    if account is not created
      AccCreate(e.currentTarget.elements.intraname.value,
      e.currentTarget.elements.password.value);
    if the user DOES NOT HAVE AN EMAIL.. or the AUTHENTICATION CODE IS OUT OF DATE
      let him habve the login function
      //problem... what if two acounts are created at the same time?
    login
      Acclogin(e.currentTarget.elements.intraname.value,
        e.currentTarget.elements.password.value);
 */
}

const OAuthLoginPage: React.FC = () => {

  const [shown, setShown] = React.useState(false);

  return (

    <div className="LoginPage">
       <span className="heading">
          </span>
          <form onSubmit={( handleAccLogin)}>
          <div>
            <label htmlFor="intraname">intraname:</label>
            <input id="intraname" type="text" />
            <label htmlFor="password">Password:</label>
            <input id="password" type={shown ? "text" : "password"} />
          </div>
            <button type="submit">Submit</button>
          </form>
    </div>
  );
}

export default OAuthLoginPage;
