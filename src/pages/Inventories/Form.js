import React, { useCallback, useEffect, useState } from 'react'
import { Box, Button, Divider, FormControl, Grid, Tooltip } from '@material-ui/core'
import { InputSelect, Loader, Textarea } from '../../pages-components'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import isEmpty from '../../functions/pages/isEmpty'
import { useParams } from 'react-router-dom';
import API_ENDPOINTS from '../../config/apis'
import { handleFetchRecord } from '../../functions/pages/handleFetchRecord'
import { formatFormRecordDropdown } from '../../functions/pages/formatFormRecordDropdown'
import { formFetchDropdownRecords } from '../../functions/pages/formFetchDropdownRecords'

const Form = ({ handleClick, icon, title }) => {
    const { id } = useParams(); // Get the ID from the URL

    const [data, setData] = useState({});
    const [editLoading, setEditLoading] = useState(false); // Add loading state
    const [stores, setStores] = useState([]);
    const [suppliers, setSuppliers] = useState([]);
    const [products, setProducts] = useState([]);

    const [loadingSuppliers, setLoadingSuppliers] = useState(false);
    const [errorSuppliers, setErrorSuppliers] = useState('');

    const [loadingStores, setLoadingStores] = useState(false);
    const [errorStores, setErrorStores] = useState('');

    const [loadingProducts, setLoadingProducts] = useState(false);
    const [errorProducts, setErrorProducts] = useState('');

    const fetchData = useCallback(() => {
        handleFetchRecord(id, API_ENDPOINTS.GET_INVENTORY, setData, setEditLoading);
    }, [id]);

    useEffect(() => {
        if (id) {
            fetchData();
        }

        const fetchDropdownData = async () => {

            setLoadingSuppliers(true);
            setLoadingProducts(true);
            setLoadingStores(true);

            try {
                await formFetchDropdownRecords('http://127.0.0.1:8000/api/get/suppliers/', setSuppliers);
                setLoadingSuppliers(false);
            } catch (error) {
                setErrorSuppliers('Error fetching suppliers');
                setLoadingSuppliers(false);
            }

            try {
                await formFetchDropdownRecords('http://127.0.0.1:8000/api/get/stores/', setStores);
                setLoadingStores(false);
            } catch (error) {
                setErrorStores('Error fetching stores');
                setLoadingStores(false);
            }

            try {
                await formFetchDropdownRecords('http://127.0.0.1:8000/api/get/products/', setProducts);
                setLoadingProducts(false);
            } catch (error) {
                setErrorProducts('Error fetching products');
                setLoadingProducts(false);
            }
        };

        fetchDropdownData();

        // formFetchDropdownRecords(`http://127.0.0.1:8000/api/get/stores/`, setStores)
        // formFetchDropdownRecords(`http://127.0.0.1:8000/api/get/suppliers/`, setSuppliers)
        // formFetchDropdownRecords(`http://127.0.0.1:8000/api/get/products/`, setProducts)
    }, [id, fetchData]);

    useEffect(() => {
        console.log(data.in_stock)
        console.log(data.min_stock)
        console.log(data.max_stock)
    }, [data.in_stock, data.min_stock, data.max_stock]);

    const isFormValid = () => {
        const { in_stock, min_stock, max_stock } = data;

        const isStockValid =
            // If in_stock is provided, validate it against max_stock and min_stock if they are also provided
            (in_stock === undefined || in_stock === '' ||
                ((max_stock === undefined || max_stock === '') &&
                (min_stock === undefined || min_stock === '') ||
                (Number(in_stock) >= Number(min_stock) || min_stock === undefined || min_stock === '') &&
                (Number(max_stock) >= Number(in_stock) || max_stock === undefined || max_stock === ''))) &&

            // If min_stock is provided, validate it against max_stock if it's provided
            (min_stock === undefined || min_stock === '' ||
                (max_stock === undefined || max_stock === '' ||
                (Number(max_stock) >= Number(min_stock)))) &&

            // If max_stock is provided, validate it against min_stock if it's provided
            (max_stock === undefined || max_stock === '' ||
                (min_stock === undefined || min_stock === '' ||
                (Number(max_stock) >= Number(min_stock))));

        return (
            data.store_id &&
            data.supplier_id &&
            data.product_id &&
            isStockValid // Apply stock validation conditionally
        );
    };

    const handleInputChange = (field) => (e) => {
        let value = e.target.value;
        if (['in_stock', 'min_stock', 'max_stock'].includes(field)) {
            // Ensure that the value is numeric
            value = value === '' ? '' : Number(value);
        }
        setData({ ...data, [field]: value });
    };

    return (
        <>
            {editLoading ? (
                <Loader /> // Render the Loader component while loading
            ) : (
            <FormControl fullWidth>
                <Grid container spacing={4} className="my-4" style={{ width: '100%' }}>
                    <Grid item xs={12} style={{ paddingLeft: '35px', paddingRight: '0px' }}>
                        <div>
                            <div className="">
                                <div className="app-page-title--heading" style={{ textAlign: 'left', paddingRight: 0 }}>
                                    <h1>{title}</h1>
                                </div>
                            </div>
                            <Divider className="my-4" />
                        </div>
                    </Grid>
                    <Grid item xs={12} style={{ paddingLeft: '35px', paddingRight: '0px' }}>
                        <div className="">
                            <div className="app-page-title--heading" style={{ textAlign: 'left', paddingRight: 0 }}>
                                <h1>DETAILS</h1>
                            </div>
                            <Divider className="my-4" />
                        </div>
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
                        disabled={!!id} // Disable if id is present
                        loading={loadingStores}
                        errorMessage={errorStores}
                        />
                    </Grid>
                    <Grid item xs={6}>
                        <InputSelect
                        selectItems={suppliers.map(supplier => ({
                            value: supplier.id,
                            name: formatFormRecordDropdown(supplier.name)
                        }))}
                        label='Supplier'
                        name='supplier_id'
                        id='supplier_id'
                        onChange={handleInputChange('supplier_id')}
                        value={data.supplier_id ?? ""}
                        error={isEmpty(data.supplier_id)}
                        disabled={!!id} // Disable if id is present
                        loading={loadingSuppliers}
                        errorMessage={errorSuppliers}
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
                        disabled={!!id} // Disable if id is present
                        loading={loadingProducts}
                        errorMessage={errorProducts}
                        />
                    </Grid>
                    <Grid item xs={12} style={{ paddingLeft: '35px', paddingRight: '0px' }}>
                        <Divider className="my-4" />
                    </Grid>
                    <Grid item xs={12} style={{ paddingLeft: '35px', paddingRight: '0px' }}>
                        <div className="font-size-lg font-weight-bold">Stocks & Quantity</div>
                    </Grid>
                    <Grid item xs={12} style={{ paddingLeft: '35px', paddingRight: '0px' }}>
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
                    <Grid item xs={12} style={{ paddingLeft: '35px', paddingRight: '0px' }}>
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