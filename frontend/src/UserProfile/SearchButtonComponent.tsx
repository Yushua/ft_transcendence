import React, { useState } from 'react';
import { removeCookie } from 'typescript-cookie';
import { newWindow } from '../App';
import LoginPage from '../Login/LoginPage';
import TWTCheckPage from '../TwoFactorSystem/TWTCheckPage';
import SearchBar from './SearchBar';

export function ButtonRefresh() {
  newWindow(<SearchBar/>)
}

function SearchButtonComponent() {
    return (
      <button onClick={() => {ButtonRefresh()}}>Search</button>
    )
}

export default SearchButtonComponent;