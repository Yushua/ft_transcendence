import React from 'react';
import ReactDOM from 'react-dom/client';
import { Pong } from './App';

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement)
root.render(
  <React.StrictMode>
    <Pong />
  </React.StrictMode>
);