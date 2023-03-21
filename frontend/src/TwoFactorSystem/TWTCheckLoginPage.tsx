import React, { useState } from 'react';
import { getCookie, removeCookie, setCookie} from 'typescript-cookie';
import { newWindow } from '../App';
import '../App.css';
import UserProfilePage from '../UserProfile/UserProfile';
import HTTP from '../Utils/HTTP';
import TurnTWTOn from './TurnTWTOn';

async function setLoginTWT(){
  try {
    const response = await fetch(HTTP.HostRedirect() + `auth/makeNewTWT` , {
      headers: {
        Accept: 'application/json',
        'Authorization': 'Bearer ' + getCookie("accessToken"),
      },
    })
    if (!response.ok) {
      throw new Error(`Error! status: ${response.status}`);
    }
    var result = await response.json();
    var TWToken:string = result["TWToken"]
    console.log(`newcode == {${TWToken}}`)
    if (TWToken == undefined){
      removeCookie('TWToken');
      console.log("TWT is UNdefined in LOGINPAGE check")
      window.location.replace(HTTP.HostRedirect());
    }
    else {
      removeCookie('TWToken');
      setCookie('TWToken', TWToken,{ expires: 10000 });
      return 
    }
  } catch (error) {
    console.log(`error ${error}`)
    removeCookie("accessToken")
    //logout of the system
    window.location.replace(HTTP.HostRedirect());
    HTTP.HostRedirect()
  }
}

/**
 * check the TWT token status. if coming in ehre, first check if the User has TWT on
 * @returns 
 */
export async function asyncGetTWTStatus():Promise<boolean> {
  console.log("LoginTOken new")
  try {
    const response = HTTP.Get(`auth/checkStatusTWT/${getCookie('TWToken')}`, null, {Accept: 'application/json'})
    var result = await JSON.parse(response)
    if (await result["status"] == true){
      return false
    }
    else
      return true
  } catch (error) {
    alert(`${error}, Token is out of date Loginpage`)
    removeCookie('TWToken');
    newWindow(<TWTCheckLoginPage/>)
  }
  return false
}

export async function asyncGetUserStatus():Promise<boolean> {
  console.log("LoginTOken new")
  try {
    const response = HTTP.Get(`auth/checkUserTWTStatus`, null, {Accept: 'application/json'})
    var result = await JSON.parse(response)
    if (await result["status"] == false){
      return false
    }
    else
      return true
  } catch (error) {
    alert(`${error}, Token is out of date Loginpage`)
    removeCookie('TWToken');
    newWindow(<TWTCheckLoginPage/>)
  }
  return false
}

var _setDisplay: React.Dispatch<React.SetStateAction<boolean>>

async function tmp(){
  if (await asyncGetUserStatus() == false){
    newWindow(<UserProfilePage/>)
  }
  console.log(`code TWT {${getCookie('TWToken')}}`)
  if (getCookie('TWToken') == null || getCookie('TWToken') == undefined){
    await setLoginTWT()
  }
  if (await asyncGetTWTStatus()== true){
    _setDisplay(true)
  }
  else {
    newWindow(<UserProfilePage/>)
  }
}

function TWTCheckLoginPage(){
  //to check if your accessToken is already valid
  const [Display, setDisplay] = useState<boolean>(false);
  _setDisplay = setDisplay
  if (Display == false){ tmp() }
  return (
    <div className="TWTEnabled">
      <TurnTWTOn/>
    </div>
  );
}

export default TWTCheckLoginPage;
