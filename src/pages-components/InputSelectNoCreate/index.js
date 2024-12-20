// import React from 'react';

// import {
//     InputLabel,
//     MenuItem,
//     FormControl,
//     Select,
//     FormHelperText
// } from '@material-ui/core';
// const InputSelectNoCreate = ({ selectItems, label, value, onChange, error, disabled, helperText, loading, errorMessage }) => {
//     // Custom menu props to limit the visible items and enable scrolling
//     const menuProps = {
//         PaperProps: {
//             style: {
//             maxHeight: 400, // Set the maximum height for the dropdown menu
//             },
//         },
//     };

//     return (
//         <FormControl
//             fullWidth
//             variant="outlined"
//             className="m-3"
//             disabled={disabled}
//         >
//             <InputLabel
//                 id="input-select-label"
//                 style={{ color: error ? 'red' : '' }} // Conditionally set label color based on error
//             >
//                 {error ? `${label} *` : label}
//             </InputLabel>
//             <Select
//                 labelId="input-select-label"
//                 id="input-select"
//                 value={value}
//                 onChange={onChange}
//                 label={label}
//                 MenuProps={menuProps} // Apply custom menu props
//                 error={false} // Disable default Select error styles, we'll handle it ourselves
//             >
//             {loading ? (
//                 // Show loading message if data is still being fetched
//                 <MenuItem disabled value="">
//                     <em>Loading...</em>
//                 </MenuItem>
//             ) : errorMessage ? (
//                 // Show error message if there was an error
//                 <MenuItem disabled value="">
//                     <em>{errorMessage}</em>
//                 </MenuItem>
//             ) : selectItems.length > 0 ? (
//                 // Show the actual select items if data is available
//                 selectItems.map((item) => (
//                 <MenuItem key={item.value} value={item.value}>
//                     {item.name}
//                 </MenuItem>
//                 ))
//             ) : (
//                 // Show a message if no data is available
//                 <MenuItem disabled value="">
//                     <em>No data found</em>
//                 </MenuItem>
//             )}
//             </Select>
//             <FormHelperText>{helperText}</FormHelperText>
//         </FormControl>
//     );
// }

// export default InputSelectNoCreate;


import React from 'react';
import {
  FormControl,
  FormHelperText
} from '@material-ui/core';
import Autocomplete from '@material-ui/lab/Autocomplete';
import TextField from '@material-ui/core/TextField';

const InputSelectNoCreate = ({ 
  selectItems, 
  label, 
  value, 
  onChange, 
  error, 
  disabled, 
  helperText, 
  loading, 
  errorMessage 
}) => {
  // Find the currently selected item
  const selectedItem = selectItems.find(item => item.value === value) || null;

  return (
    <FormControl
      fullWidth
      variant="outlined"
      className="m-3"
      disabled={disabled}
    >
      {loading ? (
        <div style={{ textAlign: 'center', margin: '16px 0' }}>
          <em>Loading...</em>
        </div>
      ) : errorMessage ? (
        <div style={{ textAlign: 'center', margin: '16px 0', color: 'red' }}>
          <em>{errorMessage}</em>
        </div>
      ) : (
        <Autocomplete
          options={selectItems}
          getOptionLabel={(option) => option.name}
          value={selectedItem}
          onChange={(event, newValue) => {
            onChange({ target: { value: newValue ? newValue.value : '' } });
          }}
          renderInput={(params) => (
            <TextField
              {...params}
              label={error ? `${label} *` : label}
              variant="outlined"
              InputLabelProps={{
                style: { color: error ? 'red' : undefined }
              }}
              fullWidth
            />
          )}
          style={{ maxHeight: '350px' }}
          noOptionsText="No data found"
        />
      )}
      {helperText && (
        <FormHelperText error={error}>{helperText}</FormHelperText>
      )}
    </FormControl>
  );
};

export default InputSelectNoCreate;