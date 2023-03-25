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
      <div>
      <UserProfileComponent/>
      </div>
    <div style={{ display: "flex", flexWrap: "wrap", maxHeight: "200px" }}>
          {buttonLabels.map((option, index) => (
            <button
              key={index}
              style={{ margin: "5px", width: "100px", height: "50px" }}
              onClick={() => handleButtonClick(option)}
            >{`name: ${option[0]}\nstatus: ${option[1]}`}
            </button>
          ))}
          {showDropdown && (
            <div style={{ position: "absolute", top: "60px", left: "0" }}>
              <ul>
                {/* <button onClick={() => addFriendFunction(selectedOption)}>Friendlist</button> */}
                <button style={{ margin: "5px", width: "100px", height: "50px" }} onClick={() => addFriendFunction(_SelectedOption[0])}> add {_SelectedOption[0]} friendlist </button>
                <button style={{ margin: "5px", width: "100px", height: "50px" }} onClick={() => addFriendFunction(_SelectedOption[0])}> add {_SelectedOption[0]} friendlist </button>
              </ul>
            </div>
          )}
        </div>
    </div>
  )
}

export default SearchBarFriend;