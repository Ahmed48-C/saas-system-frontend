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
        code: data.code,
        name: data.name,
        description: data.description,
        supplier_id: data.supplier_id,
        brand: data.brand,
        measure_unit: data.measure_unit,
        weight: data.weight,
        length: data.length,
        width: data.width,
        height: data.height,
        color: data.color,
        size: data.size,
        dimension_unit: data.dimension_unit,
        weight_unit: data.weight_unit,
      };

      const successCallback = (data) => {
        history.push('/products');
        toast.success('Edited Product Successfully');
      };

      const errorCallback = (error) => {
        toast.error('Error ' + error.message);
      };

      handleUpdateRecord(id, updateData, API_ENDPOINTS.PUT_PRODUCT, successCallback, errorCallback);
    };

    return (
      <>
        {editLoading ? (
          <Loader />
        ) : (
        <Form
          handleClick={handleUpdateClick}
          icon='save'
          title='Edit Product'
        />
        )}
      </>
    );
  };

export default EditContent;