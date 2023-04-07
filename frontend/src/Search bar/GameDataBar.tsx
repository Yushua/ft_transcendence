import React, { useEffect, useState } from 'react';
import User from '../Utils/Cache/User';
import HTTP from '../Utils/HTTP';

export async function asyncAchievmentList(){
  const response = HTTP.Get(`user-profile/GameStat/${_id}`, null, {Accept: 'application/json'})
  var result = await JSON.parse(response)
  _setList(Object.values(result["list"]))
}

async function getList(){
  await asyncAchievmentList()
  // const myArr = Object.values(myObj).map(val => val * 2);
}

var _setList:React.Dispatch<React.SetStateAction<string[]>>

type Props = {
  width:number;
  height:number;
  id:string
}

var _id:Number

function GameDataBar(props: any) {
  //get into page, get the entire list online
  const [ListSearchList, setList] = useState<any[]>([]);
  const [width, setwidth] = useState<number>(props.width);
  const [Id, setId] = useState<number>(props.id);

  const [widthButton, setwidthButton] = useState<number>(((width*0.9) - (width*0.9*0.03 * 3 * 2))/3);
  _setList = setList
  _id = Id
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
          {ListSearchList.map((option) => (
            <button
              key={option}
              style={{ display: "inline-block", width: `${widthButton}px`, height: `${widthButton}px`, marginLeft: `${width*0.02}px`, marginRight: `${width*0.02}px`, marginTop: `${width*0.02}px`, marginBottom: `${width*0.02}px`}}
              onClick={() => handleButtonClick(option)}>
                <img src={`${HTTP.HostRedirect()}pfp/${option.pictureLink}`} alt="" style={{width: `${widthButton - width*0.03}px`, height: `${widthButton - width*0.03}px`, border: "4px solid black"}}/>
            </button>
          ))}
        </div>
    )
}

export default GameDataBar;