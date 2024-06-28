import React, { useEffect, useRef, useState } from 'react';

import { Container, Card, TextField } from '@material-ui/core';

const Textarea = ({rows, rowsMax, label, value, onChange, key, error}) => {
  return (
    <>
      <TextField
        key={key}
        className="m-3"
        fullWidth
        id="filled-multiline-static"
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