import React from 'react'
import { Loader } from '../../pages-components';
import { useParams, useHistory } from 'react-router-dom';
import API_ENDPOINTS from '../../config/apis';
import { handleUpdateRecord } from '../../functions/pages/handleUpdateRecord';
import Form from './Form';
import { toast } from 'react-toastify';

const EditContent = ({ editLoading }) => {
    const { id } = useParams();
    const history = useHistory();

    const handleUpdateClick = (data) => {
      const updateData = {
        name: data.name,
        price: data.price,
        quantity: data.quantity,
        total: data.total,
        status: data.status,
        store_id: data.store_id,
        product_id: data.product_id,
      };

      const successCallback = (data) => {
        history.push('/purchase-orders');
        toast.success('Edited Purchase Order Successfully');
      };

      const errorCallback = (error) => {
        toast.error('Error ' + error.message);
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