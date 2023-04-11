import React, { useEffect, useState } from 'react';
import HTTP from '../Utils/HTTP';
import { setupOverlay } from '../UserProfile/UserProfile';
import OverlayGameData from '../UserProfile/OverlayGameInformation';

export async function asyncGetGameDatabyId(id:string){
  const response = HTTP.Get(`gamestats/pongstats/${id}`, null, {Accept: 'application/json'})
  var result = await JSON.parse(response)
  _setList(Object.values(result))
}

async function getGameDataById(id:string){
  await asyncGetGameDatabyId(id)
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
		getGameDataById(props.id)
	}, []); // empty dependency array means it will only run once

  const handleButtonClick = (e: any) => {
    // console.log('stuff:', e)
    var stuff:any = e
    setGameData(stuff)
    setupOverlay(true, <OverlayGameData  gameData={gameData} />)
  };
  const handleButtonClick2 = () => {
    console.log('list:', ListSearchList)
  };


    return (
        <div>
          <button onClick={() => handleButtonClick2()}>click</button>
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