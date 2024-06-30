import React, { useState } from 'react'
import axios from "axios";
import Form from './Form';

const CreateContent = ({ countryOptions, isEmpty, showSuccess, handleCloseSuccess, fetchLocations, handleShowSuccess }) => {
    const handleSubmitClick = (locationsData) => {
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
          handleShowSuccess(true); // Show success message
          setTimeout(() => handleShowSuccess(false), 1500); // Hide success message after 3 seconds
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
        <Form
          showSuccess={showSuccess}
          handleCloseSuccess={handleCloseSuccess}
          // handleInputChange={handleInputChange}
          // locationsData={locationsData}
          handleClick={handleSubmitClick}
          countryOptions={countryOptions}
          // isFormValid={isFormValid}
          isEmpty={isEmpty}
          successMessage='Location Added Successfully'
          icon='plus'
          data={{}}
        />
      </>
    )
  }

export default CreateContent;