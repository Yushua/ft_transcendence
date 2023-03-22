import React, { useEffect, useState } from 'react';

type DropDownProps = {
  list: string[];
  showDropDown: boolean;
  toggleDropDown: Function;
  friendSelection: Function;
};

const DropDown: React.FC<DropDownProps> = ({
  list,
  friendSelection,
}: DropDownProps): JSX.Element => {
  const [showDropDown, setShowDropDown] = useState<boolean>(false);
  
  const onClickHandler = (friend: string): void => {
    friendSelection(friend);
  };

  useEffect(() => {
    setShowDropDown(showDropDown);
  }, [showDropDown]);

  return (
    <>
      <div className={showDropDown ? 'dropdown' : 'dropdown active'}>
        {list.map(
          (friend: string, index: number): JSX.Element => {
            return (
              <p
                key={index}
                onClick={(): void => {
                  onClickHandler(friend);
                }}
              >
                {friend}
              </p>
            );
          }
        )}
      </div>
    </>
  );
};

export default DropDown;