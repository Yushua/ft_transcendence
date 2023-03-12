import React, { useState } from 'react';
import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import LoginPage from './Login/Login';
import OAuthLoginPage from './Login/LoginOAuth';

export function newWindow(newWindow:JSX.Element) {
  if (!!_setWindow)
    _setWindow(newWindow)
}

var _setWindow: React.Dispatch<React.SetStateAction<JSX.Element>> | null = null

const App = () => {

  const [window, setWindow] = useState<JSX.Element>(<OAuthLoginPage />)
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
