import "./Modal.css";
import ReactDOM from "react-dom";

function Backdrop() {
  return <div id="overlays2" className="backdrop" />;
}

function ModalOverlay(props) {
  return (
    <div className="modal">
      <div className="content">{props.children}</div>
    </div>
  );
}

const portalToElement = document.querySelector("#overlays");
function Modal(props) {
  return (
    <>
      {ReactDOM.createPortal(<Backdrop></Backdrop>, portalToElement)}
      {ReactDOM.createPortal(
        <ModalOverlay>{props.children}</ModalOverlay>,
        portalToElement
      )}
    </>
  );
}

export default Modal;
