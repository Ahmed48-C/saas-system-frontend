import React, { useEffect, useState } from 'react'
import { InputSelect, Loader, Textarea } from '../../pages-components'
import { Grid } from '@material-ui/core'
import { formatFilterRecordDropdown } from '../../functions/pages/formatFilterRecordDropdown';
import { filterFetchDropdownRecords } from '../../functions/pages/filterFetchDropdownRecords';
import { BASE_URL } from '../../config/apis';
import InputSelectNoCreate from '../../pages-components/InputSelectNoCreate';

const FilterContent = ({ currentFilter, setCurrentFilter, handleLocations, locations }) => {
    const [loading, setLoading] = useState(true);

    useEffect(() => {;
        filterFetchDropdownRecords(`${BASE_URL}/api/get/locations/`, handleLocations)
        setLoading(false);
    }, []);

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
                    label='Phone'
                    name='phone'
                    id='phone'
                    value={currentFilter.phone}
                    onChange={(e) => setCurrentFilter({ ...currentFilter, phone: e.target.value })}
                    maxLength={15}
                />
            </Grid>
            <Grid item xs={12}>
                <Textarea
                    style={{ margin: 0 }}
                    rows={1}
                    rowsMax={2}
                    label='Email'
                    name='email'
                    id='email'
                    value={currentFilter.email}
                    onChange={(e) => setCurrentFilter({ ...currentFilter, email: e.target.value })}
                    maxLength={254}
                />
            </Grid>
            <Grid item xs={12}>
                <Textarea
                    style={{ margin: 0 }}
                    rows={1}
                    rowsMax={2}
                    label='Contact Name'
                    name='contact_name'
                    id='contact_name'
                    value={currentFilter.contact_name}
                    onChange={(e) => setCurrentFilter({ ...currentFilter, contact_name: e.target.value })}
                    maxLength={80}
                />
            </Grid>
            <Grid item xs={12}>
                <Textarea
                    style={{ margin: 0 }}
                    rows={1}
                    rowsMax={2}
                    label='Contact Phone'
                    name='contact_phone'
                    id='contact_phone'
                    value={currentFilter.contact_phone}
                    onChange={(e) => setCurrentFilter({ ...currentFilter, contact_phone: e.target.value })}
                    maxLength={15}
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
            </>
            )}
        </>
    )
}

export default FilterContent