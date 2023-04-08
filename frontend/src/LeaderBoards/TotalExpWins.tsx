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
	}, []); // empty dependency array means it will only run once
  return (
    <center>
      <div style={{width: `${Width*0.9}px`, height: `${Width*1.5}px`, overflowY: "scroll", border: "2px solid black"}}>
            {/*  button size */}
            {List.map((option, index) => (
              //hey, f this index is 3 dividable, then go to next round
              <button
                key={index}
                style={{ display: "inline-block", width: `${Width*0.8}px`, height: `${Width*0.05}px`, marginLeft: `${Width*0.02}px`, marginRight: `${Width*0.02}px`, marginTop: `${Width*0.005}px`, marginBottom: `${Width*0.005}px`, border: "4px solid black" }}>
                  <h2 >{`[${index}]: name{${option[0]}}: total exp{${option[1]}}`}</h2>
              </button>
            ))}
      </div>
    </center>
  );
}

export default TotalExpWins;
