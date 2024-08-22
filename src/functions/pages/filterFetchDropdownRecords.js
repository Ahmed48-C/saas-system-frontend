import axios from "axios";

export const filterFetchDropdownRecords = (url, setRecords) => {
    axios.get(url)
        .then(response => {
            if (Array.isArray(response.data.data)) {
                setRecords(response.data.data);
            } else {
                console.error('Invalid data format:', response.data);
            }
        })
        .catch(error => {
            console.error('Error fetching data:', error);
        });
};