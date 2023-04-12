import { useState } from "react";
import Modal from "react-overlays/Modal";

interface ExampleModalProps {
  show: boolean;
  onHide: () => void;
}

const ExampleModal = ({ show, onHide }: ExampleModalProps) => (
  <Modal show={show} onHide={onHide} backdrop={true}>
    <div>Hello</div>
  </Modal>
);

type props = {
  AchievementData:any;
}

const OverlayAchievementData = (props) => {
  {/* 
  because gamedata can be different, CAN BE, depending on what game. ehre you can setup a default path,
  meaning if you have a specicfic name, you can say "if this, do this, else default system"
  
  onClose() will close this

  */}

    const [show, setShow] = useState(false);

    if (show == false){
      console.log("it is false")
    }
    const handleClick = () => {
      setShow(false);
    };

    return (
      <div onClick={handleClick}>
      <ExampleModal show={show} onHide={() => setShow(false)} />
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.5)',
        }}
      >
        <p>{props.AchievementData.name}</p>
        <p>{props.AchievementData.message}</p>
        Click anywhere to close the Modal
      </div>
    </div>
    );
  };



export default OverlayAchievementData;