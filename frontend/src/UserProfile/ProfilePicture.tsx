import React, { useState } from 'react';
import HTTP from '../Utils/HTTP';
import User from '../Utils/Cache/User';
import NameStorage from '../Utils/Cache/NameStorage';

export default function ProfilePicture() {
	const [profilePicture, setProfilePicture] = useState<string>(User.ProfilePicture);
	
	return (
		<div>
			<img src={`${HTTP.HostRedirect()}pfp/${NameStorage.UserPFP.Get(User.ID)}`} alt="" style={{width: "2cm", height: "2cm"}}/>
			<input type="file" id="avatar" name="avatar" accept="image/png, image/jpeg, image/gif" onChange={event => {
				if (!event.target.files)
					return
				const pfpURL = HTTP.Post("pfp", event.target.files[0])
				User._user.profilePicture = pfpURL
				NameStorage.UserPFP._ManualSet(User.ID, pfpURL)
				setProfilePicture(pfpURL)
			}}/>
		</div>
	)
}
