import React from 'react'
import Form from './Form';
import { Loader } from '../../pages-components';
import { useParams, useHistory } from 'react-router-dom';
import API_ENDPOINTS from '../../config/apis';
import { handleUpdateRecord } from '../../functions/pages/handleUpdateRecord';

const EditContent = ({ editLoading }) => {
    const { id } = useParams();
    const history = useHistory();

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