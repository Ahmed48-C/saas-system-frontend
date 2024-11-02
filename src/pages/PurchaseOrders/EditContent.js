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
        code: data.code,
        total: data.total,
        status: data.status,
        store_id: data.store_id,
        balance_id: data.balance_id,
        supplier_id: data.supplier_id,
        items: data.items,
      };

      const successCallback = (data) => {
        history.push('/ui/purchase-orders');
        toast.success('Edited Purchase Order Successfully');
      };

      const errorCallback = (error) => {
        if (error.response && error.response.data && error.response.data.items) {
          const items = error.response.data.items;

          items.forEach((item, index) => {
            if (item.price && item.price.length > 0) {
              // const priceError = item.price.find(err =>
              //   err.includes("Ensure that there are no more than 13 digits before the decimal point.")
              // );
              if (item.price.find(err =>
                err.includes("Ensure that there are no more than 13 digits before the decimal point.")
              )) {
                // Show the error message with the index of the item
                toast.error(`Error in item ${index + 1}: Ensure that there are no more than 13 digits before the decimal point.`);
              }
            }
          });
        } else if (error.message && error.response.data.detail.includes('Cannot')) {
          toast.error('Error: ' + error.response.data.detail);
        } else if (error.message && error.response.data.detail.includes('Maximum')) {
          toast.error('Error: ' + error.response.data.detail);
        } else if (error.message && error.response.data.detail) {
          toast.error('Error: ' + error.response.data.detail);
        } else {
          toast.error('Error: ' + error.message);
        }
      };

      handleUpdateRecord(id, updateData, API_ENDPOINTS.PUT_PURCHASE_ORDER, successCallback, errorCallback);
    };

    return (
      <>
        {editLoading ? (
          <Loader />
        ) : (
        <Form
          handleClick={handleUpdateClick}
          icon='save'
          title='Edit Purchase Order'
        />
        )}
      </>
    );
  };

export default EditContent;