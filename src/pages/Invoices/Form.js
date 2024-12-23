import React, { useCallback, useEffect, useState, useRef } from 'react'
import { Box, Button, Card, Checkbox, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Divider, FormControl, FormControlLabel, Grid, IconButton, InputLabel, MenuItem, Select, Switch, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Tooltip } from '@material-ui/core'
import { DatePicker, InputSelect, Loader, Textarea } from '../../pages-components'
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
import { countryList, currencyList, maxFileSizeInMBForUploadImage } from '../../config/common'
import apiClient from '../../config/apiClient'
import CardImageUpload from '../../pages-components/MediaUploader';
import { imageUploadHandler } from '../../config/uploadHandler'
import { format } from 'date-fns'; // Add this import at the top


const Form = ({ handleClick, icon, title }) => {
    const history = useHistory();

    const { id } = useParams(); // Get the ID from the URL

    const [data, setData] = useState({
        items: [{ product_id: '', price: 0.0, quantity: 0, total: 0.00 }],
        // You can include other parts of data as well
    });
    const [editLoading, setEditLoading] = useState(false); // Add loading state
    const [customers, setCustomers] = useState([]);
    const [locations, setLocations] = useState([]);
    const [products, setProducts] = useState([]);
    const [paymentMethods, setPaymentMethods] = useState([]);
    // const statuses = ['Pending', 'Completed']
    const [statuses, setStatuses] = useState([]);

    const [loadingCustomers, setLoadingCustomers] = useState(false);
    const [errorCustomers, setErrorCustomers] = useState('');

    const [loadingLocations, setLoadingLocations] = useState(false);
    const [errorLocations, setErrorLocations] = useState('');

    const [loadingProducts, setLoadingProducts] = useState(false);
    const [errorProducts, setErrorProducts] = useState('');

    const [loadingPaymentMethods, setLoadingPaymentMethods] = useState(false);
    const [errorPaymentMethods, setErrorPaymentMethods] = useState('');

    const [currencyOptions, setCurrencyOptions] = useState([]);
    const [countryOptions, setCountryOptions] = useState([]);

    const fetchData = useCallback(() => {
        handleFetchRecord(id, API_ENDPOINTS.GET_INVOICE, setData, setEditLoading);
    }, [id]);

    const generateInvoiceNumber = () => {
        const now = new Date();
        const year = now.getFullYear().toString().slice(-2);
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const day = String(now.getDate()).padStart(2, '0');
        const hour = String(now.getHours()).padStart(2, '0');
        const minute = String(now.getMinutes()).padStart(2, '0');
        const second = String(now.getSeconds()).padStart(2, '0');

        return `INV-${day}${hour}${minute}${second}`;
    };

    useEffect(() => {
        // Map through currency list and sort them alphabetically
        const sortedCurrencies = currencyList
            .map(currency => ({
                name: currency,
                value: currency // Setting value to currency name
            }))
            .sort((a, b) => a.name.localeCompare(b.name));

        // Set the sorted countries in the state
        setCurrencyOptions(sortedCurrencies);

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
        } else {
            // Set default values for new invoice
            const currentDate = new Date();
            const dueDate = new Date();
            dueDate.setDate(currentDate.getDate() + 7);

            const newNumber = generateInvoiceNumber();
            setData((prevData) => ({
                ...prevData,
                number: newNumber,
                date: format(currentDate, 'yyyy-MM-dd'),
                due_date: format(dueDate, 'yyyy-MM-dd')
            }));
        }

        const fetchDropdownData = async () => {

            setLoadingProducts(true);
            setLoadingCustomers(true);
            setLoadingLocations(true);
            setLoadingPaymentMethods(true);

            try {
                // Fetch all the data first
                await Promise.all([
                    formFetchDropdownRecords(`${BASE_URL}/api/get/customers/`, setCustomers, setLoadingCustomers),
                    formFetchDropdownRecords(`${BASE_URL}/api/get/products/`, setProducts, setLoadingProducts),
                    formFetchDropdownRecords(`${BASE_URL}/api/get/locations/`, setLocations, setLoadingLocations),
                    formFetchDropdownRecords(`${BASE_URL}/api/get/invoice_payment_methods/`, setPaymentMethods, setLoadingPaymentMethods)
                ]);
            } catch (error) {
                console.error('Error fetching dropdown data:', error);
                if (!id) {
                    toast.error('Error loading required data. Please try again.');
                }
            }
        };

        fetchDropdownData();
    }, [id]);

    // New useEffect to handle pending invoice data after customers and products are loaded
    useEffect(() => {
        const processPendingInvoiceData = async () => {
            // Only proceed if we have both customers and products loaded
            if (!id && customers.length > 0 && products.length > 0) {
                const pendingInvoiceData = localStorage.getItem('pendingInvoiceData');
                if (pendingInvoiceData) {
                    try {
                        const parsedData = JSON.parse(pendingInvoiceData);
                        
                        // console.log('Pending Invoice Data:', parsedData);
                        // console.log('Available Customers:', customers);
                        
                        // Find customer ID from name using the state, with more robust comparison
                        const customer = customers.find(c => {
                            // Normalize both strings for comparison
                            const customerName = (c.name || '').trim().toLowerCase();
                            const searchName = (parsedData.customer || '').trim().toLowerCase();
                            // console.log(`Comparing: "${customerName}" with "${searchName}"`);
                            return customerName === searchName;
                        });

                        if (!customer) {
                            throw new Error(`Customer not found: ${parsedData.customer}. Available customers: ${customers.map(c => c.name).join(', ')}`);
                        }

                        // console.log('Found Customer:', customer);

                        // Transform items to include product IDs
                        const transformedItems = parsedData.items.map(item => {
                            // console.log('Processing item:', item);
                            // Find product with more robust comparison
                            const product = products.find(p => {
                                const productName = (p.name || '').trim().toLowerCase();
                                const searchName = (item.product || '').trim().toLowerCase();
                                // console.log(`Comparing product: "${productName}" with "${searchName}"`);
                                return productName === searchName;
                            });

                            if (!product) {
                                throw new Error(`Product not found: ${item.product}. Available products: ${products.map(p => p.name).join(', ')}`);
                            }

                            // console.log('Found Product:', product);

                            return {
                                product_id: product.id,
                                price: item.price,
                                quantity: item.quantity,
                                total: item.total
                            };
                        });

                        // console.log('Transformed Items:', transformedItems);

                        // Update form data with transformed data
                        setData(prevData => {
                            const newData = {
                                ...prevData,
                                customer_id: customer.id,
                                items: transformedItems,
                                total: parsedData.total,
                                note: `Created from Sale Order: ${parsedData.sale_order_code}`
                            };
                            // console.log('Setting form data:', newData);
                            return newData;
                        });

                    } catch (error) {
                        console.error('Error processing pending invoice data:', error);
                        toast.error('Error loading sale order data: ' + error.message);
                    } finally {
                        // Always clear the pending data from localStorage
                        localStorage.removeItem('pendingInvoiceData');
                    }
                }
            }
        };

        processPendingInvoiceData();
    }, [id, customers, products]); // This effect runs when customers or products change

    // useEffect(() => {
    //     console.log('Products:', products); // Log products to verify
    // }, [products]);

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
        if (!data.number || !data.date || !data.due_date || !data.customer_id) {
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

    // Add a separate handler for the DatePicker component
    const handleDatePickerChange = (field) => (date) => {
        try {
            // Format the date if it's not null
            const formattedValue = date ? format(date, 'yyyy-MM-dd') : '';
            setData(prevData => ({
                ...prevData,
                [field]: formattedValue
            }));
        } catch (error) {
            console.error(`Error formatting ${field}:`, error);
            setData(prevData => ({
                ...prevData,
                [field]: null
            }));
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

    // useEffect(() => {
    //     console.log(" TOTAL: ", data.total)
    // }, [data.total])

    const handleNavigatePage = () => {
        history.push('/ui/invoices');
    };

    const handleUploadChange = (uploadData) => {
        setData({ ...data, ...uploadData });
    };

    const [openConfirmCancelDialog, setOpenConfirmCancelDialog] = useState(false);

    const [openCustomerPopupCreateNew, setOpenCustomerPopupCreateNew] = useState(false);
    const [customerPopupData, setCustomerPopupData] = useState({});

    const [openLocationPopupCreateNew, setOpenLocationPopupCreateNew] = useState(false);
    const [locationPopupData, setLocationPopupData] = useState({});

    const onCreateNewCustomer = () => {
        setLoadingCustomers(true);

        const postData = {
            code: customerPopupData.code,
            name: customerPopupData.name,
            location_id: customerPopupData.location_id,
        };

        const fetchDropdownData = async () => {

            // setLoadingSuppliers(true);

            try {
                await formFetchDropdownRecords(`${BASE_URL}/api/get/customers/`, setCustomers, setLoadingCustomers);
                // setLoadingCustomers(false);
                // console.log("FETCHED CUSTOMERS:"  + JSON.stringify(customers))
            } catch (error) {
                setErrorCustomers('Error fetching customers');
                setLoadingCustomers(false);
            }

        };

        const successCallback = (data) => {
            toast.success('Added Customer Successfully');
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

        handleSubmitRecord(postData, API_ENDPOINTS.POST_CUSTOMER, successCallback, errorCallback);
        // console.log('Created new Customer')
    };


    const isCustomerPopupFormValid = () => {
        return  customerPopupData.code &&
                customerPopupData.name &&
                customerPopupData.location_id ;
    };

    const onCreateNewLocation = () => {
        setLoadingLocations(true);

        const postData = {
            code: locationPopupData.code,
            name: locationPopupData.name,
            street: locationPopupData.street,
            city: locationPopupData.city,
            state: locationPopupData.state,
            postcode: locationPopupData.postcode,
            country: locationPopupData.country,
        };

        const fetchDropdownData = async () => {

            try {
                await formFetchDropdownRecords(`${BASE_URL}/api/get/locations/`, setLocations, setLoadingLocations);
            } catch (error) {
                setErrorLocations('Error fetching locations');
                setLoadingLocations(false);
            }

        };

        const successCallback = (data) => {
            toast.success('Added Location Successfully');
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

        handleSubmitRecord(postData, API_ENDPOINTS.POST_LOCATION, successCallback, errorCallback);
        // console.log('Created new Location')
    };

    const isLocationPopupFormValid = () => {
        return  locationPopupData.code &&
                locationPopupData.name &&
                locationPopupData.street &&
                locationPopupData.city &&
                locationPopupData.state &&
                locationPopupData.postcode &&
                locationPopupData.country;
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

    const handleCustomerPopupInputChange = handlePopupInputChange(setCustomerPopupData);
    const handleLocationPopupInputChange = handlePopupInputChange(setLocationPopupData);

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
                    <Grid item xs={4}>
                        <Textarea
                        rows={1}
                        rowsMax={2}
                        label='Number'
                        name='number'
                        id='number'
                        onChange={handleInputChange('number')}
                        value={data.number ?? ""}
                        key='number'
                        error={isEmpty(data.number)}
                        maxLength={80}
                        />
                    </Grid>

                    <Grid item xs={4}>

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
                        // error={data.total <= 0 || data.total === undefined}
                        readOnly
                        />
                    </Grid>
                        
                    <Grid item xs={4}>
                        <DatePicker
                            key='date'
                            id='date'
                            label='Date'
                            format='yyyy-MM-dd'
                            value={data.date ?? null}
                            onChange={handleDatePickerChange('date')}
                            error={isEmpty(data.date)}
                            name='date'
                        />
                    </Grid>

                    <Grid item xs={4}>
                        <DatePicker
                            key='due_date'
                            id='due_date'
                            label='Due Date'
                            format='yyyy-MM-dd'
                            value={data.due_date ?? null}
                            onChange={handleDatePickerChange('due_date')}
                            error={isEmpty(data.due_date)}
                            name='due_date'
                        />
                    </Grid>

                    <Grid item xs={6}>
                        <InputSelect
                        selectItems={customers.map(customer => ({
                            value: customer.id,
                            name: formatFormRecordDropdown(customer.name)
                        }))}
                        label='Customer'
                        name='customer_id'
                        id='customer_id'
                        onChange={handleInputChange('customer_id')}
                        value={data.customer_id ?? ""}
                        error={isEmpty(data.customer_id)}
                        disabled={!!id}
                        loading={loadingCustomers}
                        errorMessage={errorCustomers}
                        onCreateNew={() => setOpenCustomerPopupCreateNew(true)}
                        titleCreateNew='Customer'
                        />
                    </Grid>

                    <Grid item xs={6}>
                        <InputSelect
                        selectItems={locations.map(location => ({
                            value: location.id,
                            name: formatFormRecordDropdown(location.name)
                        }))}
                        label='Location'
                        name='location_id'
                        id='location_id'
                        onChange={handleInputChange('location_id')}
                        value={data.location_id ?? ""}
                        // error={isEmpty(data.location_id)}
                        disabled={!!id}
                        loading={loadingLocations}
                        errorMessage={errorLocations}
                        onCreateNew={() => setOpenLocationPopupCreateNew(true)}
                        titleCreateNew='Location'
                        />
                    </Grid>

                    <Grid item xs={12} style={{ paddingLeft: '35px', paddingRight: '0px' }}>
                        <div className="">
                            <div className="app-page-title--heading" style={{ textAlign: 'left', paddingRight: 0 }}>
                                <h1>PAYMENT</h1>
                            </div>
                            <Divider className="my-4" />
                        </div>
                    </Grid>
                    
                    <Grid item xs={6}>
                        <InputSelectNoCreate
                            selectItems={currencyOptions}
                            label='Currency'
                            name='currency'
                            id='currency'
                            onChange={handleInputChange('currency')}
                            value={data.currency ?? ""}
                            // error={isEmpty(data.currency)}
                        />
                    </Grid>

                    <Grid item xs={6}>
                        <InputSelectNoCreate
                        selectItems={paymentMethods.map(paymentMethod => ({
                            value: paymentMethod,
                            name: formatFormRecordDropdown(paymentMethod)
                        }))}
                        label='Payment Method'
                        name='payment_method'
                        id='payment_method'
                        onChange={handleInputChange('payment_method')}
                        value={data.payment_method ?? ""}
                        // error={isEmpty(data.payment_method)}
                        loading={loadingPaymentMethods}
                        errorMessage={errorPaymentMethods}
                        />
                    </Grid>

                    <Grid item xs={12} style={{ paddingLeft: '35px', paddingRight: '0px' }}>
                        <div className="">
                            <div className="app-page-title--heading" style={{ textAlign: 'left', paddingRight: 0 }}>
                                <h1>PRODUCTS</h1>
                            </div>
                            <Divider className="my-4" />
                        </div>
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
                        <div className="">
                            <div className="app-page-title--heading" style={{ textAlign: 'left', paddingRight: 0 }}>
                                <h1>ADDITIONAL INFORMATION</h1>
                            </div>
                            <Divider className="my-4" />
                        </div>
                    </Grid>

                    <Grid item xs={8}>
                        <Textarea
                            rows={1}
                            rowsMax={2}
                            label='Note'
                            name='note'
                            id='note'
                            onChange={handleInputChange('note')}
                            value={data.note ?? ""}
                            key='note'
                        />
                    </Grid>

                    <Grid item xs={8} style={{ paddingLeft: '35px', paddingRight: '0px' }}>
                        <CardImageUpload
                            // disabled={false}
                            // error={"test error"}
                            // helperText={"helper text"}
                            id="invoice_attachment"
                            imgSrc={data.attachment_file}
                            imageSpec={("Invoice Attachment Specs", "Invoice")}
                            maxFileSize={maxFileSizeInMBForUploadImage}
                            removeImageHandler={
                                inputRef =>
                                    (function() {
                                        if (inputRef.current?.value) {
                                            inputRef.current.value = "";
                                        }

                                        const newFormData = {
                                            ...data,
                                            attachment: null,
                                            attachment_file: null,
                                        };

                                        if (data.new_upload) {
                                            newFormData.new_upload = false;
                                        }
                                        setData(newFormData);
                                    })
                            }
                            imgHandler={
                                event => {
                                    imageUploadHandler(
                                        event,
                                        handleUploadChange,
                                        "attachment",
                                        "attachment_file",
                                    );
                                }
                            }
                            imageFormat={"format" + ": PNG"}
                            title={("Invoice Attachment", "Invoice")}
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
                    </Grid>

                </Grid>
                <ConfirmCancel
                    open={openConfirmCancelDialog}
                    setOpen={setOpenConfirmCancelDialog}
                    handleCancelClick={() => handleNavigatePage()}
                />
                <PopupCreateNew
                    open={openLocationPopupCreateNew}
                    setOpen={setOpenLocationPopupCreateNew}
                    handleSubmit={() => onCreateNewLocation()}
                    title='Location'
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
                                        onChange={handleLocationPopupInputChange('code')}
                                        value={locationPopupData.code ?? ""}
                                        key='code'
                                        error={isEmpty(locationPopupData.code)}
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
                                        onChange={handleLocationPopupInputChange('name')}
                                        value={locationPopupData.name ?? ""}
                                        key='name'
                                        error={isEmpty(locationPopupData.name)}
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
                                        onChange={handleLocationPopupInputChange('note')}
                                        value={locationPopupData.note ?? ""}
                                        key='note'
                                        error={isEmpty(locationPopupData.note)}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <Textarea
                                        rows={1}
                                        rowsMax={2}
                                        label='Street'
                                        name='street'
                                        id='street'
                                        onChange={handleLocationPopupInputChange('street')}
                                        value={locationPopupData.street ?? ""}
                                        key='street'
                                        error={isEmpty(locationPopupData.street)}
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
                                        onChange={handleLocationPopupInputChange('city')}
                                        value={locationPopupData.city ?? ""}
                                        key='city'
                                        error={isEmpty(locationPopupData.city)}
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
                                        onChange={handleLocationPopupInputChange('state')}
                                        value={locationPopupData.state ?? ""}
                                        key='state'
                                        error={isEmpty(locationPopupData.state)}
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
                                        onChange={handleLocationPopupInputChange('postcode')}
                                        value={locationPopupData.postcode ?? ""}
                                        key='postcode'
                                        error={isEmpty(locationPopupData.postcode)}
                                        maxLength={50}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <InputSelectNoCreate
                                        selectItems={countryOptions}
                                        label='Country'
                                        name='country'
                                        id='country'
                                        onChange={handleLocationPopupInputChange('country')}
                                        value={locationPopupData.country ?? ""}
                                        error={isEmpty(locationPopupData.country)}
                                    />
                                </Grid>
                            </Grid>
                        </FormControl>
                    }
                    isPopupFormValid={isLocationPopupFormValid}
                />
                <PopupCreateNew
                    open={openCustomerPopupCreateNew}
                    setOpen={setOpenCustomerPopupCreateNew}
                    handleSubmit={() => onCreateNewCustomer()}
                    title='Customer'
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
                                        onChange={handleCustomerPopupInputChange('code')}
                                        value={customerPopupData.code ?? ""}
                                        key='code'
                                        error={isEmpty(customerPopupData.code)}
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
                                        onChange={handleCustomerPopupInputChange('name')}
                                        value={customerPopupData.name ?? ""}
                                        key='name'
                                        error={isEmpty(customerPopupData.name)}
                                        maxLength={80}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <InputSelectNoCreate
                                        selectItems={locations.map(location => ({
                                            value: location.id,
                                            name: formatFormRecordDropdown(location.name)
                                        }))}
                                        label='Location'
                                        name='location_id'
                                        id='location_id'
                                        onChange={handleCustomerPopupInputChange('location_id')}
                                        value={customerPopupData.location_id ?? ""}
                                        error={isEmpty(customerPopupData.location_id)}
                                        loading={loadingLocations}
                                        errorMessage={errorLocations}
                                    />
                                </Grid>
                            </Grid>
                        </FormControl>
                    }
                    isPopupFormValid={isCustomerPopupFormValid}
                />
            </FormControl>
            )}
        </>
    )
}

export default Form