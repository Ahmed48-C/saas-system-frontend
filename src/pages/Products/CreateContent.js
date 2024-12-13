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
        image: data.image,
        image_file: data.image_file,
      };

      const successCallback = (data) => {
        history.push('/ui/products');
        toast.success('Added Product Successfully');
      };

      // const errorCallback = (error) => {
      //   toast.error('Error ' + error.message);
      // };

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