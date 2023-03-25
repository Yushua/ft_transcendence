import { useState } from "react";
import { newWindow } from "../App";
import UserProfilePage from "../UserProfile/UserProfile";
import './ExpBar.css';

export function ButtonRefresh() {
  newWindow(<UserProfilePage/>);
}

function EXPBarComponent() {
  const [expPercent, setExpPercent] = useState((8*10 % 100));
  const [level, setlevel] = useState((8*10 / 100) % 1);

  const barStyle = {
    width: `${expPercent}%`,
    height: '10px',
    backgroundColor: 'blue',
  };
  const textStyle = {
    color: 'black',
    margin: '5px',
  };

    return (
      <div>
        <div
        style={{
          width: `${expPercent/ 100}%`,
          height: '20px',
          background: 'green',
          color: 'white',
          textAlign: 'center',
        }}
        
      >{expPercent}
      </div>
      <div
        style={{
          width: `${100 - expPercent/ 100}%`,
          height: '20px',
          background: 'lightgray',
          color: 'white',
          textAlign: 'center',
        }}
      >level {level} - {100 - expPercent}%
      </div>
      </div>
    )
}

export default EXPBarComponent;