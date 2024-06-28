import React, { useEffect, useState } from 'react'
import { DatePicker, InputSelect, Loader, MainTable, Popover, TagSelect, Textarea, TimePicker, ToggleSwitch, Upload } from '../pages-components'
import { Box, Button, ButtonGroup, Card, Divider, Fade, Grid, Popper, Tooltip } from '@material-ui/core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import DashboardIcon from '@material-ui/icons/Dashboard';
import { useCountries } from 'use-react-countries'
import axios from 'axios';
import SuccessMessage from '../pages-components/SuccesMessage';
import NoRecords from '../pages-components/NoRecords';
import { MoonLoader } from 'react-spinners';

const headers = [
  { key: 'Code', className: 'bg-white text-left' },
  { key: 'Name', className: 'bg-white text-left' },
  { key: 'Actions', className: 'bg-white text-center' }
];

const Locations = () => {
  const [showSuccess, setShowSuccess] = useState(false);
  const [showDeleted, setShowDeleted] = useState(false);

  const [loading, setLoading] = useState(true);
  const [locations, setLocations] = useState([]);

  const [showCreate, setShowCreate] = useState(false);

  const [recordId, setRecordId] = useState('');
  const [editMode, setEditMode] = useState(false);
  const [editLoading, setEditLoading] = useState(false);
  const [location, setLocation] = useState({});

  const handleClick = () => {
    setShowCreate(prevShowCreate => !prevShowCreate);
  };

  const fetchLocations = () => {
    setLoading(true);
    axios.get('http://127.0.0.1:8000/api/get/locations/')
      .then(response => {
        setLocations(response.data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching data:', error);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchLocations();
  }, []);

  const { countries } = useCountries();

  const countryOptions = countries
      .map(country => ({
        name: country.name,
        value: country.name, // Setting value to country name
      }))
      .sort((a, b) => a.name.localeCompare(b.name));

  const CreateContent = () => {
    const [locationsData, setLocationsData] = useState({});

    const isFormValid = () => {
      return locationsData.code &&
             locationsData.name &&
             locationsData.street &&
             locationsData.city &&
             locationsData.state &&
             locationsData.postcode &&
             locationsData.country;
    };

    console.log('create component rendered');

    const isEmpty = (field) => {
      return field === null || field === undefined || field === '';
    };

    const handleSubmitClick = () => {
      const postData = {
        code: locationsData.code,
        name: locationsData.name,
        note: locationsData.note,
        street: locationsData.street,
        city: locationsData.city,
        state: locationsData.state,
        postcode: locationsData.postcode,
        country: locationsData.country,
      };

      axios.post('http://127.0.0.1:8000/api/post/location/', postData)
        .then(response => {
          // Handle success (if needed)
          console.log('Post request successful:', response.data);
          fetchLocations();
          setShowSuccess(true); // Show success message
          setTimeout(() => setShowSuccess(false), 1500); // Hide success message after 3 seconds
          // Optionally reset form state or show success message
          // setLocationsData({})
        })
        .catch(error => {
          // Handle error (if needed)
          console.error('Error making post request:', error);
          // Optionally show error message to user
        });
    };

    return (
      <>
        <SuccessMessage
          open={showSuccess}
          message='Location Added Successfully'
          vertical='bottom'
          horizontal='center'
          toastrStyle='toastr-success'
          onClose={() => setShowSuccess(false)}
        />
        <Grid container spacing={3} className="my-4">
          <Grid item xs={12}>
            <div className="font-size-lg font-weight-bold">DETAILS</div>
          </Grid>
          <Grid item xs={12}>
            <Divider className="my-4" />
          </Grid>
          <Grid item xs={6}>
            <Textarea
              rows={1}
              rowsMax={2}
              label='Code'
              name='code'
              id='code'
              onChange={
                e => {
                  setLocationsData({ ...locationsData, code: e.target.value })
                }
              }
              value={locationsData.code ?? ""}
              key='code'
              error={isEmpty(locationsData.code)}
            />
          </Grid>
          <Grid item xs={6}>
            <Textarea
              rows={1}
              rowsMax={2}
              label='Name'
              name='name'
              id='name'
              onChange={
                e => {
                  setLocationsData({ ...locationsData, name: e.target.value })
                }
              }
              value={locationsData.name ?? ""}
              key='name'
              error={isEmpty(locationsData.name)}
            />
          </Grid>
          <Grid item xs={12}>
            <Textarea
              rows={1}
              rowsMax={2}
              label='Note'
              name='note'
              id='note'
              onChange={
                e => {
                  setLocationsData({ ...locationsData, note: e.target.value })
                }
              }
              value={locationsData.note ?? ""}
              key='note'
            />
          </Grid>
          <Grid item xs={12}>
            <Divider className="my-4" />
          </Grid>
          <Grid item xs={12}>
            <div className="font-size-lg font-weight-bold">ADRESSS</div>
          </Grid>
          <Grid item xs={12}>
            <Divider className="my-4" />
          </Grid>
          <Grid item xs={6}>
            <Textarea
              rows={1}
              rowsMax={2}
              label='Street'
              name='street'
              id='street'
              onChange={
                e => {
                  setLocationsData({ ...locationsData, street: e.target.value })
                }
              }
              value={locationsData.street ?? ""}
              key='street'
              error={isEmpty(locationsData.street)}
            />
          </Grid>
          <Grid item xs={6}>
            <Textarea
              rows={1}
              rowsMax={2}
              label='City'
              name='city'
              id='city'
              onChange={
                e => {
                  setLocationsData({ ...locationsData, city: e.target.value })
                }
              }
              value={locationsData.city ?? ""}
              key='city'
              error={isEmpty(locationsData.city)}
            />
          </Grid>
          <Grid item xs={6}>
            <Textarea
              rows={1}
              rowsMax={2}
              label='State'
              name='state'
              id='state'
              onChange={
                e => {
                  setLocationsData({ ...locationsData, state: e.target.value })
                }
              }
              value={locationsData.state ?? ""}
              key='state'
              error={isEmpty(locationsData.state)}
            />
          </Grid>
          <Grid item xs={6}>
            <Textarea
              rows={1}
              rowsMax={2}
              label='Postcode'
              name='postcode'
              id='postcode'
              onChange={
                e => {
                  setLocationsData({ ...locationsData, postcode: e.target.value })
                }
              }
              value={locationsData.postcode ?? ""}
              key='postcode'
              error={isEmpty(locationsData.postcode)}
            />
          </Grid>
          <Grid item xs={6}>
            <InputSelect
              selectItems={countryOptions}
              label='Country'
              name='country'
              id='country'
              onChange={
                e => {
                  setLocationsData({ ...locationsData, country: e.target.value })
                }
              }
              value={locationsData.country ?? ""}
              error={isEmpty(locationsData.country)}
            />
          </Grid>
          <Grid item xs={12}>
            <Divider className="my-4" />
          </Grid>
          <Grid item xs={12}>
            <Box display="flex" justifyContent="flex-end">
              <Tooltip title="Submit">
                <span>
                <Button
                  variant="contained"
                  size="small"
                  className="d-40 btn-success"
                  onClick={handleSubmitClick}
                  disabled={!isFormValid()} // Disable button if form is not valid
                >
                  <span className="btn-wrapper--icon">
                    <FontAwesomeIcon icon={['fas', 'plus']} className="opacity-8" />
                  </span>
                </Button>
                </span>
              </Tooltip>
            </Box>
          </Grid>
        </Grid>
      </>
    )
  }

  // const fetchLocation = ({idz}) => {
  //   setEditLoading(true);
  //   axios.get(`http://127.0.0.1:8000/api/get/location/${idz}/`)
  //     .then(response => {
  //       setLocation(response.data);
  //       setEditLoading(false);
  //     })
  //     .catch(error => {
  //       console.error('Error fetching data:', error);
  //       setEditLoading(false);
  //     });
  // };

  const EditContent = ({ id }) => {
    const [locationsData, setLocationsData] = useState({});
    const [showSuccess, setShowSuccess] = useState(false);

    // const [editLoading, setEditLoading] = useState(true); // Add loading state

    console.log('edit component rendered');
    // console.log('loading start' + editLoading )

    // const fetchLocation = () => {
    //   setEditLoading(true);
    //   axios.get(`http://127.0.0.1:8000/api/get/location/${id}/`)
    //     .then(response => {
    //       setLocation(response.data);
    //       setEditLoading(false);
    //     })
    //     .catch(error => {
    //       console.error('Error fetching data:', error);
    //       setEditLoading(false);
    //     });
    // };
  
    // useEffect(() => {
    //   fetchLocation();
    // }, []);
  
    const isFormValid = () => {
      return (
        location.code &&
        location.name &&
        location.street &&
        location.city &&
        location.state &&
        location.postcode &&
        location.country
      );
    };
  
    const isEmpty = (field) => {
      return field === null || field === undefined || field === '';
    };
  
    const handleUpdateClick = () => {
      const putData = {
        code: location.code,
        name: location.name,
        note: location.note,
        street: location.street,
        city: location.city,
        state: location.state,
        postcode: location.postcode,
        country: location.country,
      };
  
      axios.put(`http://127.0.0.1:8000/api/put/location/${id}/`, putData)
        .then(response => {
          console.log('Update request successful:', response.data);
          setShowSuccess(true); // Show success message
          setTimeout(() => {
            setShowSuccess(false);
            // handleClose(); // Close edit mode after successful update
            setEditMode(false);
            handleClick();
            fetchLocations();
          }, 1500); // Hide success message after 1.5 seconds
        })
        .catch(error => {
          console.error('Error making update request:', error);
        });
    };

    // if (loading) {
    //   return <Loader />;
    // }
  
    return (
      <>
        <SuccessMessage
          open={showSuccess}
          message='Location Updated Successfully'
          vertical='bottom'
          horizontal='center'
          toastrStyle='toastr-success'
          onClose={() => setShowSuccess(false)}
        />
        {editLoading ? (
          <Loader />
          // <MoonLoader />
        ) : (
        <Grid container spacing={3} className="my-4">
        <Grid item xs={12}>
            <div className="font-size-lg font-weight-bold">DETAILS</div>
          </Grid>
          <Grid item xs={12}>
            <Divider className="my-4" />
          </Grid>
          <Grid item xs={6}>
            <Textarea
              rows={1}
              rowsMax={2}
              label='Code'
              name='code'
              id='code'
              onChange={
                e => {
                  setLocation({ ...location, code: e.target.value })
                }
              }
              value={location.code ?? ""}
              key='code'
              error={isEmpty(location.code)}
            />
          </Grid>
          <Grid item xs={6}>
            <Textarea
              rows={1}
              rowsMax={2}
              label='Name'
              name='name'
              id='name'
              onChange={
                e => {
                  setLocation({ ...location, name: e.target.value })
                }
              }
              value={location.name ?? ""}
              key='name'
              error={isEmpty(location.name)}
            />
          </Grid>
          <Grid item xs={12}>
            <Textarea
              rows={1}
              rowsMax={2}
              label='Note'
              name='note'
              id='note'
              onChange={
                e => {
                  setLocation({ ...location, note: e.target.value })
                }
              }
              value={location.note ?? ""}
              key='note'
            />
          </Grid>
          <Grid item xs={12}>
            <Divider className="my-4" />
          </Grid>
          <Grid item xs={12}>
            <div className="font-size-lg font-weight-bold">ADRESSS</div>
          </Grid>
          <Grid item xs={12}>
            <Divider className="my-4" />
          </Grid>
          <Grid item xs={6}>
            <Textarea
              rows={1}
              rowsMax={2}
              label='Street'
              name='street'
              id='street'
              onChange={
                e => {
                  setLocation({ ...location, street: e.target.value })
                }
              }
              value={location.street ?? ""}
              key='street'
              error={isEmpty(location.street)}
            />
          </Grid>
          <Grid item xs={6}>
            <Textarea
              rows={1}
              rowsMax={2}
              label='City'
              name='city'
              id='city'
              onChange={
                e => {
                  setLocation({ ...location, city: e.target.value })
                }
              }
              value={location.city ?? ""}
              key='city'
              error={isEmpty(location.city)}
            />
          </Grid>
          <Grid item xs={6}>
            <Textarea
              rows={1}
              rowsMax={2}
              label='State'
              name='state'
              id='state'
              onChange={
                e => {
                  setLocation({ ...location, state: e.target.value })
                }
              }
              value={location.state ?? ""}
              key='state'
              error={isEmpty(location.state)}
            />
          </Grid>
          <Grid item xs={6}>
            <Textarea
              rows={1}
              rowsMax={2}
              label='Postcode'
              name='postcode'
              id='postcode'
              onChange={
                e => {
                  setLocation({ ...location, postcode: e.target.value })
                }
              }
              value={location.postcode ?? ""}
              key='postcode'
              error={isEmpty(location.postcode)}
            />
          </Grid>
          <Grid item xs={6}>
            <InputSelect
              selectItems={countryOptions}
              label='Country'
              name='country'
              id='country'
              onChange={
                e => {
                  setLocation({ ...location, country: e.target.value })
                }
              }
              value={location.country ?? ""}
              error={isEmpty(location.country)}
            />
          </Grid>
          <Grid item xs={12}>
            <Divider className="my-4" />
          </Grid>
          <Grid item xs={12}>
            <Box display="flex" justifyContent="flex-end">
              <Tooltip title="Update">
                <span>
                <Button
                  variant="contained"
                  size="small"
                  className="d-40 btn-success"
                  onClick={handleUpdateClick}
                  disabled={!isFormValid()}
                >
                  <span className="btn-wrapper--icon">
                    <FontAwesomeIcon icon={['fas', 'save']} className="opacity-8" />
                  </span>
                </Button>
                </span>
              </Tooltip>
            </Box>
          </Grid>
        </Grid>
        )}
      </>
    );
  };

  const TableContent = () => {
    const [active, setActive] = useState(true);
    const [isDefault, setIsDefault] = useState(false);

    useEffect(() => {
      setEditMode(false);
    }, );

    const handleDeleteClick = (id) => {
      axios.delete(`http://127.0.0.1:8000/api/delete/location/${id}/`)
        .then(response => {
          console.log('Delete request successful:', response.data);
          fetchLocations(); // Assuming you have a fetchLocations function to refresh the data
          setShowDeleted(true); // Show success message
          setTimeout(() => setShowDeleted(false), 1500); // Hide success message after 3 seconds
        })
        .catch(error => {
          console.error('Error deleting location:', error);
        });
    };

    const fetchLocation = (id) => {
      setEditLoading(true);
      axios.get(`http://127.0.0.1:8000/api/get/location/${id}/`)
        .then(response => {
          setLocation(response.data);
          setEditLoading(false);
        })
        .catch(error => {
          console.error('Error fetching data:', error);
          setEditLoading(false);
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
        />
      ))
    );
  };

  const LocationRow = ({ row, active, isDefault, setActive, handleDeleteClick, setIsDefault, fetchLocation }) => {
    const [anchorEl, setAnchorEl] = useState(null);

    const handlePopperClick = (event) => {
      setAnchorEl(anchorEl ? null : event.currentTarget);
    };

    const open = Boolean(anchorEl);
    const id = open ? 'transitions-popper' : undefined;

    const handleButtonClick = () => {
      setAnchorEl(null);
    };

    // const handleEditClick = () => {
    //   handleClick();
    //   handleButtonClick();
    // };

    const handleEditClick = (id) => {
      fetchLocation(row.id);
      setEditMode(true);
      setRecordId(id);
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
          open={showDeleted}
          message='Location Deleted Successfully'
          vertical='bottom'
          horizontal='center'
          toastrStyle='toastr-success'
          onClose={() => setShowDeleted(false)}
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
  
  return (
    <>
      <MainTable
        headers={headers}
        tableContent={
          !loading && locations.length === 0 ? (
            <NoRecords context='Locations' />
          ) : (
            <TableContent />
          )
        }
        Heading={editMode ? 'Update Location' : 'Add Location'}
        createContent={editMode ? <EditContent id={recordId} /> : <CreateContent />}
        handleClick={handleClick}
        showCreate={showCreate}
      />
    </>
  )
}

export default Locations