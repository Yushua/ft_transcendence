import '../App.css';

import { getCookie, removeCookie } from 'typescript-cookie';
import HTTP from '../Utils/HTTP';

import { newWindow } from '../App';
import LoginPage from '../Login/LoginPage';
import LogoutButtonComponent from '../ButtonComponents/LogoutButton';

async function getAccessToken(username:string){
  try {
    const response = await fetch(HTTP.HostRedirect() + `auth/ChangeUsername/${username}` , {
      headers: {
        Accept: 'application/json',
        'Authorization': 'Bearer ' + getCookie("accessToken"),
        'Content-Type': 'application/json',
      },
      method: 'GET'
    })
    if (!response.ok) {
      throw new Error(`Error! status: ${response.status}`);
    }
    var result = await response.json();
    var status:boolean = result["status"]
    if (status == undefined){
      alert("JWT authorization failed, returned nothing")
      window.location.replace('http://localhost:4242/');
    }
    if (status == false){
      alert(`error in SetUsername already in use ${username}`)
    }
    else if (status == true){
      newWindow(<LoginPage/>)
    }
  } catch (error) {
    console.log(`error ${error}`)
    alert(`error in SetUsername already in use${error} username ${username}`)
    window.location.replace('http://localhost:4242/');
  }
}

const handleUsername = (e: any) => {
  e.preventDefault();
  getAccessToken(e.currentTarget.elements.username.value)
}

function SetUsername(){

  return (
    <div className="setting up new account for Team Zero">
      <LogoutButtonComponent/>
        <form onSubmit={(handleUsername)}>
          <div>
            <label htmlFor="username">Set you Username</label>
            <input id="username" type="text" />
          </div>
        </form>
    </div>
  );
}

export default SetUsername;
