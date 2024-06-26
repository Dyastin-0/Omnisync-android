import { useState } from "react";

import { arrayIncludes } from "../../config/database";

import { Button } from "../button/button";

import { useData } from "../../contexts/data/data";
import { useAuth } from "../../contexts/auth/auth";

export const AddPanel = (props) => {
  const { userDataPath } = useAuth();
  const { addToggle } = useData();
  const [toggleName, setToggleName] = useState(null);
  
  const handleAddToggle = async (e) => {
    if (e.key === 'Enter') {
      const includes = await arrayIncludes(`${userDataPath}/toggles`, toggleName);
      if (includes) {
        props.setToastMessage(`${toggleName} is already used.`);
      } else {
        const event = () => {
          return async () => {
            await addToggle(toggleName);
            props.setToastMessage(`Toggle ${toggleName.toLocaleLowerCase()} added.`);
            e.target.value = null;
          };  
        };
        props.setConfirmEvent(event);
        props.setConfirmMessage(`Add ${toggleName}?`);
      }
    }
  }
  return (
    <div className='content-panel '>
      <h2>{props.title}</h2>
      <div className='container bottom'>
        <div className='row'>
          <input className='width-half-parent' placeholder="Toggle name"
            onChange={(e) => setToggleName(e.target.value)}
            onKeyUp={(e) => handleAddToggle(e)}
          />
          <Button className='nav-button'
            text='Add'
          />
        </div>
      </div>
    </div>
  );
};