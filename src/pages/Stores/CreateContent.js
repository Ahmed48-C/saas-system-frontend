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
            name: data.name,
            note: data.note,
            street: data.street,
            city: data.city,
            state: data.state,
            postcode: data.postcode,
            country: data.country,
        };

        const successCallback = (data) => {
            history.push('/stores');
            toast.success('Added Store Successfully');
        };

        const errorCallback = (error) => {
            toast.error('Error ' + error.message);
        };

        handleSubmitRecord(postData, API_ENDPOINTS.POST_STORE, successCallback, errorCallback);
    };

    return (
    <>
        <Form
        handleClick={handleSubmitClick}
        icon='plus'
        title='Add Store'
        />
    </>
    )
}

export default CreateContent;