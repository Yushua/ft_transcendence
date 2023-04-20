import React, { useEffect, useState } from 'react';
import HTTP from '../Utils/HTTP';
import OtherUserProfile from '../UserProfile/ProfilePages/OtherUserProfile';
import { SetWindowProfile } from '../UserProfile/ProfileMainWindow';
import { Box } from '@mui/material';
import { Width } from '../MainWindow/MainWindow';

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
    SetWindowProfile(<OtherUserProfile id={e}/>, true)
  };
    return (
        <>
          {ListSearchList.map((option, index) => (
              <Box
                fontFamily={"'Courier New', monospace"}
                fontSize={"100%"}
                marginTop={`${Width*0.3}px`}
                key={index}
                className='normal_object'
                style={{ alignItems: 'center', justifyContent: "center", width: `${widthButton}px`, height: `${1.7*widthButton}px`, marginLeft: `${width*0.02}px`, marginRight: `${width*0.02}px`, marginTop: `${width*0.02}px`, marginBottom: `${width*0.02}px`}}
                >
                  <img onClick={() => handleButtonClick(option[3])} src={`${HTTP.HostRedirect()}pfp/${option[0]}`} alt="" className='image_button' style={{width: `${widthButton - width*0.03}px`, height: `${widthButton - width*0.03}px`}}/>
                  <h2 >{`${option[1]}`}</h2>
                  <h2 >{`${option[2]}`}</h2>
              </Box>
          ))}
        </>
    )
}

export default FriendListBar;