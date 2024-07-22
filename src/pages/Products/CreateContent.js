import React from 'react'
import Form from './Form';
import { useHistory } from 'react-router-dom';
import API_ENDPOINTS from '../../config/apis';
import { handleSubmitRecord } from '../../functions/pages/handleSubmitRecord';

const CreateContent = () => {
  const history = useHistory();

    const handleSubmitClick = (data) => {
      const postData = {
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
      };

      const errorCallback = (error) => {
        console.error('Error making post request:', error);
      };

      handleSubmitRecord(postData, API_ENDPOINTS.POST_PRODUCT, successCallback, errorCallback);
    };

    return (
      <>
        <Form
          handleClick={handleSubmitClick}
          icon='plus'
          title='Add Product'
        />
      </>
    )
  }

export default CreateContent;