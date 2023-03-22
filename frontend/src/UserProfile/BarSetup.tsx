import React, { useState } from 'react';

type Props = {
  items: string[];
};

const SeachBarButton: React.FC<Props> = ({ items }) => {
  const [selectedButton, setSelectedButton] = useState<string>('');

  const handleClick = (value: string) => {
    setSelectedButton(value);
    // do something with the button value
  };

  return (
   <div className="button-container">
      {items.map((item, index) => {
        return (
          <button key={index} className="button-item" onClick={() => handleClick(item)}>
            {item}
          </button>
        );
      })}
    </div>
  );
};


export default SeachBarButton;