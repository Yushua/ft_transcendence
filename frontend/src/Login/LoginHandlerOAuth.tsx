import React, { useState } from 'react';
import '../App.css';

import { newWindow } from '../App';
import MainWindow from '../MainWindow/MainWindow';

async function setLogin(){
  try {
    const response = await fetch(`http://localhost:4242/auth/token/${window.location.href.split('code=')[1]}` , {
      headers: {
        Accept: 'application/json',
      },
    }).then(asd => {
      console.log(asd.body + " IS RESPONES FROM FETCH");
    });
    console.log("checking the response if succesfull")
    console.log(`bmajor response ${response}`)
    console.log("i am before response")
    console.log("result////")
    newWindow(<MainWindow/>)
  } catch (error) {
    console.log(`error in login ${error}`)
    // alert("login in failed for some reason, back to login")
    // _setDisplay(false)
  }
  var intraName:string
  // try {
  //   const intraPull = await axios.get(`http://localhost:4243/auth/token/${window.location.href.split('code=')[1]}`, {
  //     headers: {
  //       Accept: 'application/json',
  //     },
  //   }).then((response) => {
  //     console.log(`response login page${response}`)
  //     // intraName = response['data'].login
  //   })
  // } catch (error) {
  //   //exemption
  // }

}

const loginIntoOAuth = () => {
  console.log("i am here")
  ///try go to
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
    //this sis et if the login failed
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
