import { newWindow } from "../App";
import SearchBarFriend from "../Search bar/SearchbarFriend";

export function ButtonRefresh() {
  newWindow(<SearchBarFriend/>)
}

function FriendListSearchButtonComponent() {
    return (
      <button onClick={() => {ButtonRefresh()}}>Friendlist</button>
    )
}

export default FriendListSearchButtonComponent;