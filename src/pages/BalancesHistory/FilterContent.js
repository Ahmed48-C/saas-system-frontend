import React, { useEffect, useState } from 'react'
import { InputSelect, Loader, Textarea } from '../../pages-components'
import { Grid } from '@material-ui/core'
import { formatFilterRecordDropdown } from '../../functions/pages/formatFilterRecordDropdown';
import { filterFetchDropdownRecords } from '../../functions/pages/filterFetchDropdownRecords';
import { BASE_URL } from '../../config/apis';
import InputSelectNoCreate from '../../pages-components/InputSelectNoCreate';

const FilterContent = ({ currentFilter, setCurrentFilter, handleBalances, balances }) => {
    const [loading, setLoading] = useState(true);
    const [actions, setActions] = useState([]);

    useEffect(() => {
        filterFetchDropdownRecords(`${BASE_URL}/api/get/balances/`, handleBalances)
        filterFetchDropdownRecords(`${BASE_URL}/api/get/balance_history_action/`, setActions)
        setLoading(false);
    }, []);

    const handleInputChange = (field) => (e) => {
        let value = e.target.value;

        // Allow empty value for clearing the input
        if (['amount', 'previous_amount', 'current_amount'].includes(field)) {
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
                <Textarea
                    style={{ margin: 0 }}
                    rows={1}
                    rowsMax={2}
                    label='Amount'
                    name='amount'
                    id='amount'
                    value={currentFilter.amount}
                    onChange={handleInputChange('amount')}
                    maxLength={35}
                />
            </Grid>
            <Grid item xs={12}>
                <Textarea
                    style={{ margin: 0 }}
                    rows={1}
                    rowsMax={2}
                    label='Previous Amount'
                    name='previous_amount'
                    id='previous_amount'
                    value={currentFilter.previous_amount}
                    onChange={handleInputChange('previous_amount')}
                    maxLength={35}
                />
            </Grid>
            <Grid item xs={12}>
                <Textarea
                    style={{ margin: 0 }}
                    rows={1}
                    rowsMax={2}
                    label='Current Amount'
                    name='current_amount'
                    id='current_amount'
                    value={currentFilter.current_amount}
                    onChange={handleInputChange('current_amount')}
                    maxLength={35}
                />
            </Grid>
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
                    selectItems={actions.map(action => ({
                        value: action,
                        name: formatFilterRecordDropdown(action)
                    }))}
                    label='Action'
                    name='action'
                    id='action'
                    onChange={(e) => setCurrentFilter({ ...currentFilter, action: e.target.value })}
                    value={currentFilter.action}
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
                    onChange={handleInputChange('note')}
                    maxLength={100}
                />
            </Grid>
            </>
            )}
        </>
    )
}

export default FilterContent