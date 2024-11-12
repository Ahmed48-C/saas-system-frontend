import axios from "axios";

export const formFetchDropdownRecords = (url, setRecords) => {
    axios.get(url)
        .then(response => {
            if (Array.isArray(response.data.data)) {
                setRecords(response.data.data);
            } else if (Array.isArray(response.data)) {
                setRecords(response.data);
            } else {
                console.error('Invalid data format:', response.data);
            }
        })
        .catch(error => {
            console.error('Error fetching data:', error);
        });
};