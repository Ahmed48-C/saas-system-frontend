import React from 'react'
import Form from './Form';
import { Loader } from '../../pages-components';
import { useParams, useHistory } from 'react-router-dom';
import API_ENDPOINTS from '../../config/apis';
import { handleUpdateRecord } from '../../functions/pages/handleUpdateRecord';

const EditContent = ({ editLoading }) => {
    const { id } = useParams();
    const history = useHistory();

    const handleUpdateClick = (locationsData) => {
      const updateData = {
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
        console.error('Error making update request:', error);
      };
  
      handleUpdateRecord(id, updateData, API_ENDPOINTS.PUT_LOCATION, successCallback, errorCallback);
    };
  
    return (
      <>
        {editLoading ? (
          <Loader />
        ) : (
        <Form
          handleClick={handleUpdateClick}
          icon='save'
          title='Edit Location'
        />
        )}
      </>
    );
  };

export default EditContent;