import React, { useEffect, useState } from 'react'
import { InputSelect, Loader, Textarea } from '../../pages-components'
import { Grid } from '@material-ui/core'
import { formatFilterRecordDropdown } from '../../functions/pages/formatFilterRecordDropdown';
import { filterFetchDropdownRecords } from '../../functions/pages/filterFetchDropdownRecords';
import { BASE_URL } from '../../config/apis';

const FilterContent = ({ currentFilter, setCurrentFilter, handleBalances, balances }) => {
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        filterFetchDropdownRecords(`${BASE_URL}/api/get/balances/`, handleBalances)
        setLoading(false);
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