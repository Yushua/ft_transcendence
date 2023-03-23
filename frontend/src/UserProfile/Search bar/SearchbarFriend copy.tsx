import React, { useState } from 'react';
import HTTP from '../../Utils/HTTP';
import SeachBarButton from '../BarSetup';
import UserProfileComponent from '../ButtonComponents/UserProfileComponent';

async function asyncReturnID(usernameFriend: string) {
  const response = HTTP.Get(`user-profile/returnID/${usernameFriend}`, null, {Accept: 'application/json'})
  var result = await JSON.parse(response)
}

//add the ID to the list
async function addFriendToList(_friendID: string) {
  HTTP.Patch(`user-profile/friendlist/add/${_friendID}`, null, {Accept: 'application/json'})
}

var list_:string[];
export async function asyncGetFriendListById(){
  const response = HTTP.Get(`user-profile/userAddListusername`, null, {Accept: 'application/json'})
  var result = await JSON.parse(response)
  list_ = result
}

function SearchBarFriend() {
  const [selectedButton, setSelectedButton] = useState<string>('');
  
  const buttonLabels = ['flipy', 'yusha', 'hey', 'hey', 'hey', 'hey', 'hey', 'hey', 'hey', 'hey'];
  const handleClick = (value: string) => {
    setSelectedButton(value);
    // do something with the button value
  };

    return (
      <div>
        <div>
         <UserProfileComponent/>
        </div>
           <div className="button-container">
          {buttonLabels.map((buttonLabels, index) => {
            return (
              <button key={index} className="button-item" onClick={() => handleClick(buttonLabels)}>
                {buttonLabels}
              </button>
            );
          })}
        </div>
      </div>
    )
}

export default SearchBarFriend;