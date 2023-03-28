import './UserProfile.css';
import '../App.css';
import User from '../Utils/Cache/User';

function TestPage() {
  return (
    <div className="pageborder">
      <button className="button" >hello</button>
      <img src={User.ProfilePicture} alt="" className="profilePicture"/>
    </div>
  );
}

export default TestPage;
