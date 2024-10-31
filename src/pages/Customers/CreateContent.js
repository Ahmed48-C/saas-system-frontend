import React from 'react'
import Form from './Form';
import { useHistory } from 'react-router-dom';
import {API_ENDPOINTS} from '../../config/apis';
import { handleSubmitRecord } from '../../functions/pages/handleSubmitRecord';
import { toast } from 'react-toastify';

const CreateContent = () => {
  const history = useHistory();

    const handleSubmitClick = (data) => {
      const postData = {
        code: data.code,
        name: data.name,
        phone: data.phone,
        email: data.email,
        location_id: data.location_id,
      };

      const successCallback = (data) => {
        history.push('/customers');
        toast.success('Added Customer Successfully');
      };

      const errorCallback = (error) => {
        toast.error('Error ' + error.message);
      };

      handleSubmitRecord(postData, API_ENDPOINTS.POST_CUSTOMER, successCallback, errorCallback);
    };

    return (
      <>
        <Form
          handleClick={handleSubmitClick}
          icon='plus'
          title='Add Customer'
        />
      </>
    )
  }

export default CreateContent;