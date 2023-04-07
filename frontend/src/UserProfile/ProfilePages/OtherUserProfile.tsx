import React, { useEffect, useState } from 'react';
import '../../App.css';

import HTTP from '../../Utils/HTTP';
import { Width } from '../../MainWindow/MainWindow';
import AchievementBar from '../../Search bar/AchievementBar';
import FriendListBar from '../../Search bar/FriendListBar';
import GameDataBar from '../../Search bar/GameDataBar';
import EXPBarComponent from '../../ButtonComponents/EXPBarComponent';
import NameStorage from '../../Utils/Cache/NameStorage';
import User from '../../Utils/Cache/User';
import MainChatWindow from '../../Chat/Windows/MainChatWindow';
import MainWindowButtonComponent from '../../ButtonComponents/MainWindowButtonComponent';

async function asyncGetUserUsername(id: string):Promise<any> {
	const response = HTTP.Get(`user-profile/user/${id}`, null, {Accept: 'application/json'})
	var user = await JSON.parse(response)
	return await user["user"];
  }

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

type Props = {
    id: string;
  }

var _setButtonStatus:React.Dispatch<React.SetStateAction<number>>

function OtherUserProfile(props: any){

    var id = props.id;

    const [myUsername, setMyUsername] = useState<string>("");
    const [userId, setUser] = useState<string>(props.userId);
    const [userOtherId, setOtherUser] = useState<string>(props.id);
    const [myPFP, setMyPFP] = useState<string>("");
    const [myWins, setMyWins] = useState<number>(0);
    const [myLosses, setMyLosses] = useState<number>(0);
    const [Button, setButton] = useState<any>(0);
    const [ButtonStatus, setButtonStatus] = useState<number>(0);

    _setButtonStatus = setButtonStatus
    useEffect(() => {
        setUp(id)
    }, []); // empty dependency array means it will only run once

    // do something with myString
    async function setUp(id:string) {
        var _user: any = await asyncGetUserUsername(id)
        setMyUsername(_user.username)
        setMyPFP(_user.profilePicture)
        setMyWins(_user.wins)
        setMyLosses(_user.losses)
        await AsyncSetButtonStatus(id)
        if (ButtonStatus == 1) {
            setButton(<button onClick={AddFriend}>Follow</button>)
          }
        else if (ButtonStatus == 2){
            setButton(<button onClick={RemoveFriend}>unfollow</button>)
          }
        else if (ButtonStatus == 3){
            setButton(<div></div>)
          }
    }

    async function AddFriend() {
        await asyncUpdateAddFriendList(userOtherId)
        await AsyncSetButtonStatus(id)
    }
    async function RemoveFriend() {
        await asyncUpdateRemoveFriendList(userOtherId)
        await AsyncSetButtonStatus(id)
    }

return (
    <center>
    <div> <MainWindowButtonComponent /></div>
      <div className={"MainWidnow"} style={{width: `${Width}px`}}>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <img src={`${HTTP.HostRedirect()}pfp/${myPFP}`} alt="" style={{width: `${0.1*Width}px`, height: `${0.1*Width}px`, alignItems: 'center', padding: `${0.01*Width}px`}}/>
              <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: `${0.01*Width}px`}}>
                <h2 >{`Welcome: ${myUsername}`}</h2>
                {/* make a check if its already there. follow or unfollow */}
                {Button}
              </div>
            </div>

            <div> <EXPBarComponent wins={myWins}/> </div>
            
            {/* centter left will have two blocks. one achievement, the other, games played. the right will have the friendlist*/}
            <div style={{ display: 'flex', alignItems: 'center', width: `${Width}px`, border: "2px solid black" }}>
            {/*  */}
            <div style={{ display: 'flex', alignItems: 'center', flexDirection: 'column', width: `${(Width - (0.03*Width))/2}px`, padding: `${0.01*Width}px` }}>
                {/* width of the box == (width - (0.03*Width))/2 */}
                {/* height of the box == (width - (0.03*Width))/2 */}
                  <div style={{ display: 'flex', border: "2px solid black", padding: `${0.01*Width}px`  }}> Game Data </div>
                  <div style={{width: `${(Width - (0.05*Width))/2}px`, height: `${(Width - (0.02*Width))/2}px`, border: "2px solid black", overflow: "auto", marginLeft: `${Width*0.01}px`, marginRight: `${Width*0.01}px`, marginTop: `${Width*0.02}px`, marginBottom: `${Width*0.02}px`,}}>
                    <div style={{display: 'flex'}}>
                    {/* friendlist */}
                      <GameDataBar id={id} width={(Width - (0.03*Width))/2} height={(Width - (0.02*Width))/2}/>
                    </div>
                  </div>
                 <div style={{ display: 'flex', border: "2px solid black", padding: `${0.01*Width}px`  }}> Achievemement Data </div>
                  <div style={{width: `${(Width - (0.05*Width))/2}px`, height: `${(Width - (0.03*Width))/2}px`, border: "2px solid black", overflow: "auto", marginLeft: `${Width*0.01}px`, marginRight: `${Width*0.01}px`, marginTop: `${Width*0.02}px`, marginBottom: `${Width*0.02}px`,}}>
                    <div style={{display: 'flex'}}>
                      {/* gameStat */}
                      <AchievementBar id={id} width={(Width - (0.03*Width))/2} height={(Width - (0.02*Width))/2}/>
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
                      <FriendListBar id={id} width={(Width - (0.03*Width))/2} height={(Width - (0.02*Width))/2}/>
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
    );
}

export default OtherUserProfile;
