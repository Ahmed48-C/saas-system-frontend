import React, { useEffect, useState } from 'react'
import axios from "axios";
import SuccessMessage from '../../pages-components/SuccesMessage';
import { Button, ButtonGroup, Fade, Popper } from '@material-ui/core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Loader } from '../../pages-components';

const TableContent = ({
    fetchLocations,
    loading,
    editLoading,
    locations,
    handleEditMode,
    handleClick,
    handleShowSuccess,
    showSuccess,
    handleLocation,
    handleEditLoading,
    handleRecordId
}) => {
    const [active, setActive] = useState(true);
    const [isDefault, setIsDefault] = useState(false);

    useEffect(() => {
        handleEditMode(false);
    }, );

    const handleDeleteClick = (id) => {
      axios.delete(`http://127.0.0.1:8000/api/delete/location/${id}/`)
        .then(response => {
          console.log('Delete request successful:', response.data);
          fetchLocations(); // Assuming you have a fetchLocations function to refresh the data
        //   setShowDeleted(true); // Show success message
        //   setTimeout(() => setShowDeleted(false), 1500); // Hide success message after 3 seconds
          handleShowSuccess(true); // Show success message
          setTimeout(() => handleShowSuccess(false), 1500); // Hide success message after 3 seconds
        })
        .catch(error => {
          console.error('Error deleting location:', error);
        });
    };

    const fetchLocation = (id) => {
      handleEditLoading(true);
      axios.get(`http://127.0.0.1:8000/api/get/location/${id}/`)
        .then(response => {
          handleLocation(response.data);
          handleEditLoading(false);
        })
        .catch(error => {
          console.error('Error fetching data:', error);
          handleEditLoading(false);
        });
    };

    return loading || editLoading ? (
      <Loader />
    ) : (
      locations.map((row, index) => (
        <LocationRow
          key={index}
          row={row}
          active={active}
          isDefault={isDefault}
          setActive={setActive}
          handleDeleteClick={handleDeleteClick}
          setIsDefault={setIsDefault}
          fetchLocation={fetchLocation}
          handleEditMode={handleEditMode}
          handleClick={handleClick}
          handleShowSuccess={handleShowSuccess}
          showSuccess={showSuccess}
          handleRecordId={handleRecordId}
        />
      ))
    );
  };

  const LocationRow = ({ row, active, isDefault, setActive, handleDeleteClick, setIsDefault, fetchLocation, handleEditMode, handleClick, handleShowSuccess, showSuccess, handleRecordId }) => {
    const [anchorEl, setAnchorEl] = useState(null);

    const handlePopperClick = (event) => {
      setAnchorEl(anchorEl ? null : event.currentTarget);
    };

    const open = Boolean(anchorEl);
    const id = open ? 'transitions-popper' : undefined;

    const handleButtonClick = () => {
      setAnchorEl(null);
    };

    const handleEditClick = (id) => {
      fetchLocation(row.id);
      handleEditMode(true);
      handleRecordId(id);
      handleClick();
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
        <SuccessMessage
          open={showSuccess}
          message='Location Deleted Successfully'
          vertical='bottom'
          horizontal='center'
          toastrStyle='toastr-success'
          onClose={() => handleShowSuccess(false)}
        />
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
            onClick={handlePopperClick}
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
      </tr>
      </>
    );
  };

export default TableContent