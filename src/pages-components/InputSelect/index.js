// import React from 'react';

// import {
//   InputLabel,
//   MenuItem,
//   FormControl,
//   Select,
//   FormHelperText,
//   Button,
//   Box
// } from '@material-ui/core';

// const InputSelect = ({ selectItems, label, value, onChange, error, disabled, helperText, loading, errorMessage, onCreateNew, titleCreateNew }) => {
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
//       fullWidth
//       variant="outlined"
//       className="m-3"
//       disabled={disabled}
//     >
//       {loading ? (
//         // Show loading message if data is still being fetched
//         <div style={{ textAlign: 'center', margin: '16px 0' }}>
//           <em>Loading...</em>
//         </div>
//       ) : errorMessage ? (
//         // Show error message if there was an error
//         <div style={{ textAlign: 'center', margin: '16px 0', color: 'red' }}>
//           <em>{errorMessage}</em>
//         </div>
//       ) : selectItems.length > 0 ? (
//         // Show the dropdown if data is available
//         <>
//           <InputLabel
//             id="input-select-label"
//             style={{ color: error ? 'red' : '' }} // Conditionally set label color based on error
//           >
//             {error ? `${label} *` : label}
//           </InputLabel>
//           <Select
//             labelId="input-select-label"
//             id="input-select"
//             value={value}
//             onChange={onChange}
//             label={label}
//             MenuProps={menuProps} // Apply custom menu props
//             error={false} // Disable default Select error styles, we'll handle it ourselves
//           >
//             {selectItems.map((item) => (
//               <MenuItem key={item.value} value={item.value}>
//                 {item.name}
//               </MenuItem>
//             ))}
//           </Select>
//         </>
//       ) : (
//         // Show the "Create New" button if no data is available
//         <Box display="flex" alignItems="center">
//           <div className="">
//               <div className="app-page-title--heading">
//                 <h1>{titleCreateNew}</h1>
//               </div>
//           </div>
//           <div className="app-page-title--heading">
//             <span style={{ paddingRight: '8px' }}>
//                 <Button
//                 variant="contained"
//                 size="small"
//                 className="btn-info"
//                 onClick={onCreateNew}
//                 >
//                 <span className="btn-wrapper--text" style={{ paddingRight: '5px' }}>Create a New {titleCreateNew}</span>
//                 </Button>
//             </span>
//           </div>
//         </Box>
//       )}
//       <FormHelperText>{helperText}</FormHelperText>
//     </FormControl>
//   );
// }

// export default InputSelect;

import React from 'react';
import {
  FormControl,
  FormHelperText,
  Button,
  Box
} from '@material-ui/core';
import Autocomplete from '@material-ui/lab/Autocomplete';
import TextField from '@material-ui/core/TextField';

const InputSelect = ({ 
  selectItems, 
  label, 
  value, 
  onChange, 
  error, 
  disabled, 
  helperText, 
  loading, 
  errorMessage, 
  onCreateNew, 
  titleCreateNew 
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
      ) : selectItems.length > 0 ? (
        <>
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
          />
        </>
      ) : (
        <Box display="flex" alignItems="center">
          <div className="">
            <div className="app-page-title--heading">
              <h1>{titleCreateNew}</h1>
            </div>
          </div>
          <div className="app-page-title--heading">
            <span style={{ paddingRight: '8px' }}>
              <Button
                variant="contained"
                size="small"
                className="btn-info"
                onClick={onCreateNew}
              >
                <span className="btn-wrapper--text" style={{ paddingRight: '5px' }}>Create a New {titleCreateNew}</span>
              </Button>
            </span>
          </div>
        </Box>
      )}
      {helperText && (
        <FormHelperText error={error}>{helperText}</FormHelperText>
      )}
    </FormControl>
  );
};

export default InputSelect;