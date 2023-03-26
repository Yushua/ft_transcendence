import React, { useEffect, useState } from 'react';
import { newWindow } from '../App';
import UserProfileComponent from '../ButtonComponents/UserProfileComponent';
import SeachBarButton from '../UserProfile/BarSetup';
import OtherUserProfile from '../UserProfile/ProfilePages/OtherUserProfile';
import HTTP from '../Utils/HTTP';

async function getListSearchListFunction(username: string){
  //call function
  console.log()
  _setDisplay(false);
  _setNameDisplay([['flipy', 'online'], ['yusha', 'online'], ['hey', 'offline'], ['hey', 'offline'], ['hey', 'offline'], ['hey', 'offline'], ['hey', 'offline'], ['hey', 'offline'], ['hey', 'offline'], ['hey', 'offline']])
}

//add the ID to the list
async function addFriendToList(friendName: string) {
  HTTP.Patch(`user-profile/friendlist/add/${friendName}`, null, {Accept: 'application/json'})
}

async function getListSearchList(value:string){
  if (value.length > 5){
    _setNameDisplay([["./profile-pictures/blem.jpg", "flipy"], ["./profile-pictures/blem.jpg", "flipy"], ["./profile-pictures/blem.jpg", "flipy"]])
    _setNameSearchList([["./profile-pictures/blem.jpg", "flipy"], ["./profile-pictures/blem.jpg", "flipy"], ["./profile-pictures/blem.jpg", "flipy"]])
  }
  else {
    _setNameDisplay([["./profile-pictures/blem.jpg", "flipy"], ["./profile-pictures/blem.jpg", "flipy"], ["./profile-pictures/blem.jpg", "flipy"]])
  }
}

async function addFriendFunction(friendName: string){
  await addFriendToList(friendName)
  _setShowDropdown(false);
}

var _setNameDisplay:React.Dispatch<React.SetStateAction<string[][]>>
var _setNameSearchList:React.Dispatch<React.SetStateAction<string[][]>>
var _setDisplay: React.Dispatch<React.SetStateAction<boolean>>

var _SelectedOption: string[]
var _setShowDropdown:React.Dispatch<React.SetStateAction<boolean>>

function SearchBar() {
  const [ListSearchList, setNameSearchList] = useState<string[][]>([]);
  const [ListDisplay, setNameDisplay] = useState<string[][]>([]);
  const [SearchTerm, setSearchTerm] = useState('');
  _setNameDisplay = setNameDisplay
  _setNameSearchList = setNameSearchList
  useEffect(() => {
	}, []); // empty dependency array means it will only run once
  function handleInputChange(event: React.ChangeEvent<HTMLInputElement>) {
    // event.preventDefault();
    getListSearchList(event.target.value);
  }
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedOption, setSelectedOption] = useState<string[]>([]);

  const handleButtonClick = (e: any) => {
    e.preventDefault();
    // newWindow(<OtherUserProfile option />)
    //se the other users page with the name input, the username is all you need
  };

    return (
      <div>
        <div>
         <UserProfileComponent/>
        </div>
          <input type="text" value={SearchTerm} onChange={handleInputChange} />
        <div style={{ display: "flex", flexWrap: "wrap", maxHeight: "200px" }}>
          {ListSearchList.map((option, index) => (
            <button
              key={index}
              style={{ width: "100px", height: "50px" }}
              onClick={() => handleButtonClick(option)}
            >{`name: ${option[0]}\nstatus: ${option[1]}`}
            </button>
          ))}
        </div>
      </div>
    )
}

export default SearchBar;