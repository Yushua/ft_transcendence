import React, { useEffect, useState } from 'react';
import '../../App.css';

import HTTP from '../../Utils/HTTP';
import { Width } from '../../MainWindow/MainWindow';
import AchievementBar from '../../Search bar/AchievementBar';
import GameDataBar from '../../Search bar/GameDataBar';
import EXPBarComponent from '../../ButtonComponents/EXPBarComponent';
import User from '../../Utils/Cache/User';
import MainWindowButtonComponent from '../../ButtonComponents/MainWindowButtonComponent';


async function asyncUpdateAddFriendList(otherId: string):Promise<any> {
        HTTP.Get(`user-profile/friendlist/add/${otherId}`, null, {Accept: 'application/json'})
    }
async function asyncUpdateRemoveFriendList(otherId: string):Promise<any> {
        HTTP.Get(`user-profile/friendlist/remove/${otherId}/${User.ID}`, null, {Accept: 'application/json'})
    }
async function AsyncSetButtonStatus(otherId: string):Promise<any> {
    const response = HTTP.Get(`user-profile/friendlist/check/${otherId}/${User.ID}`, null, {Accept: 'application/json'})
    var user = await JSON.parse(response)
	  _setButtonStatus(await user["status"])
    }
 async function AsyncGeOtherUser(otherId: string):Promise<any> {
      const response = HTTP.Get(`user-profile/user/${otherId}`, null, {Accept: 'application/json'})
      _setOtherUser(await JSON.parse(response))
    }

// async function AddFriend(id:string) {
//   await asyncUpdateAddFriendList(userOtherId)
//   await AsyncSetButtonStatus(id)
// }
// async function RemoveFriend(id:string) {
//   await asyncUpdateRemoveFriendList(userOtherId)
//   await AsyncSetButtonStatus(id)
// }

async function setUpUser(id:string){
  await AsyncGeOtherUser(id)
}

type Props = {
  id: string;
}

var _setButtonStatus:React.Dispatch<React.SetStateAction<number>>
var _setOtherUser:React.Dispatch<React.SetStateAction<any>>
var _otherUser:any
function OtherUserProfile(props: any){

    const [otherUser, setOtherUser] = useState<any>(null);
    const [Button, setButton] = useState<any>(0);
    const [ButtonStatus, setButtonStatus] = useState<number>(0);
    const [myPFP, setMyPFP] = useState<string>("");
    const [myUsername, setMyUsername] = useState<string>("");
    const [myDisplay, setMyDisplay] = useState<boolean>(false);
    _setButtonStatus = setButtonStatus
    _setOtherUser = setOtherUser
    _otherUser = otherUser
    useEffect(() => {
      if (myDisplay == false){
        setUpUser(props.id)
        setMyDisplay(true)
        alert("here")
        alert(`profile{${otherUser.profilePicture}}`)
      }
    }, []); // empty dependency array means it will only run once


return (
    <center>
        <div> <MainWindowButtonComponent /></div>
        <div className={"MainWidnow"} style={{width: `${Width}px`}}>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <img src={`${HTTP.HostRedirect()}pfp/${otherUser.profilePicture}`} alt="" style={{width: `${0.1*Width}px`, height: `${0.1*Width}px`, alignItems: 'center', padding: `${0.01*Width}px`}}/>
                <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: `${0.01*Width}px`}}>
                  <h2 >{`Welcome: ${otherUser.username}`}</h2>
                  {/* make a check if its already there. follow or unfollow */}
                  {/* {Button} */}
                </div>
              </div>

              <div> <EXPBarComponent wins={otherUser.wins} id={otherUser.id}/> </div>
              
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
                        <GameDataBar id={props.id} width={(Width - (0.03*Width))/2} height={(Width - (0.02*Width))/2}/>
                      </div>
                    </div>
                  <div style={{ display: 'flex', border: "2px solid black", padding: `${0.01*Width}px`  }}> Achievemement Data </div>
                    <div style={{width: `${(Width - (0.05*Width))/2}px`, height: `${(Width - (0.03*Width))/2}px`, border: "2px solid black", overflow: "auto", marginLeft: `${Width*0.01}px`, marginRight: `${Width*0.01}px`, marginTop: `${Width*0.02}px`, marginBottom: `${Width*0.02}px`,}}>
                      <div style={{display: 'flex'}}>
                        {/* gameStat */}
                        <AchievementBar id={props.id} width={(Width - (0.03*Width))/2} height={(Width - (0.02*Width))/2}/>
                      </div>
                    </div>
                </div>
              </div>

        </div>
    </center>
    );
}

export default OtherUserProfile;
