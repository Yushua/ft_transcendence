import { useState } from "react";
import OverlayGameData from "./OverlayGameInformation";
import OverlayAchievementData from "./OverlayAchievementData";

export const onClose= () =>{
  _setShowOverlay(false)
}

type props = {
  GameData:any;
  AchievementData:any;
  status:boolean;
  infoSend:string;
}

var _setShowOverlay:React.Dispatch<any>

const OverlaySetup = (props) => {
  const [showOverlay, setShowOverlay] = useState(props.status);
  alert(`i am in with{${props.infoSend}}`)
  _setShowOverlay = setShowOverlay
  if (showOverlay) {
    if (props.infoSend == "game"){
      return (
        <div>
          <button onClick={onClose}>
            <OverlayGameData gameData={props.gameData}/>
          </button>
        </div>
      );
    }
  else if (props.infoSend == "achieve"){
      return (
        <div>
          <button onClick={onClose}>
            <OverlayAchievementData AchievementData={props.AchievementData}/>
          </button>
        </div>
      );
    }
  }
  else {
    return 
  }
};



export default OverlaySetup;