import React, { useEffect, useState } from 'react';
import HTTP from '../Utils/HTTP';
import FillSpaceComponentAchieve from './FillSpaceComponent';

export async function asyncAchievmentList(id:string){
  const response = HTTP.Get(`user-profile/GetAchievementListDone/${id}`, null, {Accept: 'application/json'})
  var result = await JSON.parse(response)
  _setList(Object.values(result["list"]))
}

async function getList(id:string){
  await asyncAchievmentList(id)
  // const myArr = Object.values(myObj).map(val => val * 2);
}

var _setList:React.Dispatch<React.SetStateAction<string[]>>

function AchievementBar(props: any) {
  //get into page, get the entire list online
  const [ListSearchList, setList] = useState<any[]>([]);


  _setList = setList
  
  useEffect(() => {
		getList(props.id)
	}, []); // empty dependency array means it will only run once
    return (
      <div>
        {ListSearchList.map((option, idx) => (
          <FillSpaceComponentAchieve option={option} idx={idx} amount={6}></FillSpaceComponentAchieve>
        ))}
      </div>
    )
}

export default AchievementBar;