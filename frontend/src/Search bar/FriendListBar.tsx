import React, { useEffect, useState } from 'react';
import HTTP from '../Utils/HTTP';
import OtherUserProfile from '../UserProfile/ProfilePages/OtherUserProfile';
import { SetWindowProfile } from '../UserProfile/ProfileMainWindow';

export async function asyncAchievmentList(id:string){
  const response = HTTP.Get(`user-profile/GetFriendList/${id}`, null, {Accept: 'application/json'})
  var result = await JSON.parse(response)
  _setList(result["list"])
}

async function getList(id:string){
  await asyncAchievmentList(id)
}

var _setList:React.Dispatch<React.SetStateAction<string[][]>>

function FriendListBar(props: any) {
  //get into page, get the entire list online
  const [ListSearchList, setList] = useState<string[][]>([]);
  const [width, setwidth] = useState<number>(props.width);
  const [Id, setId] = useState<string>(props.id);
  const [widthButton, setwidthButton] = useState<number>(((width*0.9) - (width*0.9*0.03 * 3 * 2))/3);
  _setList = setList
  useEffect(() => {
		getList(Id)
	}, []); // empty dependency array means it will only run once

  const handleButtonClick = (e: string) => {
    SetWindowProfile(<OtherUserProfile id={e}/>)
  };
    return (
        <div >
          {ListSearchList.map((option, index) => (
              <div
                className='image_button'
                key={index}
                style={{ display: "inline-block", width: `${widthButton}px`, marginLeft: `${width*0.02}px`, marginRight: `${width*0.02}px`, marginTop: `${width*0.02}px`, marginBottom: `${width*0.02}px`}}
                onClick={() => handleButtonClick(option[3])}>
                  <img src={`${HTTP.HostRedirect()}pfp/${option[0]}`} alt="" style={{width: `${widthButton - width*0.03}px`, height: `${widthButton - width*0.03}px`, border: "4px solid black"}}/>
                  <h2 >{`${option[1]}`}</h2>
                  <h2 >{`${option[2]}`}</h2>
              </div>
          ))}
        </div>
    )
}

export default FriendListBar;