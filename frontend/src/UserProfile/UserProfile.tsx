import React, { useState } from 'react';
import './UserProfile.css';
import '../App.css';
import HTTP from '../Utils/HTTP'
import EXPBarComponent from '../ButtonComponents/EXPBarComponent';
import User from '../Utils/Cache/User';
import SearchBarFriend from '../Search bar/SearchbarFriend';
import AchievementsComponent from '../ButtonComponents/AchievementsComponent';
import NameStorage from '../Utils/Cache/NameStorage';
import { Width } from '../MainWindow/MainWindow';

async function asyncGetName():Promise<string> {
  const response = HTTP.Get(`user-profile/user`, null, {Accept: 'application/json'})
  var result = await JSON.parse(response)
  return await result["username"];
}

export async function asyncChangeName(newUsername:string) {
  HTTP.Post(`user-profile/userchange/${newUsername}`, null, {Accept: 'application/json'})
}

interface FormElements extends HTMLFormControlsCollection {
  username: HTMLInputElement
  newInput: HTMLInputElement
}

export interface YourFormElement extends HTMLFormElement {
  readonly elements: FormElements
 }

var _setNameDisplay: React.Dispatch<React.SetStateAction<string>>

async function asyncToggleGetName(){
  _setNameDisplay(await asyncGetName())
};

function UserProfilePage() {
  const [nameDisplay, setNameDisplay] = useState<string>("");
  const [TotalExp, setExp] = useState<number>((User.wins*10));
  _setNameDisplay = setNameDisplay
  if (nameDisplay === ""){
    asyncToggleGetName()
  }
  //in the end, Friendlist will be displayed on the side
  console.log(User.ProfilePicture)
  return (
    <center>
      <div className={"MainWidnow"} style={{width: `${Width}px`}}>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <img src={`${HTTP.HostRedirect()}pfp/${NameStorage.UserPFP.Get(User.ID)}`} alt="" style={{width: `${0.1*Width}px`, height: `${0.1*Width}px`, alignItems: 'center', padding: `${0.01*Width}px`}}/>
              <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: `${0.01*Width}px`}}>
                <h2 >{`Welcome: ${User.Name}`}</h2>
              </div>
            </div>

            <div> <EXPBarComponent/> </div>
            
            {/* centter left will have two blocks. one achievement, the other, games played. the right will have the friendlist*/}
            <div style={{ display: 'flex', alignItems: 'center', width: `${Width}px` }}>
              {/* includes Achievement and games played in a small box format*/}
              {/* friendlist heightbox == (width - (0.02*Width))/2 */}
              <div style={{ display: 'flex', alignItems: 'center', width: `${Width}px` }}>
                {/* width of the box == (width - (0.03*Width))/2 */}
                {/* height of the box == (width - (0.03*Width))/2 */}
              </div>
            </div>

        {/* <div>
        </div >
        <div style={{width: "145px", height: "300px", border: "2px solid black", overflow: "auto"}}>
          <div style={{display: 'flex'}}>
            <SearchBarFriend/>
          </div>
            <AchievementsComponent/>
        </div> */}

      </div>
    </center>
    //logout when initialized
  );
}

export default UserProfilePage;
