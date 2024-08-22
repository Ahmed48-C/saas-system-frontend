import React, { useEffect, useState } from 'react'
import { Box, Button, Divider, FormControl, Grid, Tooltip } from '@material-ui/core'
import { InputSelect, Loader, Textarea } from '../../pages-components'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import isEmpty from '../../functions/pages/isEmpty'
import { useParams } from 'react-router-dom';
import API_ENDPOINTS from '../../config/apis'
import { handleFetchRecord } from '../../functions/pages/handleFetchRecord'
import axios from 'axios'
import { formatFormRecordDropdown } from '../../functions/pages/formatFormRecordDropdown'
import { formFetchDropdownRecords } from '../../functions/pages/formFetchDropdownRecords'

const Form = ({ handleClick, icon, title }) => {
    const { id } = useParams(); // Get the ID from the URL

    const [data, setData] = useState({});
    const [editLoading, setEditLoading] = useState(false); // Add loading state
    const [stores, setStores] = useState([]);
    const [products, setProducts] = useState([]);

    useEffect(() => {
        if (id) {
            fetchData();
        }

        // fetchStores();
        // fetchProducts();
        formFetchDropdownRecords(`http://127.0.0.1:8000/api/get/stores/`, setStores)
        formFetchDropdownRecords(`http://127.0.0.1:8000/api/get/products/`, setProducts)
    }, [id]);

    const fetchData = () => {
        handleFetchRecord(id, API_ENDPOINTS.GET_INVENTORY, setData, setEditLoading);
    };

    // const fetchStores = () => {
    //     axios.get(`http://127.0.0.1:8000/api/get/stores/`)
    //     .then(response => {
    //         if (Array.isArray(response.data.data)) {
    //             setStores(response.data.data);
    //         } else {
    //             console.error('Invalid data format:', response.data);
    //         }
    //     })
    //     .catch(error => {
    //         console.error('Error fetching data:', error);
    //     });
    // }

    // const fetchProducts = () => {
    //     axios.get(`http://127.0.0.1:8000/api/get/products/`)
    //     .then(response => {
    //         if (Array.isArray(response.data.data)) {
    //             setProducts(response.data.data);
    //         } else {
    //             console.error('Invalid data format:', response.data);
    //         }
    //     })
    //     .catch(error => {
    //         console.error('Error fetching data:', error);
    //     });
    // }

    const isFormValid = () => {
        return  data.code &&
                data.store_id &&
                data.product_id;
    };

    const handleInputChange = (field) => (e) => {
        setData({ ...data, [field]: e.target.value });
    };

    return (
        <>
            {editLoading ? (
                <Loader /> // Render the Loader component while loading
            ) : (
            <FormControl fullWidth>
                <Grid container spacing={3} className="my-4" style={{ width: '100%' }}>
                    <Grid item xs={12}>
                        <div>
                            <div className="app-page-title--first">
                                <div className="app-page-title--heading">
                                    <h1>{title}</h1>
                                </div>
                            </div>
                            <Divider className="my-4" />
                        </div>
                    </Grid>
                    <Grid item xs={12}>
                        <div className="font-size-lg font-weight-bold">DETAILS</div>
                    </Grid>
                    <Grid item xs={12}>
                        <Divider className="my-4" />
                    </Grid>
                    <Grid item xs={6}>
                        <Textarea
                        rows={1}
                        rowsMax={2}
                        label='Code'
                        name='code'
                        id='code'
                        onChange={handleInputChange('code')}
                        value={data.code ?? ""}
                        key='code'
                        error={isEmpty(data.code)}
                        maxLength={80}
                        />
                    </Grid>
                    <Grid item xs={6}>
                        <InputSelect
                        selectItems={stores.map(store => ({
                            value: store.id,
                            name: formatFormRecordDropdown(store.name)
                        }))}
                        label='Store'
                        name='store_id'
                        id='store_id'
                        onChange={handleInputChange('store_id')}
                        value={data.store_id ?? ""}
                        error={isEmpty(data.store_id)}
                        />
                    </Grid>
                    <Grid item xs={6}>
                        <InputSelect
                        selectItems={products.map(product => ({
                            value: product.id,
                            name: formatFormRecordDropdown(product.name)
                        }))}
                        label='Product'
                        name='product_id'
                        id='product_id'
                        onChange={handleInputChange('product_id')}
                        value={data.product_id ?? ""}
                        error={isEmpty(data.product_id)}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <Divider className="my-4" />
                    </Grid>
                    <Grid item xs={12}>
                        <div className="font-size-lg font-weight-bold">Stocks & Quantity</div>
                    </Grid>
                    <Grid item xs={12}>
                        <Divider className="my-4" />
                    </Grid>
                    <Grid item xs={6}>
                        <Textarea
                        rows={1}
                        rowsMax={2}
                        label='In Stock'
                        name='in_stock'
                        id='in_stock'
                        onChange={handleInputChange('in_stock')}
                        value={data.in_stock ?? ""}
                        key='in_stock'
                        maxLength={80}
                        />
                    </Grid>
                    <Grid item xs={6}>
                        <Textarea
                        rows={1}
                        rowsMax={2}
                        label='On order'
                        name='on_order'
                        id='on_order'
                        onChange={handleInputChange('on_order')}
                        value={data.on_order ?? ""}
                        key='on_order'
                        maxLength={80}
                        />
                    </Grid>
                    <Grid item xs={6}>
                        <Textarea
                        rows={1}
                        rowsMax={2}
                        label='Reserved'
                        name='reserved'
                        id='reserved'
                        onChange={handleInputChange('reserved')}
                        value={data.reserved ?? ""}
                        key='reserved'
                        maxLength={80}
                        />
                    </Grid>
                    <Grid item xs={6}>
                        <Textarea
                        rows={1}
                        rowsMax={2}
                        label='Minimum In Stock'
                        name='min_stock'
                        id='min_stock'
                        onChange={handleInputChange('min_stock')}
                        value={data.min_stock ?? ""}
                        key='min_stock'
                        maxLength={80}
                        />
                    </Grid>
                    <Grid item xs={6}>
                        <Textarea
                        rows={1}
                        rowsMax={2}
                        label='Maximum In Stock'
                        name='max_stock'
                        id='max_stock'
                        onChange={handleInputChange('max_stock')}
                        value={data.max_stock ?? ""}
                        key='max_stock'
                        maxLength={80}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <Divider className="my-4" />
                    </Grid>
                    <Grid item xs={12}>
                        <Box display="flex" justifyContent="flex-end">
                        <Tooltip title="Submit">
                            <span>
                                <Button
                                variant="contained"
                                size="small"
                                className="d-40 btn-success"
                                onClick={() => {
                                    handleClick(data);
                                    setData({});
                                }}
                                disabled={!isFormValid()} // Disable button if form is not valid
                                >
                                <span className="btn-wrapper--icon">
                                    <FontAwesomeIcon icon={['fas', icon]} className="opacity-8" />
                                </span>
                                </Button>
                            </span>
                        </Tooltip>
                        </Box>
                    </Grid>
                </Grid>
            </FormControl>
            )}
        </>
    )
}

export default Form