import React, { useState } from 'react';
import '../App.css';

import { newWindow } from '../App';
import UserProfilePage from '../UserProfile/UserProfile';
import NewAccount from './NewAccount';
import { removeCookie, setCookie } from 'typescript-cookie';

async function setLogin(){
  try {
    const response = await fetch(`http://localhost:4242/auth/token/${window.location.href.split('code=')[1]}` , {
      headers: {
        Accept: 'application/json',
      },
    })
    if (!response.ok) {
      throw new Error(`Error! status: ${response.status}`);
    }
    var result = await response.json();
    var authToken:string = result["authToken"]
    var code:string = result["code"]
    //can't send the intraname around, so instead the Authtoken, because you need information in it
    if (authToken == undefined){
      newWindow(<LoginHandlerOAuth/>)
    }
    else if (authToken == ""){
      removeCookie('code');
      removeCookie('authToken');
      setCookie('authToken', authToken,{ expires: 1 });
      setCookie('code', code,{ expires: 1 });
      newWindow(<NewAccount/>)
    }
    else {
      //check if you're logged in
      removeCookie('accessToken');
      setCookie('accessToken', authToken,{ expires: 1 });
      newWindow(<UserProfilePage/>)
    }
  } catch (error) {
    console.log(`error ${error}`)
    // alert(error)
    // newWindow(<LoginHandlerOAuth/>)
  }
}

const loginIntoOAuth = () => {
  console.log("i am here")
  window.location.replace('https://api.intra.42.fr/oauth/authorize?client_id=u-s4t2ud-c73b865f02b3cf14638e1a50c5caa720828d13082db6ab753bdb24ca476e1a4c&redirect_uri=http%3A%2F%2Flocalhost%3A4242%2F&response_type=code');
}

var _setDisplay:React.Dispatch<React.SetStateAction<boolean>>

function LoginHandlerOAuth(){
  const [Display, setDisplay] = useState<boolean>(false);
  _setDisplay = setDisplay;
  console.log("here")
  if (Display === false){
    if (window.location.href.split('code=')[1] == undefined){
      loginIntoOAuth()
    }
    else{
      setLogin();
    }
  }
  // else if(Display == true){
  //   setLogin();
  // }

  return (

    <div className="LoginpageV2">
       {/* <span className="heading">
          </span>
          <form onSubmit={( handleAccLogin)}>
          <button type="submit">Login</button>
          </form> */}
    </div>
  );
}

export default LoginHandlerOAuth;
