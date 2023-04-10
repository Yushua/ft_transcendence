import { useEffect, useState } from "react";
import { newWindow } from "../App";
import { Width } from "../MainWindow/MainWindow";
import UserProfilePage from "../UserProfile/UserProfile";
import HTTP from "../Utils/HTTP";

async function AsyncGetExp(id:string):Promise<number> {
  const response = HTTP.Get(`user-profile/Experience/${id}`, null, {Accept: 'application/json'})
  return await JSON.parse(response)
}

export function ButtonRefresh() {
  newWindow(<UserProfilePage/>);
}

type props = {
  id:string
}
var _setExp:React.Dispatch<React.SetStateAction<number>>

function EXPBarComponent(props: any) {
  const [TotalExp, setExp] = useState<number>(-1);
  const [expPercent, setExpPercent] = useState<number>(0);
  const [level, setlevel] = useState<number>(0);
  _setExp = setExp
  useEffect(() => {
    if (TotalExp == -1){
      setupExp(props.id)
    }
    async function setupExp(id:string){
      setExp(await AsyncGetExp(id))
      alert(`exp after{${TotalExp}}`)
      setExpPercent((TotalExp % 100))
      setlevel(Math.floor(TotalExp / 10))
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