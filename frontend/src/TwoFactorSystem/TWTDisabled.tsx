import '../App.css';
import LogoutButtonComponent from '../UserProfile/LogoutButton';
import TWTComponent from '../UserProfile/TWTButtonComponent';
import UserProfileButtonComponent from '../UserProfile/UserProfileButtonComponent';
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
