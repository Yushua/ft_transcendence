import React, { useEffect, useState } from 'react';
import User from '../Utils/Cache/User';
import HTTP from '../Utils/HTTP';

export async function asyncAchievmentList(){
  const response = HTTP.Get(`user-profile/GetFriendList/${User.ID}`, null, {Accept: 'application/json'})
  var result = await JSON.parse(response)
  _setList(Object.values(result["list"]))
}

export async function asyncGetUser(){
  const response = HTTP.Get(`user-profile/GetFriendList/${User.ID}`, null, {Accept: 'application/json'})
  var result = await JSON.parse(response)
  _setList(Object.values(result["list"]))
}

async function getList(){
  await asyncAchievmentList()
  // const myArr = Object.values(myObj).map(val => val * 2);
}

var _setList:React.Dispatch<React.SetStateAction<string[][]>>

type Props = {
  width:number;
  height:number;
}

function FriendListBar(props: any) {
  //get into page, get the entire list online
  const [ListSearchList, setList] = useState<string[][]>([]);
  const [width, setwidth] = useState<number>(props.width);
  const [widthButton, setwidthButton] = useState<number>(((width*0.9) - (width*0.9*0.03 * 3 * 2))/3);
  _setList = setList
  useEffect(() => {
		getList()
	}, []); // empty dependency array means it will only run once

  const handleButtonClick = (e: any) => {
    var stuff:any = e
    alert(`I am in click {${stuff.message}} {${stuff.nameAchievement}}`)
    // newWindow(<OtherUserProfile id={id}/>)
  };
    return (
        <div >
          {ListSearchList.map((option, key) => (
            <button
              key={key}
              style={{ display: "inline-block", width: `${widthButton}px`, height: `${widthButton}px`, marginLeft: `${width*0.02}px`, marginRight: `${width*0.02}px`, marginTop: `${width*0.02}px`, marginBottom: `${width*0.02}px`}}
              onClick={() => handleButtonClick(option)}>
                <img src={`${HTTP.HostRedirect()}pfp/${option[0]}`} alt="" style={{width: `${widthButton - width*0.03}px`, height: `${widthButton - width*0.03}px`, border: "4px solid black"}}/>
            </button>
          ))}
        </div>
    )
}

export default FriendListBar;