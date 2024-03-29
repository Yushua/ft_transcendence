import React, { useState } from 'react';
import HTTP from '../../Utils/HTTP';
import User from '../../Utils/Cache/User';
import FillSpaceComponentAchieve from '../FillSpaceComponent';

async function getAchieveFullList():Promise<any>{
  const response = HTTP.Get(`user-profile/GetAchievementListFull/${User.ID}`, null, {Accept: 'application/json'})
  var result = await JSON.parse(response)
  _setList(Object.values(result["list"]))
  return Object.values(result["list"])
}


var _setList:React.Dispatch<React.SetStateAction<string[][]>>
 //get into page, get the entire list online
 function FullAchievements(props: any){
  const [ListSearchList, setList] = useState<any[]>([]);
  const [Display, setDisplay] = useState<boolean>(false)
  _setList = setList

 _setList = setList
  if (Display === false){
    asyncPutList()
  }

  async function asyncPutList(){
    await getAchieveFullList()
    setDisplay(true)
  }

   return (
    <>
      {ListSearchList.map((option, idx) => (

        <FillSpaceComponentAchieve option={option} idx={idx} amount={6}></FillSpaceComponentAchieve>
      ))}
    </>
   )
}

export default FullAchievements;
