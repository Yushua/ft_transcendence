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
    const response = await fetch(HTTP.HostRedirect() + `auth/loginUserTWT` , {
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
    if (TWToken == undefined){
      removeCookie('TWToken');
    }
    if (TWToken == undefined){
      console.log("TWT is UNdefined in LOGINPAGE check")
      window.location.replace(HTTP.HostRedirect());
    }
    else {
      removeCookie('TWToken');
      setCookie('TWToken', TWToken,{ expires: 10000 });
      newWindow(<TWTCheckPage/>)
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
  if (getCookie('TWToken') == null || getCookie('TWToken') == undefined){
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

var _setDisplay: React.Dispatch<React.SetStateAction<boolean>>

async function tmp(){
  if (await asyncGetTWTStatus()== true){
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
  if (Display == false){ tmp() }
  return (
    <div className="TWTCheckPage">
      {Display ? <>{newWindow(<TWTEnabled/>)}</> : <>{newWindow(<TWTDisabled/>)}</>}
    </div>
  );
}

export default TWTCheckPage;
