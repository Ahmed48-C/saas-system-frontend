import React, { useState } from 'react';

import {
  Grid,
  InputLabel,
  Card,
  MenuItem,
  FormControl,
  Select
} from '@material-ui/core';

const InputSelect = ({ selectItems }) => {
  const [age, setAge] = useState('');

  const handleChange = (event) => {
    setAge(event.target.value);
  };

  return (
    <>
        <FormControl fullWidth variant="standard">
            <InputLabel id="demo-simple-select-standard-label">
            Age
            </InputLabel>
            <Select
            labelId="demo-simple-select-standard-label"
            id="demo-simple-select-standard"
            value={age}
            onChange={handleChange}
            label="Age">
            {/* <MenuItem value="">
                <em>None</em>
            </MenuItem> */}
            {/* <MenuItem value={10}>Ten</MenuItem>
            <MenuItem value={20}>Twenty</MenuItem>
            <MenuItem value={30}>Thirty</MenuItem> */}
            {selectItems.map((item) => (
              <MenuItem key={item.value} value={item.value}>
                {item.name}
              </MenuItem>
            ))}
            </Select>
        </FormControl>
    </>
  );
}

export default InputSelect;