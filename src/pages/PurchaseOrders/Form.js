import React, { useEffect, useState } from 'react'
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
    const [products, setProducts] = useState([]);
    const [balances, setBalances] = useState([]);
    const statuses = ['Pending', 'Completed']

    useEffect(() => {
        if (id) {
            fetchData();
        }

        formFetchDropdownRecords(`http://127.0.0.1:8000/api/get/stores/`, setStores)
        formFetchDropdownRecords(`http://127.0.0.1:8000/api/get/products/`, setProducts)
        formFetchDropdownRecords(`http://127.0.0.1:8000/api/get/balances/`, setBalances)
    }, [id]);

    const fetchData = () => {
        handleFetchRecord(id, API_ENDPOINTS.GET_PURCHASE_ORDER, setData, setEditLoading);
    };

    const calculateTotal = (price, quantity) => {
        const total = (parseFloat(price) || 0) * (parseFloat(quantity) || 0);
        return total.toFixed(2); // Ensure total is rounded to two decimal places
    };

    const isFormValid = () => {
        return  data.name &&
                data.price &&
                data.quantity &&
                data.store_id &&
                data.product_id &&
                data.balance_id;
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
                        label='Name'
                        name='name'
                        id='name'
                        onChange={handleInputChange('name')}
                        value={data.name ?? ""}
                        key='name'
                        error={isEmpty(data.name)}
                        maxLength={80}
                        />
                    </Grid>
                    <Grid item xs={6}>
                        <Textarea
                        rows={1}
                        rowsMax={2}
                        label='Price'
                        name='price'
                        id='price'
                        inputMode="decimal" // Suggests decimal keypad on mobile devices
                        onChange={handleInputChange('price')}
                        value={data.price ?? ""}
                        key='price'
                        error={isEmpty(data.price)}
                        maxLength={15}
                        />
                    </Grid>
                    <Grid item xs={6}>
                        <Textarea
                        rows={1}
                        rowsMax={2}
                        label='Quantity'
                        name='quantity'
                        id='quantity'
                        inputMode="decimal" // Suggests decimal keypad on mobile devices
                        onChange={handleInputChange('quantity')}
                        value={data.quantity ?? ""}
                        key='quantity'
                        error={isEmpty(data.quantity)}
                        maxLength={15}
                        />
                    </Grid>
                    <Grid item xs={6}>
                        <Textarea
                        rows={1}
                        rowsMax={2}
                        label='Total'
                        name='total'
                        id='total'
                        value={data.total ?? "0.00"}
                        key='total'
                        error={isEmpty(data.total)}
                        readOnly
                        />
                    </Grid>
                    <Grid item xs={6}>
                        <InputSelect
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
                        disabled={!!id}
                        />
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
                        disabled={!!id}
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