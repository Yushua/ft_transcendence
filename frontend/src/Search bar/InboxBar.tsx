import React, { useEffect, useState } from 'react';
import HTTP from '../Utils/HTTP';
import { Width } from '../MainWindow/MainWindow';
import { Box } from '@mui/material';

export async function asyncAchievmentList(id:string){
  const response = HTTP.Get(`user-profile/GetMessageList`, null, {Accept: 'application/json'})
  if (response) {
		let messages = await JSON.parse(response)
		_setList(messages)
    console.log("front")
    console.log(messages)
	}
}

export async function asyncRemoveMessage(id:string){
  HTTP.Post(`user-profile/removemessage/${id}`, null, {Accept: 'application/json'})
}
async function getList(id:string){
  await asyncAchievmentList(id)
}

async function removeMessage(id:string){
  await asyncRemoveMessage(id)
  _setDisplay(false)
}


var _setList:React.Dispatch<React.SetStateAction<string[][]>>

/*
  get message if you get an
  - achievement
  - a friend gets one

  maybe
  - only when you have them set up, you need to follow them to have this option, so only in unfollow
  - 
*/

var _setDisplay:React.Dispatch<React.SetStateAction<boolean>>

function InboxBar(props: any) {
  //get into page, get the entire list online
  const [ListSearchList, setList] = useState<any[]>([]);
  const [width, setwidth] = useState<number>(props.width);
  const [Display, setDisplay] = useState<boolean>(false);
  _setList = setList
  _setDisplay = setDisplay
  if (Display == false){
    getList(props.id)
    setDisplay(true)
  }
  var boxwidth:number = props.width*0.9
  var buttonsize:number = ((Width*0.9) - (Width*0.9*0.03 * 6 * 2))/6
  var border:number = Width*0.005
  const handleButtonClick = (e: string) => {
    removeMessage(e)
  };
  //have an objext, 0.8
    return (
        < >
          {ListSearchList.map((option, index) => (
            <div
              style={{ width: `${boxwidth}px`, marginLeft: `${width*0.02}px`, marginRight: `${width*0.02}px`, marginTop: `${width*0.02}px`, marginBottom: `${width*0.02}px`, border: `${Width*0.005}px solid black`}}>
              <div
                key={index}
                style={{display: "inline-block", flex: 1, alignItems: "center", justifyContent: "center", width: `${boxwidth - (buttonsize - (border*2))}px`, height: `${buttonsize - (border*2)}px`, overflow: "hidden", textOverflow:"ellipsis", top:"0px"}}
                >
                  {option.message}
              </div>
              <button
                style={{display: "inline-block", cursor: "pointer", alignItems: "center", justifyContent: "center", width: `${buttonsize - (border*2)}px`, height: `${buttonsize - (border*2)}px`, overflow: "hidden", textOverflow:"ellipsis", top="0px"}}
                onClick={() => handleButtonClick(option.id)}
              >
                <h2 >X</h2>
              </button>
            </div>
          ))}
        </>
    )
}

export default InboxBar;