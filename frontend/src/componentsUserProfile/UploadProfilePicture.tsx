import React, { Dispatch, SetStateAction, useState } from "react";
import { YourFormElement } from "../UserProfile";
//https://codesandbox.io/s/react-images-uploading-demo-u0khz?file=/src/index.js:89-111
//file will be seen, by clicking on the file, you will change the profile picture
var _setDisplay:Dispatch<SetStateAction<boolean>>;
async function TogglePfpChange(e: React.FormEvent<YourFormElement>){
    e.preventDefault();
    // await asyncChangeName(e.currentTarget.elements.username.value);
    _setDisplay(false)
  }

// const UploadProfilePicture: React.FC<DropDownProps> = ({nameOfMenu}: DropDownProps): JSX.Element =>  {
function UploadProfilePicture() {
  //remove a funciton to this list that needs to remove the string to the list.

  const [display, setDisplay] = useState(true)
  _setDisplay = setDisplay
  if (display === true){
    _setDisplay(false)
  }


  return (
    <div>
    </div>
  )
}

export default UploadProfilePicture;