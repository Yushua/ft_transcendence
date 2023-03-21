import React, { useState } from 'react';
import { getCookie, removeCookie, setCookie } from 'typescript-cookie';
import { newWindow } from '../App';
import '../App.css';
import LoginPage from '../Login/LoginPage';
import { asyncGetTWTStatus} from './TwoFactorLoginPage';
import TWTDisabled from './TWTDisabled';
import TWTEnabled from './TWTEnabled';

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
