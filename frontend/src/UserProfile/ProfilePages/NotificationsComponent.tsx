import React, { useState } from 'react';
import '../../App.css';

import HTTP from '../../Utils/HTTP';
import { Width } from '../../MainWindow/MainWindow';

async function asyncUpdateAddFriendList(otherId: string):Promise<any> {
    HTTP.Patch(`user-profile/FrienddList/add/${otherId}`, null, {Accept: 'application/json'})
}
async function asyncUpdateRemoveFriendList(otherId: string):Promise<any> {
    HTTP.Patch(`user-profile/FrienddList/remove/${otherId}`, null, {Accept: 'application/json'})
}

async function AsyncSetButtonStatus(otherId: string):Promise<any> {
    const response = HTTP.Get(`user-profile/GetNotificationStatus/${otherId}`, null, {Accept: 'application/json'})
    var user = await JSON.parse(response)
	  _setButtonStatus(await user["status"])
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

var _setButtonStatus:React.Dispatch<React.SetStateAction<number>>
var _setMyDisplay:React.Dispatch<React.SetStateAction<boolean>>

/**
 * input id == other user. so the user you need to check with
 */
function NotificationsComponent(props: any){  
  const [ButtonStatus, setButtonStatus] = useState<number>(0);
  const [myDisplay, setMyDisplay] = useState<boolean>(false);
  
  _setMyDisplay = setMyDisplay
  _setButtonStatus = setButtonStatus
  if (myDisplay === false){
    setup()
  }
  
  const handleButtonNotificationOffClick = (id:string) => {
    AddFriend(id)
  };
  
  const handleButtonNotificationOnClick = (id:string) => {
    RemoveFriend(id)
  };
  
  async function setup(){
    //check what the notification is. is it on or off
    //or better, is the other user ID in there or not
    await AsyncSetButtonStatus(props.id)
    setMyDisplay(true)
  }
  
    if (props.buttonstatus === 2){
      // console.log(`buttonstatus check {${props.buttonstatus}}`)
      return (
        <></>
      )
    }
    return (
        // console.log(`buttonstatus here {${ButtonStatus}}`),
        <>
            {ButtonStatus === 2 ? (
            <button
                style={{ display: "inline-block", marginLeft: `${Width*0.02}px`, marginRight: `${Width*0.02}px`, marginTop: `${Width*0.02}px`, marginBottom: `${Width*0.02}px`}}
                onClick={() => handleButtonNotificationOnClick(props.id)}>
                <h2 >{`Notifications On`}</h2>
            </button>
            ) : ButtonStatus === 1 ? (
            <button
                style={{ display: "inline-block", marginLeft: `${Width*0.02}px`, marginRight: `${Width*0.02}px`, marginTop: `${Width*0.02}px`, marginBottom: `${Width*0.02}px`}}
                onClick={() => handleButtonNotificationOffClick(props.id)}>
                <h2 >{`Notifications Off`}</h2>
            </button>
            ) : null}
        </>
      );
}

export default NotificationsComponent;
