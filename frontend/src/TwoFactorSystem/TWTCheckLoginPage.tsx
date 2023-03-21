import React, { useState } from 'react';
import { getCookie, removeCookie} from 'typescript-cookie';
import { newWindow } from '../App';
import '../App.css';
import UserProfilePage from '../UserProfile/UserProfile';
import HTTP from '../Utils/HTTP';
import TurnTWTOn from './TurnTWTOn';

export async function asyncGetTWTStatus():Promise<boolean> {
  try {
    const response = HTTP.Get(`auth/checkStatusTWT/${getCookie('TWToken')}`, null, {Accept: 'application/json'})
    var result = await JSON.parse(response)
    if (await result["status"] == true){
      return false
    }
    else
      return true
  } catch (error) {
    alert(`${error}, Token is out of date`)
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
