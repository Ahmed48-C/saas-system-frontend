import React, { useCallback, useEffect, useState, useRef } from 'react'
import { Box, Button, Card, Checkbox, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Divider, FormControl, FormControlLabel, Grid, IconButton, InputLabel, MenuItem, Select, Switch, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Tooltip } from '@material-ui/core'
import { InputSelect, Loader, Textarea } from '../../pages-components'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import isEmpty from '../../functions/pages/isEmpty'
import { useParams } from 'react-router-dom';
import { API_ENDPOINTS, BASE_URL} from '../../config/apis'
import { handleFetchRecord } from '../../functions/pages/handleFetchRecord'
import { formatFormRecordDropdown } from '../../functions/pages/formatFormRecordDropdown'
import { formFetchDropdownRecords } from '../../functions/pages/formFetchDropdownRecords'
import { AddOutlined, DeleteOutline } from '@material-ui/icons'

import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd'; // Import drag-and-drop components
import axios from 'axios'

import { useHistory } from 'react-router-dom';
import ConfirmCancel from '../../pages-components/ConfirmCancel'
import InputSelectNoCreate from '../../pages-components/InputSelectNoCreate'
import PopupCreateNew from '../../pages-components/PopupCreateNew'
import { handleSubmitRecord } from '../../functions/pages/handleSubmitRecord'
import { toast } from 'react-toastify'
import { countryList } from '../../config/common'
import apiClient from '../../config/apiClient'

const Form = ({ handleClick, icon, title }) => {
    const history = useHistory();

    const { id } = useParams(); // Get the ID from the URL

    const [data, setData] = useState({
        items: [{ product_id: '', price: 0.0, quantity: 0, total: 0.00 }],
        // You can include other parts of data as well
    });
    const [editLoading, setEditLoading] = useState(false); // Add loading state
    const [stores, setStores] = useState([]);
    const [products, setProducts] = useState([]);
    const [balances, setBalances] = useState([]);
    // const statuses = ['Pending', 'Completed']
    const [statuses, setStatuses] = useState([]);

    const [loadingStores, setLoadingStores] = useState(false);
    const [errorStores, setErrorStores] = useState('');

    const [loadingBalances, setLoadingBalances] = useState(false);
    const [errorBalances, setErrorBalances] = useState('');

    const [loadingProducts, setLoadingProducts] = useState(false);
    const [errorProducts, setErrorProducts] = useState('');

    const [loadingStatuses, setLoadingStatuses] = useState(false);
    const [errorStatuses, setErrorStatuses] = useState('');

    const [countryOptions, setCountryOptions] = useState([]);

    const fetchData = useCallback(() => {
        handleFetchRecord(id, API_ENDPOINTS.GET_PURCHASE_ORDER, setData, setEditLoading);
    }, [id]);

    const generatePurchaseOrderCode = () => {
        const now = new Date();
        const year = now.getFullYear().toString().slice(-2);
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const day = String(now.getDate()).padStart(2, '0');
        const hour = String(now.getHours()).padStart(2, '0');
        const minute = String(now.getMinutes()).padStart(2, '0');
        const second = String(now.getSeconds()).padStart(2, '0');

        return `PO-${day}${hour}${minute}${second}`;
    };

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

        const fetchLastPurchaseOrder = async () => {
            try {
                const response = await apiClient.get(`${BASE_URL}/api/get/purchase_order/last/`);
                const lastOrderId = response.data.id;

                console.log(response.data);

                console.log(lastOrderId);

                // Calculate the new code, at least 1000
                const newCode = lastOrderId + 1 + 1000;

                console.log(newCode);

                // Update the state with the new code
                setData((prevData) => ({
                    ...prevData,
                    code: newCode
                }));

            } catch (error) {
                console.error('Error fetching the last purchase order:', error);
            }
        };

        // formFetchDropdownRecords(`http://127.0.0.1:8000/api/get/stores/`, setStores)
        // formFetchDropdownRecords(`http://127.0.0.1:8000/api/get/products/`, setProducts)
        // formFetchDropdownRecords(`http://127.0.0.1:8000/api/get/balances/`, setBalances)

        const fetchDropdownData = async () => {

            setLoadingProducts(true);
            setLoadingStores(true);
            setLoadingBalances(true);
            setLoadingStatuses(true);

            try {
                await formFetchDropdownRecords(`${BASE_URL}/api/get/stores/`, setStores, setLoadingStores);
                // setLoadingStores(false);
            } catch (error) {
                setErrorStores('Error fetching stores');
                setLoadingStores(false);
            }

            try {
                await formFetchDropdownRecords(`${BASE_URL}/api/get/balances/`, setBalances, setLoadingBalances);
                // setLoadingBalances(false);
            } catch (error) {
                setErrorBalances('Error fetching balances');
                setLoadingBalances(false);
            }

            try {
                await formFetchDropdownRecords(`${BASE_URL}/api/get/products/`, setProducts, setLoadingProducts);
                // setLoadingProducts(false);
            } catch (error) {
                setErrorProducts('Error fetching products');
                setLoadingProducts(false);
            }

            try {
                await formFetchDropdownRecords(`${BASE_URL}/api/get/purchase_status/`, setStatuses, setLoadingStatuses);
                // setLoadingStatuses(false);
            } catch (error) {
                setErrorStatuses('Error fetching statuses');
                setLoadingStatuses(false);
            }
        };

        fetchDropdownData();

        // if (!id) {
        //     fetchLastPurchaseOrder();
        // }

        if (!id) {
            const newCode = generatePurchaseOrderCode();
            setData((prevData) => ({
                ...prevData,
                code: newCode,
            }));
        }
    }, [id, fetchData]);

    useEffect(() => {
        console.log('Products:', products); // Log products to verify
    }, [products]);

    const calculateTotal = () => {
        const totalValue = data.items.reduce((acc, product) => {
            const price = parseFloat(product.price) || 0;
            const quantity = parseFloat(product.quantity) || 0;
            return acc + (price * quantity);
        }, 0);

        // Update the total in the data object
        setData((prevData) => ({
            ...prevData,
            total: totalValue.toFixed(2) // Ensure total is formatted to 2 decimal places
        }));
    };

    const isFormValid = () => {
        // Ensure all basic fields are filled
        if (!data.code || !data.store_id || !data.balance_id) {
            return false;
        }

        // Check if items array is not empty
        if (data.items.length === 0) {
            return false;
        }

        // Validate each item in the items array
        const areItemsValid = data.items.every(item =>
            item.product_id &&               // Ensure product_id is not empty
            item.price > 0 &&                // Ensure price is greater than 0
            item.quantity > 0 &&             // Ensure quantity is greater than 0
            item.total > 0                   // Ensure total is greater than 0
        );

        return areItemsValid;
    };

    const handleInputChange = (field) => (e) => {
        let value = e.target.value;

        if (field === 'price') {
            // Allow numeric input including decimals with max 2 decimal places
            if (value === '' || /^[0-9]*\.?[0-9]{0,2}$/.test(value)) {
                const updatedData = { ...data, [field]: value };
                updatedData.total = calculateTotal(updatedData.price, updatedData.quantity);
                setData(updatedData);
            }
        } else if (field === 'quantity') {
            // Allow only whole numbers
            if (value === '' || /^[0-9]*$/.test(value)) {
                const updatedData = { ...data, [field]: value };
                updatedData.total = calculateTotal(updatedData.price, updatedData.quantity);
                setData(updatedData);
            }
        } else {
            setData({ ...data, [field]: value });
        }
    };

    const handleProductChange = (index, field, value) => {
        const updatedItems = [...data.items];

        if (field === 'product_id') {
            // Ensure product is an integer
            updatedItems[index][field] = parseInt(value, 10) || 0;
        }
        else if (field === 'price') {
            // Allow numeric input including decimals with max 2 decimal places
            if (value === '' || /^[0-9]*\.?[0-9]{0,2}$/.test(value)) {
                // Don't convert to float directly to avoid premature truncation of decimals
                updatedItems[index][field] = value;
            }
        } else if (field === 'quantity') {
            // Allow only whole numbers
            if (value === '' || /^[0-9]*$/.test(value)) {
                updatedItems[index][field] = parseInt(value, 10) || 0;
            }
        }

        // Calculate the total for the row
        updatedItems[index].total = (updatedItems[index].price * updatedItems[index].quantity).toFixed(2);

        // Update the data object with the modified items
        setData(prevData => ({
            ...prevData,
            items: updatedItems
        }));

        // Optionally, calculate the overall total again
        calculateTotal();
    };

    const addProductRow = () => {
        setData(prevData => ({
            ...prevData,
            items: [
                ...prevData.items,
                { product_id: '', price: 0.0, quantity: 0, total: 0.00 }
            ]
        }));
    };

    const removeProductRow = (index) => {
        setData(prevData => ({
            ...prevData,
            items: prevData.items.filter((_, i) => i !== index)
        }));
    };

    const handleDragEnd = (result) => {
        if (!result.destination) return;

        // Make a copy of the items from the data object
        const reorderedProducts = Array.from(data.items);

        // Remove the dragged product and reinsert it at the destination index
        const [movedProduct] = reorderedProducts.splice(result.source.index, 1);
        reorderedProducts.splice(result.destination.index, 0, movedProduct);

        // Update the data object with the reordered items
        setData(prevData => ({
            ...prevData,
            items: reorderedProducts
        }));
    };

    const ProductInputSelect = ({ selectItems, label, value, onChange, error, disabled }) => {
        // Custom menu props to limit the visible items and enable scrolling
        const menuProps = {
            PaperProps: {
                style: {
                maxHeight: 400, // Set the maximum height for the dropdown menu
                },
            },
        };

        return (
            <FormControl
            fullWidth
            error={error}
            disabled={disabled}
            >
                <Select
                labelId="country-select-label"
                id="country-select"
                value={value}
                onChange={onChange}
                label={label}
                MenuProps={menuProps} // Apply custom menu props
                >
                <MenuItem value="">
                    None
                </MenuItem>
                {selectItems.map((item) => (
                    <MenuItem key={item.value} value={item.value}>
                    {item.name}
                    </MenuItem>
                ))}
                </Select>
            </FormControl>
        );
    }

    useEffect(() => {
        console.log(" TOTAL: ", data.total)
    }, [data.total])

    const [open, setOpen] = useState(false);
    const [dontShowAgain, setDontShowAgain] = useState(false);

    // Load the user's preference from localStorage when the component mounts
    useEffect(() => {
        const storedPreference = localStorage.getItem('dontShowAgain');
        if (storedPreference === 'true') {
            setDontShowAgain(true);
        }
    }, []);

    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    const handleButtonClick = () => {
        // If the user has selected "Don't show this again", directly call handleClick
        if (dontShowAgain || data.status !== 'Completed') {
            handleClick(data);
        } else {
            handleOpen(); // Show the confirmation dialog if status is 'Completed'
        }
    };

    const handleConfirm = () => {
        handleClick(data); // Call handleClick on confirm
        handleClose(); // Close the dialog
    };

    const handleCheckboxChange = (event) => {
        const { checked } = event.target;
        setDontShowAgain(checked);
        localStorage.setItem('dontShowAgain', checked); // Store the preference in localStorage
    };

    const handleNavigatePage = () => {
        history.push('/ui/purchase-orders');
    };

    const [openConfirmCancelDialog, setOpenConfirmCancelDialog] = useState(false);

    const [openBalancePopupCreateNew, setOpenBalancePopupCreateNew] = useState(false);
    const [balancePopupData, setBalancePopupData] = useState({});

    const [openStorePopupCreateNew, setOpenStorePopupCreateNew] = useState(false);
    const [storePopupData, setStorePopupData] = useState({});

    const onCreateNewBalance = () => {
        setLoadingBalances(true);

        const postData = {
            name: balancePopupData.name,
            amount: balancePopupData.amount,
        };

        const fetchDropdownData = async () => {

            try {
                await formFetchDropdownRecords(`${BASE_URL}/api/get/balances/`, setBalances, setLoadingBalances);
            } catch (error) {
                setErrorBalances('Error fetching balances');
                setLoadingBalances(false);
            }

        };

        const successCallback = (data) => {
            toast.success('Added Balance Successfully');
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

        handleSubmitRecord(postData, API_ENDPOINTS.POST_BALANCE, successCallback, errorCallback);
        console.log('Created new Balance')
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

    const isBalancePopupFormValid = () => {
        return  balancePopupData.name &&
                balancePopupData.amount ;
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
        if (field === 'amount') {
            // Allow numeric input including decimals with max 2 decimal places
            if (value === '' || /^[0-9]*\.?[0-9]{0,2}$/.test(value)) {
                setState((prevState) => ({
                    ...prevState,
                    [field]: value,
                }));
            }
        } else {
            setState((prevState) => ({
                ...prevState,
                [field]: value,
            }));
        }
    };

    const handleBalancePopupInputChange = handlePopupInputChange(setBalancePopupData);
    const handleStorePopupInputChange = handlePopupInputChange(setStorePopupData);

    return (
        <>
            {editLoading ? (
                <Loader /> // Render the Loader component while loading
            ) : (
            <FormControl fullWidth>
                <Grid container spacing={5} className="my-4" style={{ width: '100%' }}>

                    <Grid item xs={12} style={{ paddingLeft: '35px', paddingRight: '0px' }}>
                        <Box display="flex" justifyContent="space-between" alignItems="center">
                            <div className="">
                                <div className="app-page-title--heading">
                                    <h1>{title}</h1>
                                </div>
                            </div>
                            {/* <div className="app-page-title--heading">
                                <h1>Total: <span className='text-success'>${data.total ?? "0.00"}</span></h1>
                            </div> */}
                            <Box display="flex" justifyContent="space-between" alignItems="center">
                                <div className="">
                                    <div className="app-page-title--heading">
                                        <h1>Total: <span className='text-success'>${data.total ?? "0.00"}</span></h1>
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
                        </Box>
                        <Divider className="my-4" />
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

                    <Grid item xs={2}>

                    </Grid>

                    <Grid item xs={4}>
                        <Textarea
                        rows={1}
                        rowsMax={2}
                        label='Total'
                        name='total'
                        id='total'
                        value={data.total ?? "0.00"}
                        key='total'
                        error={data.total <= 0 || data.total === undefined}
                        readOnly
                        />
                    </Grid>

                    <Grid item xs={8}>
                        <InputSelectNoCreate
                        selectItems={statuses.map(status => ({
                            value: status,
                            name: formatFormRecordDropdown(status)
                        }))}
                        label='Status'
                        name='status'
                        id='status'
                        onChange={handleInputChange('status')}
                        value={data.status ?? ""}
                        error={isEmpty(data.status)}
                        loading={loadingStatuses}
                        errorMessage={errorStatuses}
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
                        disabled={!!id}
                        loading={loadingStores}
                        errorMessage={errorStores}
                        onCreateNew={() => setOpenStorePopupCreateNew(true)}
                        titleCreateNew='Store'
                        />
                    </Grid>

                    <Grid item xs={6}>
                        <InputSelect
                        selectItems={balances.map(balance => ({
                            value: balance.id,
                            name: `${formatFormRecordDropdown(balance.name)} (Balance: ${balance.amount})`
                        }))}
                        label='Balance'
                        name='balance_id'
                        id='balance_id'
                        onChange={handleInputChange('balance_id')}
                        value={data.balance_id ?? ""}
                        error={isEmpty(data.balance_id)}
                        disabled={!!id}
                        loading={loadingBalances}
                        errorMessage={errorBalances}
                        onCreateNew={() => setOpenBalancePopupCreateNew(true)}
                        titleCreateNew='Balance'
                        />
                    </Grid>

                    <Grid item xs={12} style={{ padding: '0 0 0 35px' }}>
                        <Card className="p-3 shadow-sm mb-4" style={{ borderRadius: '8px' }}>
                            <DragDropContext onDragEnd={handleDragEnd}>
                                <Droppable droppableId="droppable">
                                    {(provided) => (
                                        <div
                                            ref={provided.innerRef}
                                            {...provided.droppableProps}
                                            style={{ overflowX: 'auto' }}
                                        >
                                            <Table className="table table-alternate-spaced" size="small" style={{ width: '100%' }}>
                                                <thead>
                                                    <tr style={{ display: 'flex', justifyContent: 'space-between' }}>
                                                    {/* <th style={{ flex: 1 }} scope="col">No.</th> */}
                                                    <th style={{ flex: 2 }} scope="col">Product</th>
                                                    <th style={{ flex: 2 }} scope="col">Price</th>
                                                    <th style={{ flex: 2 }} scope="col">Quantity</th>
                                                    <th style={{ flex: 2 }} scope="col">Total</th>
                                                    <th style={{ flex: 1, textAlign: 'right' }} scope="col">Actions</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {data.items.map((row, index) => {
                                                        // Get the IDs of selected products
                                                        const selectedProductIds = data.items
                                                            .filter((item, idx) => idx !== index) // Exclude the current row
                                                            .map(item => item.product_id); // Extract product IDs

                                                        // Filter the products to exclude selected ones
                                                        const availableProducts = products.filter(product => !selectedProductIds.includes(product.id));

                                                        return (
                                                            <Draggable key={index} draggableId={`draggable-${index}`} index={index}>
                                                                {(provided) => (
                                                                    <tr
                                                                        ref={provided.innerRef}
                                                                        {...provided.draggableProps}
                                                                        {...provided.dragHandleProps}
                                                                        style={{
                                                                            ...provided.draggableProps.style,
                                                                            display: 'flex',
                                                                            justifyContent: 'space-between',
                                                                            boxShadow: '0px 0px 0px 1px rgba(0, 0, 0, 0.1)',
                                                                            borderRadius: '12px',
                                                                            marginBottom: '10px'
                                                                        }}
                                                                    >
                                                                        <td style={{ flex: 2 }}>
                                                                            <ProductInputSelect
                                                                                selectItems={availableProducts.map(product => ({
                                                                                    value: product.id,
                                                                                    name: formatFormRecordDropdown(product.name)
                                                                                }))}
                                                                                value={row.product_id}
                                                                                onChange={e => handleProductChange(index, 'product_id', e.target.value)}
                                                                                fullWidth
                                                                                style={{ minWidth: '110px' }}
                                                                            />
                                                                        </td>
                                                                        <td style={{ flex: 2 }}>
                                                                            <TextField
                                                                                value={row.price}
                                                                                onChange={e => handleProductChange(index, 'price', e.target.value)}
                                                                                inputMode="decimal"
                                                                                maxLength={15}
                                                                                size="small"
                                                                                style={{ minWidth: '110px', padding: '4px 8px', paddingLeft: '14px' }}
                                                                                fullWidth
                                                                            />
                                                                        </td>
                                                                        <td style={{ flex: 2 }}>
                                                                            <TextField
                                                                                value={row.quantity}
                                                                                onChange={e => handleProductChange(index, 'quantity', e.target.value)}
                                                                                inputMode="decimal"
                                                                                maxLength={10}
                                                                                size="small"
                                                                                style={{ minWidth: '110px', padding: '4px 8px' }}
                                                                                fullWidth
                                                                            />
                                                                        </td>
                                                                        <td style={{ flex: 2 }}>
                                                                            <TextField
                                                                                value={row.total} // Calculate total
                                                                                size="small"
                                                                                style={{ minWidth: '110px', padding: '4px 8px' }}
                                                                                fullWidth
                                                                                inputProps={{ readOnly: true }} // Make total read-only
                                                                            />
                                                                        </td>
                                                                        <td style={{ flex: 1, textAlign: 'right' }}>
                                                                            <Button
                                                                                variant="outlined"
                                                                                size="small"
                                                                                className="btn-neutral-first"
                                                                                onClick={() => removeProductRow(index)}
                                                                                style={{ padding: '9px' }}
                                                                            >
                                                                                <DeleteOutline style={{ fontSize: '21px' }} />
                                                                            </Button>
                                                                        </td>
                                                                    </tr>
                                                                )}
                                                            </Draggable>
                                                        );
                                                    })}
                                                </tbody>
                                                </Table>
                                            {provided.placeholder}
                                        </div>
                                    )}
                                </Droppable>
                            </DragDropContext>
                            <div style={{ boxShadow: '0px 0px 0px 1px rgba(0, 0, 0, 0.1)', borderRadius: '12px'}}>
                                <Table className="table table-alternate-spaced" size="small">
                                    <tbody>
                                        <tr>
                                            <td colSpan={4} className="text-right">
                                                <span>
                                                    <Button
                                                        variant="outlined"
                                                        size="small"
                                                        className="btn-neutral-first"
                                                        onClick={addProductRow}
                                                        style={{ padding: '9px' }}
                                                    >
                                                        <AddOutlined style={{ fontSize: '21px' }} />
                                                    </Button>
                                                </span>
                                            </td>
                                        </tr>
                                    </tbody>
                                </Table>
                            </div>
                        </Card>
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
                                    onClick={handleButtonClick}
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

                        {/* Confirmation Dialog */}
                        <Dialog open={open} onClose={handleClose}>
                            <DialogTitle>Confirm Action</DialogTitle>
                            <DialogContent>
                                <DialogContentText>
                                    Purchase orders with 'Completed' status cannot be edited. Are you sure you want to proceed?
                                </DialogContentText>

                                {/* "Don't show this again" checkbox */}
                                <FormControlLabel
                                    control={<Checkbox checked={dontShowAgain} onChange={handleCheckboxChange} color="primary" />}
                                    label="Don't show this again"
                                />
                            </DialogContent>
                            <DialogActions>
                                <Button onClick={handleClose} color="primary">Cancel</Button>
                                <Button onClick={handleConfirm} color="primary" variant="contained">Confirm</Button>
                            </DialogActions>
                        </Dialog>
                    </Grid>

                </Grid>
                <ConfirmCancel
                    open={openConfirmCancelDialog}
                    setOpen={setOpenConfirmCancelDialog}
                    handleCancelClick={() => handleNavigatePage()}
                />
                <PopupCreateNew
                    open={openBalancePopupCreateNew}
                    setOpen={setOpenBalancePopupCreateNew}
                    handleSubmit={() => onCreateNewBalance()}
                    title='Balance'
                    form={
                        <FormControl fullWidth>
                            <Grid container spacing={4} className="my-4" style={{ width: '100%' }}>
                                <Grid item xs={12}>
                                    <Textarea
                                        rows={1}
                                        rowsMax={2}
                                        label='Name'
                                        name='name'
                                        id='name'
                                        onChange={handleBalancePopupInputChange('name')}
                                        value={balancePopupData.name ?? ""}
                                        key='name'
                                        error={isEmpty(balancePopupData.name)}
                                        maxLength={80}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <Textarea
                                        rows={1}
                                        rowsMax={2}
                                        label='Amount'
                                        name='amount'
                                        id='amount'
                                        onChange={handleBalancePopupInputChange('amount')}
                                        value={balancePopupData.amount ?? ""}
                                        key='amount'
                                        error={isEmpty(balancePopupData.amount)}
                                        maxLength={200}
                                    />
                                </Grid>
                            </Grid>
                        </FormControl>
                    }
                    isPopupFormValid={isBalancePopupFormValid}
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