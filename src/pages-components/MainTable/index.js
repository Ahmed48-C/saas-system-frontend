import React, { useEffect, useState } from 'react';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  Table,
  Card,
  Button,
  Tooltip,
  Typography,
  IconButton,
  Toolbar,
  makeStyles,
  lighten,
  ButtonGroup,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Popover,
  List,
  ListItem,
  FormControlLabel,
  Checkbox,
} from '@material-ui/core';

import Pagination from '@material-ui/lab/Pagination';

import { motion } from 'framer-motion';
import DeleteIcon from '@material-ui/icons/Delete';
import CheckBoxIcon from '@material-ui/icons/CheckBox';
import IndeterminateCheckBoxIcon from '@material-ui/icons/IndeterminateCheckBox';
import ViewWeekIcon from '@material-ui/icons/ViewWeek';
import clsx from 'clsx';

import { useHistory } from 'react-router-dom';

const MainTable = ({ tableContent, tableButtons, Heading, handleClick, tableHeading, handlePageChange, pageCount, filterBar, page, numSelected, handleBatchDelete, isSelectedAll, handleSelectAll, handleDeselectAll, rows, handleRows, columns, handleColumns, tabs, contentAboveFilter, isAddRecord = true }) => {

    // const [rows, setRows] = useState('50');
    const [pointerEvents, setPointerEvents] = useState('auto');

    const handleChange = (event) => {
      handleRows(event.target.value);
    };

    const handleAnimationStart = () => {
      setPointerEvents('none');
    };

    const handleAnimationComplete = () => {
      setPointerEvents('auto');
    };

    const [divHeight, setDivHeight] = useState('auto');

    useEffect(() => {
      const adjustHeight = () => {
        const mediaHeight = window.innerHeight;
        let maxHeight = 183.8;
        if (mediaHeight <= 555) {
          if (divHeight > maxHeight) {
            setDivHeight(maxHeight);
          }
        } else {
          maxHeight = 183.8 + (Math.floor((mediaHeight - 555) / 67.5) * 67.5);
          setDivHeight(maxHeight);
        }
      };

      window.addEventListener('resize', adjustHeight);
      adjustHeight();

      return () => {
        window.removeEventListener('resize', adjustHeight);
      };
    }, [divHeight]);

    const useToolbarStyles = makeStyles((theme) => ({
      highlight:
        theme.palette.type === 'light'
          ? {
              color: theme.palette.secondary.main,
              backgroundColor: lighten(theme.palette.secondary.light, 0.85)
            }
          : {
              color: theme.palette.text.primary,
              backgroundColor: theme.palette.secondary.dark
            },
    }));

    const classes = useToolbarStyles();

    const [columnsAnchorEl, setColumnsAnchorEl] = useState(null);

    const handleColumnsPopoverOpen = (event) => {
      setColumnsAnchorEl(event.currentTarget);
    };

    const handleColumnsPopoverClose = () => {
      setColumnsAnchorEl(null);
    };

    // const handleColumnToggle = (index) => {
    //   handleColumns((prevColumns) => {
    //     const updatedColumns = [...prevColumns];
    //     updatedColumns[index].selected = !updatedColumns[index].selected;
    //     return updatedColumns;
    //   });
    // };

    const handleColumnToggle = (index) => {
      handleColumns((prevColumns) => {
        const updatedColumns = [...prevColumns];
        updatedColumns[index].selected = !updatedColumns[index].selected;

        // Update the `isSelectedAll` state based on the new column selection
        const allSelected = updatedColumns.every(column => column.selected);
        setIsColumnSelectedAll(allSelected);

        return updatedColumns;
      });
    };

    const [isColumnSelectedAll, setIsColumnSelectedAll] = useState(
      columns.every(column => column.selected)
    );

    const handleColumnSelectAll = () => {
      const updatedColumns = columns.map(column => ({
        ...column,
        selected: true,
      }));
      handleColumns(updatedColumns);
      setIsColumnSelectedAll(true);
    };

    const handleColumnDeselectAll = () => {
      const updatedColumns = columns.map(column => ({
        ...column,
        selected: false,
      }));
      handleColumns(updatedColumns);
      setIsColumnSelectedAll(false);
    };

    const open = Boolean(columnsAnchorEl);

    const history = useHistory();

    return (
      <>
        <motion.div
          key="table"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.3 }}
          onAnimationStart={handleAnimationStart}
          onAnimationComplete={handleAnimationComplete}
          style={{ pointerEvents }}
        >
          {/* <Card className="card-box mb-spacing-6-x2"> */}
          <Card className="card-box">

            <List className="nav-tabs nav-tabs-primary d-flex" style={{ paddingLeft: 0 }}>
              {tabs.map((tab, index) => (
                <ListItem
                  key={index}
                  style={{ marginRight: 0, display: 'flex', justifyContent: 'center', marginTop: 0 }}
                  button
                  disableRipple
                  selected={window.location.pathname === tab.url}
                  onClick={() => history.push(tab.url)}>
                  {tab.title}
                </ListItem>
              ))}
            </List>

            {/* <div className="card-header py-3"> */}
            {numSelected > 0 ? (
              <Toolbar className={clsx(classes.highlight,'card-header py-3')}>
              <Typography
                className='card-header--title font-size-xl'
                color="h6"
                variant="tableTitle"
                component="div">
                {numSelected} selected
              </Typography>
              <ButtonGroup>
                {isSelectedAll ? (
                  <Tooltip title="Deselect All">
                      <IconButton
                          variant="outlined"
                          size="small"
                          className="d-40"
                          onClick={handleDeselectAll}
                          >
                          <IndeterminateCheckBoxIcon/>
                      </IconButton>
                  </Tooltip>
                ) : (
                  <Tooltip title="Select All">
                      <IconButton
                          variant="outlined"
                          size="small"
                          className="d-40"
                          onClick={handleSelectAll}
                          >
                          <CheckBoxIcon/>
                      </IconButton>
                  </Tooltip>
                )}
                <Tooltip title="Delete">
                    <IconButton
                        variant="outlined"
                        size="small"
                        className="d-40"
                        onClick={handleBatchDelete}
                        >
                        <DeleteIcon/>
                    </IconButton>
                </Tooltip>
              </ButtonGroup>
            </Toolbar>
            ) : (
              <Toolbar className="card-header py-3">
                <Typography
                  className='card-header--title font-size-xl'
                  variant="h6"
                  id="tableTitle"
                  component="div">
                  {Heading}
                </Typography>
                {isAddRecord && (
                  <Tooltip title="New">
                    <Button
                      variant="contained"
                      size="small"
                      className="btn-primary"
                      onClick={handleClick}>
                      <span className="btn-wrapper--text" style={{ paddingRight: '5px' }}>New</span>
                      <span className="btn-wrapper--icon">
                        <FontAwesomeIcon icon={['fas', 'plus']} style={{ marginBottom: '1px' }} />
                      </span>
                    </Button>
                  </Tooltip>
                )}
                {/* <Tooltip title="New">
                  <Button
                    variant="contained"
                    size="small"
                    className="d-40 btn-primary"
                    onClick={handleClick}>
                    <span className="btn-wrapper--icon">
                      <FontAwesomeIcon icon={['fas', 'plus-circle']} />
                    </span>
                  </Button>
                </Tooltip> */}
              </Toolbar>
            )}
            {/* </div> */}
            {tableButtons}
            <div>
              {/* <div className="search-wrapper"> */}
              {contentAboveFilter}
              {/* </div> */}
            </div>
            <div>
              {/* <div className="search-wrapper"> */}
                {filterBar}
              {/* </div> */}
            </div>
            <div className="divider" />
            <div
              id="table-container"
              style={{
                display: 'block',
                width: '100%',
                overflowX: 'auto',
                overflowY: 'auto', // Add vertical scroll bar
                WebkitOverflowScrolling: 'touch',
                maxHeight: divHeight
              }}
            >
              <Table className="table text-nowrap mb-0">
                <thead>
                  {tableHeading}
                </thead>
                <tbody>
                  {tableContent}
                </tbody>
              </Table>
            </div>
            <div className="card-footer py-3 d-flex justify-content-between">
              <Pagination
                className="pagination-primary"
                variant="outlined"
                count={pageCount} // Total number of pages
                onChange={handlePageChange} // Handle page change event
                page={page} // Current page
              />
              <div className="d-flex align-items-center">
                {/* Edit Columns Popover */}
                <Tooltip title="Columns">
                    <Button
                        style={{ width: '36px', height: '36px', padding: '0' }}
                        variant="contained"
                        size="small"
                        className="btn-primary mx-3"
                        onClick={handleColumnsPopoverOpen}
                    >
                        <span className="btn-wrapper--icon">
                            <ViewWeekIcon fontSize='small' />
                        </span>
                    </Button>
                </Tooltip>
                <Popover
                open={open}
                anchorEl={columnsAnchorEl}
                onClose={handleColumnsPopoverClose}
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'left',
                }}
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'left',
                }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', padding: '5px 5px 0 5px' }}>
                    <Typography style={{ fontSize: '0.875rem', textAlign: 'center', flexGrow: 1 }}>
                      Edit Columns
                    </Typography>
                    {isColumnSelectedAll ? (
                      <Tooltip title="Deselect All">
                        <IconButton
                          variant="outlined"
                          size="small"
                          onClick={handleColumnDeselectAll}
                          style={{ marginLeft: '10px' }} // Add some spacing between the typography and button
                        >
                          <IndeterminateCheckBoxIcon />
                        </IconButton>
                      </Tooltip>
                    ) : (
                      <Tooltip title="Select All">
                        <IconButton
                          variant="outlined"
                          size="small"
                          onClick={handleColumnSelectAll}
                          style={{ marginLeft: '10px' }} // Add some spacing between the typography and button
                        >
                          <CheckBoxIcon />
                        </IconButton>
                      </Tooltip>
                    )}
                  </div>
                  <List style={{ padding: '0' }}>
                    {columns.map((column, index) => (
                      <ListItem key={index} dense button style={{ padding: '2px 10px' }}>
                        <FormControlLabel
                          control={
                            <Checkbox
                              color="primary"
                              checked={column.selected}
                              onChange={() => handleColumnToggle(index)}
                              size="small" // Make the checkbox smaller
                            />
                          }
                          label={column.name}
                          // style={{ marginLeft: 'auto', marginRight: 'auto' }} // Center the label and checkbox
                        />
                      </ListItem>
                    ))}
                  </List>
                </Popover>
                <span>Show</span>
                <FormControl size="small" variant="outlined" className="mx-3">
                  <InputLabel id="select-rows-label">Rows</InputLabel>
                  <Select
                    labelId="select-rows-label"
                    id="select-rows"
                    value={rows}
                    onChange={handleChange}
                    label="Rows">
                    <MenuItem className="mx-2" value={25}>
                      25
                    </MenuItem>
                    <MenuItem className="mx-2" value={50}>
                      50
                    </MenuItem>
                    <MenuItem className="mx-2" value={75}>
                      75
                    </MenuItem>
                    <MenuItem className="mx-2" value={100}>
                      100
                    </MenuItem>
                    <MenuItem className="mx-2" value={150}>
                      150
                    </MenuItem>
                    <MenuItem className="mx-2" value={300}>
                      300
                    </MenuItem>
                  </Select>
                </FormControl>
                <span>Rows</span>
              </div>
            </div>
          </Card>
        </motion.div>
      </>
    );
}

export default MainTable