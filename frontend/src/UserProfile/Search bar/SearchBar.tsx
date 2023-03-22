import React, { useState } from 'react';
import SeachBarButton from '../BarSetup';
import UserProfileComponent from '../ButtonComponents/UserProfileComponent';

function SearchBar() {
  const buttonLabels = ['flipy', 'yusha', 'hey', 'hey', 'hey', 'hey', 'hey', 'hey', 'hey', 'hey'];
    return (
      <div>
        <div>
         <UserProfileComponent/>
        </div>
          <SeachBarButton items={buttonLabels} />
      </div>
    )
}

export default SearchBar;