import { newWindow } from '../../App';
import MainWindow from '../../MainWindow/MainWindow';

export function ButtonRefresh() {
  newWindow(<MainWindow/>);
}

function MainWindowButtonComponent() {
    return (
      <button onClick={() => {ButtonRefresh()}}>MainWindow</button>
    )
}

export default MainWindowButtonComponent;