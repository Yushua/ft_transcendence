import { useEffect, useState } from 'react';
import '../App.css';
import { Width } from '../MainWindow/MainWindow';
import HTTP from '../Utils/HTTP';

async function asyncGetList(){
  const response = HTTP.Get(`user-profile/ExpList`, null, {Accept: 'application/json'})
  var result = await JSON.parse(response)
  _setList(await result["list"])
}

async function asyncPutList(){
  await asyncGetList()
}

var _setList:React.Dispatch<React.SetStateAction<string[][]>>

function TotalExpWins(){
  const [List, setList] = useState<string[][]>([]);
  _setList = setList

  useEffect(() => {
      asyncPutList()
	}, []);
  return (
      <>
        {List.map((option, index) => (
          <button
            key={index}
            style={{  fontFamily: "'Courier New', monospace", fontSize: `${Width*0.05/2}px`, alignItems: 'center', justifyContent: "center", width: `${Width*0.8}px`, marginLeft: `${Width*0.02}px`, marginRight: `${Width*0.02}px`, marginTop: `${Width*0.01}px`, marginBottom: `${Width*0.01}px`, borderColor: "#3676cc", borderRadius: `${Width * 0.01}px`}}>
              {`[${index + 1}] [${option[0]}] exp: [${option[1]}]`}
          </button>
        ))}
      </>
  );
}

export default TotalExpWins;
