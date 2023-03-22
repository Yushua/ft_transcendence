import React, { useState } from 'react';
import HTTP from '../Utils/HTTP';
import SeachBarButton from './BarSetup';
import UserProfileComponent from './UserProfileComponent';

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

var _SelectedOption: string
var _setShowDropdown:React.Dispatch<React.SetStateAction<boolean>>
function SearchBarFriend() {
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedOption, setSelectedOption] = useState("");
  _SelectedOption = selectedOption
  _setShowDropdown = setShowDropdown
  const buttonLabels = ['flipy', 'yusha', 'hey', 'hey', 'hey', 'hey', 'hey', 'hey', 'hey', 'hey'];
  const handleButtonClick = (option: string) => {
    setSelectedOption(option);
    setShowDropdown(true);
  };

  const handleOptionClick = (option: string) => {
    setSelectedOption(option);
    setShowDropdown(false);
  };
  return (
  <div style={{ display: "flex", flexWrap: "wrap", maxHeight: "200px" }}>
        {buttonLabels.map((option, index) => (
          <button
            key={index}
            style={{ margin: "5px", width: "100px", height: "50px" }}
            onClick={() => handleButtonClick(option)}
          >
            {option}
          </button>
        ))}
        {showDropdown && (
          <div style={{ position: "absolute", top: "60px", left: "0" }}>
            <ul>
              {/* <button onClick={() => addFriendFunction(selectedOption)}>Friendlist</button> */}
              <button style={{ margin: "5px", width: "100px", height: "50px" }} onClick={() => addFriendFunction(_SelectedOption)}> add {_SelectedOption} friendlist </button>
              <button style={{ margin: "5px", width: "100px", height: "50px" }} onClick={() => addFriendFunction(_SelectedOption)}> add {_SelectedOption} friendlist </button>
            </ul>
          </div>
        )}
      </div>
  )
}

export default SearchBarFriend;