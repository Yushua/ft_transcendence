import React, { useState } from 'react';
import { removeCookie } from 'typescript-cookie';
import { newWindow } from '../../App';
import LoginPage from '../../Login/LoginPage';
import TWTCheckPage from '../../TwoFactorSystem/TWTCheckPage';

export function ButtonRefresh() {
  newWindow(<TWTCheckPage/>);
}

function TWTButtonComponent() {
    return (
      <button onClick={() => {ButtonRefresh()}}>TwoFactor</button>
    )
}

export default TWTButtonComponent;