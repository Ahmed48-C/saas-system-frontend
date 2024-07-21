import React, { useState } from 'react'
import { Button, ButtonGroup, Fade, Popper } from '@material-ui/core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Loader } from '../../pages-components';
import { useHistory } from 'react-router-dom';
import API_ENDPOINTS from '../../config/apis';
import handleDeleteRecord from '../../functions/pages/handleDeleteRecord';

const TableContent = ({
    fetchLocations,
    loading,
    locations
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
        />
      ))
    );
  };

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
  }) => {
    const history = useHistory();
    const open = Boolean(anchorEl) && currentRowId === row.id;
    const id = open ? 'transitions-popper' : undefined;

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

    return (
      <>
        <tr>
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
                        <Button className="d-30 px-5 btn-icon hover-scale-sm text-white" onClick={() => handleDeleteRecord(row.id, API_ENDPOINTS.DELETE_LOCATION, fetchLocations)}>Delete</Button>
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
                        <Button className="d-30 px-5 btn-icon hover-scale-sm text-white" onClick={() => handleDeleteRecord(row.id, API_ENDPOINTS.DELETE_LOCATION, fetchLocations)}>Delete</Button>
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
        </tr>
      </>
    );
  };

export default TableContent