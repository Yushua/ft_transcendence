import { newWindow } from "../App";
import UserProfilePage from "../UserProfile/UserProfile";

export function ButtonRefresh() {
  newWindow(<UserProfilePage/>);
}

function EXPBarComponent() {
    return (
      <div>

      </div>
    )
}

export default EXPBarComponent;