import React from 'react';
import 'date-fns';
import DateFnsUtils from '@date-io/date-fns';
import { MuiPickersUtilsProvider, KeyboardTimePicker } from '@material-ui/pickers';
import { FormControl, TextField } from '@material-ui/core';

const TimePicker = ({ label, value, onChange, id, ampm, minutesStep, error, key, name }) => {
  const handleTimeChange = (time) => {
    if (time) {
      // Reset seconds to 00
      const updatedTime = new Date(time);
      updatedTime.setSeconds(0, 0); // Set seconds and milliseconds to 0

      // Call the original onChange handler with the updated time
      onChange(updatedTime);
    } else {
      // Handle null value (if user clears the input)
      onChange(null);
    }
  };

  return (
    <FormControl fullWidth variant="outlined">
      <MuiPickersUtilsProvider utils={DateFnsUtils}>
        <KeyboardTimePicker
          fullWidth
          className="m-3"
          margin="normal"
          id={id}
          label={error ? `${label} *` : label}
          value={value}
          key={key}
          onChange={handleTimeChange}
          ampm={ampm}
          minutesStep={minutesStep}
          // error={error}
          name={name}
          helperText={error ? '' : ''}
          // Conditionally change the label color if there's an error
          InputLabelProps={{
            style: { color: error ? 'red' : '' }, // Change label color only when error is true
          }}
          // Remove the error prop from TextField to avoid making the entire field red
          FormHelperTextProps={{ error }}
          // Use a custom TextField component to get the outlined variant
          TextFieldComponent={(props) => (
            <TextField
              {...props}
              variant="outlined"
              // error={error}
            />
          )}
          // TextFieldComponent={(props) => (
          //   <TextField
          //     {...props}
          //     variant="outlined"
          //     error={error}
          //   />
          // )}
          KeyboardButtonProps={{
            'aria-label': 'change time',
          }}
        />
      </MuiPickersUtilsProvider>
    </FormControl>
  );
}

export default TimePicker;
