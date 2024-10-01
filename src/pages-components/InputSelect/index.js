import React from 'react';

import {
  InputLabel,
  MenuItem,
  FormControl,
  Select,
  FormHelperText
} from '@material-ui/core';

// const InputSelect = ({ selectItems, label, value, onChange, error, disabled, helperText, loading, errorMessage }) => {
//   // Custom menu props to limit the visible items and enable scrolling
//   const menuProps = {
//     PaperProps: {
//       style: {
//         maxHeight: 400, // Set the maximum height for the dropdown menu
//       },
//     },
//   };

//   return (
//     <FormControl
//     fullWidth
//     // variant="standard"
//     variant="outlined"
//     className="m-3"
//     error={error}
//     disabled={disabled}
//     >
//       <InputLabel id="country-select-label">{label}</InputLabel>
//       <Select
//         labelId="country-select-label"
//         id="country-select"
//         value={value}
//         onChange={onChange}
//         label={label}
//         MenuProps={menuProps} // Apply custom menu props
//       >
//         {/* <MenuItem value="">
//           None
//         </MenuItem>
//         {selectItems.map((item) => (
//           <MenuItem key={item.value} value={item.value}>
//             {item.name}
//           </MenuItem>
//         ))} */}
//         {loading ? (
//           // Show loading message if data is still being fetched
//           <MenuItem disabled value="">
//             <em>Loading...</em>
//           </MenuItem>
//         ) : errorMessage ? (
//           // Show error message if there was an error
//           <MenuItem disabled value="">
//             <em>{errorMessage}</em>
//           </MenuItem>
//         ) : selectItems.length > 0 ? (
//           // Show the actual select items if data is available
//           selectItems.map((item) => (
//             <MenuItem key={item.value} value={item.value}>
//               {item.name}
//             </MenuItem>
//           ))
//         ) : (
//           // Show a message if no data is available
//           <MenuItem disabled value="">
//             <em>No data found</em>
//           </MenuItem>
//         )}
//       </Select>
//       <FormHelperText>{helperText}</FormHelperText>
//     </FormControl>
//   );
// }

// export default InputSelect;

const InputSelect = ({ selectItems, label, value, onChange, error, disabled, helperText, loading, errorMessage }) => {
  // Custom menu props to limit the visible items and enable scrolling
  const menuProps = {
    PaperProps: {
      style: {
        maxHeight: 400, // Set the maximum height for the dropdown menu
      },
    },
  };

  return (
    <FormControl
      fullWidth
      variant="outlined"
      className="m-3"
      disabled={disabled}
    >
      <InputLabel 
        id="input-select-label"
        style={{ color: error ? 'red' : '' }} // Conditionally set label color based on error
      >
        {label}
      </InputLabel>
      <Select
        labelId="input-select-label"
        id="input-select"
        value={value}
        onChange={onChange}
        label={label}
        MenuProps={menuProps} // Apply custom menu props
        error={false} // Disable default Select error styles, we'll handle it ourselves
      >
        {loading ? (
          // Show loading message if data is still being fetched
          <MenuItem disabled value="">
            <em>Loading...</em>
          </MenuItem>
        ) : errorMessage ? (
          // Show error message if there was an error
          <MenuItem disabled value="">
            <em>{errorMessage}</em>
          </MenuItem>
        ) : selectItems.length > 0 ? (
          // Show the actual select items if data is available
          selectItems.map((item) => (
            <MenuItem key={item.value} value={item.value}>
              {item.name}
            </MenuItem>
          ))
        ) : (
          // Show a message if no data is available
          <MenuItem disabled value="">
            <em>No data found</em>
          </MenuItem>
        )}
      </Select>
      <FormHelperText>{helperText}</FormHelperText>
    </FormControl>
  );
}

export default InputSelect;