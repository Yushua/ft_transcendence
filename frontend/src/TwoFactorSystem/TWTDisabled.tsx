import '../App.css';
import LogoutButtonComponent from '../UserProfile/ButtonComponents/LogoutButton';
import TWTComponent from '../UserProfile/ButtonComponents/TWTButtonComponent';
import UserProfileButtonComponent from '../UserProfile/ButtonComponents/UserProfileButtonComponent';
import TurnTWTOff from './TurnTWTOff';
import TurnTWTOn from './TurnTWTOn';

function TWTDisabled(){
  
  return (
    <div className="TWTDisabled">
      <UserProfileButtonComponent/>
      <TurnTWTOff/>
    </div>
  );
}

export default TWTDisabled;
