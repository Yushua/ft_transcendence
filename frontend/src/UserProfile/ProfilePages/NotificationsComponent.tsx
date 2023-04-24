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
  if (myDisplay === false && props.buttonstatus !== 2){
    setup()
  }
  
  const handleButtonNotificationOffClick = (id:string) => {
    RemoveFriend(id)
  };
  
  const handleButtonNotificationOnClick = (id:string) => {
    AddFriend(id)
  };
  
  async function setup(){
    await AsyncSetButtonStatus(props.id)
    setMyDisplay(true)
  }
  
    if (props.buttonstatus !== 1){
      return (
        <></>
      )
    }
    else {
      return (
          <>
              {ButtonStatus === 1 ? (
              <button
                  style={{ display: "inline-block", marginLeft: `${Width*0.02}px`, marginRight: `${Width*0.02}px`, marginTop: `${Width*0.02}px`, marginBottom: `${Width*0.02}px`}}
                  onClick={() => handleButtonNotificationOffClick(props.id)}>
                  < div>{`Notifications Off`}</div>
              </button>
              ) : ButtonStatus === 2 ? (
              <button
                  style={{ display: "inline-block", marginLeft: `${Width*0.02}px`, marginRight: `${Width*0.02}px`, marginTop: `${Width*0.02}px`, marginBottom: `${Width*0.02}px`}}
                  onClick={() => handleButtonNotificationOnClick(props.id)}>
                  < div>{`Notifications On`}</div>
              </button>
              ) : null}
          </>
        );
    }
}

export default NotificationsComponent;
