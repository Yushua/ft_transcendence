import React, { useState } from 'react';
import UserProfileComponent from '../ButtonComponents/UserProfileComponent';
import SeachBarButton from '../UserProfile/BarSetup';


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