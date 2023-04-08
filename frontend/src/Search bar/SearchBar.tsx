import React, { useState } from 'react';
import { newWindow } from '../App';
import { Width } from '../MainWindow/MainWindow';
import OtherUserProfile from '../UserProfile/ProfilePages/OtherUserProfile';
import HTTP from '../Utils/HTTP';
import User from '../Utils/Cache/User';

var test:boolean = true
//add the ID to the list
async function asyncaddFriendToList(_friendUsername: string) {
  HTTP.Patch(`user-profile/friendlist/add/${_friendUsername}`, null, {Accept: 'application/json'})
}

export async function asyncGetSearchList(){
  const response = HTTP.Get(`user-profile/SearchList`, null, {Accept: 'application/json'})
  var result = await JSON.parse(response)
  _setNameDisplay(await result["searchlist"])
}

async function getListSearchList(value:string){
  if (value.length >= 5){
    await asyncGetSearchList()
    _setNameSearchList(_ListDisplay)
    //add filter
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
    var id:string = e
    newWindow(<OtherUserProfile id={id} userId={User.ID}/>)
  };
    return (
        <div >
              <input type="text" value={SearchTerm} onChange={handleInputChange} />
              {/* the size of the buttons, should include the profile picture, and the tet underneadth*/}
              <div style={{width: `${Width*0.9}px`, height: `${Width*1.5}px`, overflowY: "scroll", border: "2px solid black"}}>
                    {/*  button size */}
                    {ListSearchList.map((option, index) => (
                      //hey, f this index is 3 dividable, then go to next round
                      <button
                        key={index}
                        style={{ display: "inline-block", width: `${((Width*0.9) - (Width*0.9*0.03 * 3 * 2))/3}px`, height: `${Width*0.2}px`, marginLeft: `${Width*0.02}px`, marginRight: `${Width*0.02}px`, marginTop: `${Width*0.03}px`, marginBottom: `${Width*0.03}px`, border: "4px solid black" }}
                        onClick={() => handleButtonClick(option[3])}>
                          <img src={`${HTTP.HostRedirect()}pfp/${option[0]}`} alt="" style={{width: `${0.05*Width}px`, height: `${0.05*Width}px`, alignItems: 'center', marginRight: `${0.01*Width}px`}}/>
                          <h2 >{`name   ${option[1]}`}</h2>
                          <h2 >{`status ${option[2]}`}</h2>
                      </button>
                    ))}
              </div>
        </div>
    )
}

export default SearchBar;