import React, { useEffect, useState } from 'react';
import { newWindow } from '../App';
import UserProfileComponent from '../ButtonComponents/UserProfileComponent';
import HTTP from '../Utils/HTTP';

async function asyncReturnID(usernameFriend: string):Promise<string> {
  const response = HTTP.Get(`user-profile/returnID/${usernameFriend}`, null, {Accept: 'application/json'})
  var result = await JSON.parse(response)
  return result.id;
}

//add the ID to the list
async function addFriendToList(_friendID: string) {
  HTTP.Patch(`user-profile/friendlist/add/${_friendID}`, null, {Accept: 'application/json'})
}

var list_:string[];
export async function asyncGetFriendListById(){
  const response = HTTP.Get(`user-profile/userAddListusername`, null, {Accept: 'application/json'})
  var result = await JSON.parse(response)
  list_ = result
}

async function addFriendFunction(friendName: string){
  await addFriendToList(await asyncReturnID(friendName))
  _setDisplay(false);
}

async function seeProfileOther(username: string){
  //call function
  _setDisplay(false);
}

async function RemoveFriend(username: string){
  //call function
  console.log()
  _setDisplay(false);
  _setNameDisplay([['flipy', 'online'], ['yusha', 'online'], ['hey', 'offline'], ['hey', 'offline'], ['hey', 'offline'], ['hey', 'offline'], ['hey', 'offline'], ['hey', 'offline'], ['hey', 'offline'], ['hey', 'offline']])
}

async function getListFriendList(){
  _setDisplay(true);
}

var _setNameDisplay:React.Dispatch<React.SetStateAction<string[][]>>
var _setDisplay: React.Dispatch<React.SetStateAction<boolean>>
function SearchBarFriend() {
  const [ListDisplay, setNameDisplay] = useState<string[][]>([]);
  const [Display, setDisplay] = useState<boolean>(false);
  _setNameDisplay = setNameDisplay
  _setDisplay = setDisplay
  useEffect(() => {
		if (Display === false){
			getListFriendList()
      _setNameDisplay([['flipy', 'online'], ['yusha', 'online'], ['hey', 'offline'], ['hey', 'offline'], ['hey', 'offline'], ['hey', 'offline'], ['hey', 'offline'], ['hey', 'offline'], ['hey', 'offline'], ['hey', 'offline']])
		}
	}, []); // empty dependency array means it will only run once
  return (
    <div>
        {ListDisplay.map((item, index) => (
          <div key={index} style={{ border: "1px solid black", padding: "3px" }}>
            <img src={"./profile-pictures/blem.jpg"} alt="" style={{border: "3px solid black", width: "50px", height: "50px", alignItems: "center"}}/>
            <p style={{alignItems: "center"}}>{`name ${item[0]}`}</p>
            <p style={{alignItems: "center"}}>{`status ${item[1]}`}</p>
            <button style={{ width: "100px", height: "50px", alignItems: "center" }} onClick={() => seeProfileOther(item[0])} >{`lookup`}</button>
            <button style={{ width: "100px", height: "50px", alignItems: "center" }} onClick={() => RemoveFriend(item[0])} >remove</button>
          </div>
        ))}
      </div>
  )
}

export default SearchBarFriend;