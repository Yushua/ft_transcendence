import React, { useEffect, useState } from 'react';
import HTTP from '../Utils/HTTP';

export async function asyncGetAchievementList():Promise<string[][]>{
  const response = HTTP.Get(`user-profile/GetAchievementList`, null, {Accept: 'application/json'})
  var result = await JSON.parse(response)
  return await result["AchievementList"]
}

async function seeProfileOther(username: string){
  //call function
  _setDisplay(false);
}

async function RemoveFriend(friendID: string){
  await this.asyncRemoveFriend(friendID)
  _setDisplay(false);
}

/**
 * sets the display to [["pfp", "username", "status", "id"]]
 */
async function getListFriendList(){
  _setDisplay(true);
  _setNameDisplay(await this.asyncGetFriendList())
}

var _setNameDisplay:React.Dispatch<React.SetStateAction<string[][]>>
var _setDisplay: React.Dispatch<React.SetStateAction<boolean>>

function AchievementsComponent() {
  const [ListDisplay, setNameDisplay] = useState<string[][]>([]);
  const [Display, setDisplay] = useState<boolean>(false);
  _setNameDisplay = setNameDisplay
  _setDisplay = setDisplay
  useEffect(() => {
		if (Display === false){
			getListFriendList()
		}
	}, []); // empty dependency array means it will only run once
  return (
    <div>
        {ListDisplay.map((item, index) => (
          <div key={index} style={{ border: "1px solid black", padding: "3px" }}>
            <img src={item[0]} alt="" style={{border: "3px solid black", width: "50px", height: "50px", alignItems: "center"}}>
              <p style={{alignItems: "center"}}>{`name ${item[1]}`}</p>
              <p style={{alignItems: "center"}}>{`status ${item[2]}`}</p>
            </img>

          </div>
        ))}
      </div>
  )
}

export default AchievementsComponent;