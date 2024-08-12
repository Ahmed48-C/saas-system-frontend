import React from 'react';
import { MuiPickersUtilsProvider, KeyboardDatePicker } from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';
import { FormControl, TextField } from '@material-ui/core';

const DatePicker = ({ label, value, onChange, format, id, disablePast,
  // minDate, maxDate,
  error, key, name }) => {
  return (
    <FormControl fullWidth variant="outlined">
      <MuiPickersUtilsProvider utils={DateFnsUtils}>
      <KeyboardDatePicker
          fullWidth
          margin="normal"
          className="m-3"
          key={key}
          id={id}
          label={label}
          format={format}
          value={value}
          onChange={onChange}
          disablePast={disablePast}
          error={error}
          name={name}
          helperText={error ? '' : ''}
          // Use a custom TextField component to get the outlined variant
          TextFieldComponent={(props) => (
            <TextField
              {...props}
              variant="outlined"
              error={error}
            />
          )}
          KeyboardButtonProps={{
            'aria-label': 'change date',
          }}
        />
      </MuiPickersUtilsProvider>
    </FormControl>
  );
}

export default DatePicker;
