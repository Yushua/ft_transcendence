import React, { useState } from 'react';
import SeachBarButton from './BarSetup';
import UserProfileComponent from './UserProfileComponent';

function SearchBarFriend() {
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

export default SearchBarFriend;