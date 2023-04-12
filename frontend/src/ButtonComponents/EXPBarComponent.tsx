import { useEffect, useState } from "react";
import { Width } from "../MainWindow/MainWindow";
import HTTP from "../Utils/HTTP";

async function AsyncGetOtherUser(otherId: string):Promise<any> {
  const response = HTTP.Get(`user-profile/user/${otherId}`, null, {Accept: 'application/json'})
  var result = await JSON.parse(response)
  _setExpPercent((result["experience"] % 100))
  _setlevel(Math.floor(result["experience"] / 100))
}

async function setupExp(id:string){
  await AsyncGetOtherUser(id)
}

type props = {
  id:string
}
var _setExpPercent:React.Dispatch<React.SetStateAction<number>>
var _setlevel:React.Dispatch<React.SetStateAction<number>>

function EXPBarComponent(props: any) {
  //make it a float
  const [expPercent, setExpPercent] = useState<number>(0);
  const [level, setlevel] = useState<number>(0);
  const [Window, setWindow] = useState<boolean>(false);

  _setExpPercent = setExpPercent
  _setlevel = setlevel

  useEffect(() => {
    if (Window === false){
      setupExp(props.id)
      setWindow(true)
    }
	}, []); // empty dependency array means it will only run once
  const barWidth = Width * .88
  const barHeight = 0.034 * Width
  const fontHeight = 0.025 * Width
  return (
      <div>
        <div style={{
            width: `${barWidth}px`,
            height: `${barHeight}px`,
            boxSizing: "border-box",
            backgroundColor: '#333',
            textAlign: 'center',
            border: "solid",
            borderColor: "#3676cc",
            borderRadius: "5px",
            overflow: "hidden"
          }}>
          <div style={{
            width: `${(expPercent / 100) * barWidth}px`,
            height: `${barHeight}px`,
            boxSizing: "border-box",
            backgroundColor: "#3676cc",
          }}>
            <div style={{
              width: `${barWidth}px`,
              boxSizing: "border-box",
              color: 'white',
              fontSize: `${fontHeight}px`,
            }}>level {level} - {expPercent}%
            </div>
          </div>
        </div>
      </div>
    )
}

export default EXPBarComponent;
