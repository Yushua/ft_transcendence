import '../App.css';
import HTTP from '../Utils/HTTP';
import ProfilePicture from './ProfilePicture';
import OnOFFComponent from '../Search bar/AchievementComponents/OnOffComponent';
import { useState } from 'react';
import { Box } from '@mui/material';
import { Width } from '../MainWindow/MainWindow';

export async function asyncChangeName(newUsername:string) {
  try {
    HTTP.Post(`user-profile/userchange/${newUsername}`, null, {Accept: 'application/json'})
    _setmessage(`you succesfully changed your username to ${newUsername}`)
  } catch (error) {
    _setmessage("wrong input of username")
  }
}
 
 var _setmessage:React.Dispatch<React.SetStateAction<string>>

 function SettingsUser(){
   const [value, setValue] = useState<string>("");
   const [message, setmessage] = useState<string>("Choose a New Username");
   
   _setmessage = setmessage
   const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
  }
    async function handleUsernameChange(){
      await asyncChangeName(value);
    }
  return (
    <center>
      <Box
            fontFamily={"'Courier New', monospace"}
            fontSize={"200%"}
            marginTop={`${Width*0.05}px`}
            marginBottom={`${Width*0.025}px`}>
          <div> {message} </div>
          <input type="text" value={value} onChange={handleInputChange} />
          {value.length > 4 && value.length <= 10 && (
          <button onClick={handleUsernameChange}>Submit</button> )}
          <div> Set New profile picture </div>
          <div> <ProfilePicture/> </div>
      </Box>
      <Box
            fontFamily={"'Courier New', monospace"}
            fontSize={"200%"}
            marginTop={`${Width*0.05}px`}
            marginBottom={`${Width*0.025}px`}>
          <div> Settings inbox </div>
          <div> <OnOFFComponent string={"AchieveMessage"}/> </div>
          <div> <OnOFFComponent string={"ServerMessage"}/> </div>
      </Box>
    </center>
  );
}

export default SettingsUser;
