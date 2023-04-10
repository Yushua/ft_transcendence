import React, { useEffect, useState } from 'react';
import HTTP from '../Utils/HTTP';
import { newWindow } from '../App';
import OverlaySetup from '../UserProfile/OverlaySetup';
import { setupOverlay } from '../UserProfile/UserProfile';
import OverlayGameData from '../UserProfile/OverlayGameInformation';

export async function asyncAchievmentList(id:string){
  const response = HTTP.Get(`gamestats/${id}`, null, {Accept: 'application/json'})
  var result = await JSON.parse(response)
  _setList(Object.values(result))
}

async function getList(id:string){
  await asyncAchievmentList(id)
  // const myArr = Object.values(myObj).map(val => val * 2);
}

var _setList:React.Dispatch<React.SetStateAction<string[]>>

type Props = {
  width:number;
  height:number;
  id:string
}


function GameDataBar(props: any) {
  //get into page, get the entire list online
  const [ListSearchList, setList] = useState<any[]>([]);
  const [width, setwidth] = useState<number>(props.width);
  const [gameData, setGameData] = useState<any>(null);
  const [widthButton, setwidthButton] = useState<number>(((width*0.9) - (width*0.9*0.03 * 3 * 2))/3);

  _setList = setList
  useEffect(() => {
		getList(props.id)
	}, []); // empty dependency array means it will only run once

  const handleButtonClick = (e: any) => {
    var stuff:any = e
    setGameData(stuff)
    setupOverlay(true, <OverlayGameData  gameData={gameData} />)
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