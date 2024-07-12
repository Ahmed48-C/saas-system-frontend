import axios from "axios";

const handleDeleteRecord = (id, endpoint, fetchRecords) => {
    let url = endpoint(id);

    axios.delete(url)
    .then(response => {
        console.log('Delete request successful:', response.data);
        fetchRecords();
        // setTimeout(() =>

        // 1500);
    })
    .catch(error => {
        console.error('Error deleting supplier:', error);
    });
};

export default handleDeleteRecord;