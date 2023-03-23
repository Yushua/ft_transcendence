import { getCookie, removeCookie, setCookie } from 'typescript-cookie';
import { newWindow } from '../App';
import '../App.css';
import MainWindow from '../MainWindow/MainWindow';
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
      removeCookie('TWToken');
    }
    if (TWToken === undefined){
      console.log("TWT is UNdefined in LOGINPAGE check")
      window.location.replace(HTTP.HostRedirect());
    }
    else {
      console.log("it is turned off")
      removeCookie('TWToken');
      setCookie('TWToken', TWToken,{ expires: 10000 });
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

// const loginIntoOAuth = () => {
//   window.location.replace('https://api.intra.42.fr/oauth/authorize?client_id=u-s4t2ud-c73b865f02b3cf14638e1a50c5caa720828d13082db6ab753bdb24ca476e1a4c&redirect_uri=http%3A%2F%2Flocalhost%3A4242%2F&response_type=code');
// }

async function turnTWTFalse(){
  await setNewTWT()
  await ChangeUserStatusTWTFalse()
  newWindow(<MainWindow/>)
}

function TurnTWTOff(){
  // if (window.location.href.split('code=')[1] != undefined){
  //   checkLoginF()
  // }
  return (
    <div>
      <button onClick={turnTWTFalse}>Cancle Two Factor System</button>
    </div>
  );
}

export default TurnTWTOff;