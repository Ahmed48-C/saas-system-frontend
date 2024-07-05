import React from 'react';

import { TextField } from '@material-ui/core';

const Textarea = ({ rows, rowsMax, label, value, onChange, key, error, id }) => {
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
      />
    </>
  );
}

export default Textarea;