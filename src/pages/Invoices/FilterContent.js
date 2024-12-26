import React, { useEffect, useState } from 'react'
import { InputSelect, Loader, Textarea } from '../../pages-components'
import { Grid } from '@material-ui/core'
import { formatFilterRecordDropdown } from '../../functions/pages/formatFilterRecordDropdown';
import { filterFetchDropdownRecords } from '../../functions/pages/filterFetchDropdownRecords';
import { BASE_URL } from '../../config/apis';
import InputSelectNoCreate from '../../pages-components/InputSelectNoCreate';

const FilterContent = ({ currentFilter, setCurrentFilter, handleProducts, products, handleCustomers, customers, handleLocations, locations }) => {
    const [loading, setLoading] = useState(true);
    const [paymentMethods, setPaymentMethods] = useState([]);

    useEffect(() => {
        filterFetchDropdownRecords(`${BASE_URL}/api/get/products/`, handleProducts)
        filterFetchDropdownRecords(`${BASE_URL}/api/get/customers/`, handleCustomers)
        filterFetchDropdownRecords(`${BASE_URL}/api/get/locations/`, handleLocations)
        filterFetchDropdownRecords(`${BASE_URL}/api/get/invoice_payment_methods/`, setPaymentMethods)
        setLoading(false);
    }, []);

    const handleInputChange = (field) => (e) => {
        let value = e.target.value;

        // Allow empty value for clearing the input
        if (['total', 'items__price', 'items__total'].includes(field)) {
            // Allow numeric input including decimals, but only up to 2 decimal places
            if (value === '' || /^[0-9]*\.?[0-9]{0,2}$/.test(value)) {
                const updatedFilter = { ...currentFilter, [field]: value };
                setCurrentFilter(updatedFilter);
            }
        } else if (field === 'items__quantity') {
            // Allow only whole numbers (no decimals)
            if (value === '' || /^[0-9]*$/.test(value)) {
                const updatedFilter = { ...currentFilter, [field]: value };
                setCurrentFilter(updatedFilter);
            }
        } else {
            setCurrentFilter({ ...currentFilter, [field]: value });
        }
    };


    return (
        <>
        {loading ? (
            <Grid item xs={12} style={{ display: 'flex', justifyContent: 'center', paddingLeft: '32px' }}>
                <Loader />
            </Grid>
        ) : (
        <>
            <Grid item xs={12}>
                <Textarea
                    style={{ margin: 0 }}
                    rows={1}
                    rowsMax={2}
                    label='Number'
                    name='number'
                    id='number'
                    value={currentFilter.number}
                    onChange={(e) => setCurrentFilter({ ...currentFilter, number: e.target.value })}
                    maxLength={80}
                />
            </Grid>
            <Grid item xs={12}>
                <InputSelectNoCreate
                    selectItems={paymentMethods.map(paymentMethod => ({
                        value: paymentMethod,
                        name: formatFilterRecordDropdown(paymentMethod)
                    }))}
                    label='Payment Method'
                    name='payment_method'
                    id='payment_method'
                    onChange={(e) => setCurrentFilter({ ...currentFilter, payment_method: e.target.value })}
                    value={currentFilter.payment_method}
                />
            </Grid>
            <Grid item xs={12}>
                <Textarea
                    style={{ margin: 0 }}
                    rows={1}
                    rowsMax={2}
                    label='Total'
                    name='total'
                    id='total'
                    value={currentFilter.total}
                    onChange={handleInputChange('total')}
                    maxLength={35}
                />
            </Grid>
            <Grid item xs={12}>
                <Textarea
                    style={{ margin: 0 }}
                    rows={1}
                    rowsMax={2}
                    label='Note'
                    name='note'
                    id='note'
                    value={currentFilter.note}
                    onChange={(e) => setCurrentFilter({ ...currentFilter, note: e.target.value })}
                />
            </Grid>
            <Grid item xs={12}>
                <InputSelectNoCreate
                    selectItems={locations.map(location => ({
                        value: location.id.toString(),
                        name: formatFilterRecordDropdown(location.name)
                    }))}
                    label='Location'
                    name='location'
                    id='location'
                    onChange={(e) => setCurrentFilter({ ...currentFilter, location_id: e.target.value })}
                    value={currentFilter.location_id}
                />
            </Grid>
            <Grid item xs={12}>
                <InputSelectNoCreate
                    selectItems={customers.map(customer => ({
                        value: customer.id.toString(),
                        name: formatFilterRecordDropdown(customer.name)
                    }))}
                    label='Customer'
                    name='customer'
                    id='customer'
                    onChange={(e) => setCurrentFilter({ ...currentFilter, customer_id: e.target.value })}
                    value={currentFilter.customer_id}
                />
            </Grid>
            <Grid item xs={12}>
                <InputSelectNoCreate
                    selectItems={products.map(product => ({
                        value: product.id.toString(),
                        name: formatFilterRecordDropdown(product.name)
                    }))}
                    label='Items Product'
                    name='items__product'
                    id='items__product'
                    onChange={(e) => setCurrentFilter({ ...currentFilter, items__product_id: e.target.value })}
                    value={currentFilter.items__product_id}
                />
            </Grid>
            <Grid item xs={12}>
                <Textarea
                    style={{ margin: 0 }}
                    rows={1}
                    rowsMax={2}
                    label='Items Total'
                    name='items__total'
                    id='items__total'
                    value={currentFilter.items__total}
                    onChange={handleInputChange('items__total')}
                    maxLength={35}
                />
            </Grid>
            <Grid item xs={12}>
                <Textarea
                    style={{ margin: 0 }}
                    rows={1}
                    rowsMax={2}
                    label='Items Price'
                    name='items__price'
                    id='items__price'
                    value={currentFilter.items__price}
                    onChange={handleInputChange('items__price')}
                    maxLength={15}
                />
            </Grid>
            <Grid item xs={12}>
                <Textarea
                    style={{ margin: 0 }}
                    rows={1}
                    rowsMax={2}
                    label='Items Quantity'
                    name='items__quantity'
                    id='items__quantity'
                    value={currentFilter.items__quantity}
                    onChange={handleInputChange('items__quantity')}
                    maxLength={10}
                />
            </Grid>
            </>
            )}
        </>
    )
}

export default FilterContent