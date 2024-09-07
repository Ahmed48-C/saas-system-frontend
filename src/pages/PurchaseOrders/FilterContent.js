import React, { useEffect, useState } from 'react'
import { InputSelect, Loader, Textarea } from '../../pages-components'
import { Grid } from '@material-ui/core'
import { formatFilterRecordDropdown } from '../../functions/pages/formatFilterRecordDropdown';
import { filterFetchDropdownRecords } from '../../functions/pages/filterFetchDropdownRecords';

const FilterContent = ({ currentFilter, setCurrentFilter, handleProducts, products, stores, handleStores, handleBalances, balances }) => {
    const [loading, setLoading] = useState(true);
    const statuses = ['Pending', 'Completed']

    useEffect(() => {
        filterFetchDropdownRecords(`http://127.0.0.1:8000/api/get/products/`, handleProducts)
        filterFetchDropdownRecords(`http://127.0.0.1:8000/api/get/stores/`, handleStores)
        filterFetchDropdownRecords(`http://127.0.0.1:8000/api/get/balances/`, handleBalances)
        setLoading(false);
    }, []);

    const handleInputChange = (field) => (e) => {
        let value = e.target.value;

        // Allow empty value for clearing the input
        if (['price', 'total'].includes(field)) {
            // Allow numeric input including decimals, but only up to 2 decimal places
            if (value === '' || /^[0-9]*\.?[0-9]{0,2}$/.test(value)) {
                const updatedFilter = { ...currentFilter, [field]: value };
                setCurrentFilter(updatedFilter);
            }
        } else if (field === 'quantity') {
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
                    label='Name'
                    name='name'
                    id='name'
                    value={currentFilter.name}
                    onChange={(e) => setCurrentFilter({ ...currentFilter, name: e.target.value })}
                    maxLength={80}
                />
            </Grid>
            <Grid item xs={12}>
                <Textarea
                    style={{ margin: 0 }}
                    rows={1}
                    rowsMax={2}
                    label='Price'
                    name='price'
                    id='price'
                    value={currentFilter.price}
                    // onChange={(e) => setCurrentFilter({ ...currentFilter, price: e.target.value })}
                    onChange={handleInputChange('price')}
                    maxLength={15}
                />
            </Grid>
            <Grid item xs={12}>
                <Textarea
                    style={{ margin: 0 }}
                    rows={1}
                    rowsMax={2}
                    label='Quantity'
                    name='quantity'
                    id='quantity'
                    value={currentFilter.quantity}
                    // onChange={(e) => setCurrentFilter({ ...currentFilter, quantity: e.target.value })}
                    onChange={handleInputChange('quantity')}
                    maxLength={15}
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
                    // onChange={(e) => setCurrentFilter({ ...currentFilter, total: e.target.value })}
                    onChange={handleInputChange('total')}
                    maxLength={35}
                />
            </Grid>
            <Grid item xs={12}>
                <InputSelect
                    selectItems={statuses.map(status => ({
                        value: status,
                        name: formatFilterRecordDropdown(status)
                    }))}
                    label='Status'
                    name='status'
                    id='status'
                    onChange={(e) => setCurrentFilter({ ...currentFilter, status: e.target.value })}
                    value={currentFilter.status}
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
                    selectItems={products.map(product => ({
                        value: product.id.toString(),
                        name: formatFilterRecordDropdown(product.name)
                    }))}
                    label='Product'
                    name='product'
                    id='product'
                    onChange={(e) => setCurrentFilter({ ...currentFilter, product_id: e.target.value })}
                    value={currentFilter.product_id}
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
            </>
            )}
        </>
    )
}

export default FilterContent