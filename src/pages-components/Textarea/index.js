import React from 'react';

import { TextField } from '@material-ui/core';

const Textarea = ({ rows, rowsMax, label, value, onChange, key, error, id, maxLength }) => {
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
        inputProps={maxLength ? { maxLength: maxLength } : {}} // Conditionally add maxLength
        variant="outlined"
      />
    </>
  );
}

export default Textarea;