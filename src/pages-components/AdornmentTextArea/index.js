import React from 'react';
import { TextField, InputAdornment, Select, MenuItem } from '@material-ui/core';

// const AdornmentTextarea = ({ rows, rowsMax, label, value, onChange, key, error, id, maxLength, unit, onUnitChange, units }) => {
//   return (
//     <>
//       <TextField
//         key={key}
//         className="m-3"
//         fullWidth
//         id={id}
//         label={label}
//         onChange={onChange}
//         value={value}
//         multiline
//         rows={rows}
//         rowsMax={rowsMax}
//         error={error}
//         inputProps={maxLength ? { maxLength: maxLength } : {}}
//         variant="outlined"
//         InputProps={{
//           endAdornment: (
//             <InputAdornment position="end">
//               <Select
//                 value={unit}
//                 onChange={onUnitChange}
//                 displayEmpty
//               >
//                 {units.map((unit, index) => (
//                   <MenuItem key={index} value={unit}>
//                     {unit}
//                   </MenuItem>
//                 ))}
//               </Select>
//             </InputAdornment>
//           )
//         }}
//       />
//     </>
//   );
// }

// export default AdornmentTextarea;

const AdornmentTextarea = ({ rows, rowsMax, label, value, onChange, key, error, id, maxLength, unit, onUnitChange, units, helperText }) => {
  return (
    <>
      <TextField
        key={key}
        className="m-3"
        fullWidth
        id={id}
        label={label}
        onChange={onChange}
        value={value}
        multiline
        rows={rows}
        rowsMax={rowsMax}
        inputProps={maxLength ? { maxLength: maxLength } : {}}
        variant="outlined"
        helperText={helperText}
        // Conditionally change the label color if there's an error
        InputLabelProps={{
          style: { color: error ? 'red' : '' }, // Change label color only when error is true
        }}
        // Remove the error prop from TextField to avoid making the entire field red
        FormHelperTextProps={{ error }}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <Select
                value={unit}
                onChange={onUnitChange}
                displayEmpty
              >
                {units.map((unit, index) => (
                  <MenuItem key={index} value={unit}>
                    {unit}
                  </MenuItem>
                ))}
              </Select>
            </InputAdornment>
          )
        }}
      />
    </>
  );
}

export default AdornmentTextarea;