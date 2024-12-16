// import axios from "axios";
import apiClient from "../../config/apiClient";

export const filterFetchDropdownRecords = (url, setRecords) => {
    apiClient.get(url)
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