import { GenericModal } from "../modal";

export const HelpModal = (props) => {
  return (
    <GenericModal
      width={'364px'}
      headerTitle={"Help"}
      closeModal={props.closeModal}
      active={props.active}
      content={
        <div className='modal-content-container'>
          <div className="group">
            <h5>API key</h5>
            <p>"AIzaSyBuP81YRh3hUpo1Hv4fWYwnXlODsSOIr98"</p>
          </div>
          <div className="group">
            <h5>Database URL</h5>
            <p>"https://omnisynchronize-default-rtdb.asia-southeast1.firebasedatabase.app"</p>
          </div>
          <div className='group'>
            <h5>How to use</h5>
            <p>You'll need a microcontroller that supports Wi-Fi such as ESP32 & ESP8266.</p>
            <p>Connect your McU by using stable Firebase library such as ESP32/ESP8266FirebaseClient
              by Mobizt.</p>
          </div>
          <div className="group">
            <h5>Check out the sample Arduino code at:</h5>
            <a href="https://github.com/Dyastin-0/home-aut/blob/master/public/sample/sample.ino"
              target='blank'>ESP32 Firebase Client</a>  
          </div>  
        </div>
      }
    />
  );
}