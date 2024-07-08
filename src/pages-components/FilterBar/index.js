import { Box, Button, Chip, Divider, FormControl, Grid, IconButton, Paper, Popover, TextField, Toolbar, Tooltip, Typography } from '@material-ui/core'
import FilterListTwoToneIcon from '@material-ui/icons/FilterListTwoTone';
import ClearIcon from '@material-ui/icons/Clear';
import SearchIcon from '@material-ui/icons/Search';
import React, { useState } from 'react'
import Textarea from '../Textarea';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useCountries } from 'use-react-countries';
import InputSelect from '../InputSelect';
import DatePicker from '../DatePicker';

const FilterBar = ({
    filters,
    handleChipClick,
    handleClick,
    handleDelete,
    removeAllFilters,
    handleClickFilter,
    handleCloseFilter,
    setCurrentFilter,
    setIsEditing,
    setEditIndex,
    anchorEl4,
    open4,
    isFormValid,
    currentFilter,
    isEditing,
    formatFilter
  }) => {
    const hasFilter = Array.isArray(filters) && filters.length > 0;
    // const [filters, setFilters] = useState([]);
   
    // const [anchorEl4, setAnchorEl4] = useState(null);
    // const [currentFilter, setCurrentFilter] = useState({ code: '', name: '', note: '', street: '', city: '', state: '', postcode: '', country: '' });
    // const [isEditing, setIsEditing] = useState(false);
    // const [editIndex, setEditIndex] = useState(null);

    // console.log(filters)

    // const handleChipClick = (event, index) => {
    //     const selectedFilter = filters[index];
    //     setCurrentFilter(selectedFilter);
    //     setIsEditing(true);
    //     setEditIndex(index);
    //     setAnchorEl4(event.currentTarget);
    // };


    // const handleClick = () => {
    //     const nonEmptyFilter = Object.fromEntries(
    //         Object.entries(currentFilter).filter(([_, value]) => value.trim() !== '')
    //     );

    //     if (isEditing) {
    //         const updatedFilters = [...filters];
    //         updatedFilters[editIndex] = nonEmptyFilter;
    //         setFilters(updatedFilters);
    //     } else {
    //         setFilters([...filters, nonEmptyFilter]);
    //     }
    //     handleCloseFilter();
    // };
    // // const handleClick = () => {
    // //     if (isEditing) {
    // //         const updatedFilters = [...filters];
    // //         updatedFilters[editIndex] = currentFilter;
    // //         setFilters(updatedFilters);
    // //     } else {
    // //         setFilters([...filters, currentFilter]);
    // //     }
    // //     fetchLocations(filters);
    // //     handleCloseFilter();
    // // };

    // const removeAllFilters = () => {
    //     setFilters([]);
    // };

    // const handleDelete = (index) => {
    //     const updatedFilters = filters.filter((_, i) => i !== index);
    //     setFilters(updatedFilters);
    // };

    // const handleClickFilter = (event) => {
    //     setAnchorEl4(event.currentTarget);
    // };

    // const handleCloseFilter = () => {
    //     setAnchorEl4(null);
    //     setCurrentFilter({ code: '', name: '', note: '', street: '', city: '', state: '', postcode: '', country: '' });
    //     setIsEditing(false);
    //     setEditIndex(null);
    // };

    // const isFormValid = () => {
    //     return Object.values(currentFilter).some(value => value.trim() !== '');
    // };

    // const formatFilter = (filter) => {
    //     return Object.entries(filter)
    //         .filter(([key, value]) => value.trim() !== '')
    //         .map(([key, value]) => `${key}: ${value}`)
    //         .join(', ');
    // };
    // const formatFilter = (filter) => {
    //     return Object.values(filter)
    //         .filter(value => value.trim() !== '')
    //         .join(', ');
    // };

    // const open4 = Boolean(anchorEl4);

    const { countries } = useCountries();

    const countryOptions = countries
    .map(country => ({
        name: country.name,
        value: country.name, // Setting value to country name
    }))
    .sort((a, b) => a.name.localeCompare(b.name));

    return (
        <>
            <Toolbar className='py-3'>
                <Tooltip title="Filter">
                    <IconButton
                        variant="outlined"
                        // size="large"
                        // className="d-40 btn-secondary"
                        onClick={handleClickFilter}
                        >
                        <FilterListTwoToneIcon/>
                    </IconButton>
                </Tooltip>
                {hasFilter ? (
                    <Box display="flex" justifyContent="space-between" flex={1}>
                        <Box
                            display="flex"
                            flexGrow={1}
                            whiteSpace="nowrap"
                            sx={{ overflowX: "auto", overflowY: "hidden" }}
                        >
                            {filters.map((filter, index) => (
                                <Chip
                                    className="bg-primary text-white mr-1"
                                    key={index}
                                    label={formatFilter(filter)}
                                    onClick={(event) => handleChipClick(event, index)}
                                    onDelete={() => handleDelete(index)}
                                    clickable
                                    size="small"
                                    variant="outlined"
                                />
                            ))}
                        </Box>
                        <Box flexShrink={0}>
                            <Tooltip title="Clear">
                                <IconButton
                                    variant="outlined"
                                    size="small"
                                    onClick={removeAllFilters}
                                >
                                    <ClearIcon />
                                </IconButton>
                            </Tooltip>
                        </Box>
                    </Box>
                ) : (
                    <Typography className="card-header--title font-size-xs m-2" style={{ cursor: "default" }}>
                        Filter...
                    </Typography>
                )}
            </Toolbar>
            <Popover
                open={open4}
                anchorEl={anchorEl4}
                classes={{ paper: 'rounded font-size-md' }}
                onClose={handleCloseFilter}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'center'
                }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'left'
                }}
                PaperProps={{
                    style: {
                        width: '480px',
                        maxHeight: '700px',
                        overflowY: 'auto',
                        display: "flex",
                        flexDirection: "column",
                    },
                }}
                >
                <FormControl fullWidth className='py-3'>
                    <Box display="flex" justifyContent="center">
                        <div className="font-weight-bold">
                            Filter Locations
                        </div>
                    </Box>
                    <Grid container spacing={3}
                        className='d-flex justify-content-center'
                        style={{ paddingRight: '32px' }}
                    >
                        <Grid item xs={12}>
                            <Textarea
                                style={{ margin: 0 }}
                                rows={1}
                                rowsMax={2}
                                label='Code'
                                name='code'
                                id='code'
                                value={currentFilter.code}
                                onChange={(e) => setCurrentFilter({ ...currentFilter, code: e.target.value })}
                            />
                        </Grid>
                        <Grid item xs={12}>
                        <Textarea
                                style={{ margin: 0 }}
                                rows={1}
                                rowsMax={2}
                                label='Name'
                                name='name'
                                id='name'
                                value={currentFilter.name}
                                onChange={(e) => setCurrentFilter({ ...currentFilter, name: e.target.value })}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <Textarea
                                style={{ margin: 0 }}
                                rows={1}
                                rowsMax={2}
                                label='Note'
                                name='note'
                                id='note'
                                value={currentFilter.note}
                                onChange={(e) => setCurrentFilter({ ...currentFilter, note: e.target.value })}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <Textarea
                                style={{ margin: 0 }}
                                rows={1}
                                rowsMax={2}
                                label='Street'
                                name='street'
                                id='street'
                                value={currentFilter.street}
                                onChange={(e) => setCurrentFilter({ ...currentFilter, street: e.target.value })}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <Textarea
                                style={{ margin: 0 }}
                                rows={1}
                                rowsMax={2}
                                label='City'
                                name='city'
                                id='city'
                                value={currentFilter.city}
                                onChange={(e) => setCurrentFilter({ ...currentFilter, city: e.target.value })}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <Textarea
                                style={{ margin: 0 }}
                                rows={1}
                                rowsMax={2}
                                label='State'
                                name='state'
                                id='state'
                                value={currentFilter.state}
                                onChange={(e) => setCurrentFilter({ ...currentFilter, state: e.target.value })}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <Textarea
                                style={{ margin: 0 }}
                                rows={1}
                                rowsMax={2}
                                label='Postcode'
                                name='postcode'
                                id='postcode'
                                value={currentFilter.postcode}
                                onChange={(e) => setCurrentFilter({ ...currentFilter, postcode: e.target.value })}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <InputSelect
                                selectItems={countryOptions}
                                label='Country'
                                name='country'
                                id='country'
                                value={currentFilter.country}
                                onChange={(e) => setCurrentFilter({ ...currentFilter, country: e.target.value })}
                            />
                        </Grid>
                    </Grid>
                    <Box display="flex" justifyContent="center">
                        <Button
                            variant="contained"
                            className='btn-primary'
                            // onClick={handleClick}
                            onClick={() => {
                                handleClick();
                            }}
                            disabled={!isFormValid()}
                        >
                            {isEditing ? 'Edit Filter' : 'Add Filter'}
                            <span className="btn-wrapper--icon">
                                <FontAwesomeIcon icon={['fas', 'filter']} className="opacity-8" />
                            </span>
                        </Button>
                    </Box>
                </FormControl>
            </Popover>
        </>
    )
}

export default FilterBar
// const FilterBar = () => {
//     const [filters, setFilters] = useState([ 'Angular', 'jQuery', 'Polymer', 'code name state' ]);
//     // const [filters, setFilters] = useState([ ]);
//     const hasFilter = Array.isArray(filters) && filters.length > 0;
//     const [anchorEl4, setAnchorEl4] = useState(null);

//     const handleChipClick = (event) => {
//         console.info('You clicked the chip.');
//         //open popover with chip data for edit chip
//     };

//     const handleClick = (event) => {
//         console.info('You clicked the filter result.');
//         // close popover and save chip
//     };

//     const removeAllFilters = (event) => {
//         console.info('You removed all the chips.');
//         // remove all filters
//     };

//     const handleDelete = () => {
//         console.info('You clicked the delete icon.');
//         // delete chip
//     };

//     const handleClickFilter = (event) => {
//         setAnchorEl4(event.currentTarget);
//     };

//     const handleCloseFilter = () => {
//         setAnchorEl4(null);
//     };

//     const isFormValid = () => {
//         // disable button if all fields are empty
//         // if at least one field is not empty then dont disable
//     }

//     const open4 = Boolean(anchorEl4);

//     const { countries } = useCountries();

//     const countryOptions = countries
//     .map(country => ({
//         name: country.name,
//         value: country.name, // Setting value to country name
//     }))
//     .sort((a, b) => a.name.localeCompare(b.name));

//     return (
//         <>
//             <Toolbar className='py-3'>
//                 <Tooltip title="Filter">
//                     <IconButton
//                         variant="outlined"
//                         size="large"
//                         // className="d-40 btn-secondary"
//                         onClick={handleClickFilter}
//                         >
//                         <FilterListTwoToneIcon/>
//                     </IconButton>
//                 </Tooltip>
//                 {hasFilter ? (
//                     <>
//                         <Box display="flex" justifyContent="space-between" flex={1}>
//                             <Box
//                                 display="flex"
//                                 flexGrow={1}
//                                 whiteSpace="nowrap"
//                                 sx={{ overflowX: "auto", overflowY: "hidden" }}
//                             >
//                                 {filters.map((filter, index) => (
//                                 <Chip
//                                     className="bg-primary text-white mr-1"
//                                     key={index}
//                                     label={filter}
//                                     onClick={handleChipClick}
//                                     onDelete={handleDelete}
//                                     clickable
//                                     size="small"
//                                     variant="outlined"
//                                 />
//                                 ))}
//                             </Box>
//                             <Box flexShrink={0}>
//                                 <Tooltip title="Clear">
//                                 <IconButton
//                                     variant="outlined"
//                                     size="small"
//                                     onClick={removeAllFilters}
//                                 >
//                                     <ClearIcon />
//                                 </IconButton>
//                                 </Tooltip>
//                             </Box>
//                         </Box>
//                     </>
//                 ) : (
//                     <>
//                         <div>
//                             <Typography
//                             // className="card-header--title font-size-xs m-2 nav-link"
//                             className="card-header--title font-size-xs m-2"
//                             style={{ cursor: "default" }}
//                             // onClick={handleClickFilter}
//                             >
//                                 Filter...
//                             </Typography>
//                         </div>
//                     </>
//                 )}
//             </Toolbar>
//             <Popover
//                 open={open4}
//                 anchorEl={anchorEl4}
//                 classes={{ paper: 'rounded font-size-md' }}
//                 onClose={handleCloseFilter}
//                 anchorOrigin={{
//                     vertical: 'bottom',
//                     horizontal: 'center'
//                 }}
//                 transformOrigin={{
//                     vertical: 'top',
//                     horizontal: 'left'
//                 }}
//                 PaperProps={{
//                     style: {
//                         width: '480px',
//                         maxHeight: '700px',
//                         overflowY: 'auto',
//                         display: "flex",
//                         flexDirection: "column",
//                     },
//                 }}
//                 >
//                 <FormControl fullWidth className='py-3'>
//                     <Box display="flex" justifyContent="center">
//                         <div className="font-weight-bold">
//                             Filter Locations
//                         </div>
//                     </Box>
//                     <Grid container spacing={3}
//                         className='d-flex justify-content-center'
//                         style={{ paddingRight: '32px' }}
//                     >
//                         <Grid item xs={12}>
//                             <Textarea
//                             style={{margin: 0}}
//                             rows={1}
//                             rowsMax={2}
//                             label='Code'
//                             name='code'
//                             id='code'
//                             // onChange={handleInputChange('code')}
//                             // value={locationsData.code ?? ""}
//                             key='code'
//                             // error={isEmpty(locationsData.code)}
//                             />
//                         </Grid>
//                         <Grid item xs={12}>
//                             <Textarea
//                             style={{margin: 0}}
//                             rows={1}
//                             rowsMax={2}
//                             label='Name'
//                             name='name'
//                             id='name'
//                             // onChange={handleInputChange('code')}
//                             // value={locationsData.code ?? ""}
//                             key='name'
//                             // error={isEmpty(locationsData.code)}
//                             />
//                         </Grid>
//                         <Grid item xs={12}>
//                             <Textarea
//                             style={{margin: 0}}
//                             rows={1}
//                             rowsMax={2}
//                             label='Note'
//                             name='note'
//                             id='note'
//                             // onChange={handleInputChange('code')}
//                             // value={locationsData.code ?? ""}
//                             key='note'
//                             // error={isEmpty(locationsData.code)}
//                             />
//                         </Grid>
//                         <Grid item xs={12}>
//                             <Textarea
//                             style={{margin: 0}}
//                             rows={1}
//                             rowsMax={2}
//                             label='Street'
//                             name='street'
//                             id='street'
//                             // onChange={handleInputChange('code')}
//                             // value={locationsData.code ?? ""}
//                             key='street'
//                             // error={isEmpty(locationsData.code)}
//                             />
//                         </Grid>
//                         <Grid item xs={12}>
//                             <Textarea
//                             style={{margin: 0}}
//                             rows={1}
//                             rowsMax={2}
//                             label='City'
//                             name='city'
//                             id='city'
//                             // onChange={handleInputChange('code')}
//                             // value={locationsData.code ?? ""}
//                             key='city'
//                             // error={isEmpty(locationsData.code)}
//                             />
//                         </Grid>
//                         <Grid item xs={12}>
//                             <Textarea
//                             style={{margin: 0}}
//                             rows={1}
//                             rowsMax={2}
//                             label='State'
//                             name='state'
//                             id='state'
//                             // onChange={handleInputChange('code')}
//                             // value={locationsData.code ?? ""}
//                             key='state'
//                             // error={isEmpty(locationsData.code)}
//                             />
//                         </Grid>
//                         <Grid item xs={12}>
//                             <Textarea
//                             style={{margin: 0}}
//                             rows={1}
//                             rowsMax={2}
//                             label='Postcode'
//                             name='postcode'
//                             id='postcode'
//                             // onChange={handleInputChange('code')}
//                             // value={locationsData.code ?? ""}
//                             key='postcode'
//                             // error={isEmpty(locationsData.code)}
//                             />
//                         </Grid>
//                         <Grid item xs={12}>
//                             <InputSelect
//                             selectItems={countryOptions}
//                             label='Country'
//                             name='country'
//                             id='country'
//                             // onChange={handleInputChange('country')}
//                             // value={locationsData.country ?? ""}
//                             // error={isEmpty(locationsData.country)}
//                             />
//                         </Grid>
//                     </Grid>
//                     <Box display="flex" justifyContent="center">
//                         <Button
//                             variant="contained"
//                             className='btn-primary'
//                             onClick={() => {
//                                     handleClick();
//                                 }}
//                             // disabled={!isFormValid()} // Disable button if form is not valid
//                         >
//                             Filter Results
//                             <span className="btn-wrapper--icon">
//                                 <FontAwesomeIcon icon={['fas', 'filter']} className="opacity-8" />
//                             </span>
//                         </Button>
//                     </Box>
//                 </FormControl>
//             </Popover>
//         </>
//     )
// }

// export default FilterBar