import React, { useState } from 'react';
import { YourFormElement } from '../UserProfile';

async function handleProfilePicture (e: React.MouseEvent<HTMLButtonElement>){
    e.preventDefault();
    // asyncAddFriend(e.currentTarget.elements.newInput.value);
    // const errorThingy = document.getElementById("errorCode")
    // if (!!errorThingy)
    //  errorThingy.innerHTML = message
  }

  /**
   * sets the profile picture based on the id, and changed the path of the profile pciture when uploading a new picture
    as a ResultType, the previous profile picture will be lost

    the picture will be the button as a result
   */
var link:string = ""; 
function ProfilePicture() {
  const [profilePicture, setProfilePicture] = useState<boolean>(false);
  // const [Storepicture, setStorePicture] = useState<string>("");
  if (profilePicture === false){
    link = "./backend"
    setProfilePicture(true);
  }
    return (
        <div>
          <img src={link} alt="Image" onClick={handleProfilePicture}/>;
        </div>
    )
}

export default ProfilePicture;