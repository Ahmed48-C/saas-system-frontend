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
        toast.success('Edited Product Successfully');
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