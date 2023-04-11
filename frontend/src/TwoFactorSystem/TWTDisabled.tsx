import { getCookie, removeCookie, setCookie } from 'typescript-cookie';
import '../App.css';
import HTTP from '../Utils/HTTP';
import User from '../Utils/Cache/User';
import { SetMainProfileWindow } from '../UserProfile/ProfileMainWindow';

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
    console.log("it is turned off")
    removeCookie(`TWToken${User.intraname}`);
    setCookie(`TWToken${User.intraname}`, TWToken,{ expires: 100000 });
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
  } catch (error) {
    alert("something gone wrong while changing your TWT cookie")
  }
}

async function turnTWTFalse(){
  await setNewTWT()
  await ChangeUserStatusTWTFalse()
  SetMainProfileWindow("tWTDisplay")
}

function TWTDisabled(){
  
  return (
    <div className="TWTDisabled">
      <div>
        <button onClick={turnTWTFalse}>Cancle Two Factor System</button>
      </div>
    </div>
  );
}

export default TWTDisabled;
