import React from 'react';
import ReactDOM from 'react-dom/client';
// import App from './App';
import { RunPong } from './components/Pong';

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement)
root.render(
  <React.StrictMode>
    <RunPong />
  </React.StrictMode>
);