import '../App.css';
import MainWindowButtonComponent from '../UserProfile/ButtonComponents/MainWindowButtonComponent';
import TurnTWTOn from './TurnTWTOn';


function TWTEnabled(){
  //to check if your accessToken is already valid
  // const [Display, setDisplay] = useState<boolean>(false);
  //setu the QR code. if input Code, then it will be turned on. so there is always a QR code
  return (
    <div className="TWTEnabled">
      <MainWindowButtonComponent/>
      <TurnTWTOn/>
    </div>
  );
}

export default TWTEnabled;
