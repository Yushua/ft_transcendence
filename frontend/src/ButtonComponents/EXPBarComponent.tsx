import { useState } from "react";
import { newWindow } from "../App";
import UserProfilePage from "../UserProfile/UserProfile";
import './ExpBar.css';

export function ButtonRefresh() {
  newWindow(<UserProfilePage/>);
}

function EXPBarComponent() {
  const [exp, setExp] = useState<number>((8*10));
  const [expPercent, setExpPercent] = useState<number>((8*10 % 100));
  const [level, setlevel] = useState<number>((8*10 / 100) % 1);
  
    return (
      <div>
        <div style={{ width: "200px", height: "20px", backgroundColor: '#333' }}>
        <div style={{ width: `${expPercent}%`, height: "20px", backgroundColor: 'green' }}></div>
       </div>
      </div>
    )
}

export default EXPBarComponent;