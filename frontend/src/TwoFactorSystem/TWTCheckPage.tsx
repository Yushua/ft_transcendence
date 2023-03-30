import React, { useState } from 'react';
import { newWindow } from '../App';
import '../App.css';
import TWTDisabled from './TWTDisabled';
import TWTEnabled from './TWTEnabled';
import User from '../Utils/Cache/User';

function TWTCheckPage(){
  //to check if your accessToken is already valid
  const [Display, setDisplay] = useState<boolean>(User.TWTStatus);
  return (
    <div className="TWTCheckPage">
      {Display ? <>{newWindow(<TWTDisabled/>)}</> : <>{newWindow(<TWTEnabled/>)}</>}
    </div>
  );
}

export default TWTCheckPage;
