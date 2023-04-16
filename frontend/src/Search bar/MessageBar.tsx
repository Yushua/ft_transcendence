import React, { useEffect, useState } from 'react';
import HTTP from '../Utils/HTTP';
import OtherUserProfile from '../UserProfile/ProfilePages/OtherUserProfile';
import { SetWindowProfile } from '../UserProfile/ProfileMainWindow';
import { Width } from '../MainWindow/MainWindow';

export async function asyncAchievmentList(id:string){
  const response = HTTP.Get(`user-profile/GetMessageList`, null, {Accept: 'application/json'})
  if (response) {
		let messages = await JSON.parse(response)
		_setList(messages)
    console.log("front")
    console.log(messages)
	}
}

async function getList(id:string){
  await asyncAchievmentList(id)
}

var _setList:React.Dispatch<React.SetStateAction<string[][]>>

/*
  get message if you get an
  - acheivement
  - a friend gets one

  maybe
  - when someone befriends you (if this message is already in there, do nothing)
  - 
*/

function MessageBar(props: any) {
  //get into page, get the entire list online
  const [ListSearchList, setList] = useState<any[]>([]);
  const [width, setwidth] = useState<number>(props.width);
  _setList = setList
  useEffect(() => {
		getList(props.id)
	}, []); // empty dependency array means it will only run once

  const handleButtonClick = (e: string) => {
    SetWindowProfile(<OtherUserProfile id={e}/>)
  };
  //have an objext, 0.8
    return (
        <div >
          {ListSearchList.map((option, index) => (
              <button
                key={index}
                style={{ display: "flex", width: `${props.width*0.9}px`, maxHeight: `${((Width*0.9) - (Width*0.9*0.03 * 6 * 2))/6}px`, overflow: "hidden", textOverflow:"ellipsis", marginLeft: `${width*0.02}px`, marginRight: `${width*0.02}px`, marginTop: `${width*0.02}px`, marginBottom: `${width*0.02}px`}}
                onClick={() => handleButtonClick(option[3])}>
                  <h2 >{`${option.message}`}</h2>
              </button>
          ))}
        </div>
    )
}

export default MessageBar;