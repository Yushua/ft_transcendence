import '../App.css';
import MainWindowButtonComponent from '../UserProfile/ButtonComponents/MainWindowButtonComponent';
import TurnTWTOff from './TurnTWTOff';

function TWTDisabled(){
  
  return (
    <div className="TWTDisabled">
      <MainWindowButtonComponent/>
      <TurnTWTOff/>
    </div>
  );
}

export default TWTDisabled;
