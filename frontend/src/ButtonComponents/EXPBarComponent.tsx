import { useEffect, useState } from "react";
import { newWindow } from "../App";
import { Width } from "../MainWindow/MainWindow";
import UserProfilePage from "../UserProfile/UserProfile";
import HTTP from "../Utils/HTTP";

async function AsyncGetOtherUser(otherId: string):Promise<any> {
  const response = HTTP.Get(`user-profile/user/${otherId}`, null, {Accept: 'application/json'})
  var result = await JSON.parse(response)
  _setExp(result["experience"])
  _setExpPercent((result["experience"] % 100))
  _setlevel(Math.floor(result["experience"] / 10))
}

async function setupExp(id:string){
  await AsyncGetOtherUser(id)
}

type props = {
  id:string
}
var _setExp:React.Dispatch<React.SetStateAction<number>>
var _setExpPercent:React.Dispatch<React.SetStateAction<number>>
var _setlevel:React.Dispatch<React.SetStateAction<number>>

function EXPBarComponent(props: any) {
  const [TotalExp, setExp] = useState<number>(-1);
  const [expPercent, setExpPercent] = useState<number>(0);
  const [level, setlevel] = useState<number>(0);
  const [Window, setWindow] = useState<boolean>(false);

  _setExp = setExp
  _setExpPercent = setExpPercent
  _setlevel = setlevel

  useEffect(() => {
    if (Window === false){
      setupExp(props.id)
      setWindow(true)
    }
	}, []); // empty dependency array means it will only run once
    return (
      <div>
        <div style={{ width: `${Width}px`, height: `${0.05 * Width}px`, backgroundColor: '#333', color: 'white', textAlign: 'center', padding: `${0.01*Width}px` }}>
          <div style={{ width: `${(expPercent) * Width}px`, height: `${0.05 * Width}px`, backgroundColor: 'green' }}>
            <div style={{ width: `${Width}px`, height: `${0.05 * Width}px`, color: 'white', textAlign: 'center', justifyContent: 'center', fontSize: `${0.05 * Width}px` }}>level {level} - {expPercent}%</div>
          </div>
       </div>
      </div>
    )
}

export default EXPBarComponent;