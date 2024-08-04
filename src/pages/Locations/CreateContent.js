import React from 'react'
import Form from './Form';
import { useHistory } from 'react-router-dom';
import API_ENDPOINTS from '../../config/apis';
import { handleSubmitRecord } from '../../functions/pages/handleSubmitRecord';
import { toast } from 'react-toastify';

const CreateContent = () => {
  const history = useHistory();

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
      history.push('/locations');
      toast.success('Added Location Successfully');
    };

    const errorCallback = (error) => {
      toast.error('Error ' + error.message);
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