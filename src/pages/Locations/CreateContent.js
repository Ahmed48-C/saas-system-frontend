import React from 'react'
import axios from "axios";
import Form from './Form';
import { useHistory } from 'react-router-dom'; // Import useHistory
import API_ENDPOINTS from '../../config/apis';

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

      let url = API_ENDPOINTS.POST_LOCATION();

      axios.post(url, postData)
        .then(response => {
          console.log('Post request successful:', response.data);
          setTimeout(() => {
            history.push('/locations');
          }, 1000);
        })
        .catch(error => {
          console.error('Error making post request:', error);
        });
    };

    return (
      <>
        <Form
          handleClick={handleSubmitClick}
          icon='plus'
        />
      </>
    )
  }

export default CreateContent;