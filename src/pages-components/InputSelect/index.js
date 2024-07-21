import React from 'react';

import {
  InputLabel,
  MenuItem,
  FormControl,
  Select
} from '@material-ui/core';

const InputSelect = ({ selectItems, label, value, onChange, error }) => {
  // Custom menu props to limit the visible items and enable scrolling
  const menuProps = {
    PaperProps: {
      style: {
        maxHeight: 400, // Set the maximum height for the dropdown menu
      },
    },
  };

  return (
    <FormControl
    fullWidth
    // variant="standard"
    variant="outlined"
    className="m-3"
    error={error}
    >
      <InputLabel id="country-select-label">{label}</InputLabel>
      <Select
        labelId="country-select-label"
        id="country-select"
        value={value}
        onChange={onChange}
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