import { Dispatch, SetStateAction, useState } from "react";
import { YourFormElement } from "../UserProfile";

var _setDisplay:Dispatch<SetStateAction<boolean>>;
async function TogglePfpChange(e: React.FormEvent<YourFormElement>){
    e.preventDefault();
    // await asyncChangeName(e.currentTarget.elements.username.value);
    _setDisplay(false)
  }

// const UploadProfilePicture: React.FC<DropDownProps> = ({nameOfMenu}: DropDownProps): JSX.Element =>  {
function UploadProfilePicture({}) {
  //remove a funciton to this list that needs to remove the string to the list.

  const [display, setDisplay] = useState(true)
  _setDisplay = setDisplay
  if (display === true){
    _setDisplay(false)
  }

//   async function asyncToggleChangeProfilePicture() {
//     await ChangeProfilePicture()
//   }

  return (
    <div>
        <form onSubmit={TogglePfpChange}>
            <div>
            <label htmlFor="profile picture upload">Profile picture change:</label>
            <input id="username" type="text" />
            <button type="submit">Submit</button>
            </div>
        </form>
    </div>
  )
}

export default UploadProfilePicture;