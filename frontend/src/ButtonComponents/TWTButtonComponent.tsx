import { newWindow } from "../App";
import TWTCheckPage from "../TwoFactorSystem/TWTCheckPage";

export function ButtonRefresh() {
  newWindow(<TWTCheckPage/>);
}

function TWTButtonComponent() {
    return (
      <button onClick={() => {ButtonRefresh()}}>TwoFactor</button>
    )
}

export default TWTButtonComponent;