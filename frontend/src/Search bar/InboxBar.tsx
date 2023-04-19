import React, { useState } from 'react';
import HTTP from '../Utils/HTTP';
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
  const [Display, setDisplay] = useState<boolean>(false);
  _setList = setList
  _setDisplay = setDisplay
  if (Display === false){
    getList(props.id)
    setDisplay(true)
  }
  var boxwidth:number = props.width*0.9
  var buttonsize:number = ((Width*0.9) - (Width*0.9*0.03 * 6 * 2))/6
  var border:number = Width*0.005
  const handleButtonClick = (e: string) => {
    removeMessage(e)
  };
  {/* object around then text, then button*/}
    return (
        < >
          {ListSearchList.map((option, index) => (
            <div
              style={{width: `${boxwidth}px`, height: `${buttonsize - (border*2)}px`, overflow: "hidden", textOverflow:"ellipsis", marginRight: `${props.width*0.02}px`, marginTop: `${props.width*0.02}px`, marginBottom: `${props.width*0.02}px`, borderColor: "#3676cc", borderRadius: "5px"}}>
              <div
                key={index}
                style={{display: "inline-block", flex: 1, width: `${boxwidth - buttonsize - (border*4)}px`, height: `${buttonsize - border*2}px`, top:"0px"}}
                >
                  <h2>{option.message}</h2>
              </div>
              <button
                style={{display: "inline-block", cursor: "pointer", width: `${buttonsize - border*2}px`, height: `${buttonsize - border*2}px`, top:"0px"}}
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