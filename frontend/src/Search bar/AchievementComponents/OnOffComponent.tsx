import { useEffect, useState } from "react";
import { Width } from "../../MainWindow/MainWindow";
import HTTP from "../../Utils/HTTP";

var buttonsize:number = ((Width*0.9) - (Width*0.9*0.03 * 6 * 2))/6
var border:number = Width*0.005

/**
 * get AchieveMessage Status
 * get ServerMessage Status
 */
async function AsyncGetThisStatus(status:string):Promise<boolean> {
  const response = HTTP.Get(`user-profile/get${status}Status`, null, {Accept: 'application/json'})
  var result = await JSON.parse(response)
  console.log(`status before {${result["status"]}}`)
  return (result["status"])
}

async function AsyncPostThisStatus(status:string, change:boolean) {
  console.log(`posting {${change}}`)
  HTTP.Post(`user-profile/Post${status}Status/${change}`, null, {Accept: 'application/json'})
}

var _setDisplay:React.Dispatch<React.SetStateAction<boolean>>

function OnOFFComponent(props: any){
  const [ButtonStatus, setButtonStatus] = useState<boolean>(true);
  const [Display, setDisplay] = useState<boolean>(false);

  _setDisplay = setDisplay

  if (Display === false){
		setup()
    setDisplay(true)
  }

  async function handleOn(){
    //turn it true. so then it goes to turning false
    await AsyncPostThisStatus(props.string, true)
    setButtonStatus(await AsyncGetThisStatus(props.string))
    setDisplay(false)
  };

  async function handleOff(){
    await AsyncPostThisStatus(props.string, false)
    setButtonStatus(await AsyncGetThisStatus(props.string))
    setDisplay(false)
  };

  async function setup(){
    setButtonStatus(await AsyncGetThisStatus(props.string))
    }

  return (
    <div>
      {ButtonStatus ?
        <button
        style={{ display: "inline-block", marginLeft: `${Width*0.02}px`, marginRight: `${Width*0.02}px`, marginTop: `${Width*0.02}px`, marginBottom: `${Width*0.02}px`}}
        onClick={() => handleOff()}>
        <h2 >{`turn ${props.string} Off`}</h2>
      </button>
        :
        <button
          style={{ display: "inline-block", marginLeft: `${Width*0.02}px`, marginRight: `${Width*0.02}px`, marginTop: `${Width*0.02}px`, marginBottom: `${Width*0.02}px`}}
          onClick={() => handleOn()}>
          <h2 >{`turn ${props.string} On`}</h2>
        </button>
      }
    </div>
  );
}

export default OnOFFComponent;
