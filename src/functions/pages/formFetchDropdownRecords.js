import axios from "axios";

export const formFetchDropdownRecords = (url, setRecords, setLoading) => {
    axios.get(url)
        .then(response => {
            if (Array.isArray(response.data.data)) {
                setRecords(response.data.data);
            } else if (Array.isArray(response.data)) {
                setRecords(response.data);
            } else {
                console.error('Invalid data format:', response.data);
            }
            setLoading(false); // Set loading to false after processing
        })
        .catch(error => {
            console.error('Error fetching data:', error);
        });
};