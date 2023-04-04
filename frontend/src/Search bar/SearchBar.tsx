import React, { useState } from 'react';
import { newWindow } from '../App';
import UserProfileComponent from '../ButtonComponents/UserProfileComponent';
import { Width } from '../MainWindow/MainWindow';
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
    var username:string = e[0]
    newWindow(<OtherUserProfile username={username}/>)
  };
    //width is always. padding + ((width object + padding) * amount)
    return (
      <center>
        <div >
              <input type="text" value={SearchTerm} onChange={handleInputChange} />
              {/* the size of the buttons, should include the profile picture, and the tet underneadth*/}
              <div style={{width: `${Width*0.9}px`, height: `${Width*1.5}px`, border: "2px solid black", overflow: "auto"}}>
                  <div style={{display: 'flex'}}>
                    {/*  button size */}
                    {ListSearchList.map((option, index) => (
                      <button
                        key={index}
                        style={{ width: `${(Width - (Width*0.015))/5}`, height: `${Width*0.2}px`, padding: `${Width*0.01}px`}}
                        onClick={() => handleButtonClick(option)}
                      ><div style={{ display: 'flex', alignItems: 'center', width: `${Width}px` }}>
                        <h2 >{`name   :${option[0]}`}</h2>
                        <h2 >{`status :${option[1]}`}</h2>
                        </div>
                      </button>
                    ))}
                  </div>
              </div>
        </div>

      </center>
    )
}

export default SearchBar;