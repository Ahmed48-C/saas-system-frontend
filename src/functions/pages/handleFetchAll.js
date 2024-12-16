import axios from "axios";
import apiClient from "../../config/apiClient";

const constructFetchUrl = (endpoint, page, pageSize, order, orderBy, filters) => {
    let url = endpoint((page - 1) * pageSize, page * pageSize);
    if (order && orderBy) {
        url += `&order_by=${order === 'desc' ? '-' : ''}${orderBy}`;
    }
    if (Array.isArray(filters) && filters.length > 0) {
        url += `&filters=${JSON.stringify(filters)}`;
    }
    return url;
};

export const fetchAll = (endpoint, page, pageSize, order, orderBy, filters, setData, setLoading, errorCallback) => {
    setLoading(true);

    const url = constructFetchUrl(endpoint, page, pageSize, order, orderBy, filters);

    apiClient.get(url)
        .then(response => {
            setData(response.data);
            setLoading(false);
        })
        .catch(error => {
            console.error('Error fetching data:', error);
            if (errorCallback) {
                errorCallback(error);
            }
        });
};