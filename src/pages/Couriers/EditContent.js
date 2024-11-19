import React from 'react'
import { Loader } from '../../pages-components';
import { useParams, useHistory } from 'react-router-dom';
import {API_ENDPOINTS} from '../../config/apis';
import { handleUpdateRecord } from '../../functions/pages/handleUpdateRecord';
import Form from './Form';
import { toast } from 'react-toastify';

const EditContent = ({ editLoading }) => {
    const { id } = useParams();
    const history = useHistory();

    const handleUpdateClick = (data) => {
      const updateData = {
        name: data.name,
        phone: data.phone,
        vehicle_type: data.vehicle_type,
        is_available: data.is_available,
        default_delivery_cost: data.default_delivery_cost,
      };

      const successCallback = (data) => {
        history.push('/ui/couriers');
        toast.success('Edited Courier Successfully');
      };

      const errorCallback = (error) => {
        toast.error('Error ' + error.message);
      };

      handleUpdateRecord(id, updateData, API_ENDPOINTS.PUT_COURIER, successCallback, errorCallback);
    };

    return (
      <>
        {editLoading ? (
          <Loader />
        ) : (
        <Form
          handleClick={handleUpdateClick}
          icon='save'
          title='Edit Courier'
        />
        )}
      </>
    );
  };

export default EditContent;