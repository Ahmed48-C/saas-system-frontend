import React, { useState } from 'react'
import axios from "axios";
import Form from './Form';
import { Loader } from '../../pages-components';

const EditContent = ({
    id,
    countryOptions,
    isEmpty,
    showSuccess,
    handleCloseSuccess,
    fetchLocations,
    handleShowSuccess,
    handleEditMode,
    editLoading,
    handleClick,
    handleLocation,
    location
}) => {
    const handleUpdateClick = (locationsData) => {
      const putData = {
        code: locationsData.code,
        name: locationsData.name,
        note: locationsData.note,
        street: locationsData.street,
        city: locationsData.city,
        state: locationsData.state,
        postcode: locationsData.postcode,
        country: locationsData.country,
      };

      handleLocation(locationsData)
  
      axios.put(`http://127.0.0.1:8000/api/put/location/${id}/`, putData)
        .then(response => {
          console.log('Update request successful:', response.data);
          handleShowSuccess(true); // Show success message
          setTimeout(() => {
            handleShowSuccess(false);
            handleEditMode(false);
            handleClick();
            fetchLocations();
          }, 1500); // Hide success message after 1.5 seconds
        })
        .catch(error => {
          console.error('Error making update request:', error);
        });
    };
  
    return (
      <>
        {editLoading ? (
          <Loader />
        ) : (
        <Form
          showSuccess={showSuccess}
          handleCloseSuccess={handleCloseSuccess}
          handleClick={handleUpdateClick}
          countryOptions={countryOptions}
          isEmpty={isEmpty}
          successMessage='Location Updated Successfully'
          icon='save'
          data={location}
        />
        )}
      </>
    );
  };

export default EditContent;