import React from 'react';
import ReactDOM from 'react-dom';

const OverlayPage = ({ onClose }) => {
  return (
    <div className="overlay-page">
      <h1>Overlay Page Content</h1>
      <button onClick={onClose}>Close Overlay</button>
    </div>
  );
};

const MainPage = () => {
  const [showOverlay, setShowOverlay] = React.useState(false);

  const handleShowOverlay = () => {
    setShowOverlay(true);
  };

  const handleCloseOverlay = () => {
    setShowOverlay(false);
  };

  return (
    <div className="main-page">
      <h1>Main Page Content</h1>
      <button onClick={handleShowOverlay}>Show Overlay</button>
      {showOverlay &&
        ReactDOM.createPortal(
          <OverlayPage onClose={handleCloseOverlay} />,
          document.body
        )}
    </div>
  );
};

export default MainPage;