// import axios from "axios";
import apiClient from "../../config/apiClient";

const handleBatchDeleteRecords = (ids, endpoint, fetchRecords, successCallback, errorCallback) => {
    let url = endpoint();

    apiClient.delete(url, { data: ids })
    .then(response => {
        console.log('Batch delete request successful:', response.data);
        fetchRecords();
        if (successCallback) {
            successCallback(response.data);
        }
    })
    .catch(error => {
        console.error('Error deleting records:', error);
        if (successCallback) {
            errorCallback(error);
        }
    });
};

export default handleBatchDeleteRecords;
