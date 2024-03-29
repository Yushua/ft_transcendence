import React, { useState } from 'react';
import { Width } from '../MainWindow/MainWindow';
import OtherUserProfile from '../UserProfile/ProfilePages/OtherUserProfile';
import HTTP from '../Utils/HTTP';
import User from '../Utils/Cache/User';
import { SetWindowProfile } from '../UserProfile/ProfileMainWindow';

export async function asyncGetSearchList(SearchTerm:string){
  try {
    const response = HTTP.Patch(`user-profile/SearchList`, {username: SearchTerm}, {Accept: 'application/json'})
    var result = await JSON.parse(response)
    _setNameSearchList(await result["searchlist"])
  } catch (error) {
    console.log(error)
  }
}

async function getListSearchList(SearchTerm:string){
  asyncGetSearchList(SearchTerm)
}

var _setNameSearchList:React.Dispatch<React.SetStateAction<string[][]>>

function SearchBar() {
  //get into page, get the entire list online
  const [ListSearchList, setNameSearchList] = useState<string[][]>([]);
  const [SearchTerm, setSearchTerm] = useState("");
  const [Display, setDisplay] = useState<Boolean>(false);
  _setNameSearchList = setNameSearchList

  function handleInputChange(event: React.ChangeEvent<HTMLInputElement>) {
    setSearchTerm(event.target.value)
    if (Display === true && event.target.value.length < 5){
      _setNameSearchList([])
      setDisplay(false);
    }
    else if (event.target.value.length >= 5){
      getListSearchList(event.target.value)
      setDisplay(true);
    }
  }
  const handleButtonClick = (e: any) => {
    var id:string = e
    SetWindowProfile(<OtherUserProfile id={id} userId={User.ID}/>, true)
  };
    return (
        <div >
              <input type="text" value={SearchTerm} onChange={handleInputChange} style={{border: "solid", borderColor: "#3676cc", marginTop: `${Width*0.02}px`, marginBottom: `${Width*0.02}px`}}/>
              {/* the size of the buttons, should include the profile picture, and the tet underneadth*/}
              <div style={{ display: "flex", width: `${Width * .9}px`, height: `${Width * 1.5}px`, overflowY: "scroll", border: "solid", borderColor: "#3676cc", borderRadius: `${Width * 0.01}px`, }}>
                    {/*  button size */}
                    {ListSearchList.map((option, index) => (
                      //hey, f this index is 3 dividable, then go to next round
                      <div
                        className='image_button'
                        key={index}
                        style={{ display: "inline-block", width: `${((Width*0.9) - (Width*0.9*0.03 * 3 * 2))/3}px`, height: `${Width*0.2}px`, marginLeft: `${Width*0.02}px`, marginRight: `${Width*0.02}px`, marginTop: `${Width*0.03}px`, marginBottom: `${Width*0.03}px` }}
                        onClick={() => handleButtonClick(option[3])}>
                          <img src={`${HTTP.HostRedirect()}pfp/${option[0]}`} alt="" style={{width: `${0.1*Width}px`, height: `${0.1*Width}px`, alignItems: 'center', marginTop: `${Width*0.02}px`, marginBottom: `${Width*0.01}px`}}/>
                          < div style={{marginTop: `${Width*0.01}px`, marginBottom: `${Width*0.01}px`}}>{`${option[1]}`}</div>
                          < div style={{marginTop: `${Width*0.01}px`, marginBottom: `${Width*0.01}px`}}>{`${option[2]}`}</div>
                      </div>
                    ))}
              </div>
        </div>
    )
}

export default SearchBar;