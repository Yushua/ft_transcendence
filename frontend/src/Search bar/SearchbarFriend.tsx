import React, { useEffect, useState } from 'react';
import UserProfileComponent from '../ButtonComponents/UserProfileComponent';
import HTTP from '../Utils/HTTP';

async function asyncGetFriendListById():Promise<string[][]>{
  const response = HTTP.Get(`user-profile/GetFriendList`, null, {Accept: 'application/json'})
  var result = await JSON.parse(response)
  return await result["friendlist"]
}

async function seeProfileOther(username: string){
  // newWindow(<OtherUserProfile{username: username}/>)
  _setShowDropdown(false);
}

async function getFriendList(){
  _setFriendList(await asyncGetFriendListById())
}

var _SelectedOption: string[]
var _setShowDropdown:React.Dispatch<React.SetStateAction<boolean>>
var _setFriendList:React.Dispatch<React.SetStateAction<string[][]>>
function SearchBarFriend() {
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedOption, setSelectedOption] = useState<string[]>([]);
  const [FriendList, setFriendList] = useState<string[][]>([]);
  _SelectedOption = selectedOption
  _setShowDropdown = setShowDropdown
  _setFriendList = setFriendList
  const handleButtonClick = (option: string[]) => {
    setSelectedOption(option);
    setShowDropdown(true);
  };
  useEffect(() => {
		getFriendList()
	}, []); // empty dependency array means it will only run once


  return (
    <div>
      <div>
      <UserProfileComponent/>
      </div>
    <div style={{ display: "flex", flexWrap: "wrap", maxHeight: "200px" }}>
          {FriendList.map((option, index) => (
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
                <button style={{ margin: "5px", width: "100px", height: "50px" }} onClick={() => seeProfileOther(_SelectedOption[0])}> add {_SelectedOption[0]} Lookup </button>
              </ul>
            </div>
          )}
        </div>
    </div>
  )
}

export default SearchBarFriend;