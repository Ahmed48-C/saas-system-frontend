import axios from "axios";

const handleDeleteRecord = (id, endpoint, fetchRecords, successCallback, errorCallback) => {
    let url = endpoint(id);

    axios.delete(url)
    .then(response => {
        console.log('Delete request successful:', response.data);
        fetchRecords();
        if (successCallback) {
            successCallback(response.data);
        }
    })
    .catch(error => {
        console.error('Error deleting supplier:', error);
        if (errorCallback) {
            errorCallback(error);
        }
    });
};

export default handleDeleteRecord;