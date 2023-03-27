import React, { useEffect, useState } from 'react';
import { newWindow } from '../App';
import UserProfileComponent from '../ButtonComponents/UserProfileComponent';
import SeachBarButton from '../UserProfile/BarSetup';
import OtherUserProfile from '../UserProfile/ProfilePages/OtherUserProfile';
import HTTP from '../Utils/HTTP';


//add the ID to the list
async function asyncaddFriendToList(_friendUsername: string) {
  HTTP.Patch(`user-profile/friendlist/add/${_friendUsername}`, null, {Accept: 'application/json'})
}

export async function asyncGetSearchList():Promise<string[][]>{
  const response = HTTP.Get(`user-profile/SearchList`, null, {Accept: 'application/json'})
  var result = await JSON.parse(response)
  return await result["searchlist"]
}



async function getListSearchList(value:string){
  if (value.length >= 5){
    _setNameDisplay(await this.asyncGetSearchList())
  }
  else {
    _setNameDisplay([])
  }
}

async function addFriendFunction(friendName: string){
  await asyncaddFriendToList(friendName)
  //refresh the list
  _setShowDropdown(false);
}

var _setNameDisplay:React.Dispatch<React.SetStateAction<string[][]>>
var _setNameSearchList:React.Dispatch<React.SetStateAction<string[][]>>

var _SelectedOption: string[]
var _setShowDropdown:React.Dispatch<React.SetStateAction<boolean>>

function SearchBar() {
  const [ListSearchList, setNameSearchList] = useState<string[][]>([]);
  const [ListDisplay, setNameDisplay] = useState<string[][]>([]);
  const [SearchTerm, setSearchTerm] = useState("");
  _setNameDisplay = setNameDisplay
  _setNameSearchList = setNameSearchList

  function handleInputChange(event: React.ChangeEvent<HTMLInputElement>) {
    setSearchTerm(event.target.value)
    getListSearchList(event.target.value)
  }
  const handleButtonClick = (e: any) => {
    e.preventDefault();
    //go to the page
  };

    return (
      <div>
        <div>
         <UserProfileComponent/>
          </div>
            <input type="text" value={SearchTerm} onChange={handleInputChange} />
            <div style={{width: `${145*5}px`, height: `${200*5}px`, border: "2px solid black", overflow: "auto"}}>
              <div style={{display: 'flex'}}>
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
      </div>
    )
}

export default SearchBar;