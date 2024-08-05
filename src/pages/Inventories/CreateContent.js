import React from 'react'
import Form from './Form';
import { useHistory } from 'react-router-dom';
import API_ENDPOINTS from '../../config/apis';
import { handleSubmitRecord } from '../../functions/pages/handleSubmitRecord';
import { toast } from 'react-toastify';

const CreateContent = () => {
    const history = useHistory();

    const handleSubmitClick = (data) => {
        const postData = {
            code: data.code,
            in_stock: data.in_stock,
            on_order: data.on_order,
            reserved: data.reserved,
            min_stock: data.min_stock,
            max_stock: data.max_stock,
            store_id: data.store_id,
            product_id: data.product_id,
        };

        const successCallback = (data) => {
            history.push('/inventories');
            toast.success('Added Inventory Successfully');
        };

        const errorCallback = (error) => {
            toast.error('Error ' + error.message);
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