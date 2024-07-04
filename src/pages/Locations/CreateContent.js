import React, { useState } from 'react'
import axios from "axios";
import Form from './Form';
import { PageTitle } from '../../layout-components';
import { useHistory } from 'react-router-dom'; // Import useHistory

const CreateContent = ({  handleShowSuccess }) => {
  const history = useHistory(); // Use the useHistory hook

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
          // handleShowSuccess(true); // Show success message
          setTimeout(() => {
            // handleShowSuccess(false); // Hide success message after 1 second
            history.push('/locations'); // Navigate to /locations
          }, 1000);
        })
        .catch(error => {
          console.error('Error making post request:', error);
        });
    };

    return (
      <>
        {/* <PageTitle titleHeading='Add Location' handleClick={handleClick} /> */}
        <Form
          // showSuccess={showSuccess}
          // handleCloseSuccess={handleCloseSuccess}
          handleClick={handleSubmitClick}
          successMessage='Location Added Successfully'
          icon='plus'
          data={{}}
        />
      </>
    )
  }

export default CreateContent;