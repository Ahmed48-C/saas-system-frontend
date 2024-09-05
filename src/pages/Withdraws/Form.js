import React, { useEffect, useState } from 'react'
import { Box, Button, Divider, FormControl, Grid, Tooltip } from '@material-ui/core'
import { InputSelect, Loader, Textarea } from '../../pages-components'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import isEmpty from '../../functions/pages/isEmpty'
import { useParams } from 'react-router-dom';
import API_ENDPOINTS from '../../config/apis'
import { handleFetchRecord } from '../../functions/pages/handleFetchRecord'
import AdornmentTextarea from '../../pages-components/AdornmentTextArea'
import getUnits from '../../config/getUnits'
import { formatFormRecordDropdown } from '../../functions/pages/formatFormRecordDropdown'
import { formFetchDropdownRecords } from '../../functions/pages/formFetchDropdownRecords'

const Form = ({ handleClick, icon, title }) => {
    const { id } = useParams();

    const [data, setData] = useState({});
    const [editLoading, setEditLoading] = useState(false);
    const [balances, setBalances] = useState([]);

    useEffect(() => {
        if (id) {
            fetchData();
        }

        formFetchDropdownRecords(`http://127.0.0.1:8000/api/get/balances/`, setBalances)
    }, [id]);

    const fetchData = () => {
        handleFetchRecord(id, API_ENDPOINTS.GET_BALANCE_LOG, setData, setEditLoading);
    };

    const isFormValid = () => {
        return  data.balance_id &&
                data.amount;
    };

    // const handleInputChange = (field) => (e) => {
    //     setData({ ...data, [field]: e.target.value });
    // };

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

    return (
        <>
            {editLoading ? (
                <Loader />
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
                                    // setData({});
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