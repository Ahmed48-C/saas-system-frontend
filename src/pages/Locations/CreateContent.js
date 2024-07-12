import React from 'react'
import axios from "axios";
import Form from './Form';
import { useHistory } from 'react-router-dom'; // Import useHistory
import API_ENDPOINTS from '../../config/apis';
import { handleSubmitRecord } from '../../functions/pages/handleSubmitRecord';

const CreateContent = () => {
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

    const successCallback = (data) => {
      setTimeout(() => {
        history.push('/locations');
      }, 1000);
    };

    const errorCallback = (error) => {
      console.error('Error making post request:', error);
    };

    handleSubmitRecord(postData, API_ENDPOINTS.POST_LOCATION, successCallback, errorCallback);
  };

  return (
    <>
      <Form
        handleClick={handleSubmitClick}
        icon='plus'
        title='Add Location'
      />
    </>
  )
}

export default CreateContent;