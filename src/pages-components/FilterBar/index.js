import React from 'react'

import { Box, Button, Chip, FormControl, Grid, IconButton, Popover, Toolbar, Tooltip, Typography } from '@material-ui/core'
import FilterListTwoToneIcon from '@material-ui/icons/FilterListTwoTone';
import ClearIcon from '@material-ui/icons/Clear';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const FilterBar = ({
    filters,
    anchorEl4,
    open4,
    isEditing,
    heading,
    filterContent,
    currentFilter,
    handleAnchorEl4,
    handleFilters,
    handleCurrentFilter,
    handleIsEditing,
    handleEditIndex,
    editIndex
  }) => {
    const hasFilter = Array.isArray(filters) && filters.length > 0;

    const formatFilter = (filter) => {
        return Object.entries(filter)
        .filter(([key, value]) => value.trim() !== '')
        .map(([key, value]) => `${key}: ${value}`)
        .join(', ');
    };

    const isFormValid = () => {
        return Object.values(currentFilter).some(value => value.trim() !== '');
    };

    const handleClickFilter = (event) => {
        handleAnchorEl4(event.currentTarget);
    };

    const removeAllFilters = () => {
        handleFilters([]);
    };

    const handleDelete = (index) => {
        const updatedFilters = filters.filter((_, i) => i !== index);
        handleFilters(updatedFilters);
    };

    const handleChipClick = (event, index) => {
        const selectedFilter = filters[index];
        handleCurrentFilter(selectedFilter);
        handleIsEditing(true);
        handleEditIndex(index);
        handleAnchorEl4(event.currentTarget);
    };

    const handleClick = () => {
        const nonEmptyFilter = Object.fromEntries(
            Object.entries(currentFilter).filter(([_, value]) => value.trim() !== '')
        );

        if (isEditing) {
            const updatedFilters = [...filters];
            updatedFilters[editIndex] = nonEmptyFilter;
            handleFilters(updatedFilters);
        } else {
            handleFilters([...filters, nonEmptyFilter]);
        }
        handleCloseFilter();
    };

    const handleCloseFilter = () => {
        handleAnchorEl4(null);
        handleCurrentFilter({ code: '', name: '', note: '', street: '', city: '', state: '', postcode: '', country: '' });
        handleIsEditing(false);
        handleEditIndex(null);
    };

    return (
        <>
            <Toolbar className='py-3'>
                <Tooltip title="Filter">
                    <IconButton
                        variant="outlined"
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
                            Filter {heading}
                        </div>
                    </Box>
                    <Grid container spacing={3}
                        className='d-flex justify-content-center'
                        style={{ paddingRight: '32px' }}
                    >
                        {filterContent}
                    </Grid>
                    <Box display="flex" justifyContent="center">
                        <Button
                            variant="contained"
                            className='btn-primary'
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