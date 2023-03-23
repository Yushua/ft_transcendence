import '../App.css';
import UserProfileButtonComponent from '../UserProfile/ButtonComponents/UserProfileButtonComponent';
import TurnTWTOff from './TurnTWTOff';

function TWTDisabled(){
  
  return (
    <div className="TWTDisabled">
      <UserProfileButtonComponent/>
      <TurnTWTOff/>
    </div>
  );
}

export default TWTDisabled;
