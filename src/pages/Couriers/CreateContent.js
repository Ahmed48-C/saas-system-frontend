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
        name: data.name,
        phone: data.phone,
        vehicle_type: data.vehicle_type,
        is_available: data.is_available,
        default_delivery_cost: data.default_delivery_cost,
      };

      const successCallback = (data) => {
        history.push('/ui/couriers');
        toast.success('Added Courier Successfully');
      };

      const errorCallback = (error) => {
        toast.error('Error ' + error.message);
      };

      handleSubmitRecord(postData, API_ENDPOINTS.POST_COURIER, successCallback, errorCallback);
    };

    return (
      <>
        <Form
          handleClick={handleSubmitClick}
          icon='plus'
          title='Add Courier'
        />
      </>
    )
  }

export default CreateContent;