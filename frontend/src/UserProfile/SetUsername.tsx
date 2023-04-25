import '../App.css';

import HTTP from '../Utils/HTTP';

import { newWindow } from '../App';
import LoginPage from '../Login/LoginPage';
import { useState } from 'react';
import { Box } from '@mui/material';
import { Width } from '../MainWindow/MainWindow';

async function getAccessToken(username:string){
  try {
    const response = HTTP.Patch(`auth/ChangeUsername`, {username}, {Accept: 'application/json'})
    var result = await JSON.parse(response)

    var status:boolean = result["status"]
    if (status === false){
      _setMessage(`error in SetUsername already in use ${username}`)
      _setValue("")
    }
    newWindow(<LoginPage/>)
  } catch (error) {
    _setMessage(`error ${error.errorcode}`)
    _setValue("")
  }
}

var _setValue:React.Dispatch<React.SetStateAction<string>>
var _setMessage:React.Dispatch<React.SetStateAction<string>>
/**
 * Set your username when not set yet
 */
function SetUsername(){
  const [value, setValue] = useState<string>("");
  const [Message, setMessage] = useState<string>("Set your username to continue");
  _setValue = setValue
  _setMessage = setMessage
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (value.length > 4 && value.length <= 10){
      getAccessToken(value)
    }
    else {
      _setMessage(`must be no larger than 10, yours is ${value.length}`)
    }
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValue(event.target.value);
  };

  return (
    <center>
      <form onSubmit={handleSubmit}>
        <Box
            fontFamily={"'Courier New', monospace"}
            fontSize={"200%"}
            marginTop={`${Width*0.3}px`}>
              <div> {Message} </div>
          <input type="text" value={value} onChange={handleChange} />
          {value.length > 4 && value.length <= 10 && (
          <button type="submit">Submit</button> )}
        </Box>
      </form>
    </center>
  );
}

export default SetUsername;
