import React, { useCallback, useEffect, useState } from 'react'
import { Box, Button, Divider, FormControl, Grid, IconButton, InputAdornment, TextField, Tooltip } from '@material-ui/core'
import { InputSelect, Loader, Textarea } from '../../pages-components'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import isEmpty from '../../functions/pages/isEmpty'
import { useParams } from 'react-router-dom';
import { API_ENDPOINTS, BASE_URL} from '../../config/apis'
import { handleFetchRecord } from '../../functions/pages/handleFetchRecord'
import { formatFormRecordDropdown } from '../../functions/pages/formatFormRecordDropdown'
import { formFetchDropdownRecords } from '../../functions/pages/formFetchDropdownRecords'
import SwapHorizIcon from '@material-ui/icons/SwapHoriz';
import { useHistory } from 'react-router-dom';
import ConfirmCancel from '../../pages-components/ConfirmCancel'
import PopupCreateNew from '../../pages-components/PopupCreateNew'
import { handleSubmitRecord } from '../../functions/pages/handleSubmitRecord'
import { toast } from 'react-toastify'

const Form = ({ handleClick, icon, title }) => {
    const history = useHistory();

    const [data, setData] = useState({});
    const [editLoading, setEditLoading] = useState(false);
    const [balances, setBalances] = useState([]);
    const [balanceFromAmount, setBalanceFromAmount] = useState(0); // Track selected balance_from amount
    const [balanceToAmount, setBalanceToAmount] = useState(0); // Track selected balance_to amount

    const [loadingBalances, setLoadingBalances] = useState(false);
    const [errorBalances, setErrorBalances] = useState('');

    useEffect(() => {

        const fetchDropdownData = async () => {

            setLoadingBalances(true);

            try {
                await formFetchDropdownRecords(`${BASE_URL}/api/get/balances/`, setBalances, setLoadingBalances);
                // setLoadingBalances(false);
            } catch (error) {
                setErrorBalances('Error fetching suppliers');
                setLoadingBalances(false);
            }

        };

        fetchDropdownData();

        // formFetchDropdownRecords(`http://127.0.0.1:8000/api/get/balances/`, setBalances)
    }, []);

    const isFormValid = () => {
        return data.balance_from_id &&
            data.balance_to_id &&
            data.balance_from_id !== data.balance_to_id &&
            data.amount &&
            parseFloat(data.amount) <= getBalanceFromAmount(); // Ensure amount does not exceed balance_from amount
    };

    // Fetch the balance amount based on the selected balance_from_id
    const getBalanceFromAmount = () => {
        const balanceFrom = balances.find(b => b.id === data.balance_from_id);
        return balanceFrom ? parseFloat(balanceFrom.amount) : 0; // Assuming balances have an 'amount' field
    };

    // Fetch the balance amount based on the selected balance_to_id
    const getBalanceToAmount = () => {
        const balanceTo = balances.find(b => b.id === data.balance_to_id);
        return balanceTo ? parseFloat(balanceTo.amount) : 0; // Assuming balances have an 'amount' field
    };


    // const handleInputChange = (field) => (e) => {
    //     let value = e.target.value;

    //     if (field === 'amount') {
    //         const maxAmount = getBalanceFromAmount();
    //         // Allow numeric input including decimals with max 2 decimal places
    //         if (value === '' || (/^[0-9]*\.?[0-9]{0,2}$/.test(value) && parseFloat(value) <= maxAmount)) {
    //             setData({ ...data, [field]: value });
    //         }
    //     } else {
    //         setData({ ...data, [field]: value });
    //     }
    // };

    // Handle input change for different fields
    const handleInputChange = (field) => (e) => {
        let value = e.target.value;

        if (field === 'amount') {
            const maxAmount = getBalanceFromAmount();
            // Allow numeric input including decimals with max 2 decimal places
            if (value === '' || (parseFloat(value) > 0 && /^[0-9]*\.?[0-9]{0,2}$/.test(value) && parseFloat(value) <= maxAmount)) {
                setData({ ...data, [field]: value });
            }
        } else {
            setData({ ...data, [field]: value });
        }

        // Update balanceFromAmount if balance_from_id changes
        if (field === 'balance_from_id') {
            const selectedBalance = balances.find(b => b.id === value);
            setBalanceFromAmount(selectedBalance ? parseFloat(selectedBalance.amount) : 0);
        }

        // Update balanceToAmount if balance_to_id changes
        if (field === 'balance_to_id') {
            const selectedBalance = balances.find(b => b.id === value);
            setBalanceToAmount(selectedBalance ? parseFloat(selectedBalance.amount) : 0);
        }
    };

    const handleMaxClick = () => {
        const maxAmount = getBalanceFromAmount();
        setData({ ...data, amount: maxAmount.toFixed(2) });
    };

    // useEffect to check and adjust the amount when balance_from changes
    useEffect(() => {
        const maxAmount = getBalanceFromAmount();
        if (data.amount && parseFloat(data.amount) > maxAmount) {
            setData((prevData) => ({
                ...prevData,
                amount: maxAmount.toFixed(2) // Update amount if it exceeds the balance_from amount
            }));
        }
    }, [data.balance_from_id, balances]); // Runs when balance_from_id or balances change

    const handleNavigatePage = () => {
        history.push('/ui/transfers');
    };

    const [openConfirmCancelDialog, setOpenConfirmCancelDialog] = useState(false);

    const [openBalancePopupCreateNew, setOpenBalancePopupCreateNew] = useState(false);
    const [balancePopupData, setBalancePopupData] = useState({});

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
                    {/* <Grid item xs={6}>
                        <InputSelect
                        selectItems={balances.map(balance => ({
                            value: balance.id,
                            name: formatFormRecordDropdown(balance.name)
                        }))}
                        label='Balance From'
                        name='balance_from_id'
                        id='balance_from_id'
                        onChange={handleInputChange('balance_from_id')}
                        value={data.balance_from_id ?? ""}
                        error={isEmpty(data.balance_from_id)}
                        helperText={data.balance_from_id === data.balance_to_id ? 'Balance From and Balance To cannot be the same' : ''}
                        />
                    </Grid> */}
                    <Grid item xs={12} md={5}>
                        <InputSelect
                            selectItems={balances.map(balance => ({
                                value: balance.id,
                                name: `${formatFormRecordDropdown(balance.name)} (Balance: ${balance.amount})`
                            }))}
                            label='Balance From'
                            name='balance_from_id'
                            id='balance_from_id'
                            onChange={handleInputChange('balance_from_id')}
                            value={data.balance_from_id ?? ""}
                            error={isEmpty(data.balance_from_id)}
                            helperText={data.balance_from_id === data.balance_to_id ? 'Balance From and Balance To cannot be the same' : ''}
                            InputProps={{
                                endAdornment: balanceFromAmount > 0 && (
                                    <InputAdornment position="end" style={{
                                        position: 'absolute',
                                        top: '-15px', // Move to the top
                                        right: '0', // Align right
                                        fontSize: '12px',
                                        color: '#888'
                                    }}>
                                        {`Balance: ${balanceFromAmount}`}
                                    </InputAdornment>
                                )
                            }}
                            loading={loadingBalances}
                            errorMessage={errorBalances}
                            onCreateNew={() => setOpenBalancePopupCreateNew(true)}
                            titleCreateNew='Balance'
                        />
                    </Grid>
                    <Grid item xs={12} md={2} style={{ display: 'flex', justifyContent: 'center', paddingLeft: '48px' }}>
                        <SwapHorizIcon fontSize="large" />
                    </Grid>
                    <Grid item xs={12} md={5}>
                        <InputSelect
                            selectItems={balances.map(balance => ({
                                value: balance.id,
                                name: `${formatFormRecordDropdown(balance.name)} (Balance: ${balance.amount})`
                            }))}
                            label='Balance To'
                            name='balance_to_id'
                            id='balance_to_id'
                            onChange={handleInputChange('balance_to_id')}
                            value={data.balance_to_id ?? ""}
                            error={isEmpty(data.balance_to_id)}
                            helperText={data.balance_from_id === data.balance_to_id ? 'Balance From and Balance To cannot be the same' : ''}
                            InputProps={{
                                endAdornment: balanceToAmount > 0 && (
                                    <InputAdornment position="end" style={{
                                        position: 'absolute',
                                        top: '-15px', // Move to the top
                                        right: '0', // Align right
                                        fontSize: '12px',
                                        color: '#888'
                                    }}>
                                        {`Balance: ${balanceToAmount}`}
                                    </InputAdornment>
                                )
                            }}
                            loading={loadingBalances}
                            errorMessage={errorBalances}
                            onCreateNew={() => setOpenBalancePopupCreateNew(true)}
                            titleCreateNew='Balance'
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            className="m-3"
                            multiline
                            fullWidth
                            variant='outlined'
                            rows={1}
                            rowsMax={2}
                            label='Amount'
                            name='amount'
                            id='amount'
                            inputMode="decimal" // Suggests decimal keypad on mobile devices
                            onChange={handleInputChange('amount')}
                            value={data.amount ?? ""}
                            key='amount'
                            // error={isEmpty(data.amount)}
                            // Conditionally change the label color if there's an error
                            InputLabelProps={{
                                style: { color: isEmpty(data.amount) ? 'red' : '' }, // Change label color only when error is true
                            }}
                            // Remove the error prop from TextField to avoid making the entire field red
                            FormHelperTextProps={isEmpty(data.amount)}
                            maxLength={15}
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton
                                            onClick={handleMaxClick}
                                            edge="end"
                                            aria-label="max amount"
                                            size='small'
                                        >
                                            Max
                                        </IconButton>
                                    </InputAdornment>
                                ),
                            }}
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
            </FormControl>
            )}
        </>
    )
}

export default Form