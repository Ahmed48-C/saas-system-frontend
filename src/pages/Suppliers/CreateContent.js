import React from 'react'
import axios from "axios";
import Form from './Form';
import { useHistory } from 'react-router-dom'; // Import useHistory
import API_ENDPOINTS from '../../config/apis';
import { handleSubmitRecord } from '../../functions/pages/handleSubmitRecord';

const CreateContent = () => {
  const history = useHistory(); // Use the useHistory hook

    // const handleSubmitClick = (suppliersData) => {
    //   const postData = {
    //     name: suppliersData.name,
    //     phone: suppliersData.phone,
    //     email: suppliersData.email,
    //     // operator_id: suppliersData.operator_id,
    //     // location_id: suppliersData.location_id,
    //   };

    //   let url = API_ENDPOINTS.POST_SUPPLIER();

    //   axios.post(url, postData)
    //     .then(response => {
    //       console.log('Post request successful:', response.data);
    //       setTimeout(() => {
    //         history.push('/suppliers');
    //       }, 1000);
    //     })
    //     .catch(error => {
    //       console.error('Error making post request:', error);
    //     });
    // };

    const handleSubmitClick = (suppliersData) => {
      const postData = {
        name: suppliersData.name,
        phone: suppliersData.phone,
        email: suppliersData.email,
      };
  
      const successCallback = (data) => {
        setTimeout(() => {
          history.push('/suppliers');
        }, 1000);
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