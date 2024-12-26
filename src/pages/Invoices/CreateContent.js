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
        number: data.number,
        date: data.date,
        due_date: data.due_date,
        payment_method: data.payment_method,
        total: data.total,
        note: data.note,
        attachment: data.attachment,
        attachment_file: data.attachment_file,
        customer_id: data.customer_id,
        location_id: data.location_id,
        items: data.items,
      };

      const successCallback = (data) => {
        history.push('/ui/invoices');
        toast.success('Added Invoice Successfully');
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

      handleSubmitRecord(postData, API_ENDPOINTS.POST_INVOICE, successCallback, errorCallback);
    };

    return (
      <>
        <Form
          handleClick={handleSubmitClick}
          icon='plus'
          title='Add Invoice'
        />
      </>
    )
  }

export default CreateContent;