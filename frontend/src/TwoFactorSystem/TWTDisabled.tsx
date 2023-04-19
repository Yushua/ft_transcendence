import { getCookie, removeCookie, setCookie } from 'typescript-cookie';
import '../App.css';
import HTTP from '../Utils/HTTP';
import User from '../Utils/Cache/User';
import { SetWindowProfile } from '../UserProfile/ProfileMainWindow';
import TWTEnabled from './TWTEnabled';
import { Width } from '../MainWindow/MainWindow';
import { Box } from '@mui/material';

async function setNewTWT(){
  try {
    const response = await fetch(HTTP.HostRedirect() + `auth/makeNewTWT` , {
      headers: {
        Accept: 'application/json',
        'Authorization': 'Bearer ' + getCookie("accessToken"),
      },
    })
    if (!response.ok) {
      throw new Error(`Error! status: ${response.status}`);
    }
    var result = await response.json();
    var TWToken:string = result["TWToken"]
    if (TWToken === undefined){
      removeCookie(`TWToken${User.intraname}`);
    }
    if (TWToken === undefined){
      console.log("TWT is UNdefined in LOGINPAGE check")
      window.location.replace(HTTP.HostRedirect());
    }
    else {
      removeCookie(`TWToken${User.intraname}`);
      setCookie(`TWToken${User.intraname}`, TWToken,{ expires: 100000 });
    }
  } catch (error) {
    alert("something gone wrong while changing your TWT cookie")
  }
}

async function ChangeUserStatusTWTFalse(){
  try {
    const response = await fetch(HTTP.HostRedirect() + `auth/ChangeUserTWTStatusFalse` , {
      headers: {
        Accept: 'application/json',
        'Authorization': 'Bearer ' + getCookie("accessToken"),
      },
    })
    if (!response.ok) {
      throw new Error(`Error! status: ${response.status}`);
    }
    var result = await response.json();
    if (result["status"] === false)
    {
      User._user.status = result["status"]
      SetWindowProfile(<TWTEnabled/>)
    }
  } catch (error) {
    alert("something gone wrong while changing your TWT cookie")
  }
}

async function turnTWTFalse(){
  await setNewTWT()
  await ChangeUserStatusTWTFalse()
}

function TWTDisabled(){
  
  return (
    <center>
      <Box
          fontFamily={"'Courier New', monospace"}
          fontSize={"200%"}
          marginTop={`${Width*0.1}px`}>
        <div> {"disable tow factor authentication"} </div>
        <button onClick={turnTWTFalse}>Cancle</button>
      </Box>
    </center>
  );
}

export default TWTDisabled;
