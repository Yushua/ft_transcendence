import '../App.css';
import LogoutButtonComponent from '../UserProfile/LogoutButton';
import TWTComponent from '../UserProfile/TWTComponent';
import TurnTWTOn from './TurnTWTOn';

function TWTDisabled(){
  
  return (
    <div className="TWTDisabled">
      <TWTComponent/>
      <TurnTWTOn/>
    </div>
  );
}

export default TWTDisabled;
