import React, { useState } from 'react';

import { Switch, Grid } from '@material-ui/core';

const ToggleSwitch = () => {
  const [state, setState] = useState({
    checkedA: true,
    checkedB: true
  });

  const handleChange = (event) => {
    setState({ ...state, [event.target.name]: event.target.checked });
  };

  return (
    <>
        <Switch
        defaultChecked
        name="checkedB"
        color="secondary"
        className="switch-small"
        />
    </>
  );
}

export default ToggleSwitch;