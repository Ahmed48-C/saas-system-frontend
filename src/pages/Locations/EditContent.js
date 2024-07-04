import React, { useEffect, useState } from 'react'
import axios from "axios";
import Form from './Form';
import { Loader } from '../../pages-components';
import { useParams, useHistory } from 'react-router-dom';

const EditContent = ({
    // id,
    editLoading,
    // handleLocation,
    // location
}) => {
    const { id } = useParams(); // Get the ID from the URL
    const history = useHistory();
    const [location, setLocation] = useState({});
    console.log('id' + id)

    const fetchLocation = () => {
      // handleEditLoading(true);
      axios.get(`http://127.0.0.1:8000/api/get/location/${id}/`)
        .then(response => {
          setLocation(response.data);
          // handleEditLoading(false);
        })
        .catch(error => {
          console.error('Error fetching data:', error);
          // handleEditLoading(false);
        });
    };

    useEffect(() => {
      fetchLocation(); // Fetch locations when component mounts or dependencies change
    }, []);
    console.log('LOCATION', location)

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

      // setLocation(locationsData)
  
      axios.put(`http://127.0.0.1:8000/api/put/location/${id}/`, putData)
        .then(response => {
          console.log('Update request successful:', response.data);
          // handleShowSuccess(true); // Show success message
          setTimeout(() => {
            // handleShowSuccess(false);
            // handleEditMode(false);
            // handleClick();
            // fetchLocations();
            history.push('/locations'); // Navigate back to /
          }, 1000); // Hide success message after 1.5 seconds
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
          // showSuccess={showSuccess}
          // handleCloseSuccess={handleCloseSuccess}
          handleClick={handleUpdateClick}
          // countryOptions={countryOptions}
          // isEmpty={isEmpty}
          successMessage='Location Updated Successfully'
          icon='save'
          data={location}
        />
        )}
      </>
    );
  };

export default EditContent;