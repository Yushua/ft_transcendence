import { newWindow } from "../App";
import UserProfilePage from "../UserProfile/UserProfile";

export function ButtonRefresh() {
  newWindow(<UserProfilePage/>);
}

function UserProfileComponent() {
    return (
      <button onClick={() => {ButtonRefresh()}}>UserProfile</button>
    )
}

export default UserProfileComponent;