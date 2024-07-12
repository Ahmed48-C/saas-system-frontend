import React from 'react'
import axios from "axios";
import Form from './Form';
import { Loader } from '../../pages-components';
import { useParams, useHistory } from 'react-router-dom';
import API_ENDPOINTS from '../../config/apis';
import { handleUpdateRecord } from '../../functions/pages/handleUpdateRecord';

const EditContent = ({ editLoading }) => {
    const { id } = useParams(); // Get the ID from the URL
    const history = useHistory();

    // const handleUpdateClick = (suppliersData) => {
    //   const putData = {
    //     name: suppliersData.name,
    //     phone: suppliersData.phone,
    //     email: suppliersData.email,
    //     // operator_id: suppliersData.operator_id,
    //     // location_id: suppliersData.location_id,
    //   };

    //   let url = API_ENDPOINTS.PUT_SUPPLIER(id);

    //   axios.put(url, putData)
    //     .then(response => {
    //       console.log('Update request successful:', response.data);
    //       setTimeout(() => {
    //         history.push('/suppliers');
    //       }, 1000);
    //     })
    //     .catch(error => {
    //       console.error('Error making update request:', error);
    //     });
    // };

    const handleUpdateClick = (suppliersData) => {
      const updateData = {
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
        console.error('Error making update request:', error);
      };
  
      handleUpdateRecord(id, updateData, API_ENDPOINTS.PUT_SUPPLIER, successCallback, errorCallback);
    };
  
    return (
      <>
        {editLoading ? (
          <Loader />
        ) : (
        <Form
          handleClick={handleUpdateClick}
          icon='save'
          title='Edit Supplier'
        />
        )}
      </>
    );
  };

export default EditContent;