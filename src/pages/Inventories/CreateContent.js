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
            in_stock: data.in_stock,
            on_order: data.on_order,
            reserved: data.reserved,
            min_stock: data.min_stock,
            max_stock: data.max_stock,
            store_id: data.store_id,
            supplier_id: data.supplier_id,
            product_id: data.product_id,
        };

        const successCallback = (data) => {
            history.push('/inventories');
            toast.success('Added Inventory Successfully');
        };

        const errorCallback = (error) => {
            let errorMessage = 'An unexpected error occurred';

            if (error.response) {
                // Check if the error response contains 'duplicate key'
                if (error.response.data && typeof error.response.data === 'object' && error.response.data.detail) {
                    if (error.response.data.detail.includes('duplicate key')) {
                        errorMessage = 'Only a single inventory can have the same product, store and supplier';
                    }
                    // else {
                    //     errorMessage = error.response.data.detail;
                    // }
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

        handleSubmitRecord(postData, API_ENDPOINTS.POST_INVENTORY, successCallback, errorCallback);
    };

    return (
    <>
        <Form
        handleClick={handleSubmitClick}
        icon='plus'
        title='Add Inventory'
        />
    </>
    )
}

export default CreateContent;