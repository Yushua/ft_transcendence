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
    const response = HTTP.Get(`user-profile/friendlist/check/${otherId}`, null, {Accept: 'application/json'})
    var user = await JSON.parse(response)
	  _setButtonStatus(await user["status"])
    }
 async function AsyncGeOtherUser(otherId: string):Promise<any> {
      const response = HTTP.Get(`user-profile/user/${otherId}`, null, {Accept: 'application/json'})
      var result = await JSON.parse(response)
      _setMyUsername(result["username"])
      _setMyPFP(result["profilePicture"])
    }

async function AddFriend(id:string) {
  await asyncUpdateAddFriendList(id)
  await AsyncSetButtonStatus(id)
  _setMyDisplay(false)
}
async function RemoveFriend(id:string) {
  await asyncUpdateRemoveFriendList(id)
  await AsyncSetButtonStatus(id)
  _setMyDisplay(false)
}

async function setUpUser(id:string){
  await AsyncGeOtherUser(id)
  await AsyncSetButtonStatus(id)
}

type Props = {
  id: string;
}

var _setButtonStatus:React.Dispatch<React.SetStateAction<number>>

var _setMyUsername:React.Dispatch<React.SetStateAction<string>>
var _setMyPFP:React.Dispatch<React.SetStateAction<string>>
var _setMyDisplay:React.Dispatch<React.SetStateAction<boolean>>
var _otherUser:any

function OtherUserProfile(props: any){

    const [Button, setButton] = useState<any>(0);
    const [ButtonStatus, setButtonStatus] = useState<number>(0);
    const [myPFP, setMyPFP] = useState<string>("");
    const [myUsername, setMyUsername] = useState<string>("");
    const [myDisplay, setMyDisplay] = useState<boolean>(false);

    _setMyDisplay = setMyDisplay
    _setButtonStatus = setButtonStatus
    _setMyUsername = setMyUsername
    _setMyPFP = setMyPFP
    useEffect(() => {
      if (myDisplay == false){
        setup()
    }}, []);

    const handleButtonUnfollowClick = (id:string) => {
      RemoveFriend(id)
    };

    const handleButtonFollowClick = (id:string) => {
      AddFriend(id)
    };

    async function setup(){
      await setUpUser(props.id)
        setMyDisplay(true)
        console.log(`button {${ButtonStatus}}`)
        if (ButtonStatus == 1){
          setButton(
            <div>
              <button
                style={{ display: "inline-block", width: `${Width}px`, height: `${Width}px`, marginLeft: `${Width*0.02}px`, marginRight: `${Width*0.02}px`, marginTop: `${Width*0.02}px`, marginBottom: `${Width*0.02}px`}}
                onClick={() => handleButtonUnfollowClick(props.id)}>
                  <h2 >{`unfollow`}</h2>
              </button>
            </div>
          )
        }
        else if (ButtonStatus == 2){
          setButton(
            <div>
              <button
                style={{ display: "inline-block", width: `${Width}px`, height: `${Width}px`, marginLeft: `${Width*0.02}px`, marginRight: `${Width*0.02}px`, marginTop: `${Width*0.02}px`, marginBottom: `${Width*0.02}px`}}
                onClick={() => handleButtonFollowClick(props.id)}>
                  <h2 >{`follow`}</h2>
              </button>
            </div>
          )
        }
        else{
          setButton(
            <div></div>
          )
        }
      }

    return (
      <center>
          <div className={"MainWidnow"} style={{width: `${Width}px`}}>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <img src={`${HTTP.HostRedirect()}pfp/${myPFP}`} alt="" style={{width: `${0.1*Width}px`, height: `${0.1*Width}px`, alignItems: 'center', padding: `${0.01*Width}px`}}/>
                  <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: `${0.01*Width}px`}}>
                    <h2 >{`Welcome: ${myUsername}`}</h2>
                    {/* make a check if its already there. follow or unfollow */}
                    {Button}
                  </div>
                </div>

                <div> <EXPBarComponent id={props.id}/> </div>
                
                {/* center left will have two blocks. one achievement, the other, games played. the right will have the friendlist*/}
                <div style={{ display: 'flex', alignItems: 'center', flexDirection: 'column', width: `${(Width - (0.03*Width))}px`, padding: `${0.01*Width}px` }}>
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
      </center>
      );
}

export default OtherUserProfile;
