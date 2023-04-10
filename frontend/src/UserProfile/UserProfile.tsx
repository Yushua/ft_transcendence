import React, { useState } from 'react';
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
  
  export function setupOverlay(status:boolean, LinkData:any){
    _setShowOverlay(true)
    _setLinkData(LinkData)
  }
  
var _setNameDisplay: React.Dispatch<React.SetStateAction<string>>
var _setShowOverlay:React.Dispatch<React.SetStateAction<boolean>>
var _setLinkData:React.Dispatch<any>

function UserProfilePage() {
  const [nameDisplay, setNameDisplay] = useState<string>("");
  const [showOverlay, setShowOverlay] = useState(false);
  const [linkData, setLinkData] = useState<any>(null);

  _setNameDisplay = setNameDisplay
  _setShowOverlay = setShowOverlay
  _setLinkData = setLinkData
  if (nameDisplay === ""){
    asyncToggleGetName()
  }
  return (
    <center>
      <div className={"MainWidnow"} style={{width: `${Width}px`}}>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <img src={`${HTTP.HostRedirect()}pfp/${NameStorage.UserPFP.Get(User.ID)}`} alt="" style={{width: `${0.1*Width}px`, height: `${0.1*Width}px`, alignItems: 'center', padding: `${0.01*Width}px`}}/>
              <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: `${0.01*Width}px`}}>
                <h2 >{`Welcome: ${User.Name}`}</h2>
              </div>
            </div>

            <div> <EXPBarComponent id={User.ID}/> </div>
            
            {/* center left will have two blocks. one achievement, the other, games played. the right will have the friendlist*/}
            <div style={{ display: 'flex', alignItems: 'center', width: `${Width}px`, border: "2px solid black" }}>
            {/*  */}
            <div style={{ display: 'flex', alignItems: 'center', flexDirection: 'column', width: `${(Width - (0.03*Width))/2}px`, padding: `${0.01*Width}px` }}>
                {/* width of the box == (width - (0.03*Width))/2 */}
                {/* height of the box == (width - (0.03*Width))/2 */}
                  <div style={{ display: 'flex', border: "2px solid black", padding: `${0.01*Width}px`  }}> Game Data </div>
                  <div style={{width: `${(Width - (0.05*Width))/2}px`, height: `${(Width - (0.02*Width))/2}px`, border: "2px solid black", overflow: "auto", marginLeft: `${Width*0.01}px`, marginRight: `${Width*0.01}px`, marginTop: `${Width*0.02}px`, marginBottom: `${Width*0.02}px`,}}>
                    <div style={{display: 'flex'}}>
                    {/* friendlist */}
                      <GameDataBar id={User.ID} width={(Width - (0.03*Width))/2} height={(Width - (0.02*Width))/2}/>
                    </div>
                  </div>
                 <div style={{ display: 'flex', border: "2px solid black", padding: `${0.01*Width}px`  }}> Achievemement Data </div>
                  <div style={{width: `${(Width - (0.05*Width))/2}px`, height: `${(Width - (0.03*Width))/2}px`, border: "2px solid black", overflow: "auto", marginLeft: `${Width*0.01}px`, marginRight: `${Width*0.01}px`, marginTop: `${Width*0.02}px`, marginBottom: `${Width*0.02}px`,}}>
                    <div style={{display: 'flex'}}>
                      {/* gameStat */}
                      <AchievementBar id={User.ID} width={(Width - (0.03*Width))/2} height={(Width - (0.02*Width))/2}/>
                    </div>
                  </div>
              </div>
              {/*  */}
              <div style={{ display: 'flex', alignItems: 'center', flexDirection: 'column', width: `${(Width - (0.03*Width))/2}px`, padding: `${0.01*Width}px` }}>
                {/* width of the box == (width - (0.03*Width))/2 */}
                {/* height of the box == (width - (0.03*Width))/2 */}
                  <div style={{ display: 'flex', border: "2px solid black", padding: `${0.01*Width}px`  }}> FriendList </div>
                  <div style={{width: `${(Width - (0.05*Width))/2}px`, height: `${(Width - (0.02*Width))/2}px`, border: "2px solid black", overflow: "auto", marginLeft: `${Width*0.01}px`, marginRight: `${Width*0.01}px`, marginTop: `${Width*0.02}px`, marginBottom: `${Width*0.02}px`,}}>
                    <div style={{display: 'flex'}}>
                    {/* friendlist */}
                      <FriendListBar id={User.ID} width={(Width - (0.03*Width))/2} height={(Width - (0.02*Width))/2}/>
                    </div>
                  </div>
                 <div style={{ display: 'flex', border: "2px solid black", padding: `${0.01*Width}px`  }}> nothing </div>
                  <div style={{width: `${(Width - (0.05*Width))/2}px`, height: `${(Width - (0.03*Width))/2}px`, border: "2px solid black", overflow: "auto", marginLeft: `${Width*0.01}px`, marginRight: `${Width*0.01}px`, marginTop: `${Width*0.02}px`, marginBottom: `${Width*0.02}px`,}}>
                    <div style={{display: 'flex'}}>
                      {/* gameStat */}
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
