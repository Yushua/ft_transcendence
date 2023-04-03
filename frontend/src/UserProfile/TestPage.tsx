import './UserProfile.css';
import '../App.css';
import User from '../Utils/Cache/User';
import NameStorage from '../Utils/Cache/NameStorage';
import HTTP from '../Utils/HTTP';


function TestPage() {


  return (
    <div className="pageborder">
      <button className="button" >hello</button>
      <img src={`${HTTP.HostRedirect()}pfp/${NameStorage.UserPFP.Get(User.ID)}`} alt="" className="profilePicture"/>
    </div>
  );
}

export default TestPage;
