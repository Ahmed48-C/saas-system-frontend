import React from 'react';

import { TextField } from '@material-ui/core';

// const Textarea = ({ rows, rowsMax, label, value, onChange, key, error, id, maxLength, helperText }) => {
//   return (
//     <>
//       <TextField
//         key={key}
//         className="m-3"
//         fullWidth
//         id={id}
//         label={label}
//         onChange={onChange}
//         value={value}
//         multiline
//         rows={rows}
//         rowsMax={rowsMax}
//         error={error}
//         inputProps={maxLength ? { maxLength: maxLength } : {}} // Conditionally add maxLength
//         variant="outlined"
//         helperText={helperText}
//       />
//     </>
//   );
// }

// export default Textarea;

const Textarea = ({ rows, rowsMax, label, value, onChange, key, error, id, maxLength, helperText }) => {
  return (
    <TextField
      key={key}
      className="m-3"
      fullWidth
      id={id}
      label={error ? `${label} *` : label}
      onChange={onChange}
      value={value}
      multiline
      rows={rows}
      inputProps={maxLength ? { maxLength: maxLength } : {}} // Conditionally add maxLength
      variant="outlined"
      helperText={helperText}
      // Conditionally change the label color if there's an error
      InputLabelProps={{
        style: { color: error ? 'red' : '' }, // Change label color only when error is true
      }}
      // Remove the error prop from TextField to avoid making the entire field red
      FormHelperTextProps={{ error }}
    />
  );
};

export default Textarea;