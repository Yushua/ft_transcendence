import React, { useState } from 'react';
import { getCookie, removeCookie, setCookie } from 'typescript-cookie';
import { newWindow } from '../App';
import '../App.css';
import LoginPage from '../Login/LoginPage';
import UserProfilePage from '../UserProfile/UserProfile';
import HTTP from '../Utils/HTTP';
import { tmp } from './TwoFactorLoginPage';

var _setDisplay: React.Dispatch<React.SetStateAction<boolean>>

function TWTCheckPage(){
  //to check if your accessToken is already valid
  const [Display, setDisplay] = useState<boolean>(false);
  _setDisplay = setDisplay
  if (Display == false){ tmp() }
  //if turned tue, then you need to get the input ready
  if (Display == true){
    alert("insert code now")
    newWindow(<LoginPage/>)
  }
  return (
    <div className="TWTCheckPage">
    </div>
  );
}

export default TWTCheckPage;
