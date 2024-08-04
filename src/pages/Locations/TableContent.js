import React, { useState } from 'react'
import { Button, ButtonGroup, Checkbox, Fade, lighten, makeStyles, Popper, TableCell, TableRow } from '@material-ui/core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Loader } from '../../pages-components';
import { useHistory } from 'react-router-dom';
import API_ENDPOINTS from '../../config/apis';
import handleDeleteRecord from '../../functions/pages/handleDeleteRecord';
import clsx from 'clsx';
import { toast } from 'react-toastify';

const TableContent = ({
    fetchLocations,
    loading,
    locations,
    handleNumSelected,
    selected,
    handleSelected,
    handleIsSelectedAll,
    dense,
}) => {
    const [active, setActive] = useState(true);
    const [isDefault, setIsDefault] = useState(false);
    const [anchorEl, setAnchorEl] = useState(null);
    const [currentRowId, setCurrentRowId] = useState(null);

    const handlePopperClick = (event, rowId) => {
      if (currentRowId === rowId) {
        setAnchorEl(null);
        setCurrentRowId(null);
      } else {
        setAnchorEl(event.currentTarget);
        setCurrentRowId(rowId);
      }
    };

    const handleCheckboxChange = (id) => {
      const currentIndex = selected.indexOf(id);
      const newSelected = [...selected];

      if (currentIndex === -1) {
        newSelected.push(id);
      } else {
        newSelected.splice(currentIndex, 1);
      }

      handleSelected(newSelected);
      handleNumSelected(newSelected.length);

      if (newSelected.length === locations.data.length) {
        handleIsSelectedAll(true);
      } else {
        handleIsSelectedAll(false);
      }
    };

    return loading ? (
      <Loader />
    ) : (
      locations.data.map((row, index) => (
        <LocationRow
          key={index}
          row={row}
          active={active}
          setActive={setActive}
          anchorEl={anchorEl}
          setAnchorEl={setAnchorEl}
          currentRowId={currentRowId}
          handlePopperClick={handlePopperClick}
          fetchLocations={fetchLocations}
          setCurrentRowId={setCurrentRowId}
          handleCheckboxChange={handleCheckboxChange}
          isSelected={selected.indexOf(row.id) !== -1}
          dense={dense}
        />
      ))
    );
  };

  const useToolbarStyles = makeStyles((theme) => ({
    highlight:
      theme.palette.type === 'light'
        ? {
            // color: theme.palette.secondary.main,
            backgroundColor: lighten(theme.palette.secondary.light, 0.85),
          }
        : {
            // color: theme.palette.text.primary,
            backgroundColor: theme.palette.secondary.dark,
          },
  }));

  const LocationRow = ({
    row,
    active,
    isDefault,
    setActive,
    anchorEl,
    setAnchorEl,
    currentRowId,
    handlePopperClick,
    setCurrentRowId,
    fetchLocations,
    handleCheckboxChange,
    isSelected,
    dense,
  }) => {
    const history = useHistory();
    const open = Boolean(anchorEl) && currentRowId === row.id;
    const id = open ? 'transitions-popper' : undefined;
    const classes = useToolbarStyles();

    const handleButtonClick = () => {
      setAnchorEl(null);
      setCurrentRowId(null);
    };

    const handleEditClick = (id) => {
      history.push(`/location/edit/${id}`);
      handleButtonClick();
    };

    const handleActivateClick = () => {
      setActive(true);
      handleButtonClick();
    };

    const handleDeactivateClick = () => {
      setActive(false);
      handleButtonClick();
    };

    const handleDefaultClick = () => {
      handleButtonClick();
    };

    const handleDeleteClick = (id) => {
      const successCallback = (data) => {
        toast.success('Deleted Location Successfully');
      };

      const errorCallback = (error) => {
        toast.error('Error ' + error.message);
      };

      handleDeleteRecord(id, API_ENDPOINTS.DELETE_LOCATION, fetchLocations, successCallback, errorCallback)
    };

    return (
      <>
        <TableRow
          className={clsx(isSelected && classes.highlight)}
        >
          <td style={{ width: '50px' }}>
            <Checkbox
              checked={isSelected}
              onChange={() => handleCheckboxChange(row.id)}
            />
          </td>
          <td>
            <div className="d-flex align-items-center">
              <div>{row.code}</div>
            </div>
          </td>
          <td>{row.name}</td>
          <td className="text-center">
            <Button
              size="small"
              className="btn-link d-30 p-0 btn-icon hover-scale-sm"
              onClick={(event) => handlePopperClick(event, row.id)}
            >
              <FontAwesomeIcon
                icon={['fas', 'ellipsis-h']}
                className="font-size-lg"
              />
            </Button>
            <Popper id={id} open={open} anchorEl={anchorEl} transition>
              {({ TransitionProps }) => (
                <Fade {...TransitionProps} timeout={350}>
                  <div>
                    {active && isDefault && (
                      <ButtonGroup
                        orientation="vertical"
                        color="primary"
                        aria-label="vertical outlined primary button group"
                        variant="contained"
                      >
                        <Button className="d-30 px-5 btn-icon hover-scale-sm text-white" onClick={() => handleEditClick(row.id)}>Edit</Button>
                      </ButtonGroup>
                    )}

                    {active && !isDefault && (
                      <ButtonGroup
                        orientation="vertical"
                        color="primary"
                        aria-label="vertical outlined primary button group"
                        variant="contained"
                      >
                        <Button className="d-30 px-5 btn-icon hover-scale-sm text-white" onClick={() => handleEditClick(row.id)}>Edit</Button>
                        <Button className="d-30 px-5 btn-icon hover-scale-sm text-white" onClick={handleDefaultClick}>Default</Button>
                        <Button className="d-30 px-5 btn-icon hover-scale-sm text-white" onClick={() => handleDeleteClick(row.id)}>Delete</Button>
                        <Button
                          className="d-30 px-5 btn-icon hover-scale-sm text-white"
                          onClick={handleDeactivateClick}
                        >
                          Deactivate
                        </Button>
                      </ButtonGroup>
                    )}

                    {!active && (
                      <ButtonGroup
                        orientation="vertical"
                        color="primary"
                        aria-label="vertical outlined primary button group"
                        variant="contained"
                      >
                        <Button className="d-30 px-5 btn-icon hover-scale-sm text-white" onClick={() => handleEditClick(row.id)}>Edit</Button>
                        <Button className="d-30 px-5 btn-icon hover-scale-sm text-white" onClick={() => handleDeleteClick(row.id)}>Delete</Button>
                        <Button
                          className="d-30 px-5 btn-icon hover-scale-sm text-white"
                          onClick={handleActivateClick}
                        >
                          Activate
                        </Button>
                      </ButtonGroup>
                    )}
                  </div>
                </Fade>
              )}
            </Popper>
          </td>
        </TableRow>
      </>
    );
  };

export default TableContent