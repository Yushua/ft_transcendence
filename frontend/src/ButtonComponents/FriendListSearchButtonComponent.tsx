import { newWindow } from "../App";
import SearchBarFriend from "../Search bar/SearchbarFriend copy";

export function ButtonRefresh() {
  newWindow(<SearchBarFriend/>)
}

function FriendListSearchButtonComponent() {
    return (
      <button onClick={() => {ButtonRefresh()}}>Friendlist</button>
    )
}

export default FriendListSearchButtonComponent;