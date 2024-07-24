import axios from "axios";

const handleBatchDeleteRecords = (ids, endpoint, fetchRecords) => {
    let url = endpoint();

    axios.delete(url, { data: ids })
    .then(response => {
        console.log('Batch delete request successful:', response.data);
        fetchRecords();
        // setTimeout(() =>

        // 1500);
    })
    .catch(error => {
        console.error('Error deleting records:', error);
    });
};

export default handleBatchDeleteRecords;
