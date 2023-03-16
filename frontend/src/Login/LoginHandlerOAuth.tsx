import React, { useState } from 'react';
import '../App.css';

import { newWindow } from '../App';
import UserProfilePage from '../UserProfile/UserProfile';
import NewAccount from './NewAccount';

async function handleLoginWithIntraName(intraName:string){
  try {
    const response = await fetch(`http://localhost:4242/auth/login/` + intraName , {
      headers: {
        Accept: 'application/json',
      },
    })
    if (!response.ok) {
      throw new Error(`Error! status: ${response.status}`);
    }
    var result = await response.json();
    var authToken:string = result["authToken"]
    var check:boolean = result["check"]
    if (authToken == undefined || check == undefined){
      newWindow(<LoginHandlerOAuth/>)
    }
    else if (check == false){
      newWindow(<NewAccount/>)
    }
    else {
      //check if maybe tow people logging into the same acount
      newWindow(<UserProfilePage/>)
    }
  } catch (error) {
    console.log(`error ${error}`)
    alert("access to authorization token failed\ncheck available access to the acount creation\nand its creation of the accessToken")
    newWindow(<LoginHandlerOAuth/>)
  }
}

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
    var accessToken:string = result["accesssToken"]
    var intraName:string = result["intraName"]
    var authToken:boolean = result["authken"]
    const data = result["dataToPost"]
    console.log(`accessToken ${accessToken}`)
    console.log(`intraName ${intraName}`)
    console.log(`authToken ${authToken}`)
    console.log(`data ${data}`)
    // check in handel login if the account is not yet created

    // handleLoginWithIntraName(intraName);
  } catch (error) {
    console.log(`error ${error}`)
    // alert(error)
    newWindow(<LoginHandlerOAuth/>)
  }
}

const loginIntoOAuth = () => {
  console.log("i am here")
  window.location.replace('https://api.intra.42.fr/oauth/authorize?client_id=u-s4t2ud-c73b865f02b3cf14638e1a50c5caa720828d13082db6ab753bdb24ca476e1a4c&redirect_uri=http%3A%2F%2Flocalhost%3A4243%2F&response_type=code');
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
