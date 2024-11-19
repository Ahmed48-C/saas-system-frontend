import React from 'react'
import Form from './Form';
import { useHistory } from 'react-router-dom';
import {API_ENDPOINTS} from '../../config/apis';
import { handleSubmitRecord } from '../../functions/pages/handleSubmitRecord';
import { toast } from 'react-toastify';

const CreateContent = () => {
  const history = useHistory();

    const handleSubmitClick = (data) => {
      const postData = {
        name: data.name,
        phone: data.phone,
        share_percentage: data.share_percentage,
        is_active: data.is_active,
      };

      const successCallback = (data) => {
        history.push('/ui/clients');
        toast.success('Added Client Successfully');
      };

      const errorCallback = (error) => {
        toast.error('Error ' + error.message);
      };

      handleSubmitRecord(postData, API_ENDPOINTS.POST_CLIENT, successCallback, errorCallback);
    };

    return (
      <>
        <Form
          handleClick={handleSubmitClick}
          icon='plus'
          title='Add Client'
        />
      </>
    )
  }

export default CreateContent;