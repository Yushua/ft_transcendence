import React from 'react'
import { Pong } from './components/Pong'
import { Websocket } from './contexts/Websocket';
import { socket, WebsocketProvider } from './contexts/WebsocketContext';


// const Print = (par1:string, par2:string) => {
// 	console.log(par1)
// 	console.log(par2)
// }



function App() {
	return (
		<div className="App">
			<Pong />
			<WebsocketProvider value={socket}>
				<Websocket/>
			</WebsocketProvider>
			{/* <button onClick={() => Print("msg", "msg2")}>PRINT</button> */}
		</div>
	);
  }

export default App;
