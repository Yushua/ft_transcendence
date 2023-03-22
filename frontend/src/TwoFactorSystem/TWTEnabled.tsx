import React, { useState } from 'react';
import '../App.css';
import TWTComponent from '../UserProfile/TWTButtonComponent';
import UserProfileButtonComponent from '../UserProfile/UserProfileButtonComponent';
import TurnTWTOn from './TurnTWTOn';


function TWTEnabled(){
  //to check if your accessToken is already valid
  const [Display, setDisplay] = useState<boolean>(false);
  //setu the QR code. if input Code, then it will be turned on. so there is always a QR code
  return (
    <div className="TWTEnabled">
      <UserProfileButtonComponent/>
      <TurnTWTOn/>
    </div>
  );
}

export default TWTEnabled;
