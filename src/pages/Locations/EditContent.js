import React from 'react'
import axios from "axios";
import Form from './Form';
import { Loader } from '../../pages-components';
import { useParams, useHistory } from 'react-router-dom';
import API_ENDPOINTS from '../../config/apis';

const EditContent = ({ editLoading }) => {
    const { id } = useParams(); // Get the ID from the URL
    const history = useHistory();

    const handleUpdateClick = (locationsData) => {
      const putData = {
        code: locationsData.code,
        name: locationsData.name,
        note: locationsData.note,
        street: locationsData.street,
        city: locationsData.city,
        state: locationsData.state,
        postcode: locationsData.postcode,
        country: locationsData.country,
      };

      let url = API_ENDPOINTS.PUT_LOCATION(id);

      axios.put(url, putData)
        .then(response => {
          console.log('Update request successful:', response.data);
          setTimeout(() => {
            history.push('/locations');
          }, 1000);
        })
        .catch(error => {
          console.error('Error making update request:', error);
        });
    };
  
    return (
      <>
        {editLoading ? (
          <Loader />
        ) : (
        <Form
          handleClick={handleUpdateClick}
          icon='save'
        />
        )}
      </>
    );
  };

export default EditContent;