import React, { useState } from 'react';

import {
  Grid,
  InputLabel,
  Card,
  MenuItem,
  FormControl,
  Select
} from '@material-ui/core';

const InputSelect = ({ selectItems, label }) => {
  const [age, setAge] = useState('');

  const handleChange = (event) => {
    setAge(event.target.value);
  };

  // Custom menu props to limit the visible items and enable scrolling
  const menuProps = {
    PaperProps: {
      style: {
        maxHeight: 400, // Set the maximum height for the dropdown menu
      },
    },
  };

  return (
    <FormControl fullWidth variant="standard" className="m-3">
      <InputLabel id="country-select-label">{label}</InputLabel>
      <Select
        labelId="country-select-label"
        id="country-select"
        value={age}
        onChange={handleChange}
        label={label}
        MenuProps={menuProps} // Apply custom menu props
      >
        <MenuItem value="">
          None
        </MenuItem>
        {selectItems.map((item) => (
          <MenuItem key={item.value} value={item.value}>
            {item.name}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}

export default InputSelect;