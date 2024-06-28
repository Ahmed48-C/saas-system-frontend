import React, { useState } from 'react';

import { Container, Card, TextField } from '@material-ui/core';

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
            {/* <div className="d-flex justify-content-center align-items-center"> */}
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
            {/* </div> */}
      </MuiPickersUtilsProvider>
    </>
  );
}

export default TimePicker