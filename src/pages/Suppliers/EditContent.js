import React from 'react'
import Form from './Form';
import { Loader } from '../../pages-components';
import { useParams, useHistory } from 'react-router-dom';
import {API_ENDPOINTS} from '../../config/apis';
import { handleUpdateRecord } from '../../functions/pages/handleUpdateRecord';
import { toast } from 'react-toastify';

const EditContent = ({ editLoading }) => {
    const { id } = useParams();
    const history = useHistory();

    const handleUpdateClick = (suppliersData) => {
      const updateData = {
        name: suppliersData.name,
        phone: suppliersData.phone,
        email: suppliersData.email,
        contact_name: suppliersData.contact_name,
        contact_phone: suppliersData.contact_phone,
        location_id: suppliersData.location_id,
      };

      const successCallback = (data) => {
        history.push('/suppliers');
        toast.success('Edited Supplier Successfully');
      };

      const errorCallback = (error) => {
        toast.error('Error ' + error.message);
      };

      handleUpdateRecord(id, updateData, API_ENDPOINTS.PUT_SUPPLIER, successCallback, errorCallback);
    };

    return (
      <>
        {editLoading ? (
          <Loader />
        ) : (
        <Form
          handleClick={handleUpdateClick}
          icon='save'
          title='Edit Supplier'
        />
        )}
      </>
    );
  };

export default EditContent;