import React, { useEffect, useState } from 'react';
import './UserProfile.css';
import '../App.css';
import HTTP from '../Utils/HTTP'
import EXPBarComponent from '../ButtonComponents/EXPBarComponent';
import User from '../Utils/Cache/User';
import NameStorage from '../Utils/Cache/NameStorage';
import { Width } from '../MainWindow/MainWindow';
import AchievementBar from '../Search bar/AchievementBar';
import GameDataBar from '../Search bar/GameDataBar';
import FriendListBar from '../Search bar/FriendListBar';

async function asyncGetName():Promise<string> {
  const response = HTTP.Get(`user-profile/user`, null, {Accept: 'application/json'})
  var result = await JSON.parse(response)
  return await result["username"];
}

export async function asyncChangeName(newUsername:string) {
  HTTP.Post(`user-profile/userchange/${newUsername}`, null, {Accept: 'application/json'})
}

interface FormElements extends HTMLFormControlsCollection {
  username: HTMLInputElement
  newInput: HTMLInputElement
}

export interface YourFormElement extends HTMLFormElement {
  readonly elements: FormElements
 }

 
 async function asyncToggleGetName(){
   _setNameDisplay(await asyncGetName())
  };

  
var _setNameDisplay: React.Dispatch<React.SetStateAction<string>>

function UserProfilePage(props: any) {
  const user = props?.user ?? User._user
  
  const [nameDisplay, setNameDisplay] = useState<string>("");
  
  _setNameDisplay = setNameDisplay
  if (nameDisplay === ""){
    asyncToggleGetName()
  }
  
  const blockWidth = Width * .425
  const marginLeft = Width * 0.01
  const marginRight = marginLeft
  
  return (
    <center>
      <div className={"MainWidnow"} style={{width: `${Width * .9}px`, border: "solid", borderColor: "#3676cc", borderRadius: "5px"}}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <img src={`${HTTP.HostRedirect()}pfp/${NameStorage.UserPFP.Get(user.id)}`}
            style={{width: `${0.1*Width}px`, height: `${0.1*Width}px`, alignItems: 'center', padding: `${0.01*Width}px`, borderRadius: `50%`}}/>

          <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: `${0.01*Width}px`, color: "black"}}>
            <h2 >{`Welcome ${user.username}`}</h2>
          </div>
        </div>
        <div style={{marginBottom: `${marginLeft}px`}}> <EXPBarComponent id={user.id}/> </div>


        {/* center left will have two blocks. one achievement, the other, games played. the right will have the friendlist*/}
        <div style={{ display: 'flex', alignItems: 'center'}}>
          {/*  */}
          <div style={{ display: 'flex', alignItems: 'center', flexDirection: 'column', boxSizing: "border-box"}}>
            <div style={{ display: 'flex', border: "solid black", padding: `${0.01*Width}px`, borderColor: "#3676cc", borderRadius: "5px"}}> <b>Game Data</b> </div>
            <div style={{width: `${blockWidth}px`, height: `${(Width - (0.02*Width))/2}px`, border: "solid black", overflow: "auto", marginLeft: `${marginLeft}px`, marginRight: `${marginRight}px`, marginTop: `${Width*0.005}px`, marginBottom: `${Width*0.02}px`, borderColor: "#3676cc", borderRadius: "5px"}}>
              <div style={{display: 'flex'}}>
                <GameDataBar id={user.id} width={(Width - (0.03*Width))/2} height={(Width - (0.02*Width))/2}/>
              </div>  
            </div>
            <div style={{ display: 'flex', border: "solid black", padding: `${0.01*Width}px`, borderColor: "#3676cc", borderRadius: "5px"}}> <b>Achievemement Data</b> </div>
            <div style={{width: `${blockWidth}px`, height: `${(Width - (0.03*Width))/2}px`, border: "solid black", overflow: "auto", marginLeft: `${marginLeft}px`, marginRight: `${marginRight}px`, marginTop: `${Width*0.005}px`, marginBottom: `${Width*0.02}px`, borderColor: "#3676cc", borderRadius: "5px"}}>
              <div style={{display: 'flex'}}>
                <AchievementBar id={user.id} width={(Width - (0.03*Width))/2} height={(Width - (0.02*Width))/2}/>
              </div>
            </div>
          </div>
          {/*  */}
          <div style={{ display: 'flex', alignItems: 'center', flexDirection: 'column', width: `${(Width - (0.03*Width))/2}px` }}>
            <div style={{ display: 'flex', border: "solid black", padding: `${0.01*Width}px`, borderColor: "#3676cc", borderRadius: "5px"}}> <b>Friend List</b> </div>
            <div style={{width: `${blockWidth}px`, height: `${(Width - (0.02*Width))/2}px`, border: "solid black", overflow: "auto", marginLeft: `${marginLeft}px`, marginRight: `${marginRight}px`, marginTop: `${Width*0.005}px`, marginBottom: `${Width*0.02}px`, borderColor: "#3676cc", borderRadius: "5px"}}>
              <div style={{display: 'flex'}}>
                <FriendListBar id={user.id} width={(Width - (0.03*Width))/2} height={(Width - (0.02*Width))/2}/>
              </div>
            </div>
            <div style={{ display: 'flex', border: "solid black", padding: `${0.01*Width}px`, borderColor: "#3676cc", borderRadius: "5px"}}> <b>nothing</b> </div>
            <div style={{width: `${blockWidth}px`, height: `${(Width - (0.03*Width))/2}px`, border: "solid black", overflow: "auto", marginLeft: `${marginLeft}px`, marginRight: `${marginRight}px`, marginTop: `${Width*0.005}px`, marginBottom: `${Width*0.02}px`, borderColor: "#3676cc", borderRadius: "5px"}}>
              <div style={{display: 'flex'}}>
                {/* <SearchBarFriend width={(Width - (0.03*Width))/2} height={(Width - (0.02*Width))/2}/> */}
              </div>
            </div>
          </div>

        </div>

      </div>
    </center>
    //logout when initialized
  );
}

export default UserProfilePage;
