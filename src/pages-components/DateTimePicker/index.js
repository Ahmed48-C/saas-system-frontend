import React from 'react';
import TextField from '@material-ui/core/TextField';

const DateTime = ({
  label,
  value,
  onChange,
  key,
  error,
  id,
  helperText,
  minDateTime,
  maxDateTime,
  required,
  disablePast,
}) => {
  // Get the current date and time
  const now = new Date();
  
  // Adjust the current date-time to ISO format with the minutes (yyyy-MM-ddTHH:mm)
  const minDateTimeFormatted = now.toISOString().slice(0, 16); // For format yyyy-MM-ddTHH:mm
  
  return (
    <TextField
      key={key}
      className="m-3"
      fullWidth
      id={id}
      label={error ? `${label} *` : label}
      onChange={onChange}
      value={value}
      type="datetime-local"
      inputProps={{
        // If disablePast is true, prevent selecting any date/time before the current moment
        min: disablePast ? minDateTimeFormatted : minDateTime,
        max: maxDateTime,
      }}
      variant="outlined"
      helperText={helperText}
      InputLabelProps={{
        shrink: true,
        style: { color: error ? 'red' : '' },
      }}
      FormHelperTextProps={{ error }}
      required={required}
    />
  );
};

export default DateTime;
