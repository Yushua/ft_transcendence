import styled from "@emotion/styled";
import React from "react";
import Modal from "react-overlays/Modal";





const OverlayGameData = (props) => {
  {/* 
    because gamedata can be different, CAN BE, depending on what game. ehre you can setup a default path,
    meaning if you have a specicfic name, you can say "if this, do this, else default system"
  */}

  const [showModal, setShowModal] = React.useState(false)

  var handleClose = () => setShowModal(false)

  var handleSave = () => {
	console.log("success")
  };
  var handleSuccess = () => {
    console.log("success");
  };

  const renderBackdrop = (props) => <div className="backdrop" {...props} />;

  return (
	<Modal
		className="modal"
		show={showModal}
		onHide={handleClose}
		renderBackdrop={renderBackdrop} >
		<div>
			<div className="modal-header">
				<div className="modal-title">Modal Heading</div>
				<div>
					<span className="close-button" onClick={handleClose}>
						x
					</span>
				</div>
			</div>
			<div className="modal-desc">
				<p>Modal body contains text.</p>
			</div>
			<div className="modal-footer">
				<button className="secondary-button" onClick={handleClose}>
					Close
				</button>
				<button className="primary-button" onClick={handleSuccess}>
					Success
				</button>
			</div>
		</div>
	</Modal>
  )
  }

export default OverlayGameData;