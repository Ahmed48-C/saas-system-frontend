import React, { useState } from 'react';

import {
  TextField
} from '@material-ui/core';

import { useTheme } from '@material-ui/core/styles';

import { Autocomplete } from '@material-ui/lab';

const ITEM_HEIGHT = 24;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 6.5,
      width: 200
    }
  }
};
function getStyles(name, personName, theme) {
  return {
    fontWeight:
      personName.indexOf(name) === -1
        ? theme.typography.fontWeightRegular
        : theme.typography.fontWeightMedium
  };
}

const names = [
  'Oliver Hansen',
  'Van Henry',
  'April Tucker',
  'Ralph Hubbard',
  'Omar Alexander',
  'Carlos Abbott',
  'Miriam Wagner',
  'Bradley Wilkerson',
  'Virginia Andrews',
  'Kelly Snyder'
];



const TagSelect = ({ tagSelectOptions }) => {
  const theme = useTheme();
  const [personName, setPersonName] = useState([]);

  const handleChange = (event) => {
    setPersonName(event.target.value);
  };

  const handleDelete = (event) => {

  }

  return (
    <>
        {/* <FormControl variant="standard" fullWidth>
            <InputLabel id="demo-mutiple-chip-label">Chip</InputLabel>
            <Select
            labelId="demo-mutiple-chip-label"
            id="demo-mutiple-chip"
            multiple
            value={personName}
            onChange={handleChange}
            input={<Input id="select-multiple-chip" />}
            renderValue={(selected) => (
                <div>
                {selected.map((value) => (
                    <Chip
                    className="bg-primary text-white"
                    key={value}
                    label={value}
                    onDelete={handleDelete}
                    />

                ))}
                </div>
            )}
            MenuProps={MenuProps}>
            {names.map((name) => (
                <MenuItem
                key={name}
                value={name}
                style={getStyles(name, personName, theme)}>
                {name}
                </MenuItem>
            ))}
            </Select>
        </FormControl> */}
        {/* <Container className="py-3" style={{ paddingLeft: 0, paddingRight: 0 }} maxWidth="xg"> */}
          <Autocomplete
            multiple
            id="size-small-standard-multi"
            options={tagSelectOptions}
            getOptionLabel={(option) => option.title}
            // defaultValue={[top100Films[13]]}
            renderInput={(params) => (
              <TextField
                {...params}
                variant="standard"
                label="Size small"
                placeholder="Favorites"
                fullWidth
              />
            )}
          />
        {/* </Container> */}
    </>
  );
}

export default TagSelect;