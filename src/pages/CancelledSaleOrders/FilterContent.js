import React, { useEffect, useState } from 'react'
import { InputSelect, Loader, Textarea } from '../../pages-components'
import { Grid } from '@material-ui/core'
import { formatFilterRecordDropdown } from '../../functions/pages/formatFilterRecordDropdown';
import { filterFetchDropdownRecords } from '../../functions/pages/filterFetchDropdownRecords';
import { BASE_URL } from '../../config/apis';

const FilterContent = ({ currentFilter, setCurrentFilter, handleProducts, products, stores, handleStores, handleBalances, balances, handleCustomers, customers, handleClients, clients }) => {
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        filterFetchDropdownRecords(`${BASE_URL}/api/get/products/`, handleProducts)
        filterFetchDropdownRecords(`${BASE_URL}/api/get/stores/`, handleStores)
        filterFetchDropdownRecords(`${BASE_URL}/api/get/balances/`, handleBalances)
        filterFetchDropdownRecords(`${BASE_URL}/api/get/customers/`, handleCustomers)
        filterFetchDropdownRecords(`${BASE_URL}/api/get/clients/`, handleClients)
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
                    label='Code'
                    name='code'
                    id='code'
                    value={currentFilter.code}
                    onChange={(e) => setCurrentFilter({ ...currentFilter, code: e.target.value })}
                    maxLength={80}
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
                <InputSelect
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
                <InputSelect
                    selectItems={clients.map(client => ({
                        value: client.id.toString(),
                        name: formatFilterRecordDropdown(client.name)
                    }))}
                    label='Client'
                    name='client'
                    id='client'
                    onChange={(e) => setCurrentFilter({ ...currentFilter, client_id: e.target.value })}
                    value={currentFilter.client_id}
                />
            </Grid>
            <Grid item xs={12}>
                <InputSelect
                    selectItems={stores.map(store => ({
                        value: store.id.toString(),
                        name: formatFilterRecordDropdown(store.name)
                    }))}
                    label='Store'
                    name='store'
                    id='store'
                    onChange={(e) => setCurrentFilter({ ...currentFilter, store_id: e.target.value })}
                    value={currentFilter.store_id}
                />
            </Grid>
            <Grid item xs={12}>
                <InputSelect
                    selectItems={balances.map(balance => ({
                        value: balance.id.toString(),
                        name: formatFilterRecordDropdown(balance.name)
                    }))}
                    label='Balance'
                    name='balance'
                    id='balance'
                    onChange={(e) => setCurrentFilter({ ...currentFilter, balance_id: e.target.value })}
                    value={currentFilter.balance_id}
                />
            </Grid>
            <Grid item xs={12}>
                <InputSelect
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
                    maxLength={15}
                />
            </Grid>
            </>
            )}
        </>
    )
}

export default FilterContent