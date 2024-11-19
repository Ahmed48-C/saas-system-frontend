import React, { useEffect, useState } from 'react'
import { InputSelect, Loader, Textarea } from '../../pages-components'
import { Grid } from '@material-ui/core'
import { formatFilterRecordDropdown } from '../../functions/pages/formatFilterRecordDropdown';
import { filterFetchDropdownRecords } from '../../functions/pages/filterFetchDropdownRecords';
import { BASE_URL } from '../../config/apis';

const FilterContent = ({ currentFilter, setCurrentFilter }) => {
    const [loading, setLoading] = useState(false);
    const [isActive, setIsActive] = useState(['true', 'false']);

    const handleInputChange = (field) => (e) => {
        let value = e.target.value;

        if (field === 'share_percentage') {
            // Allow only whole numbers (no decimals)
            if ((value === '' || /^[0-9]*$/.test(value)) && (+value <= 100 || value === '')) {
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
                    maxLength={100}
                />
            </Grid>
            <Grid item xs={12}>
                <Textarea
                    style={{ margin: 0 }}
                    rows={1}
                    rowsMax={2}
                    label='Phone'
                    name='phone'
                    id='phone'
                    value={currentFilter.phone}
                    onChange={(e) => setCurrentFilter({ ...currentFilter, phone: e.target.value })}
                    maxLength={15}
                />
            </Grid>
            <Grid item xs={12}>
                <InputSelect
                    selectItems={isActive.map(active => ({
                        value: active,
                        name: formatFilterRecordDropdown(active.toString())
                    }))}
                    label='Is Active'
                    name='is_active'
                    id='is_active'
                    onChange={(e) => setCurrentFilter({ ...currentFilter, is_active: e.target.value })}
                    value={currentFilter.is_active}
                />
            </Grid>
            <Grid item xs={12}>
                <Textarea
                    style={{ margin: 0 }}
                    rows={1}
                    rowsMax={2}
                    label='Share Percentage'
                    name='share_percentage'
                    id='share_percentage'
                    value={currentFilter.share_percentage}
                    onChange={handleInputChange('share_percentage')}
                    maxLength={5}
                />
            </Grid>
            </>
            )}
        </>
    )
}

export default FilterContent