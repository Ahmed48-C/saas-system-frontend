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
        share_percentage: data.share_percentage,
        is_active: data.is_active,
      };

      const successCallback = (data) => {
        history.push('/ui/clients');
        toast.success('Edited Client Successfully');
      };

      const errorCallback = (error) => {
        toast.error('Error ' + error.message);
      };

      handleUpdateRecord(id, updateData, API_ENDPOINTS.PUT_CLIENT, successCallback, errorCallback);
    };

    return (
      <>
        {editLoading ? (
          <Loader />
        ) : (
        <Form
          handleClick={handleUpdateClick}
          icon='save'
          title='Edit Client'
        />
        )}
      </>
    );
  };

export default EditContent;