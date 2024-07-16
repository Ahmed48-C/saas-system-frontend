import axios from "axios";

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

export const fetchAll = (endpoint, page, pageSize, order, orderBy, filters, setData, setLoading) => {
    setLoading(true);

    const url = constructFetchUrl(endpoint, page, pageSize, order, orderBy, filters);

    axios.get(url)
        .then(response => {
            setData(response.data);
            setLoading(false);
        })
        .catch(error => {
            console.error('Error fetching data:', error);
            setLoading(false);
        });
};