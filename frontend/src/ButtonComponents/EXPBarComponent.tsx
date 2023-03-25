import { useState } from "react";
import { newWindow } from "../App";
import UserProfilePage from "../UserProfile/UserProfile";
import User from "../Utils/Cache/User";

export function ButtonRefresh() {
  newWindow(<UserProfilePage/>);
}

function EXPBarComponent() {
  const [TotalExp, setExp] = useState<number>((User.wins*10));
  const [expPercent, setExpPercent] = useState<number>((User.wins % 100));
  const [expbarPercent, setBarExpPercent] = useState<number>((User.wins % 10));
  const [level, setlevel] = useState<number>(Math.floor(User.wins / 10));
    return (
      <div>
        <div style={{ width: "200px", height: "20px", backgroundColor: '#333', color: 'white', textAlign: 'center'  }}>
          <div style={{ width: `${(expbarPercent) * 20}px`, height: "20px", backgroundColor: 'green' }}>
            <div style={{ width: "200px", height: "20px", color: 'white', textAlign: 'center'  }}>level {level} - {expPercent}%</div>
          </div>
       </div>
      </div>
    )
}

export default EXPBarComponent;