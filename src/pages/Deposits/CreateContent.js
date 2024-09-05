import React from 'react'
import Form from './Form';
import { useHistory } from 'react-router-dom';
import API_ENDPOINTS from '../../config/apis';
import { handleSubmitRecord } from '../../functions/pages/handleSubmitRecord';
import { toast } from 'react-toastify';

const CreateContent = () => {
  const history = useHistory();

    const handleSubmitClick = (data) => {
      const postData = {
        balance_id: data.balance_id,
        amount: data.amount,
        type: 'DEPOSIT',
        note: data.note,
        action: 'Add',
      };

      const successCallback = (data) => {
        history.push('/deposits');
        toast.success('Added Deposit Successfully');
      };

      const errorCallback = (error) => {
        toast.error('Error ' + error.message);
      };

      handleSubmitRecord(postData, API_ENDPOINTS.POST_BALANCE_LOG, successCallback, errorCallback);
    };

    return (
      <>
        <Form
          handleClick={handleSubmitClick}
          icon='plus'
          title='Add Deposit'
        />
      </>
    )
  }

export default CreateContent;