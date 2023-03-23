import React, { useState } from 'react';
import { getCookie, removeCookie, setCookie} from 'typescript-cookie';
import { newWindow } from '../App';
import '../App.css';
import UserProfilePage from '../UserProfile/UserProfile';
import HTTP from '../Utils/HTTP';
import TWTDisabled from './TWTDisabled';
import TWTEnabled from './TWTEnabled';

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
    if (TWToken === undefined){
      removeCookie('TWToken');
    }
    if (TWToken === undefined){
      console.log("TWT is UNdefined in LOGINPAGE check")
      window.location.replace(HTTP.HostRedirect());
    }
    else {
      console.log("it is turned on")
      removeCookie('TWToken');
      setCookie('TWToken', TWToken,{ expires: 10000 });
      newWindow(<UserProfilePage/>)
    }
  } catch (error) {
    console.log(`error ${error}`)
    removeCookie("accessToken")
    //logout of the system
    window.location.replace(HTTP.HostRedirect());
    HTTP.HostRedirect()
  }
}

export async function asyncGetTWTStatus():Promise<boolean> {
  if (getCookie('TWToken') === null || getCookie('TWToken') === undefined){
    await setLoginTWT()
  }
  try {
    const response = HTTP.Get(`auth/checkStatusTWT/${getCookie('TWToken')}`, null, {Accept: 'application/json'})
    var result = await JSON.parse(response)
    return await result["status"];
  } catch (error) {
    alert(`${error}, Token is out of date CheckPage`)
    removeCookie('TWToken');
    newWindow(<UserProfilePage/>)
  }
  return false
}

export async function asyncGetTWTUserStatus():Promise<boolean> {
  try {
    const response = HTTP.Get(`auth/checkUserTWTStatus`, null, {Accept: 'application/json'})
    var result = await JSON.parse(response)
    console.log(`result of UserTWT ${await result["status"]}`)
    return await result["status"];
  } catch (error) {
    alert(`${error}, Token is out of date CheckPage`)
    removeCookie('TWToken');
    newWindow(<UserProfilePage/>)
  }
  return false
}

var _setDisplay: React.Dispatch<React.SetStateAction<boolean>>

async function tmp(){
  if (await asyncGetTWTUserStatus() === true){
    _setDisplay(true)
  }
  else {
    return false
  }
}

function TWTCheckPage(){
  //to check if your accessToken is already valid
  const [Display, setDisplay] = useState<boolean>(false);
  _setDisplay = setDisplay
  if (Display === false){ tmp() }
  console.log(`display == ${Display}`)
  //if off, then turn it on, if on, turn it off
  return (
    <div className="TWTCheckPage">
      {Display ? <>{newWindow(<TWTDisabled/>)}</> : <>{newWindow(<TWTEnabled/>)}</>}
    </div>
  );
}

export default TWTCheckPage;
