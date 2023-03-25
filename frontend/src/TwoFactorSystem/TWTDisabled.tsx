import '../App.css';
import MainWindowButtonComponent from '../ButtonComponents/MainWindowButtonComponent';

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
