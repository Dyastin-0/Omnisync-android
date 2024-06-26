import { useEffect, useState } from 'react';
import './toast-message.css';

export const ToastMessage = (props) => {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    props.message !== null && openToastMessage();
  }, [props.message]);

  const openToastMessage = () => {
    setOpen(true);
    setTimeout(() => {
      setOpen(false);
      props.setToastMessage(null);
    }, 3000);
  };

  return (
    <div className={`toast-message ${open && `open`}`}>
      <h5 className='message-t'> {open ? props.message : ''} </h5>
      <button className='button'> {<i className='fa-solid fa-xmark'></i>} </button>
    </div>
  );
};