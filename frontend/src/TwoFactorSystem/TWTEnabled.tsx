import { useState } from 'react';
import { getCookie, removeCookie, setCookie } from 'typescript-cookie';
import { newWindow } from '../App';
import '../App.css';
import MainWindowButtonComponent from '../ButtonComponents/MainWindowButtonComponent';
import MainWindow from '../MainWindow/MainWindow';
import HTTP from '../Utils/HTTP';
import User from '../Utils/Cache/User';

async function turningTWTOn(code:string){
  try {
    const response = await fetch(HTTP.HostRedirect() + `auth/checkTWT/${getCookie(`TWToken${User.intraname}`)}/${code}` , {
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
    if (await result["status"] === true){
      console.log("succesfully turned on")
      removeCookie(`TWToken${User.intraname}`);
      setCookie(`TWToken${User.intraname}`, await result["TWT"],{ expires: 10000 });
      newWindow(<MainWindow/>);
    }
    else {
        alert("wrong code input, try again")
        _setInputValue("")
    }
  } catch (error) {
    alert("wrong code input, try again")
    _setInputValue("")
  }
}
async function handleSubmit(event:any){
  event.preventDefault();
  await turningTWTOn(_inputValue)
};

var _inputValue: string
var _setInputValue: React.Dispatch<React.SetStateAction<string>>

function TWTEnabled(){
  const [inputValue, setInputValue] = useState("");
  _inputValue = inputValue
  _setInputValue = setInputValue
  const handleInputChange = (event:any) => {
    setInputValue(event.target.value);
  };
  return (
    <div className="TWTEnabled">
      <MainWindowButtonComponent/>
      <div>
        <form onSubmit={handleSubmit}>
          <label>
            enable Two Factor system
            <input type="text" value={inputValue} onChange={handleInputChange} />
          </label>
          <button type="submit">Submit</button>
        </form>
      </div>
    </div>
  );
}

export default TWTEnabled;
