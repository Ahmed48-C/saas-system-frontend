import { Card } from '@material-ui/core'
import React, { useState, useEffect } from 'react'
import apiClient from '../../config/apiClient';
import { API_ENDPOINTS } from '../../config/apis';
import Loader from '../Loader';

const TotalInStock = () => {
    const [loading, setLoading] = useState(true);
    const [totalStock, setTotalStock] = useState(0);

    const fetchData = async () => {
        setLoading(true);
        try {
            const response = await apiClient.get(API_ENDPOINTS.GET_TOTAL_STOCK());
            setTotalStock(response.data.total_stock);
        } catch (error) {
            console.error('Error fetching total stock:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    if (loading) {
        return (
            <Card className="card-box text-center p-4 hover-scale-sm card-box-hover-rise" style={{ minHeight: '160px' }}>
                <div className="d-flex align-items-center justify-content-center h-100">
                    <Loader />
                </div>
            </Card>
        );
    }

    return (
        <Card className="card-box text-center p-4 hover-scale-sm card-box-hover-rise" style={{ minHeight: '162px' }}>
            <div className="display-3 text-black font-weight-bold">{totalStock}</div>
            <div className="divider mt-2 mb-3 mx-auto border-2 w-25 bg-success rounded border-success" />
            <div className="font-weight-bold font-size-sm text-uppercase">
                Total In Stock
            </div>
        </Card>
    );
}

export default TotalInStock