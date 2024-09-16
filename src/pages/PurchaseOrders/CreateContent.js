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
        code: data.code,
        // price: data.price,
        // quantity: data.quantity,
        total: data.total,
        status: data.status,
        store_id: data.store_id,
        // product_id: data.product_id,
        balance_id: data.balance_id,
        items: data.items,
      };

      const successCallback = (data) => {
        history.push('/purchase-orders');
        toast.success('Added Purchase Order Successfully');
      };

      const errorCallback = (error) => {
        console.log(error);
        if (error.message && error.response.data.detail) {
          toast.error('Error: ' + error.response.data.detail);
        } else {
          // Show the general error message if it's not a duplicate key error
          toast.error('Error: ' + error.message);
        }
      };

      handleSubmitRecord(postData, API_ENDPOINTS.POST_PURCHASE_ORDER, successCallback, errorCallback);
    };

    return (
      <>
        <Form
          handleClick={handleSubmitClick}
          icon='plus'
          title='Add Purchase Order'
        />
      </>
    )
  }

export default CreateContent;