import React, { useState } from 'react';

import { Container, Card, TextField } from '@material-ui/core';

const Textarea = () => {
  const [value, setValue] = useState('');

  const handleChange = (event) => {
    setValue(event.target.value);
  };

  return (
    <>
      {/* <Card className="p-5 shadow-xxl">
        <Container> */}
          {/* <TextField
            className="m-3"
            fullWidth
            id="filled-multiline-flexible"
            label="Multiline"
            multiline
            rowsMax="4"
            value={value}
            onChange={handleChange}
          />
          <TextField
            className="m-3"
            fullWidth
            id="filled-textarea"
            label="Multiline Placeholder"
            placeholder="Placeholder"
            multiline
          /> */}
          <TextField
            className="m-3"
            fullWidth
            id="filled-multiline-static"
            label="Multiline"
            onChange={handleChange}
            value={value}
            multiline
            rows="3"
            rowsMax="5"
          />
        {/* </Container>
      </Card> */}
    </>
  );
}

export default Textarea;