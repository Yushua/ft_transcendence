import React, { useEffect, useState } from 'react';
import User from '../Utils/Cache/User';
import HTTP from '../Utils/HTTP';
import { Width } from '../MainWindow/MainWindow';

//add the ID to the list
async function asyncaddFriendToList(_friendUsername: string) {
  HTTP.Patch(`user-profile/friendlist/add/${_friendUsername}`, null, {Accept: 'application/json'})
}

export async function asyncAchievmentList(){
  const response = HTTP.Get(`user-profile/GetAchievementList/${User.ID}`, null, {Accept: 'application/json'})
  var result = await JSON.parse(response)
  console.log(`type == ${typeof(await result["list"])}`)
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
}

function AchievementBar(props: any) {
  //get into page, get the entire list online
  const [ListSearchList, setList] = useState<any[]>([]);
  const [width, setwidth] = useState<number>(props.width);
  const [height, setheight] = useState<number>(props.height);
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
          {ListSearchList.map((option) => (
            <button
              key={option}
              style={{ display: "inline-block", width: `${widthButton}px`, height: `${widthButton}px`, marginLeft: `${width*0.02}px`, marginRight: `${width*0.02}px`, marginTop: `${width*0.02}px`, marginBottom: `${width*0.02}px`, border: "4px solid black" }}
              onClick={() => handleButtonClick(option)}>
                <img src={`${HTTP.HostRedirect()}pfp/${option.pictureLink}`} alt="" style={{width: `${widthButton - width*0.03}px`, height: `${widthButton - width*0.03}px`, alignItems: 'center'}}/>
            </button>
          ))}
        </div>
    )
}

export default AchievementBar;