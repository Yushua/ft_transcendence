import React, { } from 'react';
import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

import LoginPage from './Login';
import UserProfilePage from './userProfile';
const App: React.FC = () => {

  return (
    <BrowserRouter>
    <Routes>
      <Route path={`/userprofile`} element={<UserProfilePage />} />
      <Route path={`/login`} element={<LoginPage />}/>
    </Routes>
  </BrowserRouter>
  );
}

export default App;
