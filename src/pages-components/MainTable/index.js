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
} from '@material-ui/core';

import Pagination from '@material-ui/lab/Pagination';

import { motion } from 'framer-motion';
import DeleteIcon from '@material-ui/icons/Delete';
import CheckBoxIcon from '@material-ui/icons/CheckBox';
import IndeterminateCheckBoxIcon from '@material-ui/icons/IndeterminateCheckBox';
import clsx from 'clsx';

const MainTable = ({ tableContent, tableButtons, Heading, handleClick, tableHeading, handlePageChange, pageCount, filterBar, page, numSelected, handleBatchDelete, isSelectedAll, handleSelectAll, handleDeselectAll, rows, handleRows }) => {

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
                <Tooltip title="New">
                  <Button
                    variant="contained"
                    size="small"
                    className="d-40 btn-primary"
                    onClick={handleClick}>
                    <span className="btn-wrapper--icon">
                      <FontAwesomeIcon icon={['fas', 'plus-circle']} />
                    </span>
                  </Button>
                </Tooltip>
              </Toolbar>
            )}
            {/* </div> */}
            {tableButtons}
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