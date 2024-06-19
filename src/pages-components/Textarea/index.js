import React, { useState } from 'react';

import { Container, Card, TextField } from '@material-ui/core';

const Textarea = ({rows, rowsMax, label}) => {
  const [value, setValue] = useState('');

  const handleChange = (event) => {
    setValue(event.target.value);
  };

  return (
    <>
          <TextField
            className="m-3"
            fullWidth
            id="filled-multiline-static"
            label={label}
            onChange={handleChange}
            value={value}
            multiline
            rows={rows}
            rowsMax={rowsMax}
          />
    </>
  );
}

export default Textarea;