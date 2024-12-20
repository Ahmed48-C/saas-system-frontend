// import React from 'react';
// import {
//   FormControl,
//   InputLabel,
//   Select,
//   MenuItem,
//   FormHelperText,
//   Button,
//   Box
// } from '@material-ui/core';
// import AddIcon from '@material-ui/icons/Add';

// const InputSelectCreate = ({
//   selectItems,
//   label,
//   value,
//   onChange,
//   error,
//   disabled,
//   helperText,
//   loading,
//   errorMessage,
//   onCreateNew,
//   titleCreateNew
// }) => {
//   // Custom menu props to limit the visible items and enable scrolling
//   const menuProps = {
//     PaperProps: {
//       style: {
//         maxHeight: 400,
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
//         <div style={{ textAlign: 'center', margin: '16px 0' }}>
//           <em>Loading...</em>
//         </div>
//       ) : errorMessage ? (
//         <div style={{ textAlign: 'center', margin: '16px 0', color: 'red' }}>
//           <em>{errorMessage}</em>
//         </div>
//       ) : (
//         <>
//           <Box display="flex" alignItems="center" gap={1}>
//             <Box flexGrow={1}>
//               <InputLabel
//                 id="input-select-label"
//                 style={{ color: error ? 'red' : '' }}
//               >
//                 {error ? `${label} *` : label}
//               </InputLabel>
//               <Select
//                 labelId="input-select-label"
//                 id="input-select"
//                 value={value}
//                 onChange={onChange}
//                 label={label}
//                 MenuProps={menuProps}
//                 error={error}
//                 fullWidth
//               >
//                 {selectItems.map((item) => (
//                   <MenuItem key={item.value} value={item.value}>
//                     {item.name}
//                   </MenuItem>
//                 ))}
//               </Select>
//             </Box>
//             <Box mt={2}>
//               <Button
//                 variant="contained"
//                 size="small"
//                 className="btn-info"
//                 onClick={onCreateNew}
//                 startIcon={<AddIcon />}
//               >
//                 New
//               </Button>
//             </Box>
//           </Box>
//           {helperText && (
//             <FormHelperText error={error}>{helperText}</FormHelperText>
//           )}
//         </>
//       )}
//     </FormControl>
//   );
// };

// export default InputSelectCreate; 


import React from 'react';
import {
  FormControl,
  FormHelperText,
  Button,
  Box
} from '@material-ui/core';
import Autocomplete from '@material-ui/lab/Autocomplete';
import TextField from '@material-ui/core/TextField';
import AddIcon from '@material-ui/icons/Add';

const InputSelectCreate = ({
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
      ) : (
        <>
          <Box display="flex" alignItems="flex-start" gap={1}>
            <Box flexGrow={1}>
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
            </Box>
            <Box>
              <Button
                variant="contained"
                size="small"
                className="btn-info"
                onClick={onCreateNew}
                startIcon={<AddIcon />}
                style={{ marginTop: '8px' }}
              >
                New
              </Button>
            </Box>
          </Box>
          {helperText && (
            <FormHelperText error={error}>{helperText}</FormHelperText>
          )}
        </>
      )}
    </FormControl>
  );
};

export default InputSelectCreate;