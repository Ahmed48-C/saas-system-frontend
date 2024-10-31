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
            note: data.note,
            street: data.street,
            city: data.city,
            state: data.state,
            postcode: data.postcode,
            country: data.country,
            total_stock: data.total_stock,
        };

        const successCallback = (data) => {
            history.push('/stores');
            toast.success('Edited Store Successfully');
        };

        const errorCallback = (error) => {
            toast.error('Error ' + error.message);
        };

        handleUpdateRecord(id, updateData, API_ENDPOINTS.PUT_STORE, successCallback, errorCallback);
    };

    return (
        <>
            {editLoading ? (
            <Loader />
            ) : (
            <Form
            handleClick={handleUpdateClick}
            icon='save'
            title='Edit Store'
            />
            )}
        </>
    );
};

export default EditContent;