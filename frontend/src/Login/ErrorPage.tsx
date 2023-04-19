import { Box } from '@mui/material';
import '../App.css';

const Width: number = Math.trunc(window.screen.width * .5)

function ErrorPage(){
  return (
    <center>
      <Box
          fontFamily={"'Courier New', monospace"}
          fontSize={"200%"}
          marginTop={`${Width*0.3}px`}>
        <div> {"you are unable to enter transendence due to unknown circumstances"} </div>
      </Box>
  </center>
  );
}

export default ErrorPage;
