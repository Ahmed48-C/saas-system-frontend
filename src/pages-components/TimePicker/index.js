import React, { useState } from 'react';

import 'date-fns';
import DateFnsUtils from '@date-io/date-fns';
import {
  MuiPickersUtilsProvider,
  KeyboardTimePicker
} from '@material-ui/pickers';
import { FormControl } from '@material-ui/core';

const TimePicker = () => {
  const [time, setTime] = useState(
    new Date()
  );

  const handleDateChange = (date) => {
    setTime(date);
  };

  return (
    <>
    <FormControl fullWidth variant="standard" className="m-3">
      <MuiPickersUtilsProvider utils={DateFnsUtils}>
        <KeyboardTimePicker
          margin="normal"
          id="time-picker"
          label="Time picker"
          value={time}
          onChange={handleDateChange}
          KeyboardButtonProps={{
            'aria-label': 'change time'
          }}
        />
      </MuiPickersUtilsProvider>
    </FormControl>
    </>
  );
}

export default TimePicker