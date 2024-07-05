import React, { useState } from 'react';

import 'date-fns';
import DateFnsUtils from '@date-io/date-fns';
import {
  MuiPickersUtilsProvider,
  KeyboardTimePicker
} from '@material-ui/pickers';

const TimePicker = () => {
  const [time, setTime] = useState(
    new Date()
  );

  const handleDateChange = (date) => {
    setTime(date);
  };

  return (
    <>
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
    </>
  );
}

export default TimePicker