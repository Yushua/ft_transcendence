import React, { useState } from 'react';
import { getCookie, removeCookie, setCookie } from 'typescript-cookie';
import { newWindow } from '../App';
import '../App.css';
import LoginPage from '../Login/LoginPage';
import UserProfilePage from '../UserProfile/UserProfile';
import HTTP from '../Utils/HTTP';
import { asyncGetTWTStatus} from './TwoFactorLoginPage';

function TWTDisabled(){
  const [Display, setDisplay] = useState<boolean>(false);
  
  return (
    <div className="TWTDisabled">
    </div>
  );
}

export default TWTDisabled;
