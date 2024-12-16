// import axios from "axios";
import apiClient from "../../config/apiClient";

export const handleSubmitRecord = (postData, endpoint, successCallback, errorCallback) => {
    let url = endpoint();

    apiClient.post(url, postData)
    .then(response => {
        console.log('Post request successful:', response.data);
        if (successCallback) {
            successCallback(response.data);
        }
    })
    .catch(error => {
        console.error('Error making post request:', error);
        if (errorCallback) {
            errorCallback(error);
        }
    });
};