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
            name: data.name,
            amount: data.amount,
        };

        const successCallback = (data) => {
            history.push('/balances');
            toast.success('Added Balance Successfully');
        };

        const errorCallback = (error) => {
            toast.error('Error ' + error.message);
        };

        handleSubmitRecord(postData, API_ENDPOINTS.POST_BALANCE, successCallback, errorCallback);
    };

    return (
    <>
        <Form
        handleClick={handleSubmitClick}
        icon='plus'
        title='Add Balance'
        />
    </>
    )
}

export default CreateContent;