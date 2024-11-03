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
        amount: data.amount,
        note: data.note,
        balance_from_id: data.balance_from_id,
        balance_to_id: data.balance_to_id,
      };

      const successCallback = (data) => {
        history.push('/ui/transfers');
        toast.success('Added Transfer Successfully');
      };

      const errorCallback = (error) => {
        let errorMessage = 'An unexpected error occurred';

        if (error.response) {
            // Check if the error response contains 'duplicate key'
            if (error.response.data && typeof error.response.data === 'object' && error.response.data.detail) {
                if (error.response.data.detail.includes('Insufficient')) {
                  errorMessage = 'Insufficient balance in balance From';
                }
                // else {
                //     errorMessage = error.response.data.detail;
                // }
            } else if (error.response.status === 500) {
                // For server errors
                errorMessage = 'An error occurred on the server. Please try again later.';
            }
        } else if (error.message) {
            errorMessage = error.message;
        }

        toast.error('Error: ' + errorMessage);
        console.log('Detailed error:', error);
    };

      handleSubmitRecord(postData, API_ENDPOINTS.POST_TRANSFER, successCallback, errorCallback);
    };

    return (
      <>
        <Form
          handleClick={handleSubmitClick}
          icon='plus'
          title='Add Transfer'
        />
      </>
    )
  }

export default CreateContent;