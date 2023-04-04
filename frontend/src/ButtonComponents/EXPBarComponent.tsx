import { useState } from "react";
import { newWindow } from "../App";
import { Width } from "../MainWindow/MainWindow";
import UserProfilePage from "../UserProfile/UserProfile";
import User from "../Utils/Cache/User";

export function ButtonRefresh() {
  newWindow(<UserProfilePage/>);
}

function EXPBarComponent() {
  const [TotalExp, setExp] = useState<number>((User.wins*10));
  const [expPercent, setExpPercent] = useState<number>((User.wins % 100));
  const [level, setlevel] = useState<number>(Math.floor(User.wins / 10));
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