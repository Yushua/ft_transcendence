import { useState } from 'react';
import { getCookie, removeCookie, setCookie } from 'typescript-cookie';
import { newWindow } from '../App';
import '../App.css';
import MainWindowButtonComponent from '../ButtonComponents/MainWindowButtonComponent';
import MainWindow from '../MainWindow/MainWindow';
import HTTP from '../Utils/HTTP';
import User from '../Utils/Cache/User';

async function CheckTWTSetup(code:string, secret:string){
  console.log(` input {${code}}`)
  const response = HTTP.Get(`auth/checkTWTCodeUpdate/${secret}/${code}`, null, {Accept: 'application/json'})
  var result = await JSON.parse(response)
  if (await result["status"] == true){
    removeCookie(`TWToken${User.intraname}`);
    setCookie(`TWToken${User.intraname}`, await result["TWT"],{ expires: 10000 });
      newWindow(<MainWindow/>);
  }
  else {
    alert("wrong code input, try again")
    _setInputValue("")
  }
}

async function handleSubmit(event:any){
  event.preventDefault();
  if (_inputValue.length < 2){
    alert("input is too small")
    _setInputValue("")
  }
  else {
    await CheckTWTSetup(_inputValue, "d")
  }
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
            please fill in the code to enable Two Factor Authorization
            <input type="text" value={inputValue} onChange={handleInputChange} />
          </label>
          <button type="submit">Submit</button>
        </form>
      </div>
    </div>
  );
}

export default TWTEnabled;
