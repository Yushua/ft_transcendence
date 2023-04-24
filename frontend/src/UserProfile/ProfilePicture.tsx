import { useState } from 'react';
import HTTP from '../Utils/HTTP';
import User from '../Utils/Cache/User';
import NameStorage from '../Utils/Cache/NameStorage';
import { Width } from '../MainWindow/MainWindow';

export default function ProfilePicture() {
	const [profilePicture, setProfilePicture] = useState<string>(NameStorage.UserPFP.Get(User.ID));
	
	return (
		<center>
			<div>
				<img alt="" src={`${HTTP.HostRedirect()}pfp/${profilePicture}`} style={{width: `${0.1*Width}px`, height: `${0.1*Width}px`, alignItems: 'center', borderTop: `${0.01*Width}px`, borderBottom: `${0.01*Width}px`,}}/>
			</div>
			<div>
				<input type="file" id="avatar" name="avatar" accept="image/png, image/jpeg, image/gif" onChange={event => {
					if (!event.target.files)
						return
					const pfpURL = HTTP.Post("pfp", event.target.files[0])
					User._user.profilePicture = pfpURL
					NameStorage.UserPFP._ManualSet(User.ID, pfpURL)
					setProfilePicture(pfpURL)
				}}/>
			</div>
		</center>
	)
}
