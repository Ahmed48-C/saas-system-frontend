import React, { useEffect, useState } from 'react'
import { MainTable } from '../../pages-components'
import { useCountries } from 'use-react-countries'
import axios from 'axios';
import NoRecords from '../../pages-components/NoRecords';
import EditContent from './EditContent';
import CreateContent from './CreateContent';
import TableContent from './TableContent';

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

  // const [locationsData, setLocationsData] = useState({});

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

  const isEmpty = (field) => {
    return field === null || field === undefined || field === '';
  };

  const handleShowSuccess = (value) => {
    setShowSuccess(value);
  };

  const handleEditMode = (value) => {
    setEditMode(value);
  };

  const handleLocation = (value) => {
    setLocation(value);
  };

  const handleEditLoading = (value) => {
    setEditLoading(value);
  };

  const handleRecordId = (value) => {
    setRecordId(value);
  };

  const handleCloseSuccess = () => {
    setShowSuccess(false);
  };

  /*
  // const isFormValid = () => {
  //   return locationsData.code &&
  //          locationsData.name &&
  //          locationsData.street &&
  //          locationsData.city &&
  //          locationsData.state &&
  //          locationsData.postcode &&
  //          locationsData.country;
  // };
  

  // const handleInputChange = (field) => (e) => {
  //   setLocationsData({ ...locationsData, [field]: e.target.value });
  // };

  // const CreateContent = () => {
  //   const handleSubmitClick = (locationsData) => {
  //     const postData = {
  //       code: locationsData.code,
  //       name: locationsData.name,
  //       note: locationsData.note,
  //       street: locationsData.street,
  //       city: locationsData.city,
  //       state: locationsData.state,
  //       postcode: locationsData.postcode,
  //       country: locationsData.country,
  //     };

  //     axios.post('http://127.0.0.1:8000/api/post/location/', postData)
  //       .then(response => {
  //         // Handle success (if needed)
  //         console.log('Post request successful:', response.data);
  //         fetchLocations();
  //         setShowSuccess(true); // Show success message
  //         setTimeout(() => setShowSuccess(false), 1500); // Hide success message after 3 seconds
  //         // Optionally reset form state or show success message
  //         // setLocationsData({})
  //       })
  //       .catch(error => {
  //         // Handle error (if needed)
  //         console.error('Error making post request:', error);
  //         // Optionally show error message to user
  //       });
  //   };

  //   return (
  //     <>
  //       <Form
  //         showSuccess={showSuccess}
  //         handleCloseSuccess={handleCloseSuccess}
  //         // handleInputChange={handleInputChange}
  //         // locationsData={locationsData}
  //         handleClick={handleSubmitClick}
  //         countryOptions={countryOptions}
  //         // isFormValid={isFormValid}
  //         isEmpty={isEmpty}
  //         successMessage='Location Added Successfully'
  //         icon='plus'
  //         data={{}}
  //       />
  //     </>
  //   )
  // }

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

  // const EditContent = ({ id }) => {
  //   const handleUpdateClick = (locationsData) => {
  //     const putData = {
  //       code: locationsData.code,
  //       name: locationsData.name,
  //       note: locationsData.note,
  //       street: locationsData.street,
  //       city: locationsData.city,
  //       state: locationsData.state,
  //       postcode: locationsData.postcode,
  //       country: locationsData.country,
  //     };

  //     setLocation(locationsData)

  //     axios.put(`http://127.0.0.1:8000/api/put/location/${id}/`, putData)
  //       .then(response => {
  //         console.log('Update request successful:', response.data);
  //         setShowSuccess(true); // Show success message
  //         setTimeout(() => {
  //           setShowSuccess(false);
  //           // handleClose(); // Close edit mode after successful update
  //           setEditMode(false);
  //           handleClick();
  //           fetchLocations();
  //         }, 1500); // Hide success message after 1.5 seconds
  //       })
  //       .catch(error => {
  //         console.error('Error making update request:', error);
  //       });
  //   };

  //   return (
  //     <>
  //       {editLoading ? (
  //         <Loader />
  //       ) : (
  //       <Form
  //         showSuccess={showSuccess}
  //         handleCloseSuccess={handleCloseSuccess}
  //         // handleInputChange={handleInputChange}
  //         // locationsData={locationsData}
  //         handleClick={handleUpdateClick}
  //         countryOptions={countryOptions}
  //         // isFormValid={isFormValid}
  //         isEmpty={isEmpty}
  //         successMessage='Location Updated Successfully'
  //         icon='save'
  //         data={location}
  //       />
  //       )}
  //     </>
  //   );
  // };

  // const TableContent = () => {
  //   const [active, setActive] = useState(true);
  //   const [isDefault, setIsDefault] = useState(false);

  //   useEffect(() => {
  //     setEditMode(false);
  //   }, );

  //   const handleDeleteClick = (id) => {
  //     axios.delete(`http://127.0.0.1:8000/api/delete/location/${id}/`)
  //       .then(response => {
  //         console.log('Delete request successful:', response.data);
  //         fetchLocations(); // Assuming you have a fetchLocations function to refresh the data
  //         setShowDeleted(true); // Show success message
  //         setTimeout(() => setShowDeleted(false), 1500); // Hide success message after 3 seconds
  //       })
  //       .catch(error => {
  //         console.error('Error deleting location:', error);
  //       });
  //   };

  //   const fetchLocation = (id) => {
  //     setEditLoading(true);
  //     axios.get(`http://127.0.0.1:8000/api/get/location/${id}/`)
  //       .then(response => {
  //         setLocation(response.data);
  //         setEditLoading(false);
  //       })
  //       .catch(error => {
  //         console.error('Error fetching data:', error);
  //         setEditLoading(false);
  //       });
  //   };

  //   return loading || editLoading ? (
  //     <Loader />
  //   ) : (
  //     locations.map((row, index) => (
  //       <LocationRow
  //         key={index}
  //         row={row}
  //         active={active}
  //         isDefault={isDefault}
  //         setActive={setActive}
  //         handleDeleteClick={handleDeleteClick}
  //         setIsDefault={setIsDefault}
  //         fetchLocation={fetchLocation}
  //       />
  //     ))
  //   );
  // };

  // const LocationRow = ({ row, active, isDefault, setActive, handleDeleteClick, setIsDefault, fetchLocation }) => {
  //   const [anchorEl, setAnchorEl] = useState(null);

  //   const handlePopperClick = (event) => {
  //     setAnchorEl(anchorEl ? null : event.currentTarget);
  //   };

  //   const open = Boolean(anchorEl);
  //   const id = open ? 'transitions-popper' : undefined;

  //   const handleButtonClick = () => {
  //     setAnchorEl(null);
  //   };

  //   const handleEditClick = (id) => {
  //     fetchLocation(row.id);
  //     setEditMode(true);
  //     setRecordId(id);
  //     handleClick();
  //     handleButtonClick();
  //   };

  //   const handleActivateClick = () => {
  //     setActive(true);
  //     handleButtonClick();
  //   };

  //   const handleDeactivateClick = () => {
  //     setActive(false);
  //     handleButtonClick();
  //   };

  //   const handleDefaultClick = () => {
  //     handleButtonClick();
  //   };

  //   return (
  //     <>
  //       <SuccessMessage
  //         open={showDeleted}
  //         message='Location Deleted Successfully'
  //         vertical='bottom'
  //         horizontal='center'
  //         toastrStyle='toastr-success'
  //         onClose={() => setShowDeleted(false)}
  //       />
  //     <tr>
  //       <td>
  //         <div className="d-flex align-items-center">
  //           <div>{row.code}</div>
  //         </div>
  //       </td>
  //       <td>{row.name}</td>
  //       <td className="text-center">
  //         <Button
  //           size="small"
  //           className="btn-link d-30 p-0 btn-icon hover-scale-sm"
  //           onClick={handlePopperClick}
  //         >
  //           <FontAwesomeIcon
  //             icon={['fas', 'ellipsis-h']}
  //             className="font-size-lg"
  //           />
  //         </Button>
  //         <Popper id={id} open={open} anchorEl={anchorEl} transition>
  //           {({ TransitionProps }) => (
  //             <Fade {...TransitionProps} timeout={350}>
  //               <div>
  //                 {active && isDefault && (
  //                   <ButtonGroup
  //                     orientation="vertical"
  //                     color="primary"
  //                     aria-label="vertical outlined primary button group"
  //                     variant="contained"
  //                   >
  //                     <Button className="d-30 px-5 btn-icon hover-scale-sm text-white" onClick={() => handleEditClick(row.id)}>Edit</Button>
  //                   </ButtonGroup>
  //                 )}

  //                 {active && !isDefault && (
  //                   <ButtonGroup
  //                     orientation="vertical"
  //                     color="primary"
  //                     aria-label="vertical outlined primary button group"
  //                     variant="contained"
  //                   >
  //                     <Button className="d-30 px-5 btn-icon hover-scale-sm text-white" onClick={() => handleEditClick(row.id)}>Edit</Button>
  //                     <Button className="d-30 px-5 btn-icon hover-scale-sm text-white" onClick={handleDefaultClick}>Default</Button>
  //                     <Button className="d-30 px-5 btn-icon hover-scale-sm text-white" onClick={() => handleDeleteClick(row.id)}>Delete</Button>
  //                     <Button
  //                       className="d-30 px-5 btn-icon hover-scale-sm text-white"
  //                       onClick={handleDeactivateClick}
  //                     >
  //                       Deactivate
  //                     </Button>
  //                   </ButtonGroup>
  //                 )}

  //                 {!active && (
  //                   <ButtonGroup
  //                     orientation="vertical"
  //                     color="primary"
  //                     aria-label="vertical outlined primary button group"
  //                     variant="contained"
  //                   >
  //                     <Button className="d-30 px-5 btn-icon hover-scale-sm text-white" onClick={() => handleEditClick(row.id)}>Edit</Button>
  //                     <Button className="d-30 px-5 btn-icon hover-scale-sm text-white" onClick={() => handleDeleteClick(row.id)}>Delete</Button>
  //                     <Button
  //                       className="d-30 px-5 btn-icon hover-scale-sm text-white"
  //                       onClick={handleActivateClick}
  //                     >
  //                       Activate
  //                     </Button>
  //                   </ButtonGroup>
  //                 )}
  //               </div>
  //             </Fade>
  //           )}
  //         </Popper>
  //       </td>
  //     </tr>
  //     </>
  //   );
  // };
  */

  return (
    <>
      <MainTable
        headers={headers}
        tableContent={
          !loading && locations.length === 0 ? (
            <NoRecords context='Locations' />
          ) : (
            // <TableContent />
            <TableContent
              fetchLocations={fetchLocations}
              loading={loading}
              editLoading={editLoading}
              locations={locations}
              handleEditMode={handleEditMode}
              handleClick={handleClick}
              handleShowSuccess={handleShowSuccess}
              showSuccess={showSuccess}
              handleLocation={handleLocation}
              handleEditLoading={handleEditLoading}
              handleRecordId={handleRecordId}
            />
          )
        }
        Heading={editMode ? 'Update Location' : 'Add Location'}
        createContent={
          editMode ?
          <EditContent
            id={recordId}
            countryOptions={countryOptions}
            isEmpty={isEmpty}
            showSuccess={showSuccess}
            handleCloseSuccess={handleCloseSuccess}
            fetchLocations={fetchLocations}
            handleShowSuccess={handleShowSuccess}
            handleEditMode={handleEditMode}
            editLoading={editLoading}
            handleClick={handleClick}
            handleLocation={handleLocation}
            location={location}
          />
          :
          <CreateContent
            countryOptions={countryOptions}
            isEmpty={isEmpty}
            showSuccess={showSuccess}
            handleCloseSuccess={handleCloseSuccess}
            fetchLocations={fetchLocations}
            handleShowSuccess={handleShowSuccess}
          />
        }
        handleClick={handleClick}
        showCreate={showCreate}
      />
    </>
  )
}

export default Locations