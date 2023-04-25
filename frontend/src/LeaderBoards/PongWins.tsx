import { useEffect, useState } from 'react';
import '../App.css';
import { Width } from '../MainWindow/MainWindow';
import HTTP from '../Utils/HTTP';

async function asyncGetList(){
  const response = HTTP.Get(`user-profile/PongWinsList`, null, {Accept: 'application/json'})
  var result = await JSON.parse(response)
  _setList(await result["list"])
}

async function asyncPutList(){
  await asyncGetList()
}

var _setList:React.Dispatch<React.SetStateAction<string[][]>>

function PongWins(){
  const [List, setList] = useState<string[][]>([]);
  _setList = setList

  useEffect(() => {
      asyncPutList()
	}, []);
  const style1= {
    display: "inline-block",
    alignItems: 'center',
    justifyContent: "center", 
    width: `${Width*0.1}px`, 
    marginLeft: `${Width*0.02}px`, 
    marginRight: `${Width*0.02}px`, 
    marginTop: `${Width*0.005}px`, 
    marginBottom: `${Width*0.005}px`, 
  }
  const style2= {
    display: "inline-block",
    alignItems: 'center',
    justifyContent: "center", 
    width: `${Width*0.4}px`, 
    marginLeft: `${Width*0.02}px`, 
    marginRight: `${Width*0.02}px`, 
    marginTop: `${Width*0.005}px`, 
    marginBottom: `${Width*0.005}px`, 
  }
  return (
      <>
        <div style={{ fontFamily: "'Courier New', monospace",  fontSize: `${Width*0.05/2}px`}}>
          <div style={style1}>
            Rank
          </div>
          <div style={style2}>
            Name
          </div>
          <div style={style1}>
            Wins
          </div>
          <div style={style1}>
            Losses
          </div>
        </div>
        <div style={{marginTop: `${Width*0.005}px`, marginBottom: `${Width*0.005}px`}}> </div>
        {List.map((option, index) => (
          <div key={index} style={{ fontFamily: "'Courier New', monospace",  fontSize: `${Width*0.05/2}px`}}>
            <div style={style1}>
              {index + 1}
            </div>
            <div style={style2}>
              {option[0]}
            </div>
            <div style={style1}>
              {option[1]}
            </div>
            <div style={style1}>
              {option[2]}
          </div>
        </div>
        ))}
      </>
  );
}

export default PongWins;
