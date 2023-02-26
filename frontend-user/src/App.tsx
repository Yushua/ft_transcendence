import React, { useState } from 'react';
import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

import LoginPage from './Login';

export function newWindow(newWindow:JSX.Element) {
  if (!!_setWindow)
    _setWindow(newWindow)
}

var _setWindow: React.Dispatch<React.SetStateAction<JSX.Element>> | null = null


const App: React.FC = () => {

  const [window, setWindow] = useState<JSX.Element>(<LoginPage />)
  _setWindow = setWindow

  return (
    <BrowserRouter>
    <Routes>
      <Route path={`/`} element={window} />
    </Routes>
  </BrowserRouter>
  );
}

export default App;
