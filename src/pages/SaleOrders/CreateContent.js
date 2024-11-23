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
        code: data.code,
        total: data.total,
        status: data.status,
        store_id: data.store_id,
        balance_id: data.balance_id,
        customer_id: data.customer_id,
        client_id: data.client_id,
        courier_id: data.courier_id,
        tracking_number: data.tracking_number,
        items: data.items,

        delivery_cost: data.delivery_cost,
      };

      const successCallback = (data) => {
        history.push('/ui/sale-orders');
        toast.success('Added Sale Order Successfully');
      };

      // const errorCallback = (error) => {
      //   console.log(error);
      //   if (error.message && error.response.data.detail) {
      //     toast.error('Error: ' + error.response.data.detail);
      //   } else {
      //     // Show the general error message if it's not a duplicate key error
      //     toast.error('Error: ' + error.message);
      //   }
      // };

      const errorCallback = (error) => {
        console.log(error);

        // Check if 'items' exists in the error response
        if (error.response && error.response.data && error.response.data.items) {
          const items = error.response.data.items;

          items.forEach((item, index) => {
            if (item.price && item.price.length > 0) {
              const priceError = item.price.find(err =>
                err.includes("Ensure that there are no more than 13 digits before the decimal point.")
              );
              if (priceError) {
                // Show the error message with the index of the item
                toast.error(`Error in item ${index + 1}: ${priceError}`);
              }
            }
          });
        } else if (error.message && error.response && error.response.data && error.response.data.detail) {
          toast.error('Error: ' + error.response.data.detail);
        } else {
          // Show a general error message if it's not a specific validation error
          toast.error('Error: ' + error.message);
        }
      };

      handleSubmitRecord(postData, API_ENDPOINTS.POST_SALE_ORDER, successCallback, errorCallback);
    };

    return (
      <>
        <Form
          handleClick={handleSubmitClick}
          icon='plus'
          title='Add Sale Order'
        />
      </>
    )
  }

export default CreateContent;