import React, { useState } from 'react';
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
  _setShowDropdown(false);
}

async function seeProfileOther(username: string){
  // newWindow(<OtherUserProfile/>)
  _setShowDropdown(false);
}

var _SelectedOption: string[]
var _setShowDropdown:React.Dispatch<React.SetStateAction<boolean>>

function SearchBarFriend() {
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedOption, setSelectedOption] = useState<string[]>([]);
  _SelectedOption = selectedOption
  _setShowDropdown = setShowDropdown
  // const buttonLabels = ['flipy', 'yusha', 'hey', 'hey', 'hey', 'hey', 'hey', 'hey', 'hey', 'hey'];
  const buttonLabels = [['flipy', 'online'], ['yusha', 'online'], ['hey', 'offline'], ['hey', 'offline'], ['hey', 'offline'], ['hey', 'offline'], ['hey', 'offline'], ['hey', 'offline'], ['hey', 'offline'], ['hey', 'offline']];
  const handleButtonClick = (option: string[]) => {
    setSelectedOption(option);
    setShowDropdown(true);
  };

  return (
    <div>
      <div style={{ display: "flex", flexWrap: "wrap", maxHeight: "200px" }}>
          {buttonLabels.map((option, index) => (
            <button
              key={index}
              style={{ width: "130px", height: "100px"}}
              // onClick={() => handleButtonClick(option)}
            >{`name: ${option[0]} - ${option[1]}`}
            <div style={{display: "flex", alignItems: "center" }}>
              <button style={{ width: "50px", height: "50px", flex: "1", alignItems: "center" }} onClick={() => addFriendFunction(_SelectedOption[0])}> remove  </button>
              <button style={{ width: "50px", height: "50px", flex: "1", alignItems: "center" }} onClick={() => addFriendFunction(_SelectedOption[0])}> check </button>
            </div>
            </button>
          ))}
        </div>
    </div>
  )
}

export default SearchBarFriend;