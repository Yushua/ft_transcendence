import React, { useState } from 'react';
import { newWindow } from '../App';
import UserProfileComponent from '../ButtonComponents/UserProfileComponent';
import OtherUserProfile from '../UserProfile/ProfilePages/OtherUserProfile';
import HTTP from '../Utils/HTTP';


//add the ID to the list
async function asyncaddFriendToList(_friendUsername: string) {
  HTTP.Patch(`user-profile/friendlist/add/${_friendUsername}`, null, {Accept: 'application/json'})
}

export async function asyncGetSearchList(){
  const response = HTTP.Get(`user-profile/SearchList`, null, {Accept: 'application/json'})
  var result = await JSON.parse(response)
  console.log(`search ${await result["searchlist"]}`)
  _setNameDisplay(await result["searchlist"])
  console.log(`i am out ${await result["searchlist"][0]}`)
}

async function getListSearchList(value:string){
  if (value.length >= 5){
    await asyncGetSearchList()
    //add filter
    _setNameSearchList(_ListDisplay)
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
var _ListDisplay:string[][]
var _setShowDropdown:React.Dispatch<React.SetStateAction<boolean>>

function SearchBar() {
  //get into page, get the entire list online
  const [ListSearchList, setNameSearchList] = useState<string[][]>([]);
  const [ListDisplay, setNameDisplay] = useState<string[][]>([]);
  const [SearchTerm, setSearchTerm] = useState("");
  _setNameDisplay = setNameDisplay
  _setNameSearchList = setNameSearchList
  _ListDisplay = ListDisplay

  function handleInputChange(event: React.ChangeEvent<HTMLInputElement>) {
    setSearchTerm(event.target.value)
    getListSearchList(event.target.value)
  }
  const handleButtonClick = (e: any) => {
    e.preventDefault();
    //go to the page of this user
    alert(`username = ${e[0]}`)
    newWindow(<OtherUserProfile username={e[0]}/>)
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