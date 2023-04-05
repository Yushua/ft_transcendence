import React, { useEffect, useState } from 'react';
import User from '../Utils/Cache/User';
import HTTP from '../Utils/HTTP';

var test:boolean = true
//add the ID to the list
async function asyncaddFriendToList(_friendUsername: string) {
  HTTP.Patch(`user-profile/friendlist/add/${_friendUsername}`, null, {Accept: 'application/json'})
}

export async function asyncAchievmentList(){
  const response = HTTP.Get(`user-profile/GetAchievementList/${User.ID}`, null, {Accept: 'application/json'})
  var result = await JSON.parse(response)
  console.log(`object achieve ${await result["list"]}`)
  _setList(await result["list"])
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

function AchievementBar(props: any) {
  //get into page, get the entire list online
  const [ListSearchList, setList] = useState<object>([]);
  _setList = setList

  useEffect(() => {
		getList()
	}, []); // empty dependency array means it will only run once

  const handleButtonClick = (e: string) => {
    var id:string = e
    alert(`I am in click ${id}`)
    // newWindow(<OtherUserProfile id={id}/>)
  };
    return (
        <div >
           {/* button size
          {ListSearchList.map((option) => (
            //hey, f this index is 3 dividable, then go to next round
            <button
              key={option}
              style={{ display: "inline-block", width: `${((Width*0.9) - (Width*0.9*0.03 * 3 * 2))/3}px`, height: `${Width*0.2}px`, marginLeft: `${Width*0.02}px`, marginRight: `${Width*0.02}px`, marginTop: `${Width*0.03}px`, marginBottom: `${Width*0.03}px`, border: "4px solid black" }}
              onClick={() => handleButtonClick(option[3])}>
                <img src={`${HTTP.HostRedirect()}pfp/${option[0]}`} alt="" style={{width: `${0.05*Width}px`, height: `${0.05*Width}px`, alignItems: 'center', marginRight: `${0.01*Width}px`}}/>
            </button>
          ))} */}
        </div>
    )
}

export default AchievementBar;