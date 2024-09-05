import React from 'react'
import { Textarea } from '../../pages-components'
import { Grid } from '@material-ui/core'

const FilterContent = ({ currentFilter, setCurrentFilter }) => {

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
                    label='Amount'
                    name='amount'
                    id='amount'
                    value={currentFilter.amount}
                    // onChange={(e) => setCurrentFilter({ ...currentFilter, amount: e.target.value })}
                    onChange={handleInputChange('amount')}
                    maxLength={15}
                />
            </Grid>
        </>
    )
}

export default FilterContent