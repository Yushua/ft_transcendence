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
  const [ListSearchList, setList] = useState<string[][]>([]);
  var widthButton = ((props.width*0.9) - (props.width*0.9*0.03 * 3 * 2))/3
  _setList = setList
  useEffect(() => {
		getList(props.id)
	}, []);

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
                style={{ alignItems: 'center', justifyContent: "center", width: `${widthButton}px`, height: `${1.7*widthButton}px`, marginLeft: `${props.width*0.02}px`, marginRight: `${props.width*0.02}px`, marginTop: `${props.width*0.02}px`, marginBottom: `${props.width*0.02}px`}}
                >
                  <img onClick={() => handleButtonClick(option[3])} src={`${HTTP.HostRedirect()}pfp/${option[0]}`} alt="" className='image_button' style={{width: `${widthButton - props.width*0.03}px`, height: `${widthButton - props.width*0.03}px`}}/>
                  <h2 >{`${option[1]}`}</h2>
                  <h2 >{`${option[2]}`}</h2>
              </Box>
          ))}
        </>
    )
}

export default FriendListBar;