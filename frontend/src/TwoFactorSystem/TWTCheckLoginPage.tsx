import React, { useState } from 'react';
import { getCookie, removeCookie, setCookie} from 'typescript-cookie';
import { newWindow } from '../App';
import '../App.css';
import UserProfilePage from '../UserProfile/UserProfile';
import HTTP from '../Utils/HTTP';
import TurnTWTOn from './TurnTWTOn';
import TurnTWTOnLoginPage from './TurnTWTOnLoginPage';
import { useNavigate } from "react-router-dom";

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
  try {
    const response = HTTP.Get(`auth/checkStatusTWT/${getCookie('TWToken')}`, null, {Accept: 'application/json'})
    var result = await JSON.parse(response)
    console.log("TWT token status " + result["status"])
    return await result["status"]
  } catch (error) {
    alert(`${error}, Token is out of date Loginpage`)
    removeCookie('TWToken');
    newWindow(<TWTCheckLoginPage/>)
  }
  return false
}

export async function asyncGetUserStatus():Promise<boolean> {
  try {
    const response = HTTP.Get(`auth/checkUserTWTStatus`, null, {Accept: 'application/json'})
    var result = await JSON.parse(response)
      console.log(` user status twt {${await result["status"]}}`)
      if (result["status"] == false){
        alert("TWT is OFF refresh")
        await newWindow(<UserProfilePage/>)
      }
      return await result["status"]
  } catch (error) {
    alert(`${error}, Token is out of date Loginpage`)
    removeCookie('TWToken');
    newWindow(<TWTCheckLoginPage/>)
  }
  return false
}

var _setDisplay: React.Dispatch<React.SetStateAction<boolean>>

async function tmp(){
  alert("i am refreshing in TWT")
  if (getCookie('TWToken') == null || getCookie('TWToken') == undefined){
    alert("undefined TWT")
    await setLoginTWT()
  }
  const statusUser:boolean = await asyncGetUserStatus()
  if (statusUser == true){
    alert("TWT is ONN refresh")
    const statusTWT:boolean = await asyncGetTWTStatus()
    if (statusTWT == true){
      alert(`TWT is already on, go to userProfile`)
      newWindow(<UserProfilePage/>)
    }
    else {
      _setDisplay(true)
    }
  }
}

function TWTCheckLoginPage(){
  //to check if your accessToken is already valid
  alert("checking TWT token\n in it")
  //remove code=
  const [Display, setDisplay] = useState<boolean>(false);
  _setDisplay = setDisplay
  if (Display == false){ tmp() }
  else {
    <TurnTWTOnLoginPage/>
  }
  alert(" it is on, and not yet enabled")
  return (
    <div className="TWTEnabled">
      logging into your two factor
    </div>
  );
}

export default TWTCheckLoginPage;
