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
        balance_id: data.balance_id,
        customer_id: data.customer_id,
        category_id: data.category_id,
        amount: data.amount,
        type: 'INCOME',
        note: data.note,
        action: 'Add',
        attachment: data.attachment,
        attachment_file: data.attachment_file,
      };

      const successCallback = (data) => {
        history.push('/ui/incomes');
        toast.success('Added Income Successfully');
      };

      const errorCallback = (error) => {
        let errorMessage = 'An unexpected error occurred';

        if (error.response) {
            if (error.response.data && typeof error.response.data === 'object' && error.response.data.detail) {
                if (error.response.data.detail.includes('PNG')) {
                  errorMessage = error.response.data.detail;
                }
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

      handleSubmitRecord(postData, API_ENDPOINTS.POST_INCOME, successCallback, errorCallback);
    };

    return (
      <>
        <Form
          handleClick={handleSubmitClick}
          icon='plus'
          title='Add Income'
        />
      </>
    )
  }

export default CreateContent;