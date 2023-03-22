import React, { Dispatch, SetStateAction, useState } from 'react';
import './UserProfile.css';
import '../App.css';
import UserProfileButtonComponent from './UserProfileButtonComponent';


function OtherUserProfile() {

  return (
    <div className="UserProfile">
      <UserProfileButtonComponent/>
    </div>
  );
}

export default OtherUserProfile;
