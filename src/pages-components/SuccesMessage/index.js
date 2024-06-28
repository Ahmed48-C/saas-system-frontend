import React from 'react';
import { Snackbar } from '@material-ui/core';

const SuccessMessage = ({ open, message, vertical, horizontal, toastrStyle, onClose }) => {
  return (
    <Snackbar
      anchorOrigin={{ vertical, horizontal }}
      key={`${vertical},${horizontal}`}
      open={open}
      classes={{ root: toastrStyle }}
      onClose={onClose}
      message={message}
    />
  );
}

export default SuccessMessage;
