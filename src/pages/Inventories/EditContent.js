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
            history.push('/ui/inventories');
            toast.success('Edited Inventory Successfully');
        };

        const errorCallback = (error) => {
            toast.error('Error ' + error.message);
        };

        handleUpdateRecord(id, updateData, API_ENDPOINTS.PUT_INVENTORY, successCallback, errorCallback);
    };

    return (
        <>
            {editLoading ? (
                <Loader />
            ) : (
            <Form
                handleClick={handleUpdateClick}
                icon='save'
                title='Edit Inventory'
            />
            )}
        </>
    );
};

export default EditContent;