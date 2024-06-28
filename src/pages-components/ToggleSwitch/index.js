import React, { useState } from 'react';

import { Switch } from '@material-ui/core';

const ToggleSwitch = () => {
  const [toggle, setToggle] = useState(true);

  const handleChange = (event) => {
    setToggle({ ...toggle, [event.target.name]: event.target.checked });
  };

  return (
    <>
      <Switch
        onChange={handleChange}
        checked={toggle}
        name="checkedB"
        color="secondary"
        className="switch-small"
      />
    </>
  );
}

export default ToggleSwitch;