import React from 'react';
import { TextField, InputAdornment, Select, MenuItem } from '@material-ui/core';

const AdornmentTextarea = ({ rows, rowsMax, label, value, onChange, key, error, id, maxLength, unit, onUnitChange, units }) => {
  return (
    <>
      <TextField
        key={key}
        className="m-3"
        fullWidth
        id={id}
        label={label}
        onChange={onChange}
        value={value}
        multiline
        rows={rows}
        rowsMax={rowsMax}
        error={error}
        inputProps={maxLength ? { maxLength: maxLength } : {}}
        variant="outlined"
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <Select
                value={unit}
                onChange={onUnitChange}
                displayEmpty
              >
                {units.map((unit, index) => (
                  <MenuItem key={index} value={unit}>
                    {unit}
                  </MenuItem>
                ))}
              </Select>
            </InputAdornment>
          )
        }}
      />
    </>
  );
}

export default AdornmentTextarea;