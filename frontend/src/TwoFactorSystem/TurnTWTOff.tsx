import { getCookie, removeCookie, setCookie } from 'typescript-cookie';
import { newWindow } from '../App';
import '../App.css';
import MainWindow from '../MainWindow/MainWindow';
import User from '../Utils/Cache/User';
import HTTP from '../Utils/HTTP';
import TWTEnabled from './TWTEnabled';

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
    newWindow(<TWTEnabled/>)
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
  } catch (error) {
    alert("something gone wrong while changing your TWT cookie")
    newWindow(<TWTEnabled/>)
  }
}

async function turnTWTFalse(){
  await setNewTWT()
  await ChangeUserStatusTWTFalse()
  newWindow(<MainWindow/>)
}

function TurnTWTOff(){
  return (
    <div>
      <button onClick={turnTWTFalse}>Cancle Two Factor System</button>
    </div>
  );
}

export default TurnTWTOff;