import React from 'react'
import Form from './Form';
import { useHistory } from 'react-router-dom';
import API_ENDPOINTS from '../../config/apis';
import { handleSubmitRecord } from '../../functions/pages/handleSubmitRecord';
import { toast } from 'react-toastify';

const CreateContent = () => {
  const history = useHistory();

    const handleSubmitClick = (suppliersData) => {
      const postData = {
        name: suppliersData.name,
        phone: suppliersData.phone,
        email: suppliersData.email,
        contact_name: suppliersData.contact_name,
        contact_phone: suppliersData.contact_phone,
        location_id: suppliersData.location_id,
      };

      const successCallback = (data) => {
        history.push('/suppliers');
        toast.success('Added Supplier Successfully');
      };

      const errorCallback = (error) => {
        console.error('Error making post request:', error);
      };

      handleSubmitRecord(postData, API_ENDPOINTS.POST_SUPPLIER, successCallback, errorCallback);
    };

    return (
      <>
        <Form
          handleClick={handleSubmitClick}
          icon='plus'
          title='Add Supplier'
        />
      </>
    )
  }

export default CreateContent;