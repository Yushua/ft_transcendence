import React, { useEffect, useState } from 'react';
import '../../App.css';

import HTTP from '../../Utils/HTTP';
import MainWindowButtonComponent from '../../ButtonComponents/MainWindowButtonComponent';

async function asyncGetuserUsername(id: string):Promise<any> {
	const response = HTTP.Get(`user-profile/user/${id}`, null, {Accept: 'application/json'})
	var user = await JSON.parse(response)
	return await user["user"];
  }


type Props = {
    id: string;
  }

function OtherUserProfile(props: any){

    var id = props["id"];

    const [myUsername, setMyUsername] = useState<string>("");
    const [myPFP, setMyPFP] = useState<string>("");
    const [myWins, setMyWins] = useState<number>(0);
    const [myLosses, setMyLosses] = useState<number>(0);
    const [myAchievements, setMyAchievements] = useState<string[]>([]);

    useEffect(() => {
        setUp(id)
    }, []); // empty dependency array means it will only run once

    // do something with myString
    async function setUp(id:string) {
        var _user: any | null = await asyncGetuserUsername(id)
        setMyUsername(_user.username)
        setMyPFP(_user.profilePicture)
        setMyWins(_user.wins)
        setMyLosses(_user.losses)
        setMyAchievements(_user.AchievementList)
    }

return (
    <div className="UserProfile">
        <div>
            <MainWindowButtonComponent/>
        </div>
        <div>
            <img src={`${HTTP.HostRedirect()}pfp/${myPFP}`} alt="" style={{width: "20px", height: "20px"}}/>
            <label id="name" htmlFor="name">Welcome at {myUsername}</label>
        </div>
    </div>
    );
}

export default OtherUserProfile;
