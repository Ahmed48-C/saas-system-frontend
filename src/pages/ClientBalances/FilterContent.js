import React, { useEffect, useState } from 'react'
import { InputSelect, Loader, Textarea } from '../../pages-components'
import { Grid } from '@material-ui/core'
import { formatFilterRecordDropdown } from '../../functions/pages/formatFilterRecordDropdown';
import { filterFetchDropdownRecords } from '../../functions/pages/filterFetchDropdownRecords';
import { BASE_URL } from '../../config/apis';

const FilterContent = ({ currentFilter, setCurrentFilter, handleClients, clients }) => {
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        filterFetchDropdownRecords(`${BASE_URL}/api/get/clients/`, handleClients)
        setLoading(false);
    }, []);

    const handleInputChange = (field) => (e) => {
        let value = e.target.value;

        // Allow empty value for clearing the input
        if (field === 'amount') {
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
            </>
            )}
        </>
    )
}

export default FilterContent