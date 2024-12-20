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
import { currencyList, maxFileSizeInMBForUploadImage } from '../../config/common'
import CardImageUpload from '../../pages-components/MediaUploader';
import { imageUploadHandler } from '../../config/uploadHandler'
import InputSelectCreate from '../../pages-components/InputSelectCreate'

const Form = ({ handleClick, icon, title }) => {
    const history = useHistory();

    const { id } = useParams();

    const [data, setData] = useState({});
    const [editLoading, setEditLoading] = useState(false);
    const [balances, setBalances] = useState([]);

    const [loadingBalances, setLoadingBalances] = useState(false);
    const [errorBalances, setErrorBalances] = useState('');

    const [customers, setCustomers] = useState([]);
    const [loadingCustomers, setLoadingCustomers] = useState(false);
    const [errorCustomers, setErrorCustomers] = useState('');

    const [locations, setLocations] = useState([]);
    const [loadingLocations, setLoadingLocations] = useState(false);
    const [errorLocations, setErrorLocations] = useState('');

    const [categories, setCategories] = useState([]);
    const [loadingCategories, setLoadingCategories] = useState(false);
    const [errorCategories, setErrorCategories] = useState('');

    const fetchData = useCallback(() => {
        handleFetchRecord(id, API_ENDPOINTS.GET_INCOME, setData, setEditLoading);
    }, [id]);

    useEffect(() => {
        if (id) {
            fetchData();
        }

        const fetchDropdownData = async () => {

            setLoadingBalances(true);
            setLoadingCustomers(true);
            setLoadingLocations(true);
            setLoadingCategories(true);

            try {
                await formFetchDropdownRecords(`${BASE_URL}/api/get/balances/`, setBalances, setLoadingBalances);
                // setLoadingBalances(false);
            } catch (error) {
                setErrorBalances('Error fetching suppliers');
                setLoadingBalances(false);
            }

            try {
                await formFetchDropdownRecords(`${BASE_URL}/api/get/customers/`, setCustomers, setLoadingCustomers);
                // setLoadingCustomers(false);
            } catch (error) {
                setErrorCustomers('Error fetching customers');
                setLoadingCustomers(false);
            }

            try {
                await formFetchDropdownRecords(`${BASE_URL}/api/get/locations/`, setLocations, setLoadingLocations);
                // setLoadingLocations(false);
            } catch (error) {
                setErrorLocations('Error fetching locations');
                setLoadingLocations(false);
            }

            try {
                await formFetchDropdownRecords(`${BASE_URL}/api/get/income_categories/`, setCategories, setLoadingCategories);
                // setLoadingCategories(false);
            } catch (error) {
                setErrorCategories('Error fetching categories');
                setLoadingCategories(false);
            }

        };

        fetchDropdownData();

        // formFetchDropdownRecords(`http://127.0.0.1:8000/api/get/balances/`, setBalances)
    }, [id, fetchData]);

    // State to hold the list of countries
    const [currencyOptions, setCurrencyOptions] = useState([]);

    useEffect(() => {
        // Map through country list and sort them alphabetically
        const sortedCurrencies = currencyList
            .map(currency => ({
                name: currency,
                value: currency // Setting value to country name
            }))
            .sort((a, b) => a.name.localeCompare(b.name));

        // Set the sorted countries in the state
        setCurrencyOptions(sortedCurrencies);
    }, []);

    const isFormValid = () => {
        return  data.balance_id &&
                data.customer_id &&
                data.currency &&
                data.amount;
    };

    const calculateTotal = (price, quantity) => {
        const total = (parseFloat(price) || 0) * (parseFloat(quantity) || 0);
        return total.toFixed(2); // Ensure total is rounded to two decimal places
    };

    const handleInputChange = (field) => (e) => {
        let value = e.target.value;

        if (field === 'amount') {
            // Allow numeric input including decimals with max 2 decimal places
            if (value === '' || /^[0-9]*\.?[0-9]{0,2}$/.test(value)) {
                const updatedData = { ...data, [field]: value };
                updatedData.total = calculateTotal(updatedData.price, updatedData.quantity);
                setData(updatedData);
            }
        } else {
            setData({ ...data, [field]: value });
        }
    };

    const handleUploadChange = (uploadData) => {
        setData({ ...data, ...uploadData });
    };

    const handleNavigatePage = () => {
        history.push('/ui/incomes');
    };

    const [openConfirmCancelDialog, setOpenConfirmCancelDialog] = useState(false);

    const [openBalancePopupCreateNew, setOpenBalancePopupCreateNew] = useState(false);
    const [balancePopupData, setBalancePopupData] = useState({});

    const [openCustomerPopupCreateNew, setOpenCustomerPopupCreateNew] = useState(false);
    const [customerPopupData, setCustomerPopupData] = useState({});

    const [openCategoryPopupCreateNew, setOpenCategoryPopupCreateNew] = useState(false);
    const [categoryPopupData, setCategoryPopupData] = useState({});

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

    const isBalancePopupFormValid = () => {
        return  balancePopupData.name &&
                balancePopupData.amount ;
    };

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
                console.log("FETCHED CUSTOMERS:"  + JSON.stringify(customers))
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
        console.log('Created new Customer')
    };


    const isCustomerPopupFormValid = () => {
        return  customerPopupData.code &&
                customerPopupData.name &&
                customerPopupData.location_id ;
    };

    const onCreateNewCategory = () => {
        setLoadingCategories(true);

        const postData = {
            name: categoryPopupData.name,
        };

        const fetchDropdownData = async () => {

            // setLoadingSuppliers(true);

            try {
                await formFetchDropdownRecords(`${BASE_URL}/api/get/income_categories/`, setCategories, setLoadingCategories);
                // setLoadingCategories(false);
                console.log("FETCHED CATEGORIES:"  + JSON.stringify(categories))
            } catch (error) {
                setErrorCategories('Error fetching categories');
                setLoadingCategories(false);
            }

        };

        const successCallback = (data) => {
            toast.success('Added Category Successfully');
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

        handleSubmitRecord(postData, API_ENDPOINTS.POST_INCOME_CATEGORY, successCallback, errorCallback);
        console.log('Created new Category')
    };

    const isCategoryPopupFormValid = () => {
        return  categoryPopupData.name ;
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
    const handleCustomerPopupInputChange = handlePopupInputChange(setCustomerPopupData);
    const handleCategoryPopupInputChange = handlePopupInputChange(setCategoryPopupData);

    return (
        <>
            {editLoading ? (
                <Loader />
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
                        selectItems={balances.map(balance => ({
                            value: balance.id,
                            name: formatFormRecordDropdown(balance.name)
                        }))}
                        label='Balance'
                        name='balance_id'
                        id='balance_id'
                        onChange={handleInputChange('balance_id')}
                        value={data.balance_id ?? ""}
                        error={isEmpty(data.balance_id)}
                        loading={loadingBalances}
                        errorMessage={errorBalances}
                        onCreateNew={() => setOpenBalancePopupCreateNew(true)}
                        titleCreateNew='Balance'
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
                        loading={loadingCustomers}
                        errorMessage={errorCustomers}
                        onCreateNew={() => setOpenCustomerPopupCreateNew(true)}
                        titleCreateNew='Customer'
                        />
                    </Grid>
                    <Grid item xs={6}>
                        <InputSelectCreate
                        selectItems={categories.map(category => ({
                            value: category.id,
                            name: formatFormRecordDropdown(category.name)
                        }))}
                        label='Category'
                        name='category_id'
                        id='category_id'
                        onChange={handleInputChange('category_id')}
                        value={data.category_id ?? ""}
                        error={isEmpty(data.category_id)}
                        loading={loadingCategories}
                        errorMessage={errorCategories}
                        onCreateNew={() => setOpenCategoryPopupCreateNew(true)}
                        titleCreateNew='Category'
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <Textarea
                        rows={1}
                        rowsMax={2}
                        label='Amount'
                        name='amount'
                        id='amount'
                        inputMode="decimal" // Suggests decimal keypad on mobile devices
                        onChange={handleInputChange('amount')}
                        value={data.amount ?? ""}
                        key='amount'
                        error={isEmpty(data.amount)}
                        maxLength={15}
                        />
                    </Grid>
                    <Grid item xs={6}>
                        <InputSelectNoCreate
                        selectItems={currencyOptions}
                        label='Currency'
                        name='currency'
                        id='currency'
                        onChange={handleInputChange('currency')}
                        value={data.currency ?? ""}
                        error={isEmpty(data.currency)}
                        />
                    </Grid>
                    <Grid item xs={8} style={{ paddingLeft: '35px', paddingRight: '0px' }}>
                        <CardImageUpload
                            // disabled={false}
                            // error={"test error"}
                            // helperText={"helper text"}
                            id="income_attachment"
                            imgSrc={data.attachment_file}
                            imageSpec={("Income Attachment Specs", "Income")}
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
                            title={("Income Attachment", "Income")}
                        />
                    </Grid>
                    <Grid item xs={12}>
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
                <PopupCreateNew
                    open={openCategoryPopupCreateNew}
                    setOpen={setOpenCategoryPopupCreateNew}
                    handleSubmit={() => onCreateNewCategory()}
                    title='Category'
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
                                        onChange={handleCategoryPopupInputChange('name')}
                                        value={categoryPopupData.name ?? ""}
                                        key='name'
                                        error={isEmpty(categoryPopupData.name)}
                                        maxLength={80}
                                    />
                                </Grid>
                            </Grid>
                        </FormControl>
                    }
                    isPopupFormValid={isCategoryPopupFormValid}
                />
            </FormControl>
            )}
        </>
    )
}

export default Form