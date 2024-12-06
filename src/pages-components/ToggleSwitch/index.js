import React from 'react';
import { Switch } from '@material-ui/core';

const ToggleSwitch = ({ checked, onChange, name, color = 'secondary', className }) => {
  return (
    <Switch
      checked={checked}
      onChange={onChange}
      name={name}
      color={color}
      className={className}
    />
  );
};

export default ToggleSwitch;
