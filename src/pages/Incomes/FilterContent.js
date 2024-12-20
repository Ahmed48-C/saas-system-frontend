import React, { useEffect, useState } from 'react'
import { InputSelect, Loader, Textarea } from '../../pages-components'
import { Grid } from '@material-ui/core'
import { formatFilterRecordDropdown } from '../../functions/pages/formatFilterRecordDropdown';
import { filterFetchDropdownRecords } from '../../functions/pages/filterFetchDropdownRecords';
import { BASE_URL } from '../../config/apis';
import InputSelectNoCreate from '../../pages-components/InputSelectNoCreate';
import { currencyList } from '../../config/common';

const FilterContent = ({ currentFilter, setCurrentFilter, handleBalances, balances, handleCustomers, customers, handleCategories, categories }) => {
    const [loading, setLoading] = useState(true);
    const [currencyOptions, setCurrencyOptions] = useState([]);

    useEffect(() => {
        filterFetchDropdownRecords(`${BASE_URL}/api/get/balances/`, handleBalances)
        filterFetchDropdownRecords(`${BASE_URL}/api/get/customers/`, handleCustomers)
        filterFetchDropdownRecords(`${BASE_URL}/api/get/income_categories/`, handleCategories)
        setLoading(false);
    }, []);

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

    const handleInputChange = (field) => (e) => {
        let value = e.target.value;

        // Allow empty value for clearing the input
        if (['amount'].includes(field)) {
            // Allow numeric input including decimals, but only up to 2 decimal places
            if (value === '' || /^[0-9]*\.?[0-9]{0,2}$/.test(value)) {
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
                <InputSelectNoCreate
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
                    selectItems={categories.map(category => ({
                        value: category.id.toString(),
                        name: formatFilterRecordDropdown(category.name)
                    }))}
                    label='Category'
                    name='category'
                    id='category'
                    onChange={(e) => setCurrentFilter({ ...currentFilter, category_id: e.target.value })}
                    value={currentFilter.category_id}
                />
            </Grid>
            <Grid item xs={12}>
                <Textarea
                    style={{ margin: 0 }}
                    rows={1}
                    rowsMax={2}
                    label='Amount'
                    name='amount'
                    id='amount'
                    value={currentFilter.amount}
                    onChange={handleInputChange('amount')}
                    maxLength={15}
                />
            </Grid>
            <Grid item xs={12}>
                <InputSelectNoCreate
                    selectItems={currencyOptions}
                    label='Currency'
                    name='currency'
                    id='currency'
                    value={currentFilter.currency}
                    onChange={(e) => setCurrentFilter({ ...currentFilter, currency: e.target.value })}
                />
            </Grid>
            <Grid item xs={12}>
                <Textarea
                    style={{ margin: 0 }}
                    rows={1}
                    rowsMax={2}
                    label='Type'
                    name='type'
                    id='type'
                    value={currentFilter.type}
                    onChange={(e) => setCurrentFilter({ ...currentFilter, type: e.target.value })}
                    maxLength={80}
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
                <Textarea
                    style={{ margin: 0 }}
                    rows={1}
                    rowsMax={2}
                    label='Date'
                    name='date'
                    id='date'
                    value={currentFilter.date}
                    onChange={(e) => setCurrentFilter({ ...currentFilter, date: e.target.value })}
                    maxLength={80}
                />
            </Grid>
            <Grid item xs={12}>
                <Textarea
                    style={{ margin: 0 }}
                    rows={1}
                    rowsMax={2}
                    label='Action'
                    name='action'
                    id='action'
                    value={currentFilter.action}
                    onChange={(e) => setCurrentFilter({ ...currentFilter, action: e.target.value })}
                    maxLength={80}
                />
            </Grid>
            </>
            )}
        </>
    )
}

export default FilterContent