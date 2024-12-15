import React, { useCallback, useEffect, useState } from 'react'
import { Box, Button, Divider, FormControl, Grid, Tooltip } from '@material-ui/core'
import { InputSelect, Loader, Textarea } from '../../pages-components'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import isEmpty from '../../functions/pages/isEmpty'
import { useParams } from 'react-router-dom';
import {API_ENDPOINTS} from '../../config/apis'
import { handleFetchRecord } from '../../functions/pages/handleFetchRecord'
import { formatFormRecordDropdown } from '../../functions/pages/formatFormRecordDropdown'
import { formFetchDropdownRecords } from '../../functions/pages/formFetchDropdownRecords'
import { BASE_URL } from '../../config/apis';
import { useHistory } from 'react-router-dom';
import ConfirmCancel from '../../pages-components/ConfirmCancel'
import PopupCreateNew from '../../pages-components/PopupCreateNew'
import { handleSubmitRecord } from '../../functions/pages/handleSubmitRecord'
import { toast } from 'react-toastify'
import InputSelectNoCreate from '../../pages-components/InputSelectNoCreate'
import { countryList } from '../../config/common'

const Form = ({ handleClick, icon, title }) => {
    const history = useHistory();

    const { id } = useParams(); // Get the ID from the URL

    const [data, setData] = useState({});
    const [editLoading, setEditLoading] = useState(false); // Add loading state
    const [stores, setStores] = useState([]);
    const [products, setProducts] = useState([]);

    const [loadingStores, setLoadingStores] = useState(false);
    const [errorStores, setErrorStores] = useState('');

    const [loadingProducts, setLoadingProducts] = useState(false);
    const [errorProducts, setErrorProducts] = useState('');

    const [suppliers, setSuppliers] = useState([]);

    const [loadingSuppliers, setLoadingSuppliers] = useState(false);
    const [errorSuppliers, setErrorSuppliers] = useState('');

    const [countryOptions, setCountryOptions] = useState([]);

    const fetchData = useCallback(() => {
        handleFetchRecord(id, API_ENDPOINTS.GET_INVENTORY, setData, setEditLoading);
    }, [id]);

    useEffect(() => {
        // Map through country list and sort them alphabetically
        const sortedCountries = countryList
            .map(country => ({
                name: country,
                value: country // Setting value to country name
            }))
            .sort((a, b) => a.name.localeCompare(b.name));

        // Set the sorted countries in the state
        setCountryOptions(sortedCountries);

        if (id) {
            fetchData();
        }

        const fetchDropdownData = async () => {

            setLoadingProducts(true);
            setLoadingStores(true);
            setLoadingSuppliers(true);

            try {
                await formFetchDropdownRecords(`${BASE_URL}/api/get/stores/`, setStores, setLoadingStores);
                // setLoadingStores(false);
            } catch (error) {
                setErrorStores('Error fetching stores');
                setLoadingStores(false);
            }

            try {
                await formFetchDropdownRecords(`${BASE_URL}/api/get/products/`, setProducts, setLoadingProducts);
                // setLoadingProducts(false);
            } catch (error) {
                setErrorProducts('Error fetching products');
                setLoadingProducts(false);
            }

            try {
                await formFetchDropdownRecords(`${BASE_URL}/api/get/suppliers/`, setSuppliers, setLoadingSuppliers);
                // setLoadingSuppliers(false);
            } catch (error) {
                setErrorSuppliers('Error fetching suppliers');
                setLoadingSuppliers(false);
            }
        };

        fetchDropdownData();

        // formFetchDropdownRecords(`http://127.0.0.1:8000/api/get/stores/`, setStores)
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
            (in_stock === undefined || in_stock === null || in_stock === '' ||
                ((max_stock === undefined || max_stock === null || max_stock === '') &&
                (min_stock === undefined || min_stock === null || min_stock === '') ||
                (Number(in_stock) >= Number(min_stock) || min_stock === undefined || min_stock === null || min_stock === '') &&
                (Number(max_stock) >= Number(in_stock) || max_stock === undefined || max_stock === null || max_stock === ''))) &&

            // If min_stock is provided, validate it against max_stock if it's provided
            (min_stock === undefined || min_stock === null || min_stock === '' ||
                (max_stock === undefined || max_stock === null || max_stock === '' ||
                (Number(max_stock) >= Number(min_stock)))) &&

            // If max_stock is provided, validate it against min_stock if it's provided
            (max_stock === undefined || max_stock === null || max_stock === '' ||
                (min_stock === undefined || min_stock === null || min_stock === '' ||
                (Number(max_stock) >= Number(min_stock))));

        return (
            data.store_id &&
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

    const handleSubmit = () => {
        // Replace empty strings with null
        const sanitizedData = { ...data };
        ['in_stock', 'on_order', 'reserved', 'min_stock', 'max_stock'].forEach((field) => {
            if (sanitizedData[field] === '') {
                sanitizedData[field] = null;
            }
        });
    
        handleClick(sanitizedData); // Submit sanitized data
    };

    const handleNavigatePage = () => {
        history.push('/ui/inventories');
    };

    const [openConfirmCancelDialog, setOpenConfirmCancelDialog] = useState(false);

    const [openProductPopupCreateNew, setOpenProductPopupCreateNew] = useState(false);
    const [productPopupData, setProductPopupData] = useState({});

    const [openStorePopupCreateNew, setOpenStorePopupCreateNew] = useState(false);
    const [storePopupData, setStorePopupData] = useState({});

    const onCreateNewProduct = () => {
        setLoadingProducts(true);

        const postData = {
            code: productPopupData.code,
            name: productPopupData.name,
            supplier_id: productPopupData.supplier_id,
        };

        const fetchDropdownData = async () => {

            // setLoadingSuppliers(true);

            try {
                await formFetchDropdownRecords(`${BASE_URL}/api/get/products/`, setProducts, setLoadingProducts);
                // setLoadingProducts(false);
            } catch (error) {
                setErrorProducts('Error fetching products');
                setLoadingProducts(false);
            }

        };

        const successCallback = (data) => {
            toast.success('Added Product Successfully');
            fetchDropdownData();
        };

        const errorCallback = (error) => {
            let errorMessage = 'An unexpected error occurred';

            if (error.response) {
                if (error.response.data && typeof error.response.data === 'object' && error.response.data.detail) {
                    errorMessage = error.response.data.detail;
                } else if (error.response.status === 500) {
                    // For server errors
                    errorMessage = 'An error occurred on the server. Please try again later.';
                }
            } else if (error.message) {
                errorMessage = error.message;
            }

            toast.error('Error: ' + errorMessage);
        };

        handleSubmitRecord(postData, API_ENDPOINTS.POST_PRODUCT, successCallback, errorCallback);
        console.log('Created new Product')
    };

    const onCreateNewStore = () => {
        setLoadingStores(true);

        const postData = {
            code: storePopupData.code,
            name: storePopupData.name,
            street: storePopupData.street,
            city: storePopupData.city,
            state: storePopupData.state,
            postcode: storePopupData.postcode,
            country: storePopupData.country,
        };

        const fetchDropdownData = async () => {

            try {
                await formFetchDropdownRecords(`${BASE_URL}/api/get/stores/`, setStores, setLoadingStores);
            } catch (error) {
                setErrorStores('Error fetching stores');
                setLoadingStores(false);
            }

        };

        const successCallback = (data) => {
            toast.success('Added Store Successfully');
            fetchDropdownData();
        };

        const errorCallback = (error) => {
            let errorMessage = 'An unexpected error occurred';

            if (error.response) {
                if (error.response.data && typeof error.response.data === 'object' && error.response.data.detail) {
                    errorMessage = error.response.data.detail;
                } else if (error.response.status === 500) {
                    // For server errors
                    errorMessage = 'An error occurred on the server. Please try again later.';
                }
            } else if (error.message) {
                errorMessage = error.message;
            }

            toast.error('Error: ' + errorMessage);
        };

        handleSubmitRecord(postData, API_ENDPOINTS.POST_STORE, successCallback, errorCallback);
        console.log('Created new Store')
    };

    const isProductPopupFormValid = () => {
        return  productPopupData.code &&
                productPopupData.name &&
                productPopupData.supplier_id;
    };

    const isStorePopupFormValid = () => {
        return  storePopupData.code &&
                storePopupData.name &&
                storePopupData.street &&
                storePopupData.city &&
                storePopupData.state &&
                storePopupData.postcode &&
                storePopupData.country;
    };

    const handlePopupInputChange = (setState) => (field) => (e) => {
        const value = e?.target?.value || ''; // Safeguard against null/undefined target
        setState((prevState) => ({
            ...prevState,
            [field]: value,
        }));
    };

    const handleProductPopupInputChange = handlePopupInputChange(setProductPopupData);
    const handleStorePopupInputChange = handlePopupInputChange(setStorePopupData);

    return (
        <>
            {editLoading ? (
                <Loader /> // Render the Loader component while loading
            ) : (
            <FormControl fullWidth>
                <Grid container spacing={4} className="my-4" style={{ width: '100%' }}>
                    <Grid item xs={12} style={{ paddingLeft: '35px', paddingRight: '0px' }}>
                        {/* <div>
                            <div className="">
                                <div className="app-page-title--heading" style={{ textAlign: 'left', paddingRight: 0 }}>
                                    <h1>{title}</h1>
                                </div>
                            </div>
                            <Divider className="my-4" />
                        </div> */}
                        <Box display="flex" justifyContent="space-between" alignItems="center">
                            <div className="">
                                <div className="app-page-title--heading">
                                    <h1>{title}</h1>
                                </div>
                            </div>
                            <div className="app-page-title--heading">
                                <Box display="flex" justifyContent="flex-end">
                                    <span style={{ paddingRight: '8px' }}>
                                        <Button
                                        variant="contained"
                                        size="small"
                                        className="btn-info"
                                        onClick={() => setOpenConfirmCancelDialog(true)}
                                        >
                                        <span className="btn-wrapper--text" style={{ paddingRight: '5px' }}>Cancel</span>
                                        </Button>
                                    </span>
                                    <Tooltip title="Submit">
                                        <span>
                                            <Button
                                            variant="contained"
                                            size="small"
                                            className="btn-success"
                                            onClick={() => {
                                                handleClick(data);
                                            }}
                                            disabled={!isFormValid()} // Disable button if form is not valid
                                            >
                                            <span className="btn-wrapper--text" style={{ paddingRight: '5px' }}>Save</span>
                                            <span className="btn-wrapper--icon">
                                                <FontAwesomeIcon icon={['fas', icon]} className="opacity-8" />
                                            </span>
                                            </Button>
                                        </span>
                                    </Tooltip>
                                </Box>
                            </div>
                        </Box>
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
                        onCreateNew={() => setOpenStorePopupCreateNew(true)}
                        titleCreateNew='Store'
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
                        onCreateNew={() => setOpenProductPopupCreateNew(true)}
                        titleCreateNew='Product'
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
                                className="btn-success"
                                onClick={() => {
                                    handleSubmit();
                                }}
                                disabled={!isFormValid()} // Disable button if form is not valid
                                >
                                <span className="btn-wrapper--text" style={{ paddingRight: '5px' }}>Save</span>
                                <span className="btn-wrapper--icon">
                                    <FontAwesomeIcon icon={['fas', icon]} className="opacity-8" />
                                </span>
                                </Button>
                            </span>
                        </Tooltip>
                        </Box>
                    </Grid>
                </Grid>
                <ConfirmCancel
                    open={openConfirmCancelDialog}
                    setOpen={setOpenConfirmCancelDialog}
                    handleCancelClick={() => handleNavigatePage()}
                />
                <PopupCreateNew
                    open={openProductPopupCreateNew}
                    setOpen={setOpenProductPopupCreateNew}
                    handleSubmit={() => onCreateNewProduct()}
                    title='Product'
                    form={
                        <FormControl fullWidth>
                            <Grid container spacing={4} className="my-4" style={{ width: '100%' }}>
                                <Grid item xs={12}>
                                    <Textarea
                                        rows={1}
                                        rowsMax={2}
                                        label='Code'
                                        name='code'
                                        id='code'
                                        onChange={handleProductPopupInputChange('code')}
                                        value={productPopupData.code ?? ""}
                                        key='code'
                                        error={isEmpty(productPopupData.code)}
                                        maxLength={80}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <Textarea
                                        rows={1}
                                        rowsMax={2}
                                        label='Name'
                                        name='name'
                                        id='name'
                                        onChange={handleProductPopupInputChange('name')}
                                        value={productPopupData.name ?? ""}
                                        key='name'
                                        error={isEmpty(productPopupData.name)}
                                        maxLength={80}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <InputSelectNoCreate
                                    selectItems={suppliers.map(supplier => ({
                                        value: supplier.id,
                                        name: formatFormRecordDropdown(supplier.name)
                                    }))}
                                    label='Supplier'
                                    name='supplier_id'
                                    id='supplier_id'
                                    onChange={handleProductPopupInputChange('supplier_id')}
                                    value={productPopupData.supplier_id ?? ""}
                                    error={isEmpty(productPopupData.supplier_id)}
                                    loading={loadingSuppliers}
                                    errorMessage={errorSuppliers}
                                    />
                                </Grid>
                            </Grid>
                        </FormControl>
                    }
                    isPopupFormValid={isProductPopupFormValid}
                />
                <PopupCreateNew
                    open={openStorePopupCreateNew}
                    setOpen={setOpenStorePopupCreateNew}
                    handleSubmit={() => onCreateNewStore()}
                    title='Store'
                    form={
                        <FormControl fullWidth>
                            <Grid container spacing={4} className="my-4" style={{ width: '100%' }}>
                                <Grid item xs={12}>
                                    <Textarea
                                        rows={1}
                                        rowsMax={2}
                                        label='Code'
                                        name='code'
                                        id='code'
                                        onChange={handleStorePopupInputChange('code')}
                                        value={storePopupData.code ?? ""}
                                        key='code'
                                        error={isEmpty(storePopupData.code)}
                                        maxLength={50}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <Textarea
                                        rows={1}
                                        rowsMax={2}
                                        label='Name'
                                        name='name'
                                        id='name'
                                        onChange={handleStorePopupInputChange('name')}
                                        value={storePopupData.name ?? ""}
                                        key='name'
                                        error={isEmpty(storePopupData.name)}
                                        maxLength={80}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <Textarea
                                        rows={1}
                                        rowsMax={2}
                                        label='Note'
                                        name='note'
                                        id='note'
                                        onChange={handleStorePopupInputChange('note')}
                                        value={storePopupData.note ?? ""}
                                        key='note'
                                        error={isEmpty(storePopupData.note)}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <Textarea
                                        rows={1}
                                        rowsMax={2}
                                        label='Street'
                                        name='street'
                                        id='street'
                                        onChange={handleStorePopupInputChange('street')}
                                        value={storePopupData.street ?? ""}
                                        key='street'
                                        error={isEmpty(storePopupData.street)}
                                        maxLength={200}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <Textarea
                                        rows={1}
                                        rowsMax={2}
                                        label='City'
                                        name='city'
                                        id='city'
                                        onChange={handleStorePopupInputChange('city')}
                                        value={storePopupData.city ?? ""}
                                        key='city'
                                        error={isEmpty(storePopupData.city)}
                                        maxLength={200}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <Textarea
                                        rows={1}
                                        rowsMax={2}
                                        label='State'
                                        name='state'
                                        id='state'
                                        onChange={handleStorePopupInputChange('state')}
                                        value={storePopupData.state ?? ""}
                                        key='state'
                                        error={isEmpty(storePopupData.state)}
                                        maxLength={200}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <Textarea
                                        rows={1}
                                        rowsMax={2}
                                        label='Postcode'
                                        name='postcode'
                                        id='postcode'
                                        onChange={handleStorePopupInputChange('postcode')}
                                        value={storePopupData.postcode ?? ""}
                                        key='postcode'
                                        error={isEmpty(storePopupData.postcode)}
                                        maxLength={50}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <InputSelectNoCreate
                                        selectItems={countryOptions}
                                        label='Country'
                                        name='country'
                                        id='country'
                                        onChange={handleStorePopupInputChange('country')}
                                        value={storePopupData.country ?? ""}
                                        error={isEmpty(storePopupData.country)}
                                    />
                                </Grid>
                            </Grid>
                        </FormControl>
                    }
                    isPopupFormValid={isStorePopupFormValid}
                />
            </FormControl>
            )}
        </>
    )
}

export default Form